use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Settings {
    pub default_minutes: u32,
    pub default_seconds: u32,
    pub window_width: u32,
    pub window_height: u32,
    pub hotkey: String,
    pub sound_enabled: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            default_minutes: 5,
            default_seconds: 0,
            window_width: 300,
            window_height: 400,
            hotkey: "Ctrl+Shift+T".to_string(),
            sound_enabled: true,
        }
    }
}

pub fn load_settings(path: &Path) -> Settings {
    match fs::read_to_string(path) {
        Ok(content) => serde_json::from_str(&content).unwrap_or_default(),
        Err(_) => Settings::default(),
    }
}

pub fn save_settings(path: &Path, settings: &Settings) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn default_settings_are_valid() {
        let s = Settings::default();
        assert_eq!(s.default_minutes, 5);
        assert_eq!(s.default_seconds, 0);
        assert_eq!(s.window_width, 300);
        assert_eq!(s.window_height, 400);
        assert_eq!(s.hotkey, "Ctrl+Shift+T");
        assert!(s.sound_enabled);
    }

    #[test]
    fn serialize_deserialize_roundtrip() {
        let s = Settings::default();
        let json = serde_json::to_string(&s).unwrap();
        let deserialized: Settings = serde_json::from_str(&json).unwrap();
        assert_eq!(s, deserialized);
    }

    #[test]
    fn save_creates_json_file() {
        let dir = TempDir::new().unwrap();
        let path = dir.path().join("settings.json");
        let s = Settings::default();
        save_settings(&path, &s).unwrap();
        assert!(path.exists());
    }

    #[test]
    fn load_reads_saved_settings() {
        let dir = TempDir::new().unwrap();
        let path = dir.path().join("settings.json");
        let mut s = Settings::default();
        s.default_minutes = 10;
        s.sound_enabled = false;
        save_settings(&path, &s).unwrap();

        let loaded = load_settings(&path);
        assert_eq!(loaded.default_minutes, 10);
        assert!(!loaded.sound_enabled);
    }

    #[test]
    fn load_returns_defaults_when_file_missing() {
        let path = Path::new("/nonexistent/settings.json");
        let loaded = load_settings(path);
        assert_eq!(loaded, Settings::default());
    }

    #[test]
    fn load_returns_defaults_when_json_invalid() {
        let dir = TempDir::new().unwrap();
        let path = dir.path().join("settings.json");
        fs::write(&path, "not valid json!!!").unwrap();
        let loaded = load_settings(&path);
        assert_eq!(loaded, Settings::default());
    }
}
