import { Button, Checkbox, Flex, Radio, Select, Space, Switch, Typography } from 'antd'
import type { ReactNode } from 'react'
import {
  AGE_GROUPS,
  CITY_IDS,
  COMPANIONS,
  SIZES,
  SPECIES,
  cities,
  type CityId,
  type Sex,
} from '@/features/showcases/data/pets'
import {
  countActiveFilters,
  emptyPetFilters,
  type PetFilters,
} from '@/features/showcases/data/petsMatch'
import { usePetsCopy } from '@/features/showcases/hooks/usePetsStore'

interface PetsFiltersProps {
  filters: PetFilters
  onChange: (filters: PetFilters) => void
  matchOnly: boolean
  onMatchOnly: (value: boolean) => void
  /** Inside the drawer, whose own header already says "Filters". */
  embedded?: boolean
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="pets-filters__group">
      <legend>{title}</legend>
      {children}
    </fieldset>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  hint?: string
}) {
  return (
    <label className="pets-filters__toggle">
      <span>
        {label}
        {hint && (
          <Typography.Text type="secondary" className="pets-filters__hint">
            {hint}
          </Typography.Text>
        )}
      </span>
      <Switch size="small" checked={checked} onChange={onChange} />
    </label>
  )
}

export function PetsFilters({
  filters,
  onChange,
  matchOnly,
  onMatchOnly,
  embedded = false,
}: PetsFiltersProps) {
  const { text, language } = usePetsCopy()
  const set = <K extends keyof PetFilters>(key: K, value: PetFilters[K]) =>
    onChange({ ...filters, [key]: value })
  const active = countActiveFilters(filters) + Number(matchOnly)

  return (
    <div className="pets-filters">
      <Flex justify={embedded ? 'flex-end' : 'space-between'} align="center">
        {!embedded && (
          <Typography.Title level={4} className="pets-filters__title">
            {text.list.filters}
          </Typography.Title>
        )}
        {active > 0 && (
          <Button
            color="primary"
            variant="link"
            size="small"
            onClick={() => {
              onChange({ ...emptyPetFilters, query: filters.query })
              onMatchOnly(false)
            }}
          >
            {text.list.clear}
          </Button>
        )}
      </Flex>

      <Group title={text.list.groups.species}>
        <Checkbox.Group
          value={filters.species}
          onChange={(value) => set('species', value)}
          options={SPECIES.map((value) => ({ value, label: text.speciesPlural[value] }))}
        />
      </Group>

      <Group title={text.list.groups.city}>
        <Select<CityId | 'all'>
          className="pets-full"
          aria-label={text.list.groups.city}
          value={filters.city ?? 'all'}
          onChange={(value) => set('city', value === 'all' ? null : value)}
          options={[
            { value: 'all', label: text.list.anyCity },
            ...CITY_IDS.map((value) => ({ value, label: cities[value][language] })),
          ]}
        />
      </Group>

      <Group title={text.list.groups.age}>
        <Checkbox.Group
          className="pets-filters__stack"
          value={filters.ages}
          onChange={(value) => set('ages', value)}
          options={AGE_GROUPS.map((value) => ({ value, label: text.ages[value] }))}
        />
      </Group>

      <Group title={text.list.groups.size}>
        <Checkbox.Group
          value={filters.sizes}
          onChange={(value) => set('sizes', value)}
          options={SIZES.map((value) => ({ value, label: text.sizes[value] }))}
        />
      </Group>

      <Group title={text.list.groups.sex}>
        <Radio.Group
          optionType="button"
          size="small"
          value={filters.sex ?? 'any'}
          onChange={(event) => {
            const value = event.target.value as Sex | 'any'
            set('sex', value === 'any' ? null : value)
          }}
          options={[
            { value: 'any', label: text.list.anySex },
            { value: 'female', label: text.sexes.female },
            { value: 'male', label: text.sexes.male },
          ]}
        />
      </Group>

      <Group title={text.list.groups.goodWith}>
        <Checkbox.Group
          value={filters.goodWith}
          onChange={(value) => set('goodWith', value)}
          options={COMPANIONS.map((value) => ({ value, label: text.companions[value] }))}
        />
      </Group>

      <Group title={text.list.groups.home}>
        <Space orientation="vertical" size={12} className="pets-full">
          <Toggle
            label={text.list.matchOnly}
            hint={text.list.matchHint}
            checked={matchOnly}
            onChange={onMatchOnly}
          />
          <Toggle
            label={text.common.apartment}
            checked={filters.apartment}
            onChange={(value) => set('apartment', value)}
          />
          <Toggle
            label={text.list.specialOnly}
            checked={filters.specialNeeds}
            onChange={(value) => set('specialNeeds', value)}
          />
          <Toggle
            label={text.list.availableOnly}
            checked={filters.availableOnly}
            onChange={(value) => set('availableOnly', value)}
          />
        </Space>
      </Group>
    </div>
  )
}
