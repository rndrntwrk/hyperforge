# Guarded arena nurse restoration

The server dialogue effect `restoreArenaHealth` restores health and prayer only.
It accepts no parameters. It resolves the live NPC instance, requires its manifest
ID `duel_arena_nurse`, a matching active dialogue and server interaction session,
a connected living player (not dying), and current dialogue-range coordinates.
The duel system must exist and report no registered duel, including negotiation
and countdown. Invalid or missing authority fails closed. The dialogue is consumed
before health/prayer events, preventing repeat/reentrant continuation. Both the
combat entity and PlayerSystem health pools are restored; mismatched maxima or
uninitialized prayer state fail closed.

No inventory, stakes, rewards, payment, stamina, or duel rules are changed.
The matching assets manifest must define Nurse Sarah and its terminal treatment
node; otherwise this engine change exposes no new interaction. The companion
manifest reuses the existing Forester Wilma VRM, not new nurse artwork.

## Runnable source checks

Node 24 can run the production pure-policy tests without installing dependencies:

```sh
node --test tests/arena/nurse-policy.test.mjs
```

These test actual policy code with scalar inputs, without mocked engine services.
They do not prove the DialogueSystem-to-service integration or rendering.
From the paired assets checkout:

```sh
HYPERFORGE_ROOT=/path/to/this/checkout node --test tests/duel-arena-nurse.test.mjs
```

With the project's normal Bun dependencies available, run the shared typecheck:

```sh
cd packages/shared
bun run typecheck
```

## Required real runtime qualification (still pending)

Use the normal local server/client with the paired assets checkout and a headed
WebGPU-capable browser. Do not use WebGL or change production deployment settings.
The full engine typecheck and runtime are not verified in this source-only checkout.
The available TypeScript 5.9.3 compiler cannot use this repository’s TypeScript 6
configuration, and `bun-types`/Node type dependencies are absent.

1. Through real gameplay, reduce health and prayer. At X345 Z376, talk to Nurse
   Sarah, accept treatment, and continue. Confirm server health/prayer equal
   their maxima and the real client receives the changes. Full-health treatment
   must still restore prayer. Confirm stamina/inventory/stakes are unchanged.
2. Decline treatment or close the dialogue; neither restores stats.
3. Open treatment, then move beyond 2 X/Z Chebyshev units before continuing.
   Confirm no restoration, including during the session manager's grace ticks.
4. With a real session, test wrong NPC manifest/instance pairs, removed NPC,
   replaced/closed session, disconnect/reconnect, and repeated continuation.
   None may restore through the stale dialogue.
5. Open treatment then enter a real duel with a second player. Test negotiation,
   countdown, fighting and result states. No registered duel may receive healing.
6. Test dying/dead players through real combat and normal respawn. No resurrection
   or death-animation interruption may occur.
7. Verify the reused model, terrain height, collision and full dialogue flow.

Do not use client-only health mutation as evidence for server healing. Existing
`simulateTakingDamage` helpers affect only the browser and cannot establish this
integration. No deployment or merge is implied by passing source checks.
