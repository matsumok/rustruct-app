mod api;

use axum::{routing::get, Router};
use dotenvy::dotenv;
use sea_orm::{Database, DatabaseConnection};
use std::env;
use tower_http::cors::{Any, CorsLayer};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
}

#[derive(OpenApi)]
#[openapi(
    paths(
        api::health::health_check,
    ),
    components(
        schemas(api::health::HealthResponse)
    ),
    info(
        title = "Rustruct API",
        description = "日本の建築構造設計向け計算ツール集",
        version = "0.1.0"
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive("backend=debug".parse().unwrap()),
        )
        .init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db = Database::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    tracing::info!("Connected to database");

    let state = AppState { db };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .merge(SwaggerUi::new("/api/docs").url("/api/openapi.json", ApiDoc::openapi()))
        .route("/api/health", get(api::health::health_check))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .expect("Failed to bind port 3001");

    tracing::info!("Backend listening on http://0.0.0.0:3001");

    axum::serve(listener, app).await.expect("Server error");
}
