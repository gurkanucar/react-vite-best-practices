type RequiredEnvKey =
  | 'VITE_APP_NAME'
  | 'VITE_API_BASE_URL'
  | 'VITE_DUMMYJSON_API_BASE_URL'
  | 'VITE_FEATURE_ASSISTANT'
  | 'VITE_FEATURE_MOCK_POSTS_API'
  | 'VITE_FEATURE_MOCK_ASSISTANT_API'

export type EnvironmentSource = Pick<ImportMetaEnv, RequiredEnvKey | 'MODE' | 'DEV' | 'PROD'>

function getRequiredEnv(source: EnvironmentSource, key: RequiredEnvKey): string {
  const value = source[key]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

function getBooleanEnv(source: EnvironmentSource, key: RequiredEnvKey): boolean {
  const value = getRequiredEnv(source, key).toLowerCase()

  if (value !== 'true' && value !== 'false') {
    throw new Error(`Environment variable ${key} must be either "true" or "false"`)
  }

  return value === 'true'
}

export function createEnvironment(source: EnvironmentSource) {
  return Object.freeze({
    appName: getRequiredEnv(source, 'VITE_APP_NAME'),
    apiBaseUrl: getRequiredEnv(source, 'VITE_API_BASE_URL'),
    dummyJsonApiBaseUrl: getRequiredEnv(source, 'VITE_DUMMYJSON_API_BASE_URL'),
    assistantEnabled: getBooleanEnv(source, 'VITE_FEATURE_ASSISTANT'),
    mockPostsApi: getBooleanEnv(source, 'VITE_FEATURE_MOCK_POSTS_API'),
    mockAssistantApi: getBooleanEnv(source, 'VITE_FEATURE_MOCK_ASSISTANT_API'),
    mode: source.MODE,
    isDevelopment: source.DEV,
    isProduction: source.PROD,
  })
}

export const env = createEnvironment(import.meta.env)
