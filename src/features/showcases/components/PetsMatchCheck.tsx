import { Checkbox, Flex, Segmented, Select, Slider, Typography } from 'antd'
import { ENERGIES, type Pet } from '@/features/showcases/data/pets'
import { matchPet, type Experience, type HomeType } from '@/features/showcases/data/petsMatch'
import { MatchNotes, MatchScore } from '@/features/showcases/components/PetsBits'
import { usePetsCopy, usePetsStore } from '@/features/showcases/hooks/usePetsStore'

const HOMES: HomeType[] = ['apartment', 'house', 'garden']
const EXPERIENCES: Experience[] = ['none', 'some', 'experienced']

/** The detail page's live match: the visitor describes their home and the score follows. */
export function PetsMatchCheck({ pet }: { pet: Pet }) {
  const { text } = usePetsCopy()
  const household = usePetsStore((state) => state.household)
  const setHousehold = usePetsStore((state) => state.setHousehold)
  const match = matchPet(pet, household)
  const living = (['kids', 'cats', 'dogs'] as const).filter((key) => household[key])

  return (
    <section className="pets-panel pets-matchcheck" aria-labelledby="pets-match-title">
      <Typography.Title level={3} id="pets-match-title">
        {text.match.title}
      </Typography.Title>
      <Typography.Paragraph type="secondary">{text.match.lead}</Typography.Paragraph>
      <div className="pets-matchcheck__grid">
        <div className="pets-matchcheck__form">
          <div className="pets-field">
            <Typography.Text strong id="pets-match-home">
              {text.match.home}
            </Typography.Text>
            <Segmented<HomeType>
              block
              aria-labelledby="pets-match-home"
              value={household.home}
              onChange={(home) => setHousehold({ ...household, home })}
              options={HOMES.map((value) => ({ value, label: text.match.homes[value] }))}
            />
          </div>
          <div className="pets-field">
            <Typography.Text strong id="pets-match-living">
              {text.match.living}
            </Typography.Text>
            <Checkbox.Group
              aria-labelledby="pets-match-living"
              value={living}
              onChange={(values) =>
                setHousehold({
                  ...household,
                  kids: values.includes('kids'),
                  cats: values.includes('cats'),
                  dogs: values.includes('dogs'),
                })
              }
              options={(['kids', 'cats', 'dogs'] as const).map((value) => ({
                value,
                label: text.companions[value],
              }))}
            />
          </div>
          <div className="pets-field">
            <Flex justify="space-between">
              <Typography.Text strong id="pets-match-alone">
                {text.match.hoursAlone}
              </Typography.Text>
              <Typography.Text type="secondary">
                {text.match.hours(household.hoursAlone)}
              </Typography.Text>
            </Flex>
            <Slider
              aria-labelledby="pets-match-alone"
              min={0}
              max={12}
              value={household.hoursAlone}
              onChange={(hoursAlone) => setHousehold({ ...household, hoursAlone })}
              tooltip={{ formatter: (value) => text.match.hours(value ?? 0) }}
            />
          </div>
          <div className="pets-field">
            <Typography.Text strong id="pets-match-activity">
              {text.match.activity}
            </Typography.Text>
            <Segmented
              block
              aria-labelledby="pets-match-activity"
              value={household.activity}
              onChange={(activity) => setHousehold({ ...household, activity })}
              options={ENERGIES.map((value) => ({ value, label: text.energies[value] }))}
            />
          </div>
          <div className="pets-field">
            <Typography.Text strong id="pets-match-experience">
              {text.match.experience}
            </Typography.Text>
            <Select<Experience>
              aria-labelledby="pets-match-experience"
              value={household.experience}
              onChange={(experience) => setHousehold({ ...household, experience })}
              options={EXPERIENCES.map((value) => ({
                value,
                label: text.match.experiences[value],
              }))}
            />
          </div>
        </div>
        <div className="pets-matchcheck__result" aria-live="polite">
          <MatchScore match={match} />
          <MatchNotes match={match} />
          <Typography.Text type="secondary" className="pets-matchcheck__note">
            {text.match.disclaimer}
          </Typography.Text>
        </div>
      </div>
    </section>
  )
}
