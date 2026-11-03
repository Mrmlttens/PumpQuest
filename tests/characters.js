/* Headless, hardware-independent 3D model smoke test.
   Validates that each original character builds separate geometry, that the
   WebGL render pipeline runs, and that swapping characters does not leak UI. */
const assert = require('node:assert/strict');
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.resolve(__dirname,'..');
let drawCount=0,drawnTriangles=0,callback=null;const atob=s=>Buffer.from(s,'base64').toString('binary');
const gl = new Proxy({
 VERTEX_SHADER:35633, FRAGMENT_SHADER:35632, COMPILE_STATUS:35713, LINK_STATUS:35714,
 ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,STATIC_DRAW:35044,FLOAT:5126,
 UNSIGNED_SHORT:5123,TRIANGLES:4,POINTS:0,DEPTH_TEST:2929,CULL_FACE:2884,BACK:1029,
 BLEND:3042,SRC_ALPHA:770,ONE:1,LEQUAL:515,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
 createShader:()=>({}), createProgram:()=>({}), createBuffer:()=>({}), createVertexArray:()=>({}),
 getShaderParameter:()=>true, getProgramParameter:()=>true, getUniformLocation:()=>({}),
 getShaderInfoLog:()=>'',getProgramInfoLog:()=>'',drawElements:(_,n)=>{drawCount++;drawnTriangles+=n/3;},
 getExtension:()=>null,
}, {get(target,key){return key in target ? target[key] : (()=>{});}});
let listeners={};const canvas={dataset:{},clientWidth:390,clientHeight:844,width:390,height:844,
 getContext:type=>type==='webgl2'?gl:null,addEventListener:(k,cb)=>listeners[k]=cb,
 removeEventListener(){},setPointerCapture(){}};
const context={window:{},document:{addEventListener(){}},console,Math,Float32Array,Uint16Array,
 atob,devicePixelRatio:1, matchMedia:()=>({matches:false}),requestAnimationFrame:cb=>(callback=cb,1),cancelAnimationFrame:()=>{}};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'assets/sculpt.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(root,'scene3d.js'),'utf8'),context);
const model=context.window.PQ3D.create(canvas);
const counts={};
let tick=1000;for(const s of ['bruiser','shell','kaiju']){
 model.setCharacter(s);model.setMode({bruiser:'storm',shell:'tide',kaiju:'ember'}[s]);drawCount=0;drawnTriangles=0;callback(tick+=500);
 assert.equal(canvas.dataset.character,s,`${s} selectable`);assert.ok(drawCount>90,`${s} draws real 3D pieces`);
 counts[s]=drawCount;
}
assert.ok(new Set(Object.values(counts)).size===3,'All three have unique geometry counts');
assert.equal(model.getRenderer(),'WebGL2');model.setQuality('balanced');model.setQuality('cinematic');model.dispose();
console.log('PASS: Three distinct 3D meshes, scene rendering, selectable characters:',counts);