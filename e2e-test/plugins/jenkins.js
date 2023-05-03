/* eslint-disable @typescript-eslint/no-var-requires */
const {
  existsSync,
  renameSync,
} = require('fs');

const { jenkinsErrorsFileName } = require('./defaults');

// pretty print errors for jenkins notification
if (existsSync(`./${jenkinsErrorsFileName}`)) {
  renameSync(`./${jenkinsErrorsFileName}`, `./report/${jenkinsErrorsFileName}`);
}