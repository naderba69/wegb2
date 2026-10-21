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
      // R305/ت13: أيقونات PNG حقيقية بدل SVG مضمَّن — تُظهر محتواها كاملاً على أندرويد
      // (purpose "any") ولا تُقصّ عند قناع الأيقونة التكيّفية (purpose "maskable": محتوى
      // منكمِش إلى منطقة أمان ~70% من اللوحة).
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["education", "language"],
  };
}
