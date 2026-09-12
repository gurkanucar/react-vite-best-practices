import { env } from '@/config/env'

export const FEATURE_FLAGS = Object.freeze({
  assistant: env.assistantEnabled,
  mockPostsApi: env.mockPostsApi,
  mockAssistantApi: env.mockAssistantApi,
})

export type FeatureFlagName = keyof typeof FEATURE_FLAGS

export function isFeatureEnabled(flag: FeatureFlagName): boolean {
  return FEATURE_FLAGS[flag]
}

/**
 * The Service Worker is shared, so it has to start when any mocked feature is on and
 * stay off — and be removed — when none of them are.
 */
export function isAnyApiMocked(): boolean {
  return FEATURE_FLAGS.mockPostsApi || (FEATURE_FLAGS.assistant && FEATURE_FLAGS.mockAssistantApi)
}
