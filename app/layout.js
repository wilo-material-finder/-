import "./globals.css";

export const metadata = {
  title: "WILO 자재 담당자 조회",
  description: "WILO 자재 담당자 조회 시스템",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}