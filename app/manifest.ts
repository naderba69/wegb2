import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "طريقي إلى B2 — Mein Weg bis B2",
    short_name: "WegB2",
    description: "خطة عربية تفاعلية لتعلّم الألمانية من A0 إلى B2، مع حفظ التقدّم في متصفحك.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    orientation: "portrait-primary",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='96' fill='%230b1020'/><text x='50%25' y='54%25' font-size='280' text-anchor='middle' dominant-baseline='middle' font-family='system-ui,Arial,sans-serif'>🇩🇪</text><text x='50%25' y='88%25' font-size='72' text-anchor='middle' fill='white' font-family='system-ui,Arial,sans-serif' font-weight='700'>B2</text></svg>",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["education", "language"],
  };
}
