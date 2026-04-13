import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Advanced Power Solutions | Industrial Energy Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent line */}
        <div style={{ width: "80px", height: "4px", background: "#f97316", marginBottom: "32px", display: "flex" }} />

        {/* Company name */}
        <div style={{ fontSize: 64, fontWeight: 700, color: "#ffffff", textAlign: "center", display: "flex" }}>
          Advanced Power Solutions
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 28, color: "#f97316", marginTop: "16px", display: "flex" }}>
          Industrial Energy Systems
        </div>

        {/* Description */}
        <div style={{ fontSize: 20, color: "#9ca3af", marginTop: "24px", textAlign: "center", maxWidth: "800px", display: "flex" }}>
          Industrial-grade generators engineered for 24/7 reliability
        </div>

        {/* Bottom URL */}
        <div style={{ position: "absolute", bottom: "40px", fontSize: 18, color: "#6b7280", display: "flex" }}>
          apspower.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}