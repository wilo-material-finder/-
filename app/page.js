'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [rows, setRows] = useState([]);
  const [partNumber, setPartNumber] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('데이터를 불러오는 중입니다...');

  useEffect(() => {
    async function loadExcel() {
      try {
        const response = await fetch('/materials.xlsx?version=1');
        if (!response.ok) throw new Error('Excel 파일을 불러오지 못했습니다.');
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        setRows(data);
        setStatus(`${data.length.toLocaleString()}건 준비 완료`);
      } catch (error) {
        console.error(error);
        setStatus('데이터를 불러오지 못했습니다.');
      }
    }
    loadExcel();
  }, []);

  function lookup() {
    const key = partNumber.trim();
    if (!key) {
      setResult(null);
      return;
    }

    const found = rows.find(
      (row) => String(row['품번']).trim() === key
    );

    setResult(found || 'NOT_FOUND');
  }

  return (
    <main className="page">
      <section className="card">
        <div className="logo">WILO</div>
        <h1>자재 조회</h1>
        <p className="sub">품번을 입력해 주세요.</p>

        <div className="search">
          <input
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="품번 입력"
            autoFocus
          />
          <button onClick={lookup}>조회</button>
        </div>

        <div className="status">{status}</div>

        {result === 'NOT_FOUND' && (
          <div className="message">해당 품번을 찾을 수 없습니다.</div>
        )}

        {result && result !== 'NOT_FOUND' && (
          <div className="result">
            <Info label="품번" value={result['품번']} />
            <Info label="자재명" value={result['자재명']} />
            <Info label="업체" value={result['업체']} />
            <Info label="자재반 담당자" value={result['자재반 담당자']} />
            <Info label="자재팀 담당자" value={result['자재팀 담당자']} />
          </div>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">{value || '-'}</div>
    </div>
  );
}
