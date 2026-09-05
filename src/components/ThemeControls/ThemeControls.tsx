import {
  BgColorsOutlined,
  CompressOutlined,
  DesktopOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Flex, Popover, Segmented, Switch, Tooltip, Typography } from 'antd'
import { useState, type CSSProperties } from 'react'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { visualThemeOptions, type ColorMode, type VisualTheme } from '@/theme/theme'
import './ThemeControls.css'

interface ColorModeControlProps {
  variant?: 'menu' | 'segmented'
  size?: 'small' | 'middle' | 'large'
}

export function ColorModeControl({
  variant = 'segmented',
  size = 'middle',
}: ColorModeControlProps) {
  const messages = useMessages()
  const colorMode = usePreferencesStore((state) => state.colorMode)
  const setColorMode = usePreferencesStore((state) => state.setColorMode)

  const options = [
    { label: messages.common.system, value: 'system', icon: <DesktopOutlined /> },
    { label: messages.common.light, value: 'light', icon: <SunOutlined /> },
    { label: messages.common.dark, value: 'dark', icon: <MoonOutlined /> },
  ]

  if (variant === 'menu') {
    const selected = options.find((option) => option.value === colorMode) ?? options[0]

    return (
      <Dropdown
        menu={{
          items: options.map((option) => ({
            key: option.value,
            icon: option.icon,
            label: option.label,
          })),
          selectable: true,
          selectedKeys: [colorMode],
          onClick: ({ key }) => setColorMode(key as ColorMode),
        }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Tooltip title={`${messages.common.colorTheme}: ${selected.label}`}>
          <Button
            aria-label={`${messages.common.colorTheme}: ${selected.label}`}
            icon={selected.icon}
            size={size}
          />
        </Tooltip>
      </Dropdown>
    )
  }

  return (
    <Segmented
      aria-label={messages.common.colorTheme}
      options={options}
      size={size}
      value={colorMode}
      onChange={(value) => setColorMode(value as ColorMode)}
    />
  )
}

export function ThemeControls() {
  const [themeGalleryOpen, setThemeGalleryOpen] = useState(false)
  const compact = usePreferencesStore((state) => state.compact)
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const setCompact = usePreferencesStore((state) => state.setCompact)
  const setVisualTheme = usePreferencesStore((state) => state.setVisualTheme)
  const selectedTheme = visualThemeOptions.find((option) => option.value === visualTheme)

  const themeGallery = (
    <ul className="theme-gallery" aria-label="Visual theme presets">
      {visualThemeOptions.map((option) => {
        const selected = option.value === visualTheme

        return (
          <li key={option.value}>
            <Button
              aria-pressed={selected}
              block
              className="theme-gallery__option"
              icon={
                <span
                  aria-hidden="true"
                  className="theme-gallery__swatch"
                  style={{ '--theme-swatch': option.color } as CSSProperties}
                />
              }
              type={selected ? 'primary' : 'default'}
              onClick={() => {
                setVisualTheme(option.value as VisualTheme)
                setThemeGalleryOpen(false)
              }}
            >
              {option.label}
            </Button>
          </li>
        )
      })}
    </ul>
  )

  return (
    <Flex className="theme-controls" align="center" gap={12} wrap>
      <Popover
        arrow={false}
        content={themeGallery}
        open={themeGalleryOpen}
        placement="bottomRight"
        title="Ant Design theme gallery"
        trigger="click"
        onOpenChange={setThemeGalleryOpen}
      >
        <Button
          aria-label={`Visual theme: ${selectedTheme?.label ?? 'Ant Design'}`}
          className="theme-controls__preset"
          icon={<BgColorsOutlined />}
        >
          {selectedTheme?.label ?? 'Ant Design'}
        </Button>
      </Popover>
      <ColorModeControl />
      <Tooltip title="Use Ant Design's compact spacing algorithm">
        <Flex align="center" gap={7}>
          <CompressOutlined aria-hidden="true" />
          <Typography.Text className="theme-controls__density">Compact</Typography.Text>
          <Switch
            aria-label="Compact density"
            checked={compact}
            size="small"
            onChange={setCompact}
          />
        </Flex>
      </Tooltip>
    </Flex>
  )
}
