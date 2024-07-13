import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "error",
      "for-direction": "error",
      "no-const-assign": "error",
      "no-dupe-else-if": "error",
      "no-inner-declarations": "error",
      "no-undef-init": "error",
      "no-self-assign": "error",
      "no-unreachable": "error",
      "no-unsafe-negation": "error",
      "valid-typeof": "error",
      "no-invalid-regexp": "error",
      "no-invalid-this": "error",
      "prefer-const": [
        "error",
        { destructuring: "any", ignoreReadBeforeAssign: false },
      ],
      "prefer-destructuring": ["error", { object: true }],
      "no-compare-neg-zero": "error",
      "no-cond-assign": "error",
      "no-constant-binary-expression": "error",
      "no-constant-condition": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-duplicate-imports": "error",
      "no-empty-character-class": "error",
      "no-empty-pattern": "error",
      "no-ex-assign": "error",
      "no-loss-of-precision": "error",
      "no-empty": "error",
      "no-empty-function": "error",
      "no-empty-static-block": "error",
      "no-extra-boolean-cast": "error",
      "no-redeclare": "error",
      "no-shadow-restricted-names": "error",
      "no-useless-catch": "error",
      "no-useless-escape": "error",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
];