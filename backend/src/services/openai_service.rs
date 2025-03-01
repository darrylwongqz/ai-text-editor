use reqwest;
use serde_json::json;
use std::env;

use crate::models::transformation::TransformationAction;

pub async fn transform_text(
    original_text: &str,
    action: TransformationAction,
    target_language: Option<&str>,
) -> Result<String, Box<dyn std::error::Error>> {
    // Retrieve the OpenAI API key from the environment.
    let api_key = env::var("OPENAI_API_KEY")?;

    // Read the base URL from the environment variable;
    // default to "https://api.openai.com" if not set.
    let base_url =
        env::var("OPENAI_API_BASE_URL").unwrap_or_else(|_| "https://api.openai.com".to_string());
    let openai_url = format!("{}/v1/chat/completions", base_url);

    let client = reqwest::Client::new();

    // Determine the instruction and system message based on the action.
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
            let lang = target_language.ok_or("Target language must be provided for translation")?;
            (
                format!("translate into {}", lang),
                "You are a helpful assistant that translates text.".to_string(),
            )
        }
    };

    // Build the user prompt.
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
        .await?;

    if !resp.status().is_success() {
        let status = resp.status();
        let err_text = resp.text().await.unwrap_or_default();
        return Err(format!("OpenAI request failed: {} - {}", status, err_text).into());
    }

    let json_resp: serde_json::Value = resp.json().await?;
    let transformed_text = json_resp["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("")
        .trim()
        .to_string();

    Ok(transformed_text)
}
