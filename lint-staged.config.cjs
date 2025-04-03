module.exports = {
  "*.?(m|c)[jt]s?(x)": ["eslint --fix", "prettier --write"],
  "*.md": ["eslint --fix", "prettier --write"],
  "*.{json,css}": ["prettier --write"],
};
