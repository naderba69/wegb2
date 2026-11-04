// 🧹 R303/ب4 + R305/ب14: حراسة كود ميت دنيا (no-unused-vars) + حراسة وصولية (jsx-a11y)
// فوق tsc وبوابات المشروع. jsx-a11y أُضيفت بعد أن مرّت بطاقة مفردات <div onClick> بلا
// دور/تبويب بلا صيد آلي (R305/ت16) — هذه القاعدة كانت تصطادها لولا غيابها.
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  // Keep the Next plugin visible at the root config level. Next 15 inspects the
  // config file itself during `next build`; a files-only declaration runs the
  // rules correctly but produces a false "plugin not detected" warning.
  {
    plugins: { "@next/next": nextPlugin },
    // Next 15's build-time detector assumes a rules object once it sees the
    // plugin. A disabled sentinel keeps that legacy detector safe; the scoped
    // config below replaces it with the full recommended/Core Web Vitals set.
    rules: { "@next/next/google-font-display": "off" },
  },
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.ts", "middleware.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" }],
      "react-hooks/exhaustive-deps": "warn",
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // كل <audio> هنا هو محتوى الدرس نفسه (كلمة/جملة/حوار ألماني) لا فيديو تكميلي —
      // والنصّ الألماني معروض دائمًا إلى جانبه على الشاشة (المعادل الوظيفي للترجمة
      // النصية). قاعدة الترجمة المصمَّمة لفيديو/صوت طويل غير ملائمة لمشغّلات نطق قصيرة.
      "jsx-a11y/media-has-caption": "off",
    },
  },
];
