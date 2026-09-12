import { env } from '@/config/env'

export const FEATURE_FLAGS = Object.freeze({
  mockPostsApi: env.mockPostsApi,
})

export type FeatureFlagName = keyof typeof FEATURE_FLAGS

export function isFeatureEnabled(flag: FeatureFlagName): boolean {
  return FEATURE_FLAGS[flag]
}
