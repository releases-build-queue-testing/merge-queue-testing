import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "./server.js";

test("renders the version", () => {
  assert.match(render("1.2.3"), /version 1\.2\.3/);
});
