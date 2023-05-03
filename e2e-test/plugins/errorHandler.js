/* eslint-disable @typescript-eslint/no-var-requires */
const { writeFileSync } = require('fs');

const { jenkinsErrorsFileName } = require('./defaults');

module.exports = (results) => {
  if (!results) {
    return;
  }
  const { stats, tests } = results;

  let errorText = '';

  if (stats.failures > 0) {
    const erroredSpecs = tests.filter(({ state }) => state !== 'passed');

    erroredSpecs.forEach(({ title, attempts }) => {
      const { error } = attempts[0];
      const titleError = `Error in ${title.join(' -> ')}.`;

      if (!error) {
        errorText += `${titleError}\n\n`;
      } else {
        const { name, message } = error;

        errorText += `${titleError}\nInformation: ${name}\nDetails: ${message}\n\n`;
      }
    });
  }

  writeFileSync(`./${jenkinsErrorsFileName}`, errorText);
};
