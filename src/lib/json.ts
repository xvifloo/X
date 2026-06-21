import { Prisma } from "@prisma/client";

/**
 * Plain JSON value types — describes anything that can come out of
 * `JSON.parse` (and therefore `await req.json()`). Use these to type
 * request-body fields that will be stored in a Prisma `Json` column.
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

/**
 * Converts a plain JSON value into the shape Prisma's generated client
 * expects when writing to a `Json` column (`create`/`update`/`upsert`).
 *
 * ROOT CAUSE this exists to fix: Prisma v6's generated types for a `Json`
 * field are `Prisma.InputJsonValue | Prisma.JsonNull | undefined` — NOT
 * `Prisma.InputJsonValue | null`. Prisma deliberately rejects a bare
 * TypeScript `null` at this position because it's ambiguous: it could mean
 * "store the JSON value `null`" or "leave the column untouched" /
 * "set the SQL column to NULL". To remove that ambiguity, Prisma requires
 * the literal sentinel `Prisma.JsonNull` instead of plain `null` for the
 * "store JSON null" case. Our own `JsonValue` type (above) allows `null`
 * anywhere a JSON value is allowed — which is correct for describing
 * arbitrary parsed JSON — but TypeScript therefore won't let a `JsonValue`
 * be assigned directly to Prisma's stricter input type, which is exactly
 * the "Type 'JsonValue' is not assignable to type 'JsonNull | InputJsonValue
 * | undefined'" build error this function exists to resolve.
 *
 * The single `as Prisma.InputJsonValue` cast below is sound (not just
 * convenient): `value` here is guaranteed to already be a valid JSON value,
 * because it originated from `JSON.parse` (via `req.json()`), and the
 * `=== null` branch is handled explicitly above the cast — so every
 * remaining case is a string, number, boolean, array, or plain object,
 * which is precisely what `Prisma.InputJsonValue` describes structurally.
 */
export function toPrismaJson(value: JsonValue): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}
