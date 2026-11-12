// Shared, dependency-free rules for the online card engine.
// This module does not deal hands or authorize moves: those must run server-side.
export const ROUND_CARDS = Object.freeze([3,4,5,6,7,8,7,6,5,4,3]);
export const SUITS = Object.freeze(['Spades','Hearts','Diamonds','Clubs']);
export const RANKS = Object.freeze(['2','3','4','5','6','7','8','9','10','J','Q','K','A']);

export function deckCount(players, cardsPerPlayer) {
  if (!Number.isInteger(players) || players < 2 || players > 8) throw Error('Requires 2–8 players');
  if (!Number.isInteger(cardsPerPlayer) || cardsPerPlayer < 1 || cardsPerPlayer > 8) throw Error('Invalid hand size');
  return Math.ceil(players * cardsPerPlayer / 52);
}
export function makeDeck(count) {
  if (!Number.isInteger(count) || count < 1 || count > 2) throw Error('Invalid deck count');
  return Array.from({length:count}, (_,deck) =>
    SUITS.flatMap(suit => RANKS.map((rank,rankIndex) =>
      ({id:deck+':'+suit+':'+rank, deck, suit, rank, rankValue:rankIndex+2}))
    )
  ).flat();
}
export function shuffle(cards, random) {
  const out=cards.slice();
  for(let i=out.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    if(j<0||j>i)throw Error('Invalid random source');
    [out[i],out[j]]=[out[j],out[i]];
  }
  return out;
}
export function deal(players, handSize, random) {
  if (!Array.isArray(players) || new Set(players).size!==players.length) throw Error('Invalid player IDs');
  const cards=shuffle(makeDeck(deckCount(players.length,handSize)),random);
  const hands=Object.fromEntries(players.map(p=>[p,[]]));
  for(let i=0;i<handSize;i++)for(const p of players)hands[p].push(cards.pop());
  return {hands,remaining:cards};
}
export function legalCards(hand, trick) {
  if (!Array.isArray(hand)||!Array.isArray(trick)) throw Error('Invalid cards');
  if (!trick.length)return hand.slice();
  const led=trick[0].card.suit;
  const matching=hand.filter(c=>c.suit===led);
  return matching.length?matching:hand.slice();
}
export function trickWinner(plays, trump=null) {
  if(!Array.isArray(plays)||!plays.length)throw Error('No plays');
  const led=plays[0].card.suit;
  if(trump!==null&&!SUITS.includes(trump))throw Error('Invalid trump');
  let winner=plays[0],best=-1;
  for(const play of plays){
    const card=play.card;
    if(!SUITS.includes(card.suit)||!Number.isInteger(card.rankValue)||card.rankValue<2||card.rankValue>14)throw Error('Invalid card');
    const tier=trump&&card.suit===trump?2:card.suit===led?1:0;
    const strength=tier*100+card.rankValue;
    // Strictly greater: equal copies from multiple decks cannot overtake the first played.
    if(strength>best){best=strength;winner=play}
  }
  return winner.playerId;
}
export function validateBid(bid, existingBids, handSize, isLastBidder) {
  if(!Number.isInteger(bid)||bid<0||bid>handSize)throw Error('Invalid bid');
  if(isLastBidder && Object.values(existingBids).reduce((sum,b)=>sum+(typeof b==='number'?b:b.value),0)+bid===handSize)
    throw Error("Brian's Rule: final bidder cannot make total bids equal tricks");
  return true;
}
export function roundScore(bid, tricks, blind=false) {
  if(!Number.isInteger(bid)||!Number.isInteger(tricks)||bid<0||tricks<0)throw Error('Invalid score input');
  return bid===tricks?(blind?15:10)+bid:tricks;
}
