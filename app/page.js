"use client";

import { useState } from "react";

export default function Home() {
  const [partNumber, setPartNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("품번을 입력하고 조회해주세요.");

  async function searchPart() {
    const value = partNumber.trim();

    if (!value) {
      setResult(null);
      setMessage("품번을 입력해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);
    setMessage("");

    try {
      const response = await fetch(
        `/api/material?partNumber=${encodeURIComponent(value)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "조회 중 오류가 발생했습니다.");
        return;
      }

      if (!data.material) {
        setMessage("해당 품번의 자재 정보를 찾을 수 없습니다.");
        return;
      }

      setResult(data.material);
    } catch (error) {
      setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      searchPart();
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="brand">WILO</div>
        <h1>자재 담당자 조회</h1>
        <p>품번을 입력하면 자재 정보를 빠르게 확인할 수 있습니다.</p>
      </section>

      <section className="content">
        <div className="search-card">
          <input
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="품번을 입력하세요"
            inputMode="numeric"
            autoComplete="off"
            aria-label="품번"
          />
          <button onClick={searchPart} disabled={loading}>
            {loading ? "조회 중" : "조회"}
          </button>
        </div>

        {result ? (
          <section className="result-card">
            <div className="result-heading">자재 정보</div>
            <Info label="품번" value={result.part_number} />
            <Info label="자재명" value={result.material_name} />
            <Info label="업체" value={result.vendor} />
            <Info label="자재반 담당자" value={result.material_contact} />
            <Info label="자재팀 담당자" value={result.team_contact} />
          </section>
        ) : (
          <div className="message">{message}</div>
        )}
      </section>

      <footer>WILO Material Contact Search</footer>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <div className="label">{label}</div>
      <div className="value">{value || "-"}</div>
    </div>
  );
}