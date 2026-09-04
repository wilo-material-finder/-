# WILO 자재 담당자 조회

WILO 브랜드 컬러 `#009C82`를 사용한 모바일 자재 담당자 조회 웹사이트입니다.

## 구성

- Next.js
- Supabase
- Vercel
- Excel → Supabase import script

현재 엑셀 구조:

- 품번
- 자재명
- 업체
- 자재반 담당자
- 자재팀 담당자

## 1. Supabase

Supabase 프로젝트를 만든 후 SQL Editor에서 `supabase/schema.sql`을 실행합니다.

그리고 Project Settings → API에서 다음 값을 확인합니다.

- Project URL
- service_role key

service_role key는 절대 GitHub에 올리지 마세요.

## 2. 로컬 환경변수

`.env.example`을 `.env.local`로 복사하고 값을 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

## 3. 엑셀 DB 입력

엑셀 파일을 프로젝트 폴더에 잠시 넣고:

```bash
npm install
npm run import:excel -- ./materials.xlsx
```

완료 후 엑셀 파일은 삭제해도 됩니다.

## 4. 로컬 테스트

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 5. GitHub

이 프로젝트 전체를 GitHub repository에 올립니다.

엑셀 파일과 `.env.local`은 `.gitignore`로 제외되어 있습니다.

## 6. Vercel

Vercel에서 GitHub repository를 Import합니다.

Environment Variables에 다음을 등록합니다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Deploy하면 스마트폰에서 접속할 수 있는 웹주소가 생성됩니다.

## 보안

`SUPABASE_SERVICE_ROLE_KEY`는 브라우저 코드에 노출하면 안 됩니다.
현재 검색 API는 서버에서만 service role key를 사용하도록 구성되어 있습니다.
