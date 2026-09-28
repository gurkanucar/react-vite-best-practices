import { PlayCircleFilled, StarFilled } from '@ant-design/icons'
import { Flex, Modal, Tag, Typography } from 'antd'
import { CinemaPoster } from '@/features/showcases/components/CinemaPoster'
import { formatRuntime, type Movie } from '@/features/showcases/data/cinema'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'

/** Age rating, runtime, genres and the audience score, in one line. */
export function MovieMeta({ movie }: { movie: Movie }) {
  const { text, language } = useCinemaText()
  return (
    <Flex gap={6} wrap align="center" className="cinema-meta">
      <Tag
        variant="solid"
        color={movie.rating === '18+' || movie.rating === '16+' ? 'red' : 'blue'}
      >
        {text.rating[movie.rating]}
      </Tag>
      <span>{formatRuntime(movie.minutes, language)}</span>
      <span aria-hidden="true">·</span>
      <span>{movie.genres.map((genre) => genre[language]).join(', ')}</span>
      {movie.score > 0 && (
        <span className="cinema-meta__score" title={text.score}>
          <StarFilled aria-hidden="true" /> {movie.score.toFixed(1)}
        </span>
      )}
    </Flex>
  )
}

/** The trailer is a still and a play button: no video ships with the demo. */
export function TrailerModal({ movie, onClose }: { movie: Movie | null; onClose: () => void }) {
  const { text, language } = useCinemaText()
  return (
    <Modal
      open={movie !== null}
      onCancel={onClose}
      footer={null}
      width={760}
      title={movie ? `${text.movie.trailer} · ${movie.title[language]}` : undefined}
      destroyOnHidden
    >
      {movie && (
        <div className="cinema-trailer">
          <CinemaPoster movie={movie} showTitle={false} className="cinema-trailer__art" />
          <PlayCircleFilled className="cinema-trailer__play" aria-hidden="true" />
          <Typography.Text className="cinema-trailer__note">
            {text.movie.trailerNote}
          </Typography.Text>
        </div>
      )}
    </Modal>
  )
}
