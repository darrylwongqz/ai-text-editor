use reqwest;
use serde_json::json;
use std::env;

use crate::errors::AppError;
use crate::models::transformation::TransformationAction;
use log::{error, info};

pub async fn transform_text(
    original_text: &str,
    action: TransformationAction,
    target_language: Option<&str>,
) -> Result<String, AppError> {
    info!("Starting transformation process for action: {:?}", action);

    let api_key =
        env::var("OPENAI_API_KEY").map_err(|_| AppError::MissingEnvVar("OPENAI_API_KEY".into()))?;
    info!("Using API key: [REDACTED]");

    let base_url =
        env::var("OPENAI_API_BASE_URL").unwrap_or_else(|_| "https://api.openai.com".to_string());
    let openai_url = format!("{}/v1/chat/completions", base_url);
    info!("Sending request to OpenAI URL: {}", openai_url);

    let client = reqwest::Client::new();

    let (instruction, system_message) = match action {
        TransformationAction::Paraphrase => (
            "paraphrase".to_string(),
            "You are a helpful assistant that paraphrases text.".to_string(),
        ),
        TransformationAction::Expand => (
            "expand on".to_string(),
            "You are a helpful assistant that expands on text.".to_string(),
        ),
        TransformationAction::Summarize => (
            "summarize".to_string(),
            "You are a helpful assistant that summarizes text.".to_string(),
        ),
        TransformationAction::Translate => {
            let lang = target_language.ok_or_else(|| {
                AppError::MissingParameter("target_language is required for translation".into())
            })?;
            (
                format!("translate into {}", lang),
                "You are a helpful assistant that translates text.".to_string(),
            )
        }
    };

    let user_message = format!(
        "Please {} the following text:\n\n{}",
        instruction, original_text
    );
    let request_body = json!({
        "model": "gpt-3.5-turbo",
        "messages": [
            { "role": "system", "content": system_message },
            { "role": "user", "content": user_message }
        ],
        "temperature": 0.7,
        "max_tokens": 300
    });
    info!("Request body: {}", request_body);

    let resp = client
        .post(&openai_url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| {
            error!("Error sending request: {}", e);
            AppError::OpenAIRequestFailed(e.to_string())
        })?;

    if !resp.status().is_success() {
        let status = resp.status();
        let err_text = resp.text().await.unwrap_or_default();
        error!("Request failed: {} - {}", status, err_text);
        return Err(AppError::OpenAIRequestFailed(format!(
            "{} - {}",
            status, err_text
        )));
    }

    let json_resp: serde_json::Value = resp.json().await.map_err(|_| {
        error!("Failed to parse response JSON");
        AppError::UnexpectedResponse
    })?;
    info!("Received response: {:?}", json_resp);

    let transformed_text = json_resp["choices"][0]["message"]["content"]
        .as_str()
        .ok_or(AppError::UnexpectedResponse)?
        .trim()
        .to_string();

    info!(
        "Transformation successful, returning text: {}",
        transformed_text
    );
    Ok(transformed_text)
}
