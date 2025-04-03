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
    "body-max-line-length": [2, "always", 72],
    "references-empty": [0, "never"],
    "subject-max-length": [2, "always", 50],
  },
};
