import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Allow custom title/description via query params for dynamic pages
  const title = searchParams.get("title") || "OctoPals";
  const subtitle =
    searchParams.get("subtitle") || "Underwater Hockey Community Platform";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          // Deep ocean gradient
          background: "linear-gradient(135deg, #03045e 0%, #023e8a 30%, #0077b6 60%, #0096c7 100%)",
        }}
      >
        {/* Decorative bubbles */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "8%",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(144, 224, 239, 0.2)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "rgba(144, 224, 239, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            right: "10%",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(144, 224, 239, 0.2)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "75%",
            right: "20%",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(144, 224, 239, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "25%",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "rgba(144, 224, 239, 0.18)",
            display: "flex",
          }}
        />

        {/* Wave decoration at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            display: "flex",
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <path
              d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
              fill="rgba(0, 180, 216, 0.3)"
            />
            <path
              d="M0,80 C200,140 400,20 600,80 C800,140 1000,20 1200,80 L1200,120 L0,120 Z"
              fill="rgba(72, 202, 228, 0.2)"
            />
          </svg>
        </div>

        {/* Octopus emoji as mascot */}
        <div
          style={{
            fontSize: "100px",
            marginBottom: "20px",
            display: "flex",
          }}
        >
          🐙
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            fontSize: "80px",
            fontWeight: 800,
            letterSpacing: "-2px",
            background: "linear-gradient(90deg, #caf0f8 0%, #90e0ef 50%, #48cae4 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "16px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "32px",
            color: "#ade8f4",
            fontWeight: 500,
            letterSpacing: "1px",
            display: "flex",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          {subtitle}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginTop: "40px",
            color: "#90e0ef",
            fontSize: "22px",
            fontWeight: 500,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🌊</span>
            <span>Find Clubs</span>
          </span>
          <span style={{ display: "flex" }}>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🤿</span>
            <span>Join Sessions</span>
          </span>
          <span style={{ display: "flex" }}>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🏆</span>
            <span>Compete</span>
          </span>
        </div>

        {/* URL badge */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "24px",
            border: "1px solid rgba(144, 224, 239, 0.3)",
          }}
        >
          <span
            style={{
              color: "#ffb703",
              fontSize: "18px",
              fontWeight: 600,
              display: "flex",
            }}
          >
            octopals.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
