interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_DUMMYJSON_API_BASE_URL: string
  readonly VITE_FEATURE_MOCK_POSTS_API: string
  readonly VITE_FEATURE_MOCK_ASSISTANT_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
