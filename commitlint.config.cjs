module.exports = {
  /*
   * Whether commitlint uses the default ignore rules, see the description above.
   */
  defaultIgnores: true,
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ["@commitlint/config-conventional"],
  /*
   * Custom URL to show upon failure
   */
  helpUrl: "https://www.conventionalcommits.org/en/v1.0.0/#summary",
  parserPreset: {
    parserOpts: {
      issuePrefixes: ["KD-"],
    },
  },

  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    "body-max-line-length": [1, "always", 100],
    "references-empty": [0, "never"],
    "subject-max-length": [1, "always", 100],
    "subject-case": [0, "always"],
    "type-empty": [1, "never"],
    "subject-empty": [1, "never"],
    "type-case": [1, "always", "lower-case"],
    "type-enum": [
      1,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "update",
        "improve",
        "change",
      ],
    ],
  },
};
