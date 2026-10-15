/** Pure authorization policy for the arena nurse's server-owned dialogue effect. */
export type ArenaNurseContext = {
  npcId: string;
  liveNpcId: string;
  entityId: string;
  dialogueNpcId: string;
  dialogueEntityId?: string;
  playerId: string;
  sessionPlayerId: string;
  sessionType: string;
  sessionEntityId: string;
  alive: boolean;
  inDuel: boolean;
  playerPosition: { x: number; y: number; z: number };
  npcPosition: { x: number; y: number; z: number };
  maxDistance: number;
};

export function canRestoreAtArenaNurse(context: ArenaNurseContext): boolean {
  const c = context;
  if (
    c.npcId !== "duel_arena_nurse" ||
    c.liveNpcId !== c.npcId ||
    c.dialogueNpcId !== c.npcId ||
    !c.entityId ||
    c.dialogueEntityId !== c.entityId ||
    c.sessionEntityId !== c.entityId ||
    !c.playerId ||
    c.sessionPlayerId !== c.playerId ||
    c.sessionType !== "dialogue" ||
    !c.alive ||
    c.inDuel
  )
    return false;

  const coordinates = [
    c.playerPosition.x,
    c.playerPosition.y,
    c.playerPosition.z,
    c.npcPosition.x,
    c.npcPosition.y,
    c.npcPosition.z,
    c.maxDistance,
  ];
  if (!coordinates.every(Number.isFinite) || c.maxDistance < 0) return false;

  // Match the server interaction manager's X/Z Chebyshev distance contract.
  return (
    Math.max(
      Math.abs(c.playerPosition.x - c.npcPosition.x),
      Math.abs(c.playerPosition.z - c.npcPosition.z),
    ) <= c.maxDistance
  );
}
