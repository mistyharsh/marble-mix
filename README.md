# marble-mix
Common Utilities for [Marble.js](https://github.com/marblejs/marble). It provides:
  1. [Static directory serving middleware](./docs/directory.md)
  2. [File serving helper](./docs/file.md)
  3. [API effect logger](./docs/effectLogger.md)
  4. [HTTP redirect utilities](./docs/redirect.md)
  5. [Cookie parser middleware](./docs/cookie.md)
  6. [Toolkit](./docs/toolkit.md)

## Installation
Install using `npm install --save marble-mix;`

Even if the library is written in TypeScript, it is published as CommonJS module and hence can be used directly from Node.js code without any compilation.

### Pending work
  - Setting up CI with Travis
  - Code coverage with Coveralls
  - Documentation

## Coverage
[![Build Status](https://travis-ci.com/mistyharsh/marble-mix.svg?branch=master)](https://travis-ci.com/mistyharsh/marble-mix)

[![Coverage Status](https://coveralls.io/repos/github/mistyharsh/marble-mix/badge.svg?branch=master)](https://coveralls.io/github/mistyharsh/marble-mix?branch=master)