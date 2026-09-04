import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const partNumber = (searchParams.get("partNumber") || "").trim();

  if (!partNumber) {
    return NextResponse.json(
      { error: "품번을 입력해주세요." },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from("materials")
    .select(
      "part_number, material_name, vendor, material_contact, team_contact"
    )
    .eq("part_number", partNumber)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "데이터베이스 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ material: data });
}