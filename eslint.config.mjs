// 🧹 R303/ب4 + R305/ب14: حراسة كود ميت دنيا (no-unused-vars) + حراسة وصولية (jsx-a11y)
// فوق tsc وبوابات المشروع. jsx-a11y أُضيفت بعد أن مرّت بطاقة مفردات <div onClick> بلا
// دور/تبويب بلا صيد آلي (R305/ت16) — هذه القاعدة كانت تصطادها لولا غيابها.
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.ts"],
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
      ...jsxA11y.flatConfigs.recommended.rules,
      // كل <audio> هنا هو محتوى الدرس نفسه (كلمة/جملة/حوار ألماني) لا فيديو تكميلي —
      // والنصّ الألماني معروض دائمًا إلى جانبه على الشاشة (المعادل الوظيفي للترجمة
      // النصية). قاعدة الترجمة المصمَّمة لفيديو/صوت طويل غير ملائمة لمشغّلات نطق قصيرة.
      "jsx-a11y/media-has-caption": "off",
    },
  },
];
