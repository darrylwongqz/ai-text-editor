use actix_web::{test, App};
use ai_text_editor_backend::handlers::transform_handler::transform_endpoint;
use mockito::Matcher;
use mockito::Server;
use serde_json::json;
use serial_test::serial;
use std::env;

#[tokio::test]
#[serial]
async fn test_transform_endpoint_paraphrase() {
    // Create a new async Mockito server.
    let mut server = Server::new_async().await;
    env::set_var("OPENAI_API_KEY", "dummy_key");
    env::set_var("OPENAI_API_BASE_URL", &server.url());

    // Define a mock response for the paraphrase action.
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

    // Initialize the Actix app with our transform endpoint.
    let app = test::init_service(App::new().service(transform_endpoint)).await;
    let req_body = json!({
        "text": "Hello world",
        "action": "paraphrase"
    });
    let req = test::TestRequest::post()
        .uri("/api/transform")
        .set_json(&req_body)
        .to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let body_bytes = test::read_body(resp).await;
    let body_str = std::str::from_utf8(&body_bytes).unwrap();
    let v: serde_json::Value = serde_json::from_str(body_str).unwrap();
    assert_eq!(v["transformed_text"], "Mocked paraphrased text");
}

#[tokio::test]
#[serial]
async fn test_transform_endpoint_expand() {
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

    let app = test::init_service(App::new().service(transform_endpoint)).await;
    let req_body = json!({
        "text": "Some text",
        "action": "expand"
    });
    let req = test::TestRequest::post()
        .uri("/api/transform")
        .set_json(&req_body)
        .to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let body_bytes = test::read_body(resp).await;
    let body_str = std::str::from_utf8(&body_bytes).unwrap();
    let v: serde_json::Value = serde_json::from_str(body_str).unwrap();
    assert_eq!(v["transformed_text"], "Mocked expanded text");
}

#[tokio::test]
#[serial]
async fn test_transform_endpoint_summarize() {
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

    let app = test::init_service(App::new().service(transform_endpoint)).await;
    let req_body = json!({
        "text": "Some long text that needs summarizing",
        "action": "summarize"
    });
    let req = test::TestRequest::post()
        .uri("/api/transform")
        .set_json(&req_body)
        .to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let body_bytes = test::read_body(resp).await;
    let body_str = std::str::from_utf8(&body_bytes).unwrap();
    let v: serde_json::Value = serde_json::from_str(body_str).unwrap();
    assert_eq!(v["transformed_text"], "Mocked summarized text");
}

#[tokio::test]
#[serial]
async fn test_transform_endpoint_translate() {
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

    let app = test::init_service(App::new().service(transform_endpoint)).await;
    let req_body = json!({
        "text": "Hello, how are you?",
        "action": "translate",
        "target_language": "spanish"
    });
    let req = test::TestRequest::post()
        .uri("/api/transform")
        .set_json(&req_body)
        .to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let body_bytes = test::read_body(resp).await;
    let body_str = std::str::from_utf8(&body_bytes).unwrap();
    let v: serde_json::Value = serde_json::from_str(body_str).unwrap();
    assert_eq!(v["transformed_text"], "Mocked translated text");
}

#[tokio::test]
#[serial]
async fn test_transform_endpoint_missing_target_language_error() {
    // Test the error condition for translation when target_language is missing.
    let app = test::init_service(App::new().service(transform_endpoint)).await;
    let req_body = json!({
        "text": "Hello, how are you?",
        "action": "translate"
        // Missing target_language field
    });
    let req = test::TestRequest::post()
        .uri("/api/transform")
        .set_json(&req_body)
        .to_request();

    let resp = test::call_service(&app, req).await;
    // We expect an error; our handler should return a 500 in that case.
    assert!(resp.status().is_server_error());
}
