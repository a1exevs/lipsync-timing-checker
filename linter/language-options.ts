import { Linter } from 'eslint';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const languageOptions: Linter.LanguageOptions = {
  parser: tsEslint.parser,
  ecmaVersion: 2021,
  sourceType: 'module',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    ...globals.browser,
  },
};

export default languageOptions;
