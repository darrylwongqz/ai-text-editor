use actix_cors::Cors;
use actix_web::{App, HttpServer};
use ai_text_editor_backend::handlers::{health_handler, transform_handler};
use dotenv::dotenv;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    env_logger::init();

    log::info!("Starting server at http://localhost:8080");

    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .service(health_handler::health_check)
            .service(transform_handler::transform_endpoint)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
