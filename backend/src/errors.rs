use actix_web::{HttpResponse, ResponseError};
use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Missing environment variable: {0}")]
    MissingEnvVar(String),

    #[error("Missing parameter: {0}")]
    MissingParameter(String),

    #[error("OpenAI request failed: {0}")]
    OpenAIRequestFailed(String),

    #[error("Unexpected response from OpenAI API")]
    UnexpectedResponse,
}

#[derive(Serialize)]
struct ErrorResponse {
    code: u16,
    message: String,
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        // For MissingEnvVar, MissingParameter, and OpenAIRequestFailed, we return 400 Bad Request.
        // For UnexpectedResponse, we return 500 Internal Server Error.
        let (status, code) = match self {
            AppError::MissingEnvVar(_)
            | AppError::MissingParameter(_)
            | AppError::OpenAIRequestFailed(_) => (actix_web::http::StatusCode::BAD_REQUEST, 400),
            AppError::UnexpectedResponse => {
                (actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, 500)
            }
        };
        let error_response = ErrorResponse {
            code,
            message: self.to_string(),
        };
        HttpResponse::build(status).json(error_response)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::http::StatusCode;

    #[test]
    fn test_missing_env_var_error() {
        let err = AppError::MissingEnvVar("OPENAI_API_KEY".into());
        // Check the error's display message.
        assert_eq!(
            err.to_string(),
            "Missing environment variable: OPENAI_API_KEY"
        );

        // Get the HTTP response from the error.
        let response = err.error_response();
        // Our ResponseError implementation returns a BAD_REQUEST (400).
        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    }

    #[test]
    fn test_missing_parameter_error() {
        let err = AppError::MissingParameter("target_language is required for translation".into());
        assert_eq!(
            err.to_string(),
            "Missing parameter: target_language is required for translation"
        );

        let response = err.error_response();
        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    }
}
