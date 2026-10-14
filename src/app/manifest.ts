import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Payzen — Crypto Trading Dashboard",
    short_name: "Payzen",
    description: "Crypto trading dashboard",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f6",
    theme_color: "#f5f5f6",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
