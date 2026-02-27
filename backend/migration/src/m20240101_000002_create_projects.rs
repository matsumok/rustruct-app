use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        db.execute_unprepared(
            "CREATE TABLE IF NOT EXISTS projects (
                id          SERIAL PRIMARY KEY,
                name        TEXT NOT NULL,
                description TEXT NOT NULL,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            )",
        )
        .await?;

        db.execute_unprepared(
            "INSERT INTO projects (name, description) VALUES
                ('渋谷オフィスビル', 'RC造 地上10階建て 基準法準拠'),
                ('新宿マンション',   'S造 地上15階建て 耐震等級3'),
                ('品川倉庫',         '鉄骨造 平屋 積雪荷重考慮'),
                ('横浜工場',         'SRC造 地上5階建て 免震構造'),
                ('千葉住宅',         '木造 2階建て 省エネ等級4')",
        )
        .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        db.execute_unprepared("DROP TABLE IF EXISTS projects")
            .await?;
        Ok(())
    }
}
