module.exports = {
  // Only use prettier for TS/JS files - skip ESLint for demo app
  "*.?(m|c)[jt]s?(x)": ["prettier --write"],
  "*.md": ["prettier --write"],
  "*.{json,css}": ["prettier --write"],
};
