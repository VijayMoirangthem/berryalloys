export const BUILD_INFO = {
  id: typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev-local',
  timestamp: typeof __APP_BUILD_TIMESTAMP__ !== 'undefined' ? __APP_BUILD_TIMESTAMP__ : 'unknown',
  mode: typeof __APP_MODE__ !== 'undefined' ? __APP_MODE__ : 'development',
} as const;
