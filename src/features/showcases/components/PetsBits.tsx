import {
  CheckCircleFilled,
  CloseCircleFilled,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import { Button, Flex, Progress, Space, Tag, Tooltip, Typography } from 'antd'
import { Link } from 'react-router'
import { PetsPortrait } from '@/features/showcases/components/PetsPortrait'
import { breeds, cities, formatAge, type Pet, type Sex } from '@/features/showcases/data/pets'
import type { Match } from '@/features/showcases/data/petsMatch'
import { usePetsCopy, usePetsStore } from '@/features/showcases/hooks/usePetsStore'

export function SexIcon({ sex }: { sex: Sex }) {
  return sex === 'female' ? (
    <WomanOutlined className="pets-sex pets-sex--female" aria-hidden="true" />
  ) : (
    <ManOutlined className="pets-sex pets-sex--male" aria-hidden="true" />
  )
}

export function FavoriteButton({ pet, size = 'middle' }: { pet: Pet; size?: 'middle' | 'large' }) {
  const { text } = usePetsCopy()
  const saved = usePetsStore((state) => state.favorites.includes(pet.id))
  const toggle = usePetsStore((state) => state.toggleFavorite)
  const label = saved ? text.common.removeFavorite(pet.name) : text.common.addFavorite(pet.name)
  return (
    <Tooltip title={label}>
      <Button
        className={`pets-heart${saved ? ' is-saved' : ''}`}
        shape="circle"
        size={size}
        aria-label={label}
        aria-pressed={saved}
        icon={saved ? <HeartFilled /> : <HeartOutlined />}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggle(pet.id)
        }}
      />
    </Tooltip>
  )
}

/** A listing card. The name is the link; its hit area covers the card, the heart sits above. */
export function PetCard({ pet, root }: { pet: Pet; root: string }) {
  const { text, language } = usePetsCopy()
  return (
    <article className="pets-card">
      <div className="pets-card__media">
        <PetsPortrait
          species={pet.species}
          coat={pet.coat}
          breed={pet.breed}
          className="pets-card__art"
        />
        <div className="pets-card__heart">
          <FavoriteButton pet={pet} />
        </div>
        {pet.status === 'reserved' && (
          <Tag className="pets-card__status" color="gold">
            {text.common.reserved}
          </Tag>
        )}
      </div>
      <div className="pets-card__body">
        <Flex justify="space-between" align="center" gap={8}>
          <Typography.Title level={4} className="pets-card__name">
            <Link to={`${root}/animals/${pet.id}`} className="pets-card__link">
              {pet.name}
            </Link>
          </Typography.Title>
          <SexIcon sex={pet.sex} />
        </Flex>
        <Typography.Text type="secondary" className="pets-card__meta">
          {breeds[pet.breed].name[language]} · {formatAge(pet.ageMonths, language)}
        </Typography.Text>
        <Flex justify="space-between" align="center" gap={8} wrap className="pets-card__foot">
          <Typography.Text className="pets-card__city">
            <EnvironmentOutlined aria-hidden="true" /> {cities[pet.cityId][language]}
          </Typography.Text>
          {pet.specialNeed ? (
            <Tag color="purple" className="pets-card__tag">
              {text.common.specialNeeds}
            </Tag>
          ) : (
            <Typography.Text type="secondary" className="pets-card__waiting">
              {text.common.waiting(pet.waitingDays)}
            </Typography.Text>
          )}
        </Flex>
      </div>
    </article>
  )
}

const levelColors: Record<Match['level'], string> = {
  great: '#1f9d6b',
  good: '#4c8df6',
  fair: '#e8a33a',
  low: '#d9534f',
}

export function MatchScore({ match, compact = false }: { match: Match; compact?: boolean }) {
  const { text } = usePetsCopy()
  return (
    <Flex align="center" gap={16} className="pets-match-score">
      <Progress
        type="circle"
        size={compact ? 56 : 84}
        percent={match.score}
        strokeColor={levelColors[match.level]}
        format={(value) => `${value}%`}
      />
      <Space orientation="vertical" size={2}>
        <Typography.Text strong>{text.match.levels[match.level]}</Typography.Text>
        <Typography.Text type="secondary">{text.match.score(match.score)}</Typography.Text>
      </Space>
    </Flex>
  )
}

export function MatchNotes({ match }: { match: Match }) {
  const { text } = usePetsCopy()
  return (
    <ul className="pets-match-notes">
      {match.notes.map(({ note, positive }) => (
        <li key={note} className={positive ? 'is-good' : 'is-bad'}>
          {positive ? (
            <CheckCircleFilled aria-hidden="true" />
          ) : (
            <CloseCircleFilled aria-hidden="true" />
          )}
          <span>{text.match.notes[note]}</span>
        </li>
      ))}
    </ul>
  )
}
