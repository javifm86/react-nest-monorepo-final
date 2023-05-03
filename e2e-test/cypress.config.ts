import {
  addCucumberPreprocessorPlugin,
  afterSpecHandler,
  afterRunHandler
} from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { defineConfig } from 'cypress';

import globalConfig from './config/config';

const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

const { cypressConfig, env } = globalConfig;

const { e2e, ...restOfCypressConfig } = cypressConfig;

export default defineConfig({
  experimentalInteractiveRunEvents: true,
  requestTimeout: 5000,
  responseTimeout: 10000,
  pageLoadTimeout: 60000,
  fixturesFolder: 'fixtures',
  screenshotsFolder: 'report/errors',
  downloadsFolder: 'downloads',
  video: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    async setupNodeEvents(on, config) {
      const finalConfig = {
        ...config,
        ...cypressConfig
      };
      await addCucumberPreprocessorPlugin(on, finalConfig);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(finalConfig)]
        })
      );

      const basePluginPath = './plugins/';

      on('after:run', async () => {
        await afterRunHandler(finalConfig);
        require(`${basePluginPath}jenkins`);
      });
      on('after:spec', (spec, results) => {
        afterSpecHandler(finalConfig, spec, results);
        require(`${basePluginPath}errorHandler`)(results);
      });

      return {
        ...finalConfig,
        env: {
          ...finalConfig.env,
          ...env
        }
      };
    },
    baseUrl: env.baseUrl,
    supportFile: 'config/global.ts',
    ...cypressConfig.e2e
  },
  ...restOfCypressConfig
});
