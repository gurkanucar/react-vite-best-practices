import { Breadcrumb, Col, Flex, Row } from 'antd'
import { useSearchParams } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  FollowerList,
  FriendGrid,
  PostCard,
  PostComposer,
  ProfileAbout,
  ProfileCover,
  ProfileGallery,
  ProfileSocial,
  ProfileStats,
} from '@/features/profile/components'
import { profileOwner, profilePosts } from '@/features/profile/data'
import { useMessages } from '@/i18n/messages'

const TABS = ['profile', 'followers', 'friends', 'gallery'] as const
type ProfileTab = (typeof TABS)[number]

function isProfileTab(value: string | null): value is ProfileTab {
  return value !== null && (TABS as readonly string[]).includes(value)
}

export function ProfilePage() {
  const messages = useMessages()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: ProfileTab = isProfileTab(tabParam) ? tabParam : 'profile'

  return (
    <div className="admin-page">
      {/* Description commented out rather than deleted: not worth the space on this screen. */}
      <PageHeader title={messages.profile.title} /* description={messages.profile.description} */ />

      <Breadcrumb
        className="profile-breadcrumb"
        items={[
          { title: messages.navigation.dashboard },
          { title: messages.profile.people },
          { title: profileOwner.name },
        ]}
      />

      <ProfileCover
        person={profileOwner}
        activeKey={tab}
        onChange={(key) =>
          setSearchParams((current) => {
            const next = new URLSearchParams(current)
            next.set('tab', key)
            return next
          })
        }
        items={TABS.map((key) => ({ key, label: messages.profile.tabs[key] }))}
      />

      {tab === 'profile' && (
        <Row gutter={[16, 16]} className="profile-body">
          <Col xs={24} lg={8}>
            <Flex vertical gap={16}>
              <ProfileStats />
              <ProfileAbout />
              <ProfileSocial />
            </Flex>
          </Col>

          <Col xs={24} lg={16}>
            <Flex vertical gap={16}>
              <PostComposer />
              {profilePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Flex>
          </Col>
        </Row>
      )}

      {tab === 'followers' && (
        <div className="profile-body">
          <FollowerList />
        </div>
      )}

      {tab === 'friends' && (
        <div className="profile-body">
          <FriendGrid />
        </div>
      )}

      {tab === 'gallery' && (
        <div className="profile-body">
          <ProfileGallery />
        </div>
      )}
    </div>
  )
}
