# Online two-phone test deployment checklist

This branch includes a **backend scaffold**, not a playable online game yet.

## Implemented
- Cloud Functions setup (Node.js 22).
- Authenticated create/join callable handlers with six-character room codes.
- Maximum eight participants; no new joins after the lobby.
- Cryptographically secure card-shuffling helper for future server-side dealing.

## Required before enabling online mode
1. Implement authoritative deal/play/score transactions and private per-user hand storage.
2. Add dedicated Firebase Realtime Database rules for `onlineGames` and `onlineHands` and verify denial tests. Do **not** relax existing `games` rules.
3. Wire the client to callable functions, public game-state listeners, and private hand listeners.
4. Test two separate anonymous accounts on two devices, including refresh/reconnect.
5. Deploy functions and database rules to the existing Firebase project using owner-approved credentials; this may require Blaze billing.
6. Only then enable Play Online on the public site.

The existing Scorekeeper Mode remains unchanged.
