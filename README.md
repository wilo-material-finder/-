# WILO 자재 조회

GitHub + Vercel만 사용하는 간단한 버전입니다.

## 데이터 변경 방법

1. GitHub 저장소의 `public/materials.xlsx` 파일을 엽니다.
2. 현재 회사 Excel 파일로 교체합니다.
3. Commit changes를 누릅니다.
4. Vercel이 자동으로 다시 배포합니다.
5. 잠시 후 웹사이트에 새 데이터가 반영됩니다.

Excel의 첫 번째 시트와 아래 열 이름을 그대로 유지해 주세요.

- 품번
- 자재명
- 업체
- 자재반 담당자
- 자재팀 담당자

## 배포

Vercel에서 이 GitHub 저장소를 Import하면 됩니다.
환경변수나 Supabase 설정은 필요 없습니다.
