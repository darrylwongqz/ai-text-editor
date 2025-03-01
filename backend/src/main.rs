use actix_web::{App, HttpServer};
use ai_text_editor_backend::handlers::{health_handler, transform_handler};
use dotenv::dotenv;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    println!("Starting server at http://localhost:8080");

    HttpServer::new(|| {
        App::new()
            .service(health_handler::health_check)
            .service(transform_handler::transform_endpoint)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
