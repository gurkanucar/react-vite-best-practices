import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Input, Select, Switch, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ALL_SKILLS,
  CITIES,
  CITY_NAMES,
  ROLE_TITLES,
  careersCompanies,
  type City,
} from '@/features/showcases/data/careers'
import { suggestions } from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'

interface KeywordInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  size?: 'middle' | 'large'
  id?: string
}

/**
 * A keyword box that suggests role titles, skills and companies as you type. Picking a
 * suggestion submits it; Enter submits the surrounding form.
 */
export function CareersKeywordInput({
  value,
  onChange,
  onSubmit,
  size = 'large',
  id,
}: KeywordInputProps) {
  const { text, language } = useCareersCopy()
  const titles = useMemo(() => ROLE_TITLES.map((title) => title[language]), [language])
  const found = suggestions(value, {
    titles,
    skills: ALL_SKILLS,
    companies: careersCompanies.map((company) => company.name),
  })
  const group = (label: string, items: string[]) =>
    items.length
      ? [
          {
            label: <Typography.Text type="secondary">{label}</Typography.Text>,
            options: items.map((item) => ({ value: item, label: item })),
          },
        ]
      : []

  return (
    <AutoComplete
      value={value}
      className="careers-keyword"
      options={[
        ...group(text.home.suggestionGroups.titles, found.titles),
        ...group(text.home.suggestionGroups.skills, found.skills.slice(0, 4)),
        ...group(text.home.suggestionGroups.companies, found.companies.slice(0, 3)),
      ]}
      onChange={onChange}
      onSelect={(selected: string) => onSubmit(selected)}
    >
      <Input
        id={id}
        size={size}
        allowClear
        prefix={<SearchOutlined aria-hidden="true" />}
        placeholder={text.home.keyword}
        aria-label={text.home.keyword}
      />
    </AutoComplete>
  )
}

/** The home page's search: keyword, city and a remote switch, sent to the jobs page. */
export function CareersSearchBar({ root }: { root: string }) {
  const { text, language } = useCareersCopy()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState<City>()
  const [remote, setRemote] = useState(false)

  const submit = (query = keyword) => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (city) params.set('location', city)
    if (remote) params.set('mode', 'remote')
    const search = params.toString()
    void navigate(`${root}/jobs${search ? `?${search}` : ''}`)
  }

  return (
    <search>
      <form
        className="careers-searchbar"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className="careers-searchbar__keyword">
          <CareersKeywordInput value={keyword} onChange={setKeyword} onSubmit={submit} />
        </div>
        <Select<City>
          size="large"
          allowClear
          value={city}
          onChange={setCity}
          className="careers-searchbar__location"
          aria-label={text.home.location}
          placeholder={
            <span>
              <EnvironmentOutlined aria-hidden="true" /> {text.home.anyLocation}
            </span>
          }
          options={CITIES.map((value) => ({ value, label: CITY_NAMES[language][value] }))}
        />
        <label className="careers-searchbar__remote">
          <Switch checked={remote} onChange={setRemote} size="small" />
          <span>{text.home.remoteOnly}</span>
        </label>
        <Button type="primary" size="large" htmlType="submit" icon={<SearchOutlined />}>
          {text.home.search}
        </Button>
      </form>
    </search>
  )
}
