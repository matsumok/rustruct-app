pub use sea_orm_migration::prelude::*;

mod m20240101_000001_create_example;
mod m20240101_000002_create_projects;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20240101_000001_create_example::Migration),
            Box::new(m20240101_000002_create_projects::Migration),
        ]
    }
}
