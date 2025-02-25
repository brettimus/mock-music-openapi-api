# FP Playground Mock API

This is a mock API for the FP Playground. It is used to test the FP Playground against a large-ish and varied OpenAPI spec.

## Local Development with `fiberplane`

If you are working with unpublished builds of `@fiberplane/hono` and `@fiberplane/hono-otel`, you can link to your local builds by running:

```json
    "@fiberplane/hono": "link:/path/to/fiberplane/packages/fiberplane-hono",
    "@fiberplane/hono-otel": "link:/path/to/fiberplane/packages/client-library-otel",
```

If you do this, a few things to note:

1. You need to manually build the packages, or run their `watch` scripts to force rebuilds when you make changes.
2. Typescript will complain about the types of arguments to `@fiberplane/hono`, but this shouldn't be an issue once published. 
