/*
 * Manual end-to-end check of the signup phone requirement against a real
 * running server (not the in-memory test harness).
 *
 *   node scripts/check-phone.mjs
 */
const BASE = process.env.API_URL || "http://localhost:9000";

const post = async (body) => {
  const res = await fetch(`${BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json() };
};

const stamp = Date.now();

// `phone` is unique+ sparse on the User model, so each run needs a fresh
// number or the duplicate guard rejects the "happy path" case.
const phoneA = "9" + String(100000000 + (stamp % 899999999)).slice(0, 9);
const phoneB = "8" + String(100000000 + (stamp % 899999999)).slice(0, 9);
const phoneC = "7" + String(100000000 + (stamp % 899999999)).slice(0, 9);

const withPhone = await post({
  name: "Alice Sharma",
  email: `phone-ok-${stamp}@example.com`,
  phone: phoneA,
  password: "Password123!",
});
console.log(
  "with phone   ->",
  withPhone.status,
  "role=" + withPhone.json.user?.role,
  "phone=" + withPhone.json.user?.phone,
);

const noPhone = await post({
  name: "Bob Sharma",
  email: `phone-missing-${stamp}@example.com`,
  password: "Password123!",
});
console.log("without phone->", noPhone.status, noPhone.json.message);

const shortName = await post({
  name: "C",
  email: `phone-short-${stamp}@example.com`,
  phone: phoneC,
  password: "Password123!",
});
console.log("short name   ->", shortName.status, shortName.json.message);