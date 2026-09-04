const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { createClient } = require("@supabase/supabase-js");

const filePath = process.argv[2];

if (!filePath) {
  console.error("사용법: npm run import:excel -- ./materials.xlsx");
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`파일을 찾을 수 없습니다: ${filePath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const normalized = rows
  .map((row) => ({
    part_number: String(row["품번"] ?? "").trim(),
    material_name: String(row["자재명"] ?? "").trim() || null,
    vendor: String(row["업체"] ?? "").trim() || null,
    material_contact: String(row["자재반 담당자"] ?? "").trim(),
    team_contact: String(row["자재팀 담당자"] ?? "").trim() || null
  }))
  .filter((row) => row.part_number && row.material_contact);

console.log(`원본 행: ${rows.length}`);
console.log(`업로드 대상: ${normalized.length}`);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function main() {
  const batchSize = 500;

  for (let i = 0; i < normalized.length; i += batchSize) {
    const batch = normalized.slice(i, i + batchSize);

    const { error } = await supabase
      .from("materials")
      .upsert(batch, { onConflict: "part_number" });

    if (error) {
      console.error(`업로드 실패 (${i + 1}-${i + batch.length})`, error);
      process.exit(1);
    }

    console.log(`업로드 완료: ${Math.min(i + batchSize, normalized.length)}/${normalized.length}`);
  }

  console.log("DB 업데이트가 완료되었습니다.");
}

main();