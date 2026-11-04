/* Regression: routine schedule, one-tap reuse of prior weight/reps, history correction, autosave. */
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..');
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},value:'',style:{},addEventListener(){},append(){},remove(){}});return elements.get(id)}
const listeners={},storage=new Map();
const context={console,Date,Math,JSON,Number,String,Array,Map,Set,Promise,structuredClone,setInterval:()=>{},setTimeout:()=>0,clearTimeout:()=>{},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},location:{protocol:'file:'},navigator:{},window:{scrollTo(){},confirm:()=>true},document:{querySelector:s=>element(s),body:{dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}}},getElementById:()=>element('pq3d-canvas'),addEventListener:(n,fn)=>listeners[n]=fn}};
context.window.window=context.window;vm.createContext(context);
for(const n of ['data.js','anatomy.js','artmap.js','insights.js','importer.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,n),'utf8'),context);
const get=()=>JSON.parse(storage.get('pumpquest.save.v1'));
const click=(action,dataset={})=>{const t={dataset:{action,...dataset},closest:()=>t};listeners.click({target:t,preventDefault(){}})};
const input=(dataset,value,id='')=>listeners.input({target:{dataset,value:String(value),id}});
// Initial migrated starters should have correct weekday assignments.
click('nav',{view:'splits'});
assert.match(element('#app').innerHTML,/My routines/);
click('editRoutine',{id:'push'});
assert.match(element('#modal-root').innerHTML,/Training days/);
element('#routine-name').value='Push';element('#routine-tag').value='Chest';
click('toggleRoutineDay',{day:'5'});
click('saveRoutine');
assert.deepEqual(Array.from(get().routines.find(x=>x.id==='push').days),[1,5]);
// User logs first workout: nothing yet to prefill.
click('startRoutine',{id:'push'});
let active=get().activeWorkout;assert.equal(active.exercises[0].sets[0].weight,'');
input({input:'weight',index:'0',set:'0'},'185');input({input:'reps',index:'0',set:'0'},'8');
click('toggleSet',{index:'0',set:'0'});
click('finishWorkout');
assert.equal(get().workouts.length,1);assert.equal(get().workouts[0].exercises[0].sets[0].weight,185);
click('goHome');
// Restarting same routine must initialize from actual previous performance, without entering any numbers.
click('startRoutine',{id:'push'});
active=get().activeWorkout;
assert.equal(active.exercises[0].sets[0].weight,'185');
assert.equal(active.exercises[0].sets[0].reps,'8');
assert.equal(active.exercises[0].sets[1].weight,'185','Missing matching historic sets fall back to last valid set');
assert.equal(active.exercises[0].sets[1].reps,'8');
assert.match(element('#app').innerHTML,/Last: 185 lb × 8/);
click('toggleSet',{index:'0',set:'0'});
assert.equal(get().activeWorkout.exercises[0].sets[0].done,true,'Prefilled set completes with one tap');
click('discardConfirm');
// Edit completed session; changes must be reflected in the next workout's prefilled values.
click('nav',{view:'history'});
const original=get().workouts[0];click('workoutDetails',{id:original.id});
assert.match(element('#modal-root').innerHTML,/EDIT SESSION/);
click('historyEdit');
assert.match(element('#modal-root').innerHTML,/EDIT WORKOUT/);
input({historyField:'weight',index:'0',set:'0'},'195');
input({historyField:'reps',index:'0',set:'0'},'9');
click('historySave');
assert.equal(get().workouts.length,1,'Edit does not duplicate history');
assert.equal(get().workouts[0].exercises[0].sets[0].weight,195);
assert.equal(get().workouts[0].exercises[0].sets[0].reps,9);
click('startRoutine',{id:'push'});
assert.equal(get().activeWorkout.exercises[0].sets[0].weight,'195');
assert.equal(get().activeWorkout.exercises[0].sets[0].reps,'9');
assert.equal(get().profile.totalXp,90,'Editing history does not award or remove earned XP');
console.log('PASS: weekday routines, prefilled history, single tap, autosave, editable history, no duplicate XP');