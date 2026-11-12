# Online Multiplayer Upgrade Plan

## Confirmed requirements
- Preserve the existing physical-card scorekeeper mode and its saved games.
- Add a distinct live online multiplayer mode.
- Support 2–8 players.
- Use multiple independently identifiable 52-card decks, shuffled together when the peak round requires more than 52 cards (8 players × 8 cards = 64 cards).
- Players join the same room across countries, using their own devices.
- Deal private hands; enforce turn order, following suit, trump, bidding, Brian's Rule, and scoring.
- Keep the existing round sequence: 3,4,5,6,7,8,7,6,5,4,3.

## Phase 1 — Safe mode separation
- [x] Create feature branch from main.
- [x] Add two-mode entry screen.
- [x] Keep scorekeeper's existing create/join/game handlers.
- [x] Show online mode as unavailable until secure game engine exists.
- [ ] Test scoring mode on multiple devices and verify reconnect, bid, score, history.
- [ ] Validate the feature branch in a browser before merging.

## Phase 2 — Digital rules engine
- Model each card with suit, rank, and deck identifier to distinguish duplicates.
- Implement secure server-side shuffle and deal, trick evaluation, legal-card validation, and deterministic scoring.
- Duplicate-card tie rule (confirmed): when two or more cards of the same suit and rank are played in a trick, the earliest played copy outranks later identical copies. Apply normal led-suit and trump precedence first; use play order only to break otherwise equal card ranks. Keep a unique deck/card ID for each physical copy.
- Confirm remaining rule details for blind bids and trump selection before enabling gameplay.

## Phase 3 — Secure Firebase multiplayer
- Use server-authoritative Cloud Functions for deal/play/turn transitions.
- Keep player hands under per-user restricted paths; do not store secret hands in publicly readable game state.
- Introduce an online-specific database schema and access rules; existing scorekeeper rooms remain compatible.
- Add idempotent actions and transactional turn updates to handle simultaneous requests.

## Phase 4 — UI and resilience
- Render responsive card table and tappable hand.
- Show active player, current trick, trump, bids, and scores.
- Support reconnect/resume and disconnect notifications.
- Test across iPhone, Android, desktop, and distant network connections.

## Deployment
- GitHub Pages remains the static frontend host.
- Firebase server functions may require enabling billing; review before deployment.
- Keep production main and database rules unchanged until regression and security tests pass.
