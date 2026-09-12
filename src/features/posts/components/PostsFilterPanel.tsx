import { ClearOutlined } from '@ant-design/icons'
import { Button, Card, Col, DatePicker, Flex, Form, Input, InputNumber, Row, Select } from 'antd'
import dayjs from 'dayjs'
import { usePostCategoriesQuery, type PostFilterPatch } from '@/features/posts/hooks'
import type { PostFilterValues } from '@/features/posts/hooks'
import { POST_AUTHOR_OPTIONS } from '@/features/posts/types'
import { useMessages } from '@/i18n/messages'

interface PostsFilterPanelProps {
  values: PostFilterValues
  hasActiveFilters: boolean
  onChange: (patch: PostFilterPatch) => void
  onClear: () => void
}

const DATE_FORMAT = 'YYYY-MM-DD'

export function PostsFilterPanel({
  values,
  hasActiveFilters,
  onChange,
  onClear,
}: PostsFilterPanelProps) {
  const messages = useMessages()
  const categoriesQuery = usePostCategoriesQuery()

  return (
    <Card size="small" title={messages.posts.filtersTitle}>
      <Form layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12} lg={8}>
            {/* Free text, matched against the title by the handler. */}
            <Form.Item label={messages.posts.searchLabel}>
              <Input.Search
                key={values.search}
                allowClear
                aria-label={messages.posts.searchLabel}
                defaultValue={values.search}
                placeholder={messages.posts.searchPlaceholder}
                onSearch={(value) => onChange({ q: value.trim() || undefined })}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            {/* Options come from the API, because only the server knows them. */}
            <Form.Item label={messages.posts.categoryLabel}>
              <Select
                allowClear
                aria-label={messages.posts.categoryLabel}
                mode="multiple"
                loading={categoriesQuery.isPending}
                placeholder={messages.posts.categoryPlaceholder}
                value={values.categories}
                options={(categoriesQuery.data ?? []).map((category) => ({
                  label: category,
                  value: category,
                }))}
                onChange={(categories: string[]) =>
                  onChange({ categories: categories.join(',') || undefined })
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            {/* A closed set the client already knows, so the options are constants. */}
            <Form.Item label={messages.posts.authorLabel}>
              <Select
                allowClear
                aria-label={messages.posts.authorLabel}
                mode="multiple"
                placeholder={messages.posts.authorPlaceholder}
                value={values.authors}
                options={POST_AUTHOR_OPTIONS.map((userId) => ({
                  label: `#${userId}`,
                  value: userId,
                }))}
                onChange={(authors: number[]) =>
                  onChange({ authors: authors.join(',') || undefined })
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item label={messages.posts.viewsLabel}>
              <Flex gap={8}>
                <InputNumber
                  className="full-width"
                  min={0}
                  placeholder={messages.posts.minPlaceholder}
                  value={values.minViews}
                  onChange={(minViews) => onChange({ minViews: minViews?.toString() })}
                />
                <InputNumber
                  className="full-width"
                  min={0}
                  placeholder={messages.posts.maxPlaceholder}
                  value={values.maxViews}
                  onChange={(maxViews) => onChange({ maxViews: maxViews?.toString() })}
                />
              </Flex>
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item label={messages.posts.publishedLabel}>
              <DatePicker.RangePicker
                allowEmpty={[true, true]}
                className="full-width"
                value={[
                  values.publishedFrom ? dayjs(values.publishedFrom) : null,
                  values.publishedTo ? dayjs(values.publishedTo) : null,
                ]}
                onChange={(range) =>
                  onChange({
                    from: range?.[0]?.format(DATE_FORMAT),
                    to: range?.[1]?.format(DATE_FORMAT),
                  })
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item label=" ">
              <Button
                block
                disabled={!hasActiveFilters}
                icon={<ClearOutlined aria-hidden="true" />}
                onClick={onClear}
              >
                {messages.posts.clearFilters}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
