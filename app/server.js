import { createServer } from "node:http";

export function render(version) {
  return `<!doctype html><title>web</title><h1>Hello from web</h1><p>version ${version}</p>`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const version = process.env.APP_VERSION ?? "dev";
  createServer((_req, res) => res.end(render(version))).listen(process.env.PORT ?? 3000);
}
