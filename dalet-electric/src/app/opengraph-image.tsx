import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "Dalet Electric — Infraestructura eléctrica en México";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#161a21",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", fontSize: 25, letterSpacing: 5 }}>
        DALET ELECTRIC
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 66,
          maxWidth: 1000,
          lineHeight: 1.08,
        }}
      >
        Desarrollamos la energía que impulsa a México.
      </div>
      <div style={{ display: "flex", fontSize: 19, color: "#b5bac1" }}>
        INGENIERÍA · PLANEACIÓN · DESARROLLO
      </div>
    </div>,
    size,
  );
}
