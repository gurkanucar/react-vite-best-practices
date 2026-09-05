/** @type {import('lint-staged').Configuration} */
export default {
  '*.{js,jsx,ts,tsx,mjs}': ['oxlint --fix --deny-warnings', 'oxfmt --write'],
  '*.{css,html,json,jsonc,md,yaml,yml}': 'oxfmt --write',
}
