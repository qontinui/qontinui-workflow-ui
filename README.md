# @qontinui/workflow-ui

Headless React component library for the Qontinui workflow builder. Provides concrete components, headless state, render props, and a `UIProvider` shared between `qontinui-runner` and `qontinui-web/frontend`.

## Installation

```bash
npm install @qontinui/workflow-ui
```

Peer dependencies (install in your app):

- `@xyflow/react` `>=12.0.0`
- `lucide-react` `>=0.300.0`
- `mermaid` `>=11.0.0` (optional)
- `react` `>=18.0.0`
- `react-window` `>=2.0.0`

## Architecture

This package sits in the middle layer of the workflow UI stack:

```
App-Specific Layer (runner / web)         <- library pickers, StepConfigPanel, save/load
@qontinui/workflow-ui (this package)      <- concrete components, headless state, UIProvider
@qontinui/workflow-utils                  <- pure functions, settings config, formatting
@qontinui/shared-types                    <- type definitions (single source of truth)
```

See `knowledge-base/qontinui-specific/shared-frontend-packages.md` in the parent repo for the full architectural reference.

## Development

```bash
npm install
npm run build       # bundle via tsup, verify dist/index.d.ts
npm run dev         # tsup --watch
npm run typecheck   # tsc --noEmit
npm run clean       # rimraf dist
```

### Local hot-reload for cross-repo development

To work on this package alongside a consumer (e.g. `qontinui-runner`, `qontinui-web/frontend`), use `npm link`:

```bash
# In this package
cd qontinui-workflow-ui
npm link

# In the consumer
cd qontinui-runner   # or qontinui-web/frontend
npm link @qontinui/workflow-ui
```

`npm unlink @qontinui/workflow-ui` to undo.

## Release process

This package publishes to the public npm registry as `@qontinui/workflow-ui`. Releases are tag-triggered through `.github/workflows/publish.yml`.

To cut a release:

1. Bump the `version` field in `package.json` (semver). While the package is `0.x`, breaking changes bump the minor.
2. Commit the version bump on `master`.
3. Tag the commit and push:

   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

4. The `Publish to npm` workflow runs on the tag push: `npm ci`, `npm run build`, `npm publish --access public`. The `NPM_TOKEN` secret must be configured at the org or repo level.

### Dependency ordering

`@qontinui/workflow-ui` depends on `@qontinui/shared-types` and `@qontinui/workflow-utils`. Both must be published to npm at the version this package depends on before this package's tag-triggered build will succeed (otherwise `npm ci` fails to resolve them).

When making coordinated changes across the three packages, publish in dependency order:

1. `@qontinui/shared-types`
2. `@qontinui/workflow-utils`
3. `@qontinui/workflow-ui`

## License

AGPL-3.0-or-later. See [`LICENSE`](LICENSE) and [`CONTRIBUTING.md`](CONTRIBUTING.md) (CLA required for non-trivial contributions).
