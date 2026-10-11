# Up & Down the River ♠

A mobile-first, five-player, shared-score card game. Each player joins from their own phone using a room code. The host runs the game and can correct mistakes.

## Rules implemented

- Exactly five players.
- Eleven rounds: **3, 4, 5, 6, 7, 8** cards with trump, then **7, 6, 5, 4, 3** without trump.
- The dealer rotates every round and bids last.
- Bids are visible immediately and locked once submitted; the host can correct them.
- **Brian's Rule:** the final dealer bid cannot make the sum of all bids equal the number of tricks.
- Exact regular bid scores **10 + bid**; exact blind bid scores **15 + bid**; missed bid scores **0**.
- The host records tricks won and can reopen the last completed round.
- Live scoreboard, game history, and reconnection through a saved room code.

## One-time setup to play on multiple phones

This app uses **Firebase Authentication** (anonymous sign-in) and **Firebase Realtime Database** to synchronize devices. Firebase offers a no-cost tier subject to usage limits.

1. Go to https://console.firebase.google.com/ and create a project.
2. Under **Build → Authentication → Sign-in method**, enable **Anonymous**.
3. Under **Build → Realtime Database**, create a database. Copy its exact database URL.
4. In **Realtime Database → Rules**, replace the rules with the contents of `database.rules.json`, then publish. Do not leave test-mode rules enabled.
5. Under **Project settings → Your apps**, register a **Web** app and copy its Firebase config into `config.js` in this repository. Ensure `databaseURL` matches the database URL from step 3. The web API key is a client identifier, not a secret; access is enforced by database rules.
6. In GitHub, open **Settings → Pages**. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
7. Once published, open **https://duke32034.github.io/up-down-the-river/** on your phone. Create a room and send the invite link to four other players.

All players need internet access. If you want to use the app on a different phone after reinstalling or clearing browser storage, Firebase anonymous authentication assigns a new player identity. Rejoin during the lobby or have the host create a fresh room.

## Host workflow

Create a room → wait for five players → start → choose trump (trump rounds only) → each player bids in order → record each player's tricks → finish round. After round 11, the winner is shown.

## Important notes

- **This is an initial playable build, not a production-audited game service.** Test with five browsers before relying on it for a family game.
- The client checks Brian's Rule, but a fully tamper-resistant implementation requires server-side validation (for example, a Firebase Cloud Function) to prevent malicious or simultaneous requests from bypassing it.
- Room codes are invitations, not passwords. Anyone with a valid code can read game state after signing in anonymously. Avoid entering sensitive information.
- Host identity is tied to the browser's anonymous Firebase account. Do not clear browser storage while hosting a game.
- Firebase project configuration is not included; the owner must supply it once.
