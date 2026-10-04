/**
 * Phone number requirement across the account-creation paths.
 *
 * `phone` is `required` on the User schema, so every route that creates a user
 * must accept it. These tests pin that contract so a future refactor cannot
 * reintroduce a handler that omits the field — which previously made
 * POST /api/v1/users fail with a 500 on every single call, because the handler
 * destructured name/email/password and never passed `phone` to the model.
 */
import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import { app, User, resetDb, shutdown } from "./helpers.js";

beforeEach(resetDb);
after(shutdown);

test("POST /auth/register accepts a signup with a phone number", async () => {
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "With Phone",
      email: "with-phone@example.com",
      phone: "9876543210",
      password: "Password123!",
      role: "merchant", // still discarded — a client is created
    })
    .expect(201);

  assert.equal(res.body.user.phone, "9876543210");
  assert.equal(res.body.user.role, "client");

  const stored = await User.findOne({ email: "with-phone@example.com" });
  assert.equal(stored.phone, "9876543210");
});

test("POST /auth/register rejects a signup with no phone number", async () => {
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "No Phone",
      email: "no-phone@example.com",
      password: "Password123!",
    })
    .expect(400);

  assert.match(
    JSON.stringify(res.body),
    /phone/i,
    "the error should mention the missing phone number",
  );

  // Nothing should have been persisted.
  assert.equal(await User.countDocuments({ email: "no-phone@example.com" }), 0);
});

test("POST /api/v1/users accepts a phone number (regression)", async () => {
  const res = await request(app)
    .post("/api/v1/users")
    .send({
      name: "Admin Created",
      email: "admin-created@example.com",
      phone: "9123456780",
      password: "Password123!",
    })
    .expect(201);

  assert.equal(res.body.user.role, "client");
  assert.equal(
    await User.countDocuments({ email: "admin-created@example.com" }),
    1,
  );
});

test("POST /api/v1/users rejects a missing phone number", async () => {
  await request(app)
    .post("/api/v1/users")
    .send({
      name: "Admin Created No Phone",
      email: "admin-created-no-phone@example.com",
      password: "Password123!",
    })
    .expect(400);
});
test("a schema violation is a 400 with the reason, not an opaque 500", async () => {
  // `name` has a minlength of 2 in the User model. This used to be swallowed
  // by the generic catch and returned 500 "Server error", which reads like a
  // server fault and gives the user nothing to act on.
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "C", // too short
      email: "short-name@example.com",
      phone: "9876543213",
      password: "Password123!",
    })
    .expect(400);

  assert.match(JSON.stringify(res.body), /name/i);

  assert.equal(
    await User.countDocuments({ email: "short-name@example.com" }),
    0,
  );
});