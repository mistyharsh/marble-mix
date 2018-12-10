# Static file handler
In few cases, plain directory handler is not enough. You might want to transform request before serving the file. In that case, you should use `replyFile` interface.

## Usage

Following code serves a single file `assets/hello.text` for the request `GET /hello.text`.

```typescript
import { replyFile } from 'marble-mix';

const fileToServe = path.join(__dirname, 'assets', 'hello.txt');

const singleFile = EffectFactory
    .matchPath('/hello.txt')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        // TRANSFORM REQUEST HERE
        switchMap((req) => replyFile(req, res, fileToServe))));
```

## API
### `replyFile(req: HttpRequest, res: HttpResponse, filePath: string, options: StaticMiddlewareOpts)`

  - `req` and `res`: Standard request and response objects provided by Marble.js.
  - `filePath`: An absolute or relative (restricted to CWD) path of the file.
  - `options` (optional): Same as that of `serveDirectory` options. However, `root`, `fallthrough` and `params` are ignored in this case.

