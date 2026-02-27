use axum::Json;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema)]
pub struct HealthResponse {
    pub status: String,
}

/// ヘルスチェック
///
/// サーバーが正常に動作しているか確認します。
#[utoipa::path(
    get,
    path = "/api/health",
    responses(
        (status = 200, description = "サーバー正常", body = HealthResponse)
    ),
    tag = "system"
)]
pub async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
    })
}
