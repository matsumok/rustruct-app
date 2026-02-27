use axum::{extract::State, Json};
use sea_orm::EntityTrait;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{entity::project, AppState};

#[derive(Serialize, Deserialize, ToSchema)]
pub struct ProjectResponse {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub created_at: String,
}

/// プロジェクト一覧取得
///
/// データベースに登録されたプロジェクトの一覧を返します。
#[utoipa::path(
    get,
    path = "/api/projects",
    responses(
        (status = 200, description = "プロジェクト一覧", body = Vec<ProjectResponse>)
    ),
    tag = "projects"
)]
pub async fn list_projects(
    State(state): State<AppState>,
) -> Json<Vec<ProjectResponse>> {
    let projects = project::Entity::find()
        .all(&state.db)
        .await
        .unwrap_or_default();

    let response = projects
        .into_iter()
        .map(|p| ProjectResponse {
            id: p.id,
            name: p.name,
            description: p.description,
            created_at: p.created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
        })
        .collect();

    Json(response)
}
