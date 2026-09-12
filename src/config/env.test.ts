import { describe, expect, it } from 'vitest'
import { createEnvironment, type EnvironmentSource } from '@/config/env'

const validSource: EnvironmentSource = {
  VITE_APP_NAME: 'React Vite Best Practices',
  VITE_API_BASE_URL: 'https://api.example.com',
  VITE_DUMMYJSON_API_BASE_URL: 'https://dummy.example.com',
  VITE_FEATURE_MOCK_POSTS_API: 'false',
  VITE_FEATURE_MOCK_ASSISTANT_API: 'false',
  MODE: 'test',
  DEV: true,
  PROD: false,
}

describe('createEnvironment', () => {
  it('normalizes and freezes the environment configuration', () => {
    const environment = createEnvironment({
      ...validSource,
      VITE_APP_NAME: '  React Vite Best Practices  ',
    })

    expect(environment).toEqual({
      appName: 'React Vite Best Practices',
      apiBaseUrl: 'https://api.example.com',
      dummyJsonApiBaseUrl: 'https://dummy.example.com',
      mockPostsApi: false,
      mockAssistantApi: false,
      mode: 'test',
      isDevelopment: true,
      isProduction: false,
    })
    expect(Object.isFrozen(environment)).toBe(true)
  })

  it('throws a descriptive error when a required value is empty', () => {
    expect(() =>
      createEnvironment({
        ...validSource,
        VITE_API_BASE_URL: ' ',
      }),
    ).toThrow('Missing required environment variable: VITE_API_BASE_URL')
  })

  it('parses feature flags strictly', () => {
    expect(
      createEnvironment({ ...validSource, VITE_FEATURE_MOCK_POSTS_API: ' TRUE ' }).mockPostsApi,
    ).toBe(true)
    expect(() => createEnvironment({ ...validSource, VITE_FEATURE_MOCK_POSTS_API: 'yes' })).toThrow(
      'Environment variable VITE_FEATURE_MOCK_POSTS_API must be either "true" or "false"',
    )
  })
})
