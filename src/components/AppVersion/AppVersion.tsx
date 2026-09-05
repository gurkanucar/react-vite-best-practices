import './AppVersion.css'

export function AppVersion() {
  return (
    <p className="app-version" aria-label={`Application version ${__APP_VERSION__}`}>
      <span className="app-version__label">Current build</span>
      <code className="app-version__value">v{__APP_VERSION__}</code>
    </p>
  )
}
