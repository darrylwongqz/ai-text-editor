use ai_text_editor_backend::models::transformation::TransformationAction;
use ai_text_editor_backend::services::openai_service::transform_text;
use mockito::Matcher;
use mockito::Server;
use serial_test::serial;
use std::env;

#[tokio::test]
#[serial]
async fn test_paraphrase_with_mockito() -> Result<(), Box<dyn std::error::Error>> {
    // Create a new async Mockito server.
    let mut server = Server::new_async().await;

    // Set the environment variables for this test.
    env::set_var("OPENAI_API_KEY", "dummy_key");
    env::set_var("OPENAI_API_BASE_URL", &server.url());

    // Create a mock for the paraphrasing endpoint.
    let _m = server
        .mock("POST", "/v1/chat/completions")
        .match_header("Authorization", "Bearer dummy_key")
        .match_header("Content-Type", "application/json")
        .match_body(Matcher::Any)
        .with_status(200)
        .with_body(
            r#"
            {
              "choices": [
                {
                  "message": {
                    "content": "Mocked paraphrased text"
                  }
                }
              ]
            }
        "#,
        )
        .create_async()
        .await;

    let result = transform_text("Hello world", TransformationAction::Paraphrase, None).await?;
    assert_eq!(result, "Mocked paraphrased text");
    Ok(())
}

#[tokio::test]
#[serial]
async fn test_expand_with_mockito() -> Result<(), Box<dyn std::error::Error>> {
    let mut server = Server::new_async().await;
    env::set_var("OPENAI_API_KEY", "dummy_key");
    env::set_var("OPENAI_API_BASE_URL", &server.url());

    let _m = server
        .mock("POST", "/v1/chat/completions")
        .match_header("Authorization", "Bearer dummy_key")
        .match_header("Content-Type", "application/json")
        .match_body(Matcher::Any)
        .with_status(200)
        .with_body(
            r#"
            {
              "choices": [
                {
                  "message": {
                    "content": "Mocked expanded text"
                  }
                }
              ]
            }
        "#,
        )
        .create_async()
        .await;

    let result = transform_text("Some text", TransformationAction::Expand, None).await?;
    assert_eq!(result, "Mocked expanded text");
    Ok(())
}

#[tokio::test]
#[serial]
async fn test_summarize_with_mockito() -> Result<(), Box<dyn std::error::Error>> {
    let mut server = Server::new_async().await;
    env::set_var("OPENAI_API_KEY", "dummy_key");
    env::set_var("OPENAI_API_BASE_URL", &server.url());

    let _m = server
        .mock("POST", "/v1/chat/completions")
        .match_header("Authorization", "Bearer dummy_key")
        .match_header("Content-Type", "application/json")
        .match_body(Matcher::Any)
        .with_status(200)
        .with_body(
            r#"
            {
              "choices": [
                {
                  "message": {
                    "content": "Mocked summarized text"
                  }
                }
              ]
            }
        "#,
        )
        .create_async()
        .await;

    let result = transform_text(
        "Some long text that needs summarizing",
        TransformationAction::Summarize,
        None,
    )
    .await?;
    assert_eq!(result, "Mocked summarized text");
    Ok(())
}

#[tokio::test]
#[serial]
async fn test_translate_with_mockito() -> Result<(), Box<dyn std::error::Error>> {
    let mut server = Server::new_async().await;
    env::set_var("OPENAI_API_KEY", "dummy_key");
    env::set_var("OPENAI_API_BASE_URL", &server.url());

    let _m = server
        .mock("POST", "/v1/chat/completions")
        .match_header("Authorization", "Bearer dummy_key")
        .match_header("Content-Type", "application/json")
        .match_body(Matcher::Any)
        .with_status(200)
        .with_body(
            r#"
            {
              "choices": [
                {
                  "message": {
                    "content": "Mocked translated text"
                  }
                }
              ]
            }
        "#,
        )
        .create_async()
        .await;

    let result = transform_text(
        "Hello, how are you?",
        TransformationAction::Translate,
        Some("spanish"),
    )
    .await?;
    assert_eq!(result, "Mocked translated text");
    Ok(())
}
