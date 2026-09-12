import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppVersion } from '@/components/AppVersion/AppVersion'

describe('AppVersion', () => {
  it('renders the version injected from package.json', () => {
    render(<AppVersion />)

    expect(screen.getByLabelText('Application version 0.1.0')).toHaveTextContent('v0.1.0')
  })
})
