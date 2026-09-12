import { LeftOutlined, RightOutlined, SwapOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Progress, Typography } from 'antd'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { flashcards } from '@/features/learning/data'
import { useMessages } from '@/i18n/messages'

export function FlashcardsPage() {
  const messages = useMessages()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<string>>(() => new Set())

  const card = flashcards[index]!

  /** Moving on always shows the next card front first; a flipped card would give it away. */
  const goTo = (next: number) => {
    setIndex((next + flashcards.length) % flashcards.length)
    setFlipped(false)
  }

  const mark = (isKnown: boolean) => {
    setKnown((current) => {
      const next = new Set(current)

      if (isKnown) {
        next.add(card.id)
      } else {
        next.delete(card.id)
      }

      return next
    })
    goTo(index + 1)
  }

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.learning.flashcardsTitle}
        extra={
          <Button
            onClick={() => {
              setKnown(new Set())
              goTo(0)
            }}
          >
            {messages.learning.resetDeck}
          </Button>
        }
      />

      <Flex vertical align="center" gap={16}>
        <div className="flashcard-progress">
          <Flex justify="space-between">
            <Typography.Text type="secondary">
              {messages.learning.cardOf
                .replace('{index}', String(index + 1))
                .replace('{total}', String(flashcards.length))}
            </Typography.Text>
            <Typography.Text type="secondary">
              {messages.learning.knownCount.replace('{count}', String(known.size))}
            </Typography.Text>
          </Flex>
          <Progress percent={Math.round((known.size / flashcards.length) * 100)} />
        </div>

        {/*
         * A button, not a card with an onClick: flipping is the only thing it does, and a
         * button is what a keyboard and a screen reader already understand.
         */}
        <button
          type="button"
          className="flashcard"
          aria-pressed={flipped}
          aria-label={messages.learning.flip}
          onClick={() => setFlipped((current) => !current)}
        >
          <Card className="flashcard__face">
            <Typography.Text type="secondary">
              {flipped ? messages.learning.explanation : messages.learning.flip}
            </Typography.Text>
            <Typography.Title level={4} className="flashcard__text">
              {flipped
                ? messages.learning.flashcards[
                    card.backId as keyof typeof messages.learning.flashcards
                  ]
                : messages.learning.flashcards[
                    card.frontId as keyof typeof messages.learning.flashcards
                  ]}
            </Typography.Title>
          </Card>
        </button>

        <Flex gap={8} wrap justify="center">
          <Button
            icon={<LeftOutlined aria-hidden="true" />}
            aria-label={messages.learning.previous}
            onClick={() => goTo(index - 1)}
          />
          <Button icon={<SwapOutlined aria-hidden="true" />} onClick={() => setFlipped((c) => !c)}>
            {messages.learning.flip}
          </Button>
          <Button
            icon={<RightOutlined aria-hidden="true" />}
            aria-label={messages.learning.next}
            onClick={() => goTo(index + 1)}
          />
        </Flex>

        <Flex gap={8} wrap justify="center">
          <Button onClick={() => mark(false)}>{messages.learning.markUnknown}</Button>
          <Button type="primary" onClick={() => mark(true)}>
            {messages.learning.markKnown}
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}
