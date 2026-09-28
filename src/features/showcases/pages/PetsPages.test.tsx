import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePetsStore } from '@/features/showcases/hooks/usePetsStore'
import { PetApplyPage } from '@/features/showcases/pages/PetApplyPage'
import { PetDetailPage } from '@/features/showcases/pages/PetDetailPage'
import { PetsFavoritesPage } from '@/features/showcases/pages/PetsFavoritesPage'
import { PetsHomePage } from '@/features/showcases/pages/PetsHomePage'
import { PetsListPage } from '@/features/showcases/pages/PetsListPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

const root = '/preview/pets'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path={root} element={<PetsHomePage standalone />} />
          <Route path={`${root}/animals`} element={<PetsListPage standalone />} />
          <Route path={`${root}/animals/:petId`} element={<PetDetailPage standalone />} />
          <Route path={`${root}/apply/:petId`} element={<PetApplyPage standalone />} />
          <Route path={`${root}/favorites`} element={<PetsFavoritesPage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

/*
 * jsdom matches no media query, so these run the phone layout (filters in a drawer).
 * Controls are found by label and text; role queries over antd trees are slow here.
 */
describe('pet adoption site', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    usePetsStore.getState().reset()
  })

  it('shows the home page with featured animals, steps and shelters', () => {
    renderAt(root)
    expect(screen.getByText('Every paw deserves a home.')).toBeInTheDocument()
    expect(screen.getByText('Waiting the longest')).toBeInTheDocument()
    expect(screen.getByText('How adoption works')).toBeInTheDocument()
    expect(screen.getByText('Sarıyer Orman Evi')).toBeInTheDocument()
  })

  it('speaks Turkish', () => {
    usePreferencesStore.getState().setLanguage('tr')
    renderAt(root)
    expect(screen.getByText('Her patinin bir yuvası olmalı.')).toBeInTheDocument()
  })

  it('filters the list from the address and saves favourites', () => {
    renderAt(`${root}/animals?species=rabbit&city=bursa`)
    expect(screen.getByText('3 animals')).toBeInTheDocument()
    expect(screen.getByText('Zıpzıp')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Save Havuç to favourites'))
    expect(usePetsStore.getState().favorites).toEqual(['havuc'])
    expect(screen.getByLabelText('Remove Havuç from favourites')).toBeInTheDocument()
  })

  it('searches by name', () => {
    renderAt(`${root}/animals`)
    fireEvent.change(screen.getByLabelText('Name, breed or city'), { target: { value: 'sutlac' } })
    expect(screen.getByText('1 animal')).toBeInTheDocument()
    expect(screen.getByText('Sütlaç')).toBeInTheDocument()
  })

  it('shows an animal with its story, health and a live match', () => {
    renderAt(`${root}/animals/bulut`)
    expect(screen.getByText('Bulut’s story')).toBeInTheDocument()
    expect(screen.getByText('Microchipped')).toBeInTheDocument()
    expect(screen.getByText('Kadıköy Dostlar Barınağı')).toBeInTheDocument()
    // An apartment is too small for Bulut; ticking cats makes it worse.
    expect(screen.getByText('Needs more space than an apartment')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Cats'))
    expect(screen.getByText('Does not get on with cats')).toBeInTheDocument()
    expect(usePetsStore.getState().household.cats).toBe(true)
  })

  it('shows a not-found page for an unknown animal', () => {
    renderAt(`${root}/animals/nobody`)
    expect(screen.getByText('We could not find that animal.')).toBeInTheDocument()
  })

  it('walks through the application and tracks it', async () => {
    renderAt(`${root}/apply/pamuk`)
    expect(screen.getByText('Adopt Pamuk')).toBeInTheDocument()

    // Next is blocked until the first step is valid.
    fireEvent.click(screen.getByText('Next'))
    expect(await screen.findAllByText('Please fill this in.')).not.toHaveLength(0)

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Elif Demir' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'elif@example.com' } })
    fireEvent.change(screen.getByLabelText('Mobile phone'), { target: { value: '0212 000' } })
    fireEvent.change(screen.getByLabelText('Year of birth'), { target: { value: '2015' } })
    fireEvent.click(screen.getByText('Next'))
    expect(
      await screen.findByText('Enter a mobile number such as 0532 123 45 67.'),
    ).toBeInTheDocument()
    expect(screen.getByText('You need to be 18 or older to adopt.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Mobile phone'), { target: { value: '0532 123 45 67' } })
    fireEvent.change(screen.getByLabelText('Year of birth'), { target: { value: '1990' } })
    fireEvent.click(screen.getByText('Next'))
    expect(await screen.findByText('Type of home')).toBeInTheDocument()

    // Renters must confirm their landlord's permission.
    fireEvent.click(screen.getByLabelText('Rent'))
    await screen.findByLabelText('My landlord allows pets')
    fireEvent.click(screen.getByText('Next'))
    expect(await screen.findByText('Renters need their landlord’s permission.')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('My landlord allows pets'))
    fireEvent.click(screen.getByText('Next'))

    const reason = await screen.findByLabelText('Why would you like to adopt Pamuk?')
    fireEvent.change(reason, { target: { value: 'Too short' } })
    fireEvent.click(screen.getByText('Next'))
    expect(await screen.findByText('Please write at least 40 characters.')).toBeInTheDocument()
    fireEvent.change(reason, {
      target: { value: 'I work from home and would love a calm cat for quiet evenings.' },
    })
    fireEvent.click(screen.getByText('Next'))

    expect(await screen.findByText('Your application')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Send application'))
    expect(await screen.findAllByText('Please confirm to continue.')).toHaveLength(3)
    fireEvent.click(screen.getByLabelText('A volunteer may visit my home before the adoption.'))
    fireEvent.click(
      screen.getByLabelText('I agree to follow-up messages in the first three months.'),
    )
    fireEvent.click(
      screen.getByLabelText(
        'If I can no longer care for the animal, I will return them to the shelter.',
      ),
    )
    fireEvent.click(screen.getByText('Send application'))

    expect(await screen.findByText('Application sent!')).toBeInTheDocument()
    const [application] = usePetsStore.getState().applications
    expect(application).toMatchObject({ petId: 'pamuk' })
    expect(application!.values).toMatchObject({ fullName: 'Elif Demir', ownership: 'rent' })
    expect(application!.score).toBeGreaterThan(0)
  })

  it('lists applications with their steps and lets the visitor withdraw', async () => {
    usePetsStore.getState().apply(
      'duman',
      {
        fullName: 'Can',
        email: 'can@example.com',
        phone: '05321234567',
        birthYear: 1985,
        city: 'istanbul',
        home: 'apartment',
        ownership: 'own',
        landlordConsent: false,
        kids: false,
        cats: false,
        dogs: false,
        hoursAlone: 4,
        activity: 'medium',
        experience: 'some',
        previousPets: '',
        reason: 'x'.repeat(40),
        homeVisit: true,
        followUp: true,
        returnPolicy: true,
      },
      90,
    )
    renderAt(`${root}/favorites?tab=applications`)
    expect(screen.getByText('Application received')).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Withdraw'))
    const confirm = await screen.findAllByText('Withdraw')
    fireEvent.click(confirm.at(-1)!)
    await waitFor(() => expect(screen.getByText('Withdrawn')).toBeInTheDocument())
    expect(usePetsStore.getState().applications[0]!.withdrawnAt).toBeDefined()
  })

  it('shows an empty favourites tab with a way back to the list', () => {
    renderAt(`${root}/favorites`)
    expect(screen.getByText('Tap the heart on any animal to keep them here.')).toBeInTheDocument()
  })
})
