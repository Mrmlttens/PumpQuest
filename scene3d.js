/* PumpQuest 3D — original procedural WebGL character, no CDN or paid model required.
   This is actual perspective 3D geometry with orbit/pinch controls, not a static illustration. */
(function(root){
'use strict';
const EPS=.00001, PI=Math.PI;
const V=(x=0,y=0,z=0)=>[x,y,z];
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,k)=>a.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{let n=Math.hypot(...a);return n>EPS?mul(a,1/n):[0,1,0]};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const id=()=>[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
const mm=(a,b)=>{let o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o};
const trans=(x,y,z)=>[1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1];
const scale=(x,y,z)=>[x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1];
const ry=a=>[Math.cos(a),0,-Math.sin(a),0, 0,1,0,0, Math.sin(a),0,Math.cos(a),0, 0,0,0,1];
const rx=a=>[1,0,0,0, 0,Math.cos(a),Math.sin(a),0, 0,-Math.sin(a),Math.cos(a),0, 0,0,0,1];
const rz=a=>[Math.cos(a),Math.sin(a),0,0, -Math.sin(a),Math.cos(a),0,0, 0,0,1,0, 0,0,0,1];
const perspective=(fov,aspect,near,far)=>{let f=1/Math.tan(fov/2),nf=1/(near-far);return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]};
function lookAt(eye,center,up=[0,1,0]){const z=norm(sub(eye,center)),x=norm(cross(up,z)),y=cross(z,x);return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]}
function geo(){return {v:[],n:[],i:[]}}
function vertex(g,p,n){g.v.push(...p);g.n.push(...n);return g.v.length/3-1}
function tri(g,a,b,c){g.i.push(a,b,c)}
function uvBall(rows=17,cols=24,rough=0,seed=0){const g=geo();for(let y=0;y<=rows;y++){let theta=PI*y/rows;for(let x=0;x<=cols;x++){let phi=2*PI*x/cols,sn=Math.sin(theta);let nx=sn*Math.cos(phi),ny=Math.cos(theta),nz=sn*Math.sin(phi),rad=1;
 if(rough){const n=Math.sin(nx*19+seed)*Math.sin(ny*17.5+seed*.73)*Math.sin(nz*15+seed*.43)+Math.sin(nx*31+ny*13+nz*7+seed)*.4;rad+=n*rough}
 vertex(g,[nx*rad,ny*rad,nz*rad],[nx,ny,nz]);}}
for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){let a=y*(cols+1)+x,b=a+cols+1;tri(g,a,a+1,b);tri(g,b,a+1,b+1);}return g}
function coneMesh(segments=14){const g=geo();const a=vertex(g,[0,0,0],[0,-1,0]);const b=vertex(g,[0,1,0],[0,1,0]);for(let i=0;i<=segments;i++){let t=2*PI*i/segments,c=Math.cos(t),s=Math.sin(t);vertex(g,[c,0,s],[c,.35,s]);vertex(g,[c*.025,1,s*.025],[c,.4,s]);}
for(let i=0;i<segments;i++){let j=2+2*i;tri(g,j,j+1,j+2);tri(g,j+1,j+3,j+2);tri(g,a,j+2,j)}return g}
function octa(){let g=geo(),p=[[0,1,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,-1,0]];for(let q of [[0,2,1],[0,3,2],[0,4,3],[0,1,4],[5,1,2],[5,2,3],[5,3,4],[5,4,1]]){const a=p[q[0]],b=p[q[1]],c=p[q[2]],n=norm(cross(sub(b,a),sub(c,a))),v=q.map(k=>vertex(g,p[k],n));tri(g,...v)}return g}
function tube(points,radii,segments=12){const g=geo();for(let j=0;j<points.length;j++){const tangent=norm(sub(points[Math.min(j+1,points.length-1)],points[Math.max(0,j-1)]));let side=norm(cross(Math.abs(tangent[1])>.88?[1,0,0]:[0,1,0],tangent)),bit=norm(cross(tangent,side));for(let i=0;i<=segments;i++){let t=2*PI*i/segments,n=norm(add(mul(side,Math.cos(t)),mul(bit,Math.sin(t))));vertex(g,add(points[j],mul(n,radii[j])),n)}}for(let j=0;j<points.length-1;j++)for(let i=0;i<segments;i++){let a=j*(segments+1)+i,b=a+segments+1;tri(g,a,a+1,b);tri(g,b,a+1,b+1)}return g}
function yAxisTransform(a,b,r1,r2){const dir=sub(b,a),dy=Math.hypot(...dir);let y=norm(dir),x=norm(cross(Math.abs(y[2])>.92?[0,1,0]:[0,0,1],y)),z=cross(x,y);return [x[0]*r1,x[1]*r1,x[2]*r1,0,y[0]*dy,y[1]*dy,y[2]*dy,0,z[0]*r2,z[1]*r2,z[2]*r2,0,...a,1]}
const MATERIALS={skin:[.36,.225,.155],skinLight:[.48,.31,.22],muzzle:[.31,.25,.21],dark:[.10,.12,.15],nose:[.19,.15,.14],fur:[.74,.69,.60],furDark:[.47,.43,.39],iron:[.30,.37,.42],steel:[.46,.53,.57],gold:[.73,.51,.24],goldBright:[.92,.71,.36],leather:[.23,.17,.13],brown:[.34,.23,.16],horn:[.51,.36,.25],tip:[.88,.75,.55],rock:[.16,.23,.32],gem:[.18,.71,1.0],ice:[.48,.83,1.0],black:[.08,.08,.09]};
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNormal;
uniform mat4 uM,uV,uP; uniform float uBreath;
out vec3 vN,vWorld,vLocal;
void main(){vec3 p=aPos; p.xz*=1.0+uBreath;vec4 wp=uM*vec4(p,1.);vWorld=wp.xyz;vLocal=p;vN=normalize(transpose(inverse(mat3(uM)))*aNormal);gl_Position=uP*uV*wp;}`;
const FS=`#version 300 es
precision highp float;
in vec3 vN,vWorld,vLocal;out vec4 frag;
uniform vec3 uColor,uGlow,uEye;uniform float uMetal,uRough,uTime,uHot,uCold,uFur;
float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
void main(){vec3 n=normalize(vN),p=vWorld;float noise=hash(floor(p*22.));float fine=(noise-.5);n=normalize(n+vec3(fine*.055,-fine*.03,fine*.035));
vec3 a=normalize(vec3(-.47,.78,.65)),b=normalize(vec3(.65,.34,-.6));float da=max(0.,dot(n,a)),db=max(0.,dot(n,b));float rim=pow(1.-abs(dot(n,normalize(vec3(-p.x*.025,.07,1.0)))),2.2);
float fiber=uFur*(.50+.50*sin(p.y*180.+p.x*45.))*0.08;vec3 base=uColor*(.89+fine*.15+fiber);
vec3 color=base*(.21+da*.95+db*.25)+vec3(.18,.40,.68)*rim*.45;
vec3 halfv=normalize(a+normalize(vec3(-p.x*.03,.2,1.)));float spec=pow(max(0.,dot(n,halfv)),mix(19.,70.,uMetal));color+=vec3(.90,.77,.60)*spec*(.07+uMetal*.75);
vec3 hColor=mix(vec3(1.,.27,.09),vec3(.98,.70,.16),.35+sin(p.x*6.)*.12);
color+=hColor*uHot*(.18+.35*rim)+vec3(.06,.56,1.)*uCold*(.22+.5*rim);
color+=uGlow*(.88+.16*sin(uTime*1.5));
color=mix(color,vec3(.43,.70,.96),rim*.09);
frag=vec4(pow(max(color,vec3(0.)),vec3(.91)),1.0);
}`;
const PVS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;layout(location=2) in vec4 aSeed;uniform mat4 uV,uP;uniform float uTime,uKind;out float vAlpha;out float vSeed;
void main(){float t=mod(uTime*(.14+aSeed.w*.10)+aSeed.x*17.,6.7)/6.7;vec3 p=aPos;p.y+=t*7.6;p.x+=sin(t*5.+aSeed.x*21.)*.26*aSeed.y;p.z+=cos(t*7.+aSeed.z*19.)*.14;gl_Position=uP*uV*vec4(p,1.);gl_PointSize=mix(3.2,8.2,aSeed.y)*(1.-t*.6);vAlpha=sin(t*3.14159)*.7;vSeed=aSeed.z;}`;
const PFS=`#version 300 es
precision highp float;
in float vAlpha,vSeed;out vec4 frag;uniform vec3 uTint;uniform float uKind;
void main(){vec2 p=gl_PointCoord*2.-1.;float d=dot(p,p);if(d>1.)discard;float a=pow(1.-d,1.5)*vAlpha;vec3 c=mix(uTint,vec3(1.,.89,.67),step(.82,vSeed));if(uKind>1.5){a*=.65;c=mix(c,vec3(1.,.53,.19),.35);}frag=vec4(c,a);}`;
function shader(gl,v,f){const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};let p=gl.createProgram(),a=compile(gl.VERTEX_SHADER,v),b=compile(gl.FRAGMENT_SHADER,f);gl.attachShader(p,a);gl.attachShader(p,b);gl.bindAttribLocation(p,0,'aPos');gl.bindAttribLocation(p,1,'aNormal');gl.bindAttribLocation(p,2,'aSeed');gl.linkProgram(p);gl.deleteShader(a);gl.deleteShader(b);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p}
function gpuMesh(gl,g){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const attrib=(data,slot,size)=>{let buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.enableVertexAttribArray(slot);gl.vertexAttribPointer(slot,size,gl.FLOAT,false,0,0)};attrib(g.v,0,3);attrib(g.n,1,3);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.i),gl.STATIC_DRAW);gl.bindVertexArray(null);return{vao,count:g.i.length}}
function geometryLib(gl){return {ball:gpuMesh(gl,uvBall()),fur:gpuMesh(gl,coneMesh()),gem:gpuMesh(gl,octa()),rock:gpuMesh(gl,uvBall(17,22,.19,2.4))}}
function bodyNodes(gl,lib){const nodes=[];const attach=(geometry,material,pos=[0,0,0],sz=[1,1,1],opts={})=>{nodes.push({geometry,material,position:pos,scale:sz,rz:opts.rz||0,rx:opts.rx||0,ry:opts.ry||0,region:opts.region||'',glow:opts.glow||0,metal:opts.metal||0,fur:opts.fur||0,motion:opts.motion||'',axis:opts.axis||null,name:opts.name||''});return nodes[nodes.length-1]};
const ell=(m,p,s,o={})=>attach(lib.ball,m,p,s,o), fur=(a,b,r,m='fur',opts={})=>attach(lib.fur,m,a,[1,1,1],{...opts,axis:[a,b,r]}),stone=(p,s)=>attach(lib.rock,'rock',p,s,{metal:.2});
const pipe=(pts,radii,mat='horn',opts={})=>attach(gpuMesh(gl,tube(pts,radii)) ,mat,[0,0,0],[1,1,1],opts);
// Footing: layered rock instead of a flat stage.
for(let i=0;i<11;i++){let x=Math.cos(i*2.4)*(.7+(i%3)*.4),z=Math.sin(i*2.4)*(.8+(i%3)*.22);stone([x,-.27-(i%3)*.06,z],[.65+(i%3)*.2,.28+(i%2)*.14,.6]);}
stone([0,-.35,0],[1.55,.32,1.1]);
// Legs: four sculpted volumes per leg, dark joints and ornamented boots.
for(let s of [-1,1]){
 ell('skin',[s*.65,2.18,.10],[.52,.82,.52],{rz:-s*.09,region:'quads'});
 ell('skinLight',[s*.66,1.88,.33],[.43,.50,.40],{region:'quads'});
 ell('skin',[s*.68,1.24,-.03],[.33,.36,.36],{region:'hamstrings'});
 ell('iron',[s*.73,.89,.04],[.34,.55,.35],{region:'calves',metal:.65});
 ell('furDark',[s*.77,.63,.02],[.44,.20,.46],{fur:.8});
 ell('leather',[s*.77,.32,.26],[.48,.29,.69],{metal:.08});
 ell('steel',[s*.75,.29,.65],[.39,.13,.30],{metal:.7});
 for(let k=0;k<3;k++)ell('gold',[s*.76,.57+k*.15,.35],[.35,.034,.09],{metal:.95});
 for(let k=0;k<8;k++){const a=k*PI*2/8;fur([s*.77+Math.cos(a)*.34,.69,.04+Math.sin(a)*.34],[s*.77+Math.cos(a)*.48,.40,.04+Math.sin(a)*.45],.092,k%3?'fur':'furDark',{fur:1});}
}
// Pelvis and armor skirt under torso.
ell('skin',[0,2.73,.0],[1.03,.52,.59],{region:'abs'});
ell('leather',[0,2.35,.06],[.9,.46,.6],{metal:.1});
for(let s of [-1,1]){
 ell('leather',[s*.68,2.33,.35],[.45,.56,.19],{rz:-s*.30});
 ell('gold',[s*.71,2.65,.55],[.35,.06,.08],{metal:.86});
 for(let k=0;k<5;k++)fur([s*(.35+k*.115),2.53,.52],[s*(.35+k*.125),1.92-(k%2)*.18,.61],.072,k%2?'furDark':'fur',{fur:1});
}
// Core and ribcage, anatomically shaped groups rather than one sphere.
ell('skin',[0,3.87,-.08],[1.11,1.24,.63],{region:'abs',motion:'chest'});
ell('skinLight',[0,3.35,.40],[.74,.75,.23],{region:'abs',motion:'chest'});
for(let s of [-1,1]){
 ell('skin',[s*.62,4.5,.39],[.72,.50,.45],{region:'upperChest',rz:s*.08,motion:'chest'});
 ell('skinLight',[s*.60,4.18,.51],[.65,.32,.35],{region:'lowerChest',motion:'chest'});
 ell('skin',[s*.92,3.90,-.07],[.36,.85,.43],{region:'lats',rz:s*.2,motion:'chest'});
 ell('skinLight',[s*.77,3.36,.34],[.28,.65,.25],{region:'obliques',rz:s*.14,motion:'chest'});
 ell('skin',[s*.44,4.43,-.61],[.66,.51,.30],{region:'midBack',motion:'chest'});
 ell('skin',[s*.72,3.88,-.58],[.42,.80,.32],{region:'lats',motion:'chest'});
 ell('skin',[s*.51,3.28,-.48],[.35,.40,.27],{region:'lowerBack'});
 for(let j=0;j<3;j++)ell('skinLight',[s*.23,3.76-j*.30,.55],[.22,.165,.24],{region:'abs',motion:'chest'});
}
// Massive trapezius collar and shoulders.
ell('skin',[0,4.85,-.23],[1.12,.38,.62],{region:'traps',motion:'chest'});
for(let s of [-1,1]){
 ell('skinLight',[s*1.24,4.64,.05],[.69,.66,.64],{rz:s*.21,region:'sideDelts',motion:'chest'});
 ell('skin',[s*1.48,4.48,.39],[.41,.37,.30],{region:'frontDelts',motion:'chest'});
 ell('skin',[s*1.46,4.51,-.45],[.40,.42,.25],{region:'rearDelts'});
 ell('skin',[s*1.59,3.82,.03],[.45,.68,.42],{rz:s*.09,region:'biceps'});
 ell('skinLight',[s*1.63,3.76,.35],[.37,.54,.24],{region:'biceps'});
 ell('skin',[s*1.66,3.77,-.35],[.31,.53,.24],{region:'triceps'});
 ell('dark',[s*1.79,3.19,.05],[.27,.28,.29]);
 ell('skin',[s*1.82,2.82,.10],[.37,.53,.37],{rz:-s*.06,region:'forearms'});
 ell('iron',[s*1.85,2.80,.31],[.39,.44,.30],{region:'forearms',metal:.72});
 ell('leather',[s*1.93,2.42,.11],[.40,.24,.41]);
 ell('gold',[s*1.92,2.48,.45],[.37,.052,.14],{metal:.8});
 ell('skinLight',[s*1.9,2.21,.18],[.38,.32,.43]);
 for(let t=0;t<4;t++)ell('skin',[s*(1.65+t*.13),2.05,.43],[.105,.18,.15]);
 // Shoulder plating in hammered iron; gold inset trims.
 ell('iron',[s*1.27,4.77,-.20],[.56,.26,.43],{rz:s*.13,metal:.76});
 ell('gold',[s*1.40,4.91,.02],[.34,.08,.12],{metal:.96});
 ell('dark',[s*1.43,4.58,.31],[.25,.12,.09],{metal:.4});
 for(let k=0;k<5;k++){let yy=4.80-k*.21;fur([s*(1.10+k*.10),yy,-.38],[s*(1.35+k*.12),yy-.25,-.53],.085,k%2?'fur':'furDark',{fur:1});}
}
// Belt and artisan-crafted buckle.
ell('leather',[0,2.95,.22],[.93,.23,.58]);
for(let k=-4;k<=4;k++)ell('gold',[k*.17,2.94,.76-Math.abs(k)*.025],[.064,.15,.052],{metal:.85});
attach(lib.gem,'gold',[0,2.96,.83],[.26,.30,.12],{metal:.9});
attach(lib.gem,'gem',[0,2.96,.96],[.13,.20,.09],{glow:.36,metal:.55});
// Neck and wild mane; thick muscular head with broad muzzle.
ell('skin',[0,5.12,0],[.49,.42,.46],{motion:'head'});
ell('furDark',[0,5.23,-.34],[.75,.66,.62],{fur:1,motion:'head'});
ell('skinLight',[0,5.54,.12],[.63,.61,.51],{motion:'head'});
ell('muzzle',[0,5.30,.57],[.46,.29,.43],{motion:'head'});
ell('nose',[0,5.26,.91],[.32,.13,.18],{motion:'head'});
ell('black',[-.16,5.28,1.073],[.07,.036,.03],{motion:'head'});ell('black',[.16,5.28,1.073],[.07,.036,.03],{motion:'head'});
ell('furDark',[0,5.10,.75],[.39,.14,.23],{motion:'head'});
// Original glowing eyes + brow ridges.
for(let s of [-1,1]){
 ell('brown',[s*.26,5.69,.52],[.31,.17,.18],{rz:-s*.25,motion:'head'});
 ell('dark',[s*.28,5.58,.55],[.17,.115,.09],{motion:'head'});
 ell('ice',[s*.28,5.60,.623],[.092,.065,.06],{glow:.75,motion:'head'});
 ell('gem',[s*.28,5.60,.68],[.042,.05,.025],{glow:1,motion:'head'});
 ell('skin',[s*.50,5.34,-.10],[.31,.19,.16],{rz:s*.1,motion:'head'});
 ell('nose',[s*.67,5.33,-.04],[.25,.17,.21],{motion:'head'});
}
// Crown of thick curling real three-dimensional horns.
for(let s of [-1,1]){
 const pts=[[s*.44,5.85,-.02],[s*.72,6.12,-.12],[s*1.15,6.29,-.18],[s*1.65,6.37,-.22],[s*1.93,6.64,-.24],[s*1.93,6.97,-.26],[s*1.71,7.20,-.23],[s*1.47,7.23,-.21]];
 pipe(pts,[.32,.31,.28,.23,.18,.12,.06,.004],'horn',{motion:'head'});

}
// Furry brows, shoulders and flowing beard. Uses many unique tapered 3D locks.
for(let s of [-1,1]){
 for(let k=0;k<12;k++){
  const angle=(k/11)*PI*.9;let x=s*(.40+.28*Math.sin(angle)),y=5.78+.24*Math.cos(angle),z=.02-.30*Math.sin(k*.91);
  fur([x,y,z],[x+s*(.05+.11*(k%3)),y+.15+(k%2)*.13,z-.06],.095,k%4?'fur':'furDark',{fur:1,motion:'head'});
 }
 for(let k=0;k<12;k++){let x=s*(.12+k*.044),y=5.18-(k%4)*.04,z=.78-(k%3)*.035;fur([x,y,z],[x+s*(k%3)*.06,4.49+(k%4)*.10,z+.03],.073,k%3?'fur':'furDark',{fur:1,motion:'head'});}
}
for(let i=0;i<7;i++)fur([-.16+i*.054,5.13,.87],[-.23+i*.07,4.40-(i%3)*.17,.85],.10,i%3?'fur':'furDark',{fur:1,motion:'head'});
// Fur around waist and wild shoulder locks.
for(let s of [-1,1])for(let k=0;k<15;k++){
 let a=k*PI*2/15,x=s*1.12+Math.cos(a)*.35,z=-.23+Math.sin(a)*.35;
 fur([x,4.55,z],[x+s*(.12+(k%3)*.04),4.06-(k%4)*.12,z],.075,k%2?'furDark':'fur',{fur:1});
}
// Rune tattoos and stone shards on the 3D armor.
for(let s of [-1,1]){
 attach(lib.gem,'gem',[s*1.46,4.87,.15],[.10,.16,.07],{glow:.40,metal:.65});
 for(let k=0;k<3;k++)attach(lib.gem,k%2?'steel':'gold',[s*1.91,2.90-k*.20,.57],[.075,.095,.045],{metal:.85});
}
for(let k=0;k<5;k++){let t=k*2*PI/5;stone([Math.cos(t)*2.1,-.32,Math.sin(t)*1.2],[.37,.30,.46]);}
return nodes}
function init(canvas){let gl=canvas.getContext('webgl2',{antialias:true,alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 const webgl2=!!gl;
 if(!gl){gl=canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});if(!gl)throw Error('WebGL unavailable');
   const ext=gl.getExtension('OES_vertex_array_object');if(!ext)throw Error('WebGL vertex arrays unavailable');
   gl.createVertexArray=()=>ext.createVertexArrayOES();gl.bindVertexArray=(v)=>ext.bindVertexArrayOES(v);
 }
 const upgrade=(src,fragment=false)=>{
  if(webgl2)return src;
  let code=src.replace('#version 300 es','').replace(/layout\(location=\d+\) in/g,'attribute');
  if(fragment){code=code.replace(/\bin\b/g,'varying').replace(/out vec4 frag;/,'').replace(/\bfrag\s*=/g,'gl_FragColor =')}
  else code=code.replace(/\bout\b/g,'varying');
  code=code.replace('transpose(inverse(mat3(uM)))','mat3(uM)');return code;
 };
 const p=shader(gl,upgrade(VS),upgrade(FS,true)),pp=shader(gl,upgrade(PVS),upgrade(PFS,true));let lib=geometryLib(gl),nodes=bodyNodes(gl,lib);
 const get=(prog,s)=>gl.getUniformLocation(prog,s),uni={P:get(p,'uP'),V:get(p,'uV'),M:get(p,'uM'),time:get(p,'uTime'),color:get(p,'uColor'),glow:get(p,'uGlow'),metal:get(p,'uMetal'),rough:get(p,'uRough'),hot:get(p,'uHot'),cold:get(p,'uCold'),fur:get(p,'uFur'),breath:get(p,'uBreath')};
 const pUni={P:get(pp,'uP'),V:get(pp,'uV'),time:get(pp,'uTime'),tint:get(pp,'uTint'),kind:get(pp,'uKind')};
 const pbuf=gl.createVertexArray();gl.bindVertexArray(pbuf);const pv=[],ps=[];for(let i=0;i<110;i++){let a=i*2.399963,rad=.5+(i%11)*.16;pv.push(Math.cos(a)*rad,.05+(i%9)*.46,Math.sin(a)*.9);ps.push((i*.75487766)%1,(i*.414213)%1,(i*.332718)%1,(i*.193)%1);}for(let [loc,arr,sz] of [[0,pv,3],[2,ps,4]]){let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arr),gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,sz,gl.FLOAT,false,0,0)}gl.bindVertexArray(null);
 gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
 let angle=-.12,targetAngle=-.12,zoom=10.65,targetZoom=10.65,active=true,anim=0,last=0,raf=0,mode='storm',zones={},pumps={},focused=false,spin=null,touches=new Map(),lastPinch=0;
 const colors={storm:[.24,.72,1],tide:[.15,1,.82],ember:[1,.41,.18]};
 const resize=()=>{const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);let ratio=Math.min(devicePixelRatio||1,1.65),width=Math.floor(w*ratio),height=Math.floor(h*ratio);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,width,height)};
 const touchDown=e=>{if(e.target!==canvas)return;canvas.setPointerCapture(e.pointerId);touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===2){let pts=[...touches.values()];lastPinch=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1])}spin=e.clientX};
 const touchMove=e=>{if(!touches.has(e.pointerId))return;let prev=touches.get(e.pointerId);touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===1)targetAngle+=clamp((e.clientX-prev[0])*.011,-.22,.22);else if(touches.size===2){let pts=[...touches.values()],dist=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);targetZoom=clamp(targetZoom-(dist-lastPinch)*.015,8.8,13.8);lastPinch=dist}};
 const touchUp=e=>{touches.delete(e.pointerId);spin=null};
 canvas.addEventListener('pointerdown',touchDown);canvas.addEventListener('pointermove',touchMove);canvas.addEventListener('pointerup',touchUp);canvas.addEventListener('pointercancel',touchUp);
 canvas.addEventListener('wheel',e=>{if(e.cancelable)e.preventDefault();targetZoom=clamp(targetZoom+Math.sign(e.deltaY)*.35,8.8,13.8)},{passive:false});
 function draw(t){if(!active)return;raf=requestAnimationFrame(draw);if(t-last<29)return;last=t;resize();anim=t*.001;angle+=(targetAngle-angle)*.12;zoom+=(targetZoom-zoom)*.10;
 gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 let aspect=canvas.width/canvas.height,P=perspective(.84,aspect,.1,90),eye=[Math.sin(angle)*zoom,3.22+Math.sin(angle*.3)*.2,Math.cos(angle)*zoom],Vw=lookAt(eye,[0,3.36,0]);let pulse=Math.sin(anim*.70)*.005;
 gl.useProgram(p);gl.uniformMatrix4fv(uni.P,false,new Float32Array(P));gl.uniformMatrix4fv(uni.V,false,new Float32Array(Vw));gl.uniform1f(uni.time,anim);
 const tint=colors[mode]||colors.storm;
 for(const n of nodes){let breath=n.motion==='chest'?pulse:n.motion==='head'?pulse*.3:0,pos=n.position.slice(),s=n.scale.slice();if(n.motion==='head'){pos[0]+=Math.sin(anim*.34)*.016;pos[1]+=Math.sin(anim*.78)*.009}
 let mat;if(n.axis){const [a,b,r]=n.axis;mat=yAxisTransform(a,b,r,r)}else mat=mm(mm(mm(mm(trans(...pos),rz(n.rz)),ry(n.ry)),rx(n.rx)),scale(...s));
 gl.uniformMatrix4fv(uni.M,false,new Float32Array(mat));let color=MATERIALS[n.material]||MATERIALS.skin;
 gl.uniform3fv(uni.color,new Float32Array(color));let z=zones[n.region],days=z?.days;const hot=z?.status==='hot'?1:z?.status==='warm'?.48:0,cold=z?.status==='cold'?1:0;
 const pump=n.region&&pumps[n.region];let pvalue=pump? .32:0;let glow= n.glow||0;let gColor=n.material==='gem'||n.material==='ice'?tint:[0,0,0];
 gl.uniform3fv(uni.glow,new Float32Array(mul(gColor,glow*.4)));gl.uniform1f(uni.metal,n.metal);gl.uniform1f(uni.fur,n.fur);gl.uniform1f(uni.hot,hot*.65+pvalue);gl.uniform1f(uni.cold,cold*.8);gl.uniform1f(uni.breath,breath);
 gl.bindVertexArray(n.geometry.vao);gl.drawElements(gl.TRIANGLES,n.geometry.count,gl.UNSIGNED_SHORT,0);
 }
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);gl.useProgram(pp);gl.uniformMatrix4fv(pUni.P,false,new Float32Array(P));gl.uniformMatrix4fv(pUni.V,false,new Float32Array(Vw));gl.uniform1f(pUni.time,anim);gl.uniform3fv(pUni.tint,new Float32Array(tint));gl.uniform1f(pUni.kind,mode==='ember'?2:mode==='tide'?1:0);gl.bindVertexArray(pbuf);gl.drawArrays(gl.POINTS,0,110);gl.depthMask(true);gl.disable(gl.BLEND);
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let stop=null;
 function setMode(next){mode=['storm','tide','ember'].includes(next)?next:'storm'}
 function setZones(next,ps){zones=next||{};pumps=ps||{}}
 function reset(){targetAngle=-.12;targetZoom=10.65}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf)}else if(active){raf=requestAnimationFrame(draw)}});
 raf=requestAnimationFrame(draw);
 return{setMode,setZones,reset,getRenderer:()=> webgl2?'WebGL2':'WebGL1',dispose(){active=false;cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',touchDown);canvas.removeEventListener('pointermove',touchMove);canvas.removeEventListener('pointerup',touchUp);canvas.removeEventListener('pointercancel',touchUp)}}
}
root.PQ3D={create:init};
})(window);