const { CYPRESS_BASE_URL } = process.env;

export const appName = 'appName';

export const defaults = {
  baseUrl: 'http://127.0.0.1:5173/',
  baseBackendUrl: 'http://localhost:8080',
  viewportHeight: 1080,
  viewportWidth: 1920,
  features: '**/*.{feature,features}'
};

export const defaultBaseUrl = CYPRESS_BASE_URL || defaults.baseUrl;
