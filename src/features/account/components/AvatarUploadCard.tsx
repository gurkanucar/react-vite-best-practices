import { CameraOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Popconfirm, Switch, Typography, Upload, type UploadProps } from 'antd'
import { AVATAR_MAX_BYTES, AVATAR_TYPES, megabytes } from '@/features/account/types'
import { useMessages } from '@/i18n/messages'

interface AvatarUploadCardProps {
  publicProfile: boolean
  onPublicProfileChange: (value: boolean) => void
  onDelete: () => void
  onAvatarRejected: (reason: string) => void
}

export function AvatarUploadCard({
  publicProfile,
  onPublicProfileChange,
  onDelete,
  onAvatarRejected,
}: AvatarUploadCardProps) {
  const messages = useMessages()

  /**
   * There is no upload endpoint behind this screen. Returning `false` from `beforeUpload`
   * stops Ant Design from starting a request while still running the checks a real one
   * would need — which is the part worth showing.
   */
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!AVATAR_TYPES.includes(file.type)) {
      onAvatarRejected(messages.account.avatarTypeError)
    } else if (file.size > AVATAR_MAX_BYTES) {
      onAvatarRejected(
        messages.account.avatarSizeError.replace('{size}', String(megabytes(AVATAR_MAX_BYTES))),
      )
    }

    return false
  }

  return (
    <Card className="account-side-card">
      <Flex vertical align="center" gap={16}>
        <Upload
          name="avatar"
          listType="picture-circle"
          showUploadList={false}
          accept={AVATAR_TYPES.join(',')}
          beforeUpload={beforeUpload}
        >
          <Flex vertical align="center" gap={4} className="account-avatar-drop">
            <CameraOutlined aria-hidden="true" />
            <Typography.Text type="secondary" className="account-avatar-drop__hint">
              {messages.account.uploadPhoto}
            </Typography.Text>
          </Flex>
        </Upload>

        <Typography.Paragraph type="secondary" className="account-upload-hint">
          {messages.account.avatarAllowed}
          <br />
          {messages.account.avatarMaxSize.replace('{size}', String(megabytes(AVATAR_MAX_BYTES)))}
        </Typography.Paragraph>

        <Flex align="center" gap={12}>
          <Typography.Text>{messages.account.publicProfile}</Typography.Text>
          <Switch
            checked={publicProfile}
            onChange={onPublicProfileChange}
            aria-label={messages.account.publicProfile}
          />
        </Flex>

        <Popconfirm
          title={messages.account.deleteUserConfirm}
          okText={messages.account.deleteUser}
          okButtonProps={{ danger: true }}
          cancelText={messages.common.cancel}
          onConfirm={onDelete}
        >
          <Button danger type="text">
            {messages.account.deleteUser}
          </Button>
        </Popconfirm>
      </Flex>
    </Card>
  )
}
