use actix_web::{post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

use crate::errors::AppError;
use crate::models::transformation::TransformationAction;
use crate::services::openai_service;

#[derive(Deserialize)]
pub struct TransformRequest {
    pub text: String,
    pub action: TransformationAction,
    // Only required when action is Translate.
    pub target_language: Option<String>,
}

#[derive(Serialize)]
pub struct TransformResponse {
    pub transformed_text: String,
}

#[post("/api/transform")]
pub async fn transform_endpoint(
    body: web::Json<TransformRequest>,
) -> Result<impl Responder, AppError> {
    let result = openai_service::transform_text(
        &body.text,
        body.action.clone(),
        body.target_language.as_deref(),
    )
    .await?;
    let response = TransformResponse {
        transformed_text: result,
    };
    Ok(HttpResponse::Ok().json(response))
}
