import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { csvCell } from "../apps/admin/src/lib/csv";
import { isHoneypotPopulated, leadFormSchema, leadSchema } from "../apps/web/src/lib/validation";

test("honeypot accepts bot input for a silent server-side drop", () => {
  const input = {
    name: "Spam Bot",
    email: "spam@example.com",
    locale: "en",
    website: "https://spam.invalid",
  };

  assert.equal(leadFormSchema.safeParse(input).success, true);
  assert.equal(isHoneypotPopulated(input), true);
});

test("valid human lead remains accepted", () => {
  assert.equal(
    leadSchema.safeParse({
      name: "Nino Beridze",
      email: "nino@example.com",
      locale: "ka",
    }).success,
    true,
  );
  assert.equal(isHoneypotPopulated({ website: "" }), false);
});

test("CSV cells neutralize spreadsheet formulas and still escape quotes", () => {
  assert.equal(csvCell("=1+1"), "'=1+1");
  assert.equal(csvCell("+cmd"), "'+cmd");
  assert.equal(csvCell("-2+3"), "'-2+3");
  assert.equal(csvCell("@SUM(A1:A2)"), "'@SUM(A1:A2)");
  assert.equal(csvCell('say "hi"'), '"say ""hi"""');
  assert.equal(csvCell("ქართული"), "ქართული");
});

test("initial Prisma migration and provider lock are committed", () => {
  const migration = fileURLToPath(
    new URL(
      "../packages/db/prisma/migrations/20260711092400_initial/migration.sql",
      import.meta.url,
    ),
  );
  const lock = fileURLToPath(
    new URL("../packages/db/prisma/migrations/migration_lock.toml", import.meta.url),
  );

  assert.equal(existsSync(migration), true);
  assert.equal(existsSync(lock), true);
  assert.match(readFileSync(migration, "utf8"), /CREATE TABLE "Lead"/);
  assert.match(readFileSync(migration, "utf8"), /CREATE TABLE "AdminUser"/);
});
