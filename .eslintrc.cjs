module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2022,
  },
  extends: ["next/core-web-vitals"],
  rules: {
    "@next/next/no-html-link-for-pages": "off"
  }
};

