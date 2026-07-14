// eslint-config-next v16 ships native flat configs, so they're imported
// directly (the old FlatCompat bridge crashes with ESLint 9 + Next 16).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    // react-three-fiber renders three.js objects as lowercase JSX tags with
    // non-DOM props (position, args, castShadow...); this rule only knows
    // real DOM elements, so it's disabled for the 3D world components.
    files: ["src/components/world/**/*.tsx"],
    rules: { "react/no-unknown-property": "off" },
  },
];

export default eslintConfig;
