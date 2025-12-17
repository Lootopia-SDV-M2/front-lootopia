import jsxA11Y from "eslint-plugin-jsx-a11y";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals"),
    ...compat.extends("plugin:jsx-a11y/recommended"),
    ...compat.extends("prettier"),
    {
        plugins: {
            "jsx-a11y": jsxA11Y,
        },
        rules: {
            "react/no-unescaped-entities": "off",
            "@next/next/no-page-custom-font": "off",
        },
    }
];

export default eslintConfig;