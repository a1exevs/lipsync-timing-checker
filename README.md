# Lipsync Timing Checker

# Description
Application for calibrating viseme according to Audio track.

## Yarn version
v4.9.0
```bash
npm install -g corepack@0.31.0
corepack enable
yarn install
```

## Node version
v20.9.0. Use NVM:
1. nvm current - check current version of Node
2. nvm list - show list of available Node versions
3. nvm install <version> - to install and use Node version.
4. nvm use <version> - set version of Node as current version

# Getting Started with Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
In the project directory, you can run:

### `yarn run dev`
Starts the application in development mode using `react-app-rewired start`.

### `yarn run build:local`
Builds the application locally with an empty `PUBLIC_URL`.

### `yarn run build`
Creates an optimized production build using `react-app-rewired build`.

### `yarn run predeploy`
Formats sources, runs lint checks and builds the project before deployment.

### `yarn run deploy`
Deploys the contents of the `build` folder to GitHub Pages.

### `yarn run serve`
Serves the static files from the `build` directory.

### `yarn run check-deps`
### `yarn run upgrade-deps`
Checks/updates available dependencies to the latest version.

### `yarn run format`
Formats code using Prettier for TypeScript, TSX, and CSS, SCSS files.

### `yarn run lint`
Runs ESLint for static code analysis on TypeScript and TSX files.

### `yarn run lint:fix`
Fixes errors found by ESLint in TypeScript and TSX files.

### `yarn test:unit`
Runs unit tests using the Jest configuration.

### `yarn test:unit-cov`
Runs unit tests with coverage calculation option.

### `yarn test:snap`
Runs snapshot tests using the Jest configuration.

### `yarn test:snap-cov`
Runs snapshot tests with coverage calculation option.

### `yarn test:snap-update`
Updates snap-data of snapshot tests.

### `yarn test:e2e`
Executes e2e tests (Playwright)

### `yarn test`
Sequentially executes unit tests, snapshot tests, integration tests, e2e tests.

### `yarn storybook`
Runs Storybook in development mode on port 6006.

### `yarn build-storybook`
Builds a static version of Storybook for deployment.

### `yarn chromatic`
Runs Chromatic to check for visual changes in components and exits with a code 0 even if changes are detected.

### `yarn docs`
Generates comprehensive documentation using TypeDoc.

### `yarn version:major`
Increments the major version in `package.json` and `src/app/manifest.json`.  
For example, changes `"version": "1.2.3"` to `"version": "2.0.0"`.

### `yarn version:minor`
Increments the minor version in `package.json` and `src/app/manifest.json`.  
For example, changes `"version": "1.2.3"` to `"version": "1.3.0"`.

### `yarn version:patch`
Increments the patch version in `package.json` and `src/app/manifest.json`.  
For example, changes `"version": "1.2.3"` to `"version": "1.2.4"`.

### `yarn update-version:major`
Automates the process of merging branches, increasing the major-version in the package.json file and manifest file, and committing the changes to the designated branch. This ensures the version is updated consistently and the changes are easily trackable in the repository.

### `yarn update-version:minor`
Automates the process of merging branches, increasing the minor-version in the package.json file and manifest file, and committing the changes to the designated branch. This ensures the version is updated consistently and the changes are easily trackable in the repository.

### `yarn update-version:patch`
Automates the process of merging branches, increasing the patch-version in the package.json file and manifest file, and committing the changes to the designated branch. This ensures the version is updated consistently and the changes are easily trackable in the repository.

### `yarn e2e:install`
Installs Playwright deps.

### `yarn run postinstall`
Automatically runs after dependencies installation to set up git hooks through husky.

## Release steps
1) run yarn update-version:patch (or :minor, :major)
2) create PR with message "[Common] Version increase vX.X.X" from "common/version-increase" into "develop"
3) create PR with message "[Testing] Release vX.X.X" from "develop" into "testing"
4) create PR with message "Release vX.X.X" from "testing" into "main"
5) go to [Github page](https://a1exevs.github.io/lipsync-timing-checker),
   wait for the production server update to complete, make sure everything is working
6) go to [Github Repo Home page](https://github.com/a1exevs/lipsync-timing-checker) -> Tags -> Releases -> Draft a new release.

   a) create a new tag via "Choose a tag" autocomplete

   b) select "develop" branch as a target

   c) click the "Generate release notes" button, remove unnecessary notes if necessary, check PR messages and correct the messages if necessary (via PR editing)

   d) select "main" branch as a target

   e) click the "Publish release"
7) checkout "testing" and pull, then merge "main" into "testing" and push
8) checkout "develop" and pull, then merge "testing" into "develop" and push 
9) update RELEASE-NOTES.md with using generated notes in step 6, create PR with from "common/release-notes-update-vX.X.X" to "develop" message "[Common] RELEASE-NOTES.md update vX.X.X"


## Repository
Link to repository https://github.com/a1exevs/lipsync-timing-checker.
