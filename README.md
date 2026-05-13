# web-automation

# web-automation

Playwright 기반의 Admin 웹 QA 자동화 프로젝트입니다.

This project is for demonstration purposes only.

> 본 프로젝트는 사내 시스템을 대상으로 작성되었습니다.  
> 실제 실행은 사내 네트워크 환경에서만 동작하며, 접속 정보는 공개하지 않습니다.
---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 언어 | JavaScript (Node.js) |
| 프레임워크 | Playwright |
| 리포트 | Allure |
| 패턴 | Page Object Model |

---

## 프로젝트 구조

```
web-automation/
├── playwright.config.ts
├── package.json
├── .env.example               # 환경변수 형식 (실제 값 제외)
└── tests/
    ├── pages/
    │   ├── login.page.ts      # 로그인 페이지 locator / 액션
    │   └── worker.page.ts     # 작업자 관리 페이지 locator / 액션
    ├── specs/
    │   └── worker-crud.spec.ts  # 작업자 CRUD 테스트
    └── fixtures/
        └── test-data.ts       # 테스트 데이터
```

---

## 테스트 목록

작업자 관리 페이지(생성 / 검색 / 수정 / 삭제 / 승인상태) 총 10개 테스트

| # | 테스트 |
|---|--------|
| 1 | 작업자 생성 — 팝업 열기 |
| 2 | 작업자 생성 — 취소 버튼 |
| 3 | 작업자 생성 — 성공 |
| 4 | 작업자 생성 — 아이디 필수값 검증 |
| 5 | 작업자 검색 — 존재하는 키워드 |
| 6 | 작업자 검색 — 없는 키워드 |
| 7 | 작업자 검색 — 초기화 |
| 8 | 작업자 수정 — 팝업 열림 확인 |
| 9 | 작업자 삭제 — 생성된 작업자 삭제 |
| 10 | 승인상태 — 승인완료 확인 |

---

## 주요 구현 내용

**Page Object Model 패턴 적용**  
페이지별로 locator와 액션을 분리해 테스트 코드의 재사용성과 유지보수성을 높였습니다.

**안정적인 Locator 전략**  
MudBlazor 기반 UI 특성상 동적으로 생성되는 `_bl_` 속성과 `mudinput-*` id를 사용하지 않고, `role`, `type`, `class` 기반 locator를 사용했습니다.

**환경변수 분리**  
접속 URL, 계정 정보 등 민감한 정보는 `.env` 파일로 분리해 코드에 직접 노출되지 않도록 했습니다.

**테스트 데이터 중앙 관리**  
`test-data.ts` 한 곳에서 테스트 데이터를 관리해 변경 시 한 곳만 수정하면 됩니다.

**Allure 리포트 연동**  
테스트 결과를 시각적인 HTML 리포트로 확인할 수 있습니다.

---

## 실행 방법

```bash
# 패키지 설치
npm install
npx playwright install chromium

# .env 파일 설정 (.env.example 참고)

# 테스트 실행
npm test

# Allure 리포트 확인
allure generate allure-results --clean
allure open
```