import { ClockCircleOutlined, ReadOutlined, StarFilled, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Progress, Row, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { courses } from '@/features/learning/data'
import type { Course } from '@/features/learning/types'
import { useMessages } from '@/i18n/messages'

const levelColors: Record<Course['levelId'], string> = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'purple',
}

export function CoursesPage() {
  const messages = useMessages()

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.learning.coursesTitle}
        extra={
          <Link to="/learning/exam">
            <Button type="primary">{messages.learning.takeExam}</Button>
          </Link>
        }
      />

      <Row gutter={[16, 16]}>
        {courses.map((course) => (
          <Col key={course.id} xs={24} md={12} xl={8}>
            <Card
              className="course-card"
              cover={<img src={course.image} alt="" className="course-card__cover" />}
            >
              <Flex gap={8} wrap className="course-card__tags">
                <Tag color={levelColors[course.levelId]}>
                  {messages.learning.levels[course.levelId]}
                </Tag>
                <Tag>
                  {
                    messages.learning.categories[
                      course.categoryId as keyof typeof messages.learning.categories
                    ]
                  }
                </Tag>
              </Flex>

              <Typography.Title level={5}>
                {
                  messages.learning.courses[
                    course.titleId as keyof typeof messages.learning.courses
                  ]
                }
              </Typography.Title>

              <Typography.Text type="secondary">
                {messages.learning.instructor} {course.instructor}
              </Typography.Text>

              <Flex gap={16} wrap className="course-card__facts">
                <Flex align="center" gap={6}>
                  <ReadOutlined aria-hidden="true" />
                  <Typography.Text type="secondary">
                    {messages.learning.lessonCount.replace('{count}', String(course.lessons))}
                  </Typography.Text>
                </Flex>
                <Flex align="center" gap={6}>
                  <ClockCircleOutlined aria-hidden="true" />
                  <Typography.Text type="secondary">
                    {messages.learning.hourCount.replace('{count}', String(course.hours))}
                  </Typography.Text>
                </Flex>
                <Flex align="center" gap={6}>
                  <TeamOutlined aria-hidden="true" />
                  <Typography.Text type="secondary">
                    {messages.learning.studentCount.replace(
                      '{count}',
                      course.students.toLocaleString(),
                    )}
                  </Typography.Text>
                </Flex>
                <Flex align="center" gap={6}>
                  <StarFilled aria-hidden="true" className="tour-star" />
                  <Typography.Text type="secondary">{course.rating}</Typography.Text>
                </Flex>
              </Flex>

              <div className="course-card__progress">
                <Typography.Text type="secondary">
                  {messages.learning.progressLabel}
                </Typography.Text>
                <Progress percent={course.progress} />
              </div>

              <Link to="/learning/exam">
                <Button block type={course.progress > 0 ? 'primary' : 'default'}>
                  {course.progress > 0
                    ? messages.learning.continueCourse
                    : messages.learning.startCourse}
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
