import { describe, expect, it } from 'vitest'
import { FEATURE_FLAGS, isFeatureEnabled } from '@/config/featureFlags'

describe('feature flags', () => {
  it('exposes known flags through one typed lookup', () => {
    expect(isFeatureEnabled('mockPostsApi')).toBe(FEATURE_FLAGS.mockPostsApi)
  })
})
