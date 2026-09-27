import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { RestaurantMenuPage } from '@/features/showcases/pages/RestaurantMenuPage'
import { usePreferencesStore } from '@/store/preferences-store'

function renderRestaurant() {
  return render(
    <MemoryRouter initialEntries={['/preview/restaurant']}>
      <RestaurantMenuPage standalone />
    </MemoryRouter>,
  )
}

describe('RestaurantMenuPage', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
  })

  it('offers a complete QR menu in English and Turkish', async () => {
    const user = userEvent.setup()
    renderRestaurant()

    expect(
      screen.getByRole('heading', { name: 'Istanbul on a plate, made for sharing.' }),
    ).toBeVisible()
    expect(screen.getByText('Your menu, wherever you sit')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Türkçeye geç' }))

    expect(
      screen.getByRole('heading', { name: 'Paylaşmak için hazırlanan tabaklarda İstanbul.' }),
    ).toBeVisible()
    expect(screen.getByText('Oturduğunuz her yerde menünüz yanınızda')).toBeVisible()
  })

  it('filters dishes and opens an accessible detail drawer', async () => {
    const user = userEvent.setup()
    renderRestaurant()

    await user.click(screen.getByText('Desserts'))

    expect(screen.getByRole('button', { name: 'Tahini soufflé, ₺360' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Charred octopus, ₺790' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tahini soufflé, ₺360' }))

    expect(screen.getByRole('dialog')).toBeVisible()
    expect(
      screen.getByRole('img', { name: 'Warm soufflé served with a scoop of milk ice cream' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Joe Boshra / Unsplash' })).toHaveAttribute(
      'href',
      'https://unsplash.com/@joestudios',
    )
    expect(
      screen.getByText(
        'A warm, nutty centre with a paper-thin crust, balanced by lightly salted milk ice cream.',
      ),
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: /Add to table/ }))
    expect(screen.getByRole('button', { name: /Added to your table/ })).toBeVisible()
  })
})
