type RequiredEnvKey = 'VITE_APP_NAME' | 'VITE_API_BASE_URL'

function getRequiredEnv(key: RequiredEnvKey): string {
  const value = import.meta.env[key]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

export const env = Object.freeze({
  appName: getRequiredEnv('VITE_APP_NAME'),
  apiBaseUrl: getRequiredEnv('VITE_API_BASE_URL'),
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
})
