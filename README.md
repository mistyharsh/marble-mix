# marble-mix
Common Utilities for [Marble.js](https://github.com/marblejs/marble). It provides:
  1. [Static directory serving middleware](./docs/directory.md)
  2. [File serving helper](./docs/file.md)
  3. [API Effect logger](./docs/effectLogger.md)
  4. [HTTP Redirect utilities](./docs/redirect.md)

Middleware for streaming files and directories streaming is build on-top of awesome [send](https://github.com/pillarjs/send) library.

## Installation
Install using `npm install --save marble-mix;`

Even if the library is written in TypeScript, it is published as CommonJS module and hence can be used directly from Node.js code without any compilation.
