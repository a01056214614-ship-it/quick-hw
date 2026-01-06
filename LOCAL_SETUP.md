# 로컬 실행 가이드

## 빠른 시작

### 1. 환경 변수 확인

`.env.local` 파일이 프로젝트 루트에 생성되어 있는지 확인하세요. 다음 환경 변수들이 포함되어 있어야 합니다:

```
NEXT_PUBLIC_QUICKSUPABASE_URL=https://xzqfrdzzmbkhkddtiune.supabase.co
NEXT_PUBLIC_QUICKSUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/verify-email
```

### 2. 의존성 설치 (필요한 경우)

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 문제 해결

### 포트가 이미 사용 중인 경우

다른 포트로 실행하려면:

```bash
npm run dev -- -p 3001
```

### 환경 변수 오류

`.env.local` 파일이 없거나 변수가 누락된 경우, 프로젝트 루트에 `.env.local` 파일을 생성하고 위의 환경 변수들을 추가하세요.

### 데이터베이스 연결 오류

Supabase 프로젝트가 활성화되어 있는지 확인하세요. 필요하다면 `scripts` 폴더의 SQL 파일들을 Supabase 대시보드에서 실행하세요.

