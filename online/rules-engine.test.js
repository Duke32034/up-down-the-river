import {ROUND_CARDS,deckCount,makeDeck,deal,legalCards,trickWinner,validateBid,roundScore} from './rules-engine.js';
const assert=(condition,message)=>{if(!condition)throw Error(message)};
assert(ROUND_CARDS.join(',')==='3,4,5,6,7,8,7,6,5,4,3','Round order');
assert(deckCount(2,8)===1,'Two players require one deck');
assert(deckCount(8,8)===2,'Eight players require two decks');
assert(makeDeck(2).length===104,'Two decks contain 104 cards');
const two=deal(['a','b'],3,()=>0.5);
assert(two.hands.a.length===3&&two.hands.b.length===3,'Two-player deal');
const a={suit:'Spades',rankValue:14};
assert(trickWinner([{playerId:'first',card:a},{playerId:'second',card:a}])==='first','First duplicate wins');
assert(trickWinner([{playerId:'first',card:{suit:'Hearts',rankValue:14}},{playerId:'second',card:{suit:'Spades',rankValue:2}}],'Spades')==='second','Trump wins');
assert(legalCards([{suit:'Hearts'},{suit:'Spades'}],[{card:{suit:'Spades'}}]).length===1,'Follow suit');
assert(roundScore(2,2)===12&&roundScore(2,2,true)===17&&roundScore(2,1)===1,'Scoring');
let rejected=false;try{validateBid(1,{a:2},3,true)}catch{rejected=true}
assert(rejected,"Brian's Rule");
document.querySelector('#result').textContent='All 9 engine checks passed.';
