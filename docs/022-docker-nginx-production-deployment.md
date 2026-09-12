# 022 — Docker and Nginx Production Deployment

The production container builds the Vite application with Node and pnpm, then serves only the generated static files from Nginx.

## Files

```text
.
├── .dockerignore
├── Dockerfile
├── compose.yaml
└── docker/
    └── nginx.conf
```

## Multi-stage image

The first Docker stage installs locked dependencies and runs `pnpm build:production`. The second stage contains Nginx and the copied `dist` directory. Node.js, source files, development dependencies, and pnpm are not copied into the runtime image.

The install step copies `pnpm-workspace.yaml` alongside the manifest and lockfile, because pnpm
reads its settings from there, and runs with `--ignore-scripts`: the repository's `prepare` hook
installs Git hooks, and `.dockerignore` keeps `.git` out of the build context.

Build the image:

```bash
docker build -t react-vite-best-practices .
```

Run it:

```bash
docker run --rm -p 8080:80 react-vite-best-practices
```

Then open `http://localhost:8080`.

Alternatively:

```bash
docker compose up --build
```

## Build-time environment values

Vite embeds public environment values while building. Passing `-e VITE_API_BASE_URL=...` to an already-built container will not rewrite its JavaScript.

Supply deployment values as build arguments:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  --build-arg VITE_DUMMYJSON_API_BASE_URL=https://catalog.example.com \
  --build-arg VITE_FEATURE_ASSISTANT=false \
  --build-arg VITE_FEATURE_MOCK_POSTS_API=false \
  --build-arg VITE_FEATURE_MOCK_ASSISTANT_API=false \
  -t react-vite-best-practices .
```

These values are public browser configuration and must never contain private credentials. The production default disables MSW.

## Nginx behavior

`docker/nginx.conf` provides:

- `try_files $uri $uri/ /index.html` for React Router deep-link fallback;
- long-lived caching for hashed static assets;
- no-cache behavior for `index.html`;
- gzip compression;
- basic response-hardening headers;
- `/healthz` for container health checks.

Without the SPA fallback, directly opening `/products?q=phone&page=2` would ask Nginx for a physical file and return its own 404 page instead of letting React Router render the route.

## The same fallback on a static host

Nginx is one way to serve the build; dropping `dist/` on a static host is another, and that
host has no `try_files`. `public/_redirects` states the same rule in the format Netlify and
Cloudflare Pages read:

```text
/*  /index.html  200
```

It ships as a static asset, so it costs nothing on the Nginx path and is simply there if the
build is ever deployed that way instead. `200` rather than a redirect matters: a 302 would
rewrite the address bar, and every list page in this project keeps its filters in the URL.

## Verification

```bash
curl --fail http://localhost:8080/healthz
curl --fail http://localhost:8080/products?q=phone
```

The first response should be `ok`; the second should return the application HTML.

## References

- [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx `try_files`](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)
