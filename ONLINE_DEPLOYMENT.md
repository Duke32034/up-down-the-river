# Online multiplayer: Spark-only deployment plan

## Non-negotiable constraint
**No billing information, no Blaze upgrade, no paid Cloud Functions.** Keep the existing GitHub Pages frontend and Firebase Spark plan.

## Architecture
- GitHub Pages hosts the static game UI.
- Firebase anonymous authentication identifies each player's device.
- Firebase Realtime Database provides live room and game-state synchronization.
- Realtime Database rules restrict player-owned private hand paths and validate permitted updates.
- The host device coordinates shuffling, dealing, and game progress. This is a **trusted-host** model, not a cheat-resistant server-authoritative game.
- Avoid publicly readable full-deck or hand data. Assess private hand writes and read permissions carefully before shipping.

## Trade-offs
- A host can potentially inspect or manipulate game state; this is acceptable only for consenting casual family play.
- The host must remain online for host-driven turns or dealing; add reconnect/resume handling.
- Spark has quotas; exceeding limits can cause temporary service interruption rather than requiring a billing account.
- Do not claim this architecture is cheat-proof or production-audited.

## Remaining work
1. Replace callable-function create/join flows with database-only authenticated operations.
2. Design and test restrictive online-specific security rules for rooms and private hands.
3. Build card dealing, bidding, turn enforcement, trick resolution, and scoring.
4. Add a mobile-first UI and two-device reconnect tests.
5. Deploy GitHub Pages frontend and Firebase rules only after testing.

## Deployment
Do not deploy `functions/` or ask the owner to enable Blaze. Those files were exploratory and must be removed from the shipping branch.
