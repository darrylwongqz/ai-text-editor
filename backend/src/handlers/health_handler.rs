use actix_web::{get, HttpResponse, Responder};

#[get("/api/health")]
pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("Service is healthy")
}
