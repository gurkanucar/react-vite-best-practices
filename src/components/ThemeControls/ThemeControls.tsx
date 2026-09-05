import {
  BgColorsOutlined,
  CompressOutlined,
  DesktopOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { Button, Flex, Popover, Segmented, Switch, Tooltip, Typography } from 'antd'
import { useState, type CSSProperties } from 'react'
import { usePreferencesStore } from '@/store/preferences-store'
import { visualThemeOptions, type ColorMode, type VisualTheme } from '@/theme/theme'
import './ThemeControls.css'

const colorModeOptions = [
  { label: 'System', value: 'system', icon: <DesktopOutlined /> },
  { label: 'Light', value: 'light', icon: <SunOutlined /> },
  { label: 'Dark', value: 'dark', icon: <MoonOutlined /> },
]

export function ThemeControls() {
  const [themeGalleryOpen, setThemeGalleryOpen] = useState(false)
  const colorMode = usePreferencesStore((state) => state.colorMode)
  const compact = usePreferencesStore((state) => state.compact)
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const setColorMode = usePreferencesStore((state) => state.setColorMode)
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
    <Flex className="theme-controls" align="center" gap={12}>
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
      <Segmented
        aria-label="Color theme"
        options={colorModeOptions}
        value={colorMode}
        onChange={(value) => setColorMode(value as ColorMode)}
      />
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
