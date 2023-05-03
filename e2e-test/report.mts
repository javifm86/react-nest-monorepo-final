import { Formatter } from 'cucumber-json-report-formatter';

const formatter = new Formatter();
const sourceFile = './report/cucumber-messages.ndjson';
const outputFile = './report/json/cucumber-report.json';

(async () => {
  await formatter.parseCucumberJson(sourceFile, outputFile);
})();
