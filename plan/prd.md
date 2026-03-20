# windowTimer - Product Requirements Document

## Overview
Tauri + Svelte 기반 원형 타이머 데스크톱 앱.
빨간 원형 프로그레스로 남은 시간을 직관적으로 표시한다.

## Tech Stack
- **Frontend:** Svelte + TypeScript
- **Backend:** Tauri (Rust)
- **UI:** CSS + SVG 원형 프로그레스

## Core Features

### 1. 원형 타이머
- SVG 원으로 구현
- 빨간색 프로그레스
- 시간이 지나면 채워진 영역이 줄어듦 (60분 설정 시 30분 경과하면 반원)

### 2. 시간 설정
- 분/초 입력으로 자유롭게 타이머 시간 설정
- 시작 / 일시정지 / 리셋 버튼

### 3. 시스템 트레이 상주
- 창 닫기/최소화 시 시스템 트레이로 이동
- 트레이 아이콘 클릭으로 창 복원

### 4. 글로벌 단축키
- 기본값: `Ctrl+Shift+T`
- 어디서든 단축키로 창 토글 (숨기기/보이기)
- 설정에서 단축키 변경 가능

### 5. 타이머 완료 알림
- 시스템 알림 (Windows 알림 센터)
- 알림음 재생
- 알림음 on/off 설정 가능

### 6. 설정 커스터마이징
- 기본 타이머 시간
- 창 크기 (기본 크기 설정 가능)
- 글로벌 단축키 변경
- 알림음 on/off

## UI 구성

### 메인 화면
- 중앙: 빨간 원형 타이머 (SVG)
- 원 안: 남은 시간 표시 (MM:SS)
- 하단: 시작 / 일시정지 / 리셋 버튼
- 시간 입력 필드

### 설정 화면
- 기본 시간 설정
- 창 크기 설정
- 글로벌 단축키 설정
- 알림음 on/off

## Data Storage
- 설정값은 Tauri `app_data_dir`에 JSON 파일로 로컬 저장

## Non-functional Requirements
- 앱 크기: ~5MB 이하
- 메모리 사용: ~20MB 이하
- Windows 지원
