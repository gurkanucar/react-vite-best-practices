type RequiredEnvKey = 'VITE_APP_NAME' | 'VITE_API_BASE_URL'

export type EnvironmentSource = Pick<ImportMetaEnv, RequiredEnvKey | 'MODE' | 'DEV' | 'PROD'>

function getRequiredEnv(source: EnvironmentSource, key: RequiredEnvKey): string {
  const value = source[key]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

export function createEnvironment(source: EnvironmentSource) {
  return Object.freeze({
    appName: getRequiredEnv(source, 'VITE_APP_NAME'),
    apiBaseUrl: getRequiredEnv(source, 'VITE_API_BASE_URL'),
    mode: source.MODE,
    isDevelopment: source.DEV,
    isProduction: source.PROD,
  })
}

export const env = createEnvironment(import.meta.env)
