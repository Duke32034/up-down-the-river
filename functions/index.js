import {onCall,HttpsError} from 'firebase-functions/v2/https';
import {initializeApp} from 'firebase-admin/app';
import {getDatabase} from 'firebase-admin/database';
import {randomInt} from 'node:crypto';
initializeApp();
const db=getDatabase();
const suits=['Spades','Hearts','Diamonds','Clubs'];
const ranks=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const requireUid=req=>{if(!req.auth?.uid)throw new HttpsError('unauthenticated','Sign in first');return req.auth.uid};
const roomCode=code=>{if(typeof code!=='string'||!/^[A-Z2-9]{6}$/.test(code))throw new HttpsError('invalid-argument','Invalid room code');return code};
const gameRef=code=>db.ref('onlineGames/'+code);
function shuffledDeck(players,size){
 const n=Math.ceil(players*size/52),cards=[];
 for(let deck=0;deck<n;deck++)for(const suit of suits)for(let i=0;i<ranks.length;i++)cards.push({id:deck+':'+suit+':'+ranks[i],suit,rank:ranks[i],rankValue:i+2});
 for(let i=cards.length-1;i>0;i--){const j=randomInt(i+1);[cards[i],cards[j]]=[cards[j],cards[i]]}
 return cards;
}
export const createOnlineRoom=onCall(async req=>{
 const uid=requireUid(req),name=String(req.data?.name||'').trim();
 if(!name||name.length>24)throw new HttpsError('invalid-argument','Enter a name (1–24 characters)');
 for(let attempt=0;attempt<8;attempt++){
  const code=Array.from({length:6},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[randomInt(32)]).join('');
  const ref=gameRef(code);
  const result=await ref.transaction(current=>current===null?{hostUid:uid,phase:'lobby',createdAt:Date.now(),players:{[uid]:{name,seat:0}}}:undefined);
  if(result.committed)return {code};
 }
 throw new HttpsError('resource-exhausted','Could not create room');
});
export const joinOnlineRoom=onCall(async req=>{
 const uid=requireUid(req),code=roomCode(req.data?.code),name=String(req.data?.name||'').trim();
 if(!name||name.length>24)throw new HttpsError('invalid-argument','Enter a name (1–24 characters)');
 const result=await gameRef(code).transaction(g=>{
  if(!g||g.phase!=='lobby')return;
  if(g.players?.[uid])return g;
  const count=Object.keys(g.players||{}).length;
  if(count>=8)return;
  g.players[uid]={name,seat:count};return g;
 });
 if(!result.committed)throw new HttpsError('failed-precondition','Room not found, started, or full');
 return {code};
});
export const startOnlineRound=onCall(async req=>{
 const uid=requireUid(req),code=roomCode(req.data?.code),ref=gameRef(code);
 // Transaction serializes simultaneous start attempts. Private hands are stored separately.
 // Never write dealt cards to a public game-state path.
 const game=(await ref.get()).val();
 if(!game||game.hostUid!==uid)throw new HttpsError('permission-denied','Host only');
 throw new HttpsError('unimplemented','Secure private-hand dealing and turn actions are not deployed yet');
});
