use reqwest;
use serde_json::json;
use std::env;

use crate::errors::AppError;
use crate::models::transformation::TransformationAction;

pub async fn transform_text(
    original_text: &str,
    action: TransformationAction,
    target_language: Option<&str>,
) -> Result<String, AppError> {
    let api_key =
        env::var("OPENAI_API_KEY").map_err(|_| AppError::MissingEnvVar("OPENAI_API_KEY".into()))?;

    let base_url =
        env::var("OPENAI_API_BASE_URL").unwrap_or_else(|_| "https://api.openai.com".to_string());
    let openai_url = format!("{}/v1/chat/completions", base_url);
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

    let resp = client
        .post(&openai_url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| AppError::OpenAIRequestFailed(e.to_string()))?;

    if !resp.status().is_success() {
        let status = resp.status();
        let err_text = resp.text().await.unwrap_or_default();
        return Err(AppError::OpenAIRequestFailed(format!(
            "{} - {}",
            status, err_text
        )));
    }

    let json_resp: serde_json::Value = resp
        .json()
        .await
        .map_err(|_| AppError::UnexpectedResponse)?;
    let transformed_text = json_resp["choices"][0]["message"]["content"]
        .as_str()
        .ok_or(AppError::UnexpectedResponse)?
        .trim()
        .to_string();

    Ok(transformed_text)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::transformation::TransformationAction;
    use std::env;

    #[tokio::test]
    async fn test_transform_text_missing_api_key() {
        // Ensure the API key is not set.
        env::remove_var("OPENAI_API_KEY");

        let result = transform_text("Test text", TransformationAction::Paraphrase, None).await;
        assert!(result.is_err());
        if let Err(e) = result {
            assert!(e.to_string().contains("Missing environment variable"));
        }
    }

    #[tokio::test]
    async fn test_transform_text_missing_target_language() {
        // Set a dummy API key to pass the API key check.
        env::set_var("OPENAI_API_KEY", "dummy_key");
        // Do not set target_language for a translation action.
        let result = transform_text("Test text", TransformationAction::Translate, None).await;
        assert!(result.is_err());
        if let Err(e) = result {
            assert!(e.to_string().contains("target_language is required"));
        }
    }
}
