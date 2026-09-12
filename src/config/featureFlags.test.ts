import { describe, expect, it } from 'vitest'
import { FEATURE_FLAGS, isAnyApiMocked, isFeatureEnabled } from '@/config/featureFlags'

describe('feature flags', () => {
  it('exposes known flags through one typed lookup', () => {
    expect(isFeatureEnabled('mockPostsApi')).toBe(FEATURE_FLAGS.mockPostsApi)
  })

  it('keeps the product capability separate from its mock transport', () => {
    expect(isFeatureEnabled('assistant')).toBe(true)
    expect(isAnyApiMocked()).toBe(false)
  })
})
