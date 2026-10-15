import assert from "node:assert/strict";
import { test } from "node:test";
import { canRestoreAtArenaNurse } from "../../packages/shared/src/systems/shared/interaction/arenaNursePolicy.ts";

// Real pure-policy inputs; no mocked world, entities, services, or network.
const context = {
  npcId: "duel_arena_nurse",
  liveNpcId: "duel_arena_nurse",
  entityId: "nurse-1",
  dialogueNpcId: "duel_arena_nurse",
  dialogueEntityId: "nurse-1",
  playerId: "player-1",
  sessionPlayerId: "player-1",
  sessionType: "dialogue",
  sessionEntityId: "nurse-1",
  alive: true,
  inDuel: false,
  playerPosition: { x: 345, y: 0, z: 376 },
  npcPosition: { x: 345, y: 0, z: 376 },
  maxDistance: 2,
};

test("permits a living player bound to the live nurse dialogue within range", () => {
  assert.equal(canRestoreAtArenaNurse(context), true);
  assert.equal(
    canRestoreAtArenaNurse({
      ...context,
      playerPosition: { x: 347, y: 0, z: 378 },
    }),
    true,
  );
});

test("rejects identity/session substitution, death, and every duel phase", () => {
  for (const change of [
    { npcId: "bank_clerk" },
    { liveNpcId: "bank_clerk" },
    { dialogueNpcId: "bank_clerk" },
    { entityId: "" },
    { dialogueEntityId: undefined },
    { dialogueEntityId: "other" },
    { sessionEntityId: "other" },
    { playerId: "" },
    { sessionPlayerId: "other" },
    { sessionType: "bank" },
    { alive: false },
    { inDuel: true },
  ])
    assert.equal(
      canRestoreAtArenaNurse({ ...context, ...change }),
      false,
      JSON.stringify(change),
    );
});

test("rejects out-of-range and nonfinite coordinates without grace period", () => {
  assert.equal(
    canRestoreAtArenaNurse({
      ...context,
      playerPosition: { x: 347.01, y: 0, z: 376 },
    }),
    false,
  );
  for (const key of ["x", "y", "z"])
    for (const invalid of [NaN, Infinity, -Infinity]) {
      assert.equal(
        canRestoreAtArenaNurse({
          ...context,
          playerPosition: { ...context.playerPosition, [key]: invalid },
        }),
        false,
      );
      assert.equal(
        canRestoreAtArenaNurse({
          ...context,
          npcPosition: { ...context.npcPosition, [key]: invalid },
        }),
        false,
      );
    }
  for (const maxDistance of [NaN, Infinity, -1])
    assert.equal(canRestoreAtArenaNurse({ ...context, maxDistance }), false);
});
