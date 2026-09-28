import { Checkbox, Flex, Radio, Select, Slider, Switch, Typography } from 'antd'
import {
  CAREERS_CATEGORIES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_LOCATIONS,
  WORK_MODES,
  CITY_NAMES,
  careersCompanies,
} from '@/features/showcases/data/careers'
import {
  POSTED_WITHIN,
  formatSalary,
  type JobFilters,
} from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'

interface CareersFilterFieldsProps {
  filters: JobFilters
  onChange: (patch: Partial<JobFilters>) => void
}

const SALARY_STEP = 10_000
const SALARY_MAX = 200_000

/** Every filter, stacked: the contents of the filters drawer. */
export function CareersFilterFields({ filters, onChange }: CareersFilterFieldsProps) {
  const { text, language } = useCareersCopy()
  const salary = filters.salary ?? 0

  return (
    <Flex vertical gap={24} className="careers-filters">
      <fieldset>
        <legend>{text.home.location}</legend>
        <Select
          allowClear
          className="full-width"
          aria-label={text.home.location}
          placeholder={text.home.anyLocation}
          value={filters.location}
          onChange={(location) => onChange({ location })}
          options={JOB_LOCATIONS.map((value) => ({ value, label: CITY_NAMES[language][value] }))}
        />
      </fieldset>

      <fieldset>
        <legend>{text.jobs.workMode}</legend>
        <Checkbox.Group
          value={filters.modes}
          onChange={(modes) => onChange({ modes })}
          options={WORK_MODES.map((value) => ({ value, label: text.modes[value] }))}
        />
      </fieldset>

      <fieldset>
        <legend>{text.jobs.type}</legend>
        <Checkbox.Group
          value={filters.types}
          onChange={(types) => onChange({ types })}
          options={EMPLOYMENT_TYPES.map((value) => ({ value, label: text.types[value] }))}
        />
      </fieldset>

      <fieldset>
        <legend>{text.jobs.level}</legend>
        <Checkbox.Group
          value={filters.levels}
          onChange={(levels) => onChange({ levels })}
          options={EXPERIENCE_LEVELS.map((value) => ({ value, label: text.levels[value] }))}
        />
      </fieldset>

      <fieldset>
        <legend>{text.jobs.salary}</legend>
        <Typography.Text type="secondary">
          {salary ? text.jobs.salaryAtLeast(formatSalary(salary, language)) : text.jobs.salaryAny}
        </Typography.Text>
        <Slider
          min={0}
          max={SALARY_MAX}
          step={SALARY_STEP}
          value={salary}
          aria-label={text.jobs.salary}
          tooltip={{ open: false }}
          onChange={(value) => onChange({ salary: value || undefined })}
        />
      </fieldset>

      <fieldset>
        <legend>{text.jobs.posted}</legend>
        <Radio.Group
          value={filters.posted ?? 'any'}
          onChange={(event) =>
            onChange({ posted: event.target.value === 'any' ? undefined : event.target.value })
          }
          options={[
            { value: 'any', label: text.jobs.anyTime },
            ...POSTED_WITHIN.map((value) => ({ value, label: text.posted[value] })),
          ]}
        />
      </fieldset>

      <fieldset>
        <legend>{text.jobs.category}</legend>
        <Select
          allowClear
          className="full-width"
          aria-label={text.jobs.category}
          placeholder={text.jobs.anyCategory}
          value={filters.category}
          onChange={(category) => onChange({ category })}
          options={CAREERS_CATEGORIES.map((value) => ({ value, label: text.categories[value] }))}
        />
      </fieldset>

      <fieldset>
        <legend>{text.jobs.company}</legend>
        <Select
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          className="full-width"
          aria-label={text.jobs.company}
          placeholder={text.jobs.anyCompany}
          value={filters.company}
          onChange={(company) => onChange({ company })}
          options={careersCompanies.map((company) => ({ value: company.id, label: company.name }))}
        />
      </fieldset>

      <label className="careers-filters__switch">
        <Switch checked={filters.easy} onChange={(easy) => onChange({ easy })} />
        <span>{text.jobs.easyOnly}</span>
      </label>
    </Flex>
  )
}
