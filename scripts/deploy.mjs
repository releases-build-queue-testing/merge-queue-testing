// Usage: node scripts/deploy.mjs <environment>
// Ensures the environment's services exist (as infrastructure-as-code would),
// then sets each one's desired version on the platform, one at a time.
const PLATFORM = process.env.PLATFORM_URL ?? "http://localhost:4100";

const environments = {
  dev: [{ name: "web-dev", region: "ap-southeast-2", count: 2 }],
  stg: [{ name: "web-stg", region: "ap-southeast-2", count: 2 }],
  prd: [
    { name: "web-prd-syd", region: "ap-southeast-2", count: 4 },
    { name: "web-prd-iad", region: "us-east-1", count: 4 },
  ],
};

const env = process.argv[2];
const version = process.env.ARTIFACT_VERSION;
const digest = process.env.ARTIFACT_DIGEST;
if (!environments[env]) throw new Error(`unknown environment: ${env}`);
if (!version) throw new Error("ARTIFACT_VERSION is required");

async function call(method, path, body) {
  const res = await fetch(`${PLATFORM}${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

for (const service of environments[env]) {
  await call("PUT", `/services/${service.name}`, {
    tags: { app: "web", environment: env, region: service.region },
    desired_count: service.count,
  });
  const deployment = await call("POST", `/services/${service.name}/deployments`, { version, digest });
  console.log(`${service.name}: desired version set to ${version} (${deployment.id})`);
}
