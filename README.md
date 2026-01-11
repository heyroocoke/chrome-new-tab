# Chrome New Tab Dashboard

Notion 연동 개인 대시보드 Chrome Extension

Chrome의 새 탭을 Notion 데이터베이스와 연동하여 오늘의 할 일을 관리할 수 있는 확장 프로그램입니다.

## 📋 프로젝트 개요

이 프로젝트는 다음과 같이 구성되어 있습니다:

- **Extension**: Chrome 확장 프로그램 (React + TypeScript + Vite)
- **Workers**: Cloudflare Workers를 사용한 Notion API 프록시 서버

## 🛠 기술 스택

### Extension
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Workers
- Cloudflare Workers
- TypeScript
- Wrangler

## 📁 프로젝트 구조

```
chrome-new-tab/
├── extension/          # Chrome 확장 프로그램
│   ├── src/            # 소스 코드
│   ├── public/         # 정적 파일
│   └── dist/           # 빌드 출력 (gitignore)
├── workers/            # Cloudflare Workers
│   ├── src/            # 소스 코드
│   └── wrangler.toml   # Wrangler 설정
└── README.md
```

## ⚠️ 주의사항

**민감한 정보 관리:**
- 이 프로젝트에는 실제 API 키나 토큰이 하드코딩되어 있지 않습니다.
- 모든 민감한 정보는 환경변수나 Cloudflare Workers Secrets로 관리됩니다.
- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 배포 전 반드시 환경변수를 설정해주세요.

## 사전 준비

### 1. Notion Integration 생성

1. https://www.notion.so/my-integrations 접속
2. "New integration" 클릭
3. 이름 입력 후 생성
4. **Internal Integration Token** 복사 (secret_xxx 형태)

### 2. Notion Database 설정

1. Notion에서 새 데이터베이스 생성
2. 다음 속성 추가:
   - `Title` (title) - 기본 제목 속성
   - `Date` (date) - 날짜
   - `Done` (checkbox) - 완료 여부
3. 데이터베이스 페이지에서 "..." → "Connections" → 생성한 Integration 연결
4. 데이터베이스 URL에서 ID 추출:
   ```
   https://notion.so/myworkspace/[DATABASE_ID]?v=xxx
   ```

## 실행 방법

### Workers 배포

```bash
cd workers
npm install

# 로컬 개발
npm run dev

# Secret 설정 (배포 전)
npx wrangler secret put NOTION_TOKEN    # Integration Token 입력
npx wrangler secret put NOTION_DATABASE_ID  # Database ID 입력
npx wrangler secret put API_KEY         # 원하는 API 키 입력

# 배포
npm run deploy
```

### Extension 빌드

```bash
cd extension
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일 편집:
# - VITE_API_URL: Workers 배포 URL
# - VITE_API_KEY: Workers에 설정한 API_KEY

# 빌드
npm run build
```

### Chrome에 설치

1. Chrome → `chrome://extensions` 접속
2. "개발자 모드" 활성화 (우측 상단)
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `extension/dist` 폴더 선택
5. 새 탭 열기로 확인

## 환경변수 목록

### Workers
| 변수 | 설명 |
|------|------|
| `NOTION_TOKEN` | Notion Integration Token |
| `NOTION_DATABASE_ID` | Notion Database ID |
| `API_KEY` | 클라이언트 인증용 키 |

### Extension
| 변수 | 설명 |
|------|------|
| `VITE_API_URL` | Workers 배포 URL |
| `VITE_API_KEY` | API_KEY와 동일 |

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | /health | 헬스 체크 (인증 불필요) |
| GET | /todos | 오늘 할 일 조회 |
| POST | /todos | 새 할 일 생성 |
| PATCH | /todos/:id | 완료 상태 변경 |

## 트러블슈팅

### "Unauthorized" 에러
- Workers와 Extension의 API_KEY가 일치하는지 확인

### 할 일이 표시되지 않음
- Notion DB 속성명이 정확히 Title, Date, Done인지 확인
- Integration이 DB에 연결되어 있는지 확인
- 오늘 날짜(KST)의 할 일이 있는지 확인

### CORS 에러
- Workers가 실행 중인지 확인
- API URL이 올바른지 확인
