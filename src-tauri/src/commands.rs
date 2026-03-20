use crate::settings::{self, Settings};
use tauri::Manager;

fn settings_path(app: &tauri::AppHandle) -> std::path::PathBuf {
    app.path()
        .app_data_dir()
        .expect("failed to get app data dir")
        .join("settings.json")
}

#[tauri::command]
pub fn get_settings(app: tauri::AppHandle) -> Settings {
    settings::load_settings(&settings_path(&app))
}

#[tauri::command]
pub fn set_settings(app: tauri::AppHandle, settings: Settings) -> Result<(), String> {
    settings::save_settings(&settings_path(&app), &settings)
}
