"""No external packages: enforce canvas size and canonical art rig integrity."""
from pathlib import Path
import re, struct, subprocess, json
R=Path(__file__).resolve().parent.parent
spec=(R/'skin-contract.js').read_text()
app=(R/'app.js').read_text()
map_code=(R/'artmap.js').read_text()
assert "pq-19-region-art-v1" in spec and "pq-19-region-art-v1" in map_code
assert "941 1672" in map_code
assert 'artQA=1' in map_code
assert 'skin-contract.js' in (R/'index.html').read_text()
for side in ('front','back'):
 p=R/'assets'/f'champion-stormhorn-{side}.webp';raw=p.read_bytes()
 assert raw.startswith(b'RIFF') and raw[8:12]==b'WEBP',f'{p} is not WebP'
 assert raw[12:16] in (b'VP8 ',b'VP8L',b'VP8X'),f'Unexpected compression: {p}'
 if raw[12:16]==b'VP8 ':
  assert raw[23:26]==b'\x9d\x01\x2a', f'VP8 signature not found: {p}'
  w=struct.unpack('<H',raw[26:28])[0] & 0x3fff
  h=struct.unpack('<H',raw[28:30])[0] & 0x3fff
 elif raw[12:16]==b'VP8X':
  w=int.from_bytes(raw[24:27],'little')+1
  h=int.from_bytes(raw[27:30],'little')+1
 else:
  assert raw[20]==0x2f, f'VP8L signature not found: {p}'
  a=int.from_bytes(raw[21:25],'little')
  w=(a&0x3fff)+1
  h=((a>>14)&0x3fff)+1
 assert (w,h)==(941,1672),f'Art mismatches canonical canvas: {p} = {w}x{h}'
 g=R/'art'/f'MASTER_{side.upper()}.svg'
 assert g.is_file() and 'pq-19-region-art-v1' in g.read_text(),f'Missing master template: {g}'
# Cross-check all 19 zones and fixed viewBox against the actual runtime script.
js="""const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('skin-contract.js','utf8'),c);vm.runInContext(fs.readFileSync('artmap.js','utf8'),c);const r=c.window.PQ_SKIN_CONTRACT, a=c.window.PQ_ART;let x=new Set([...Object.keys(a.FRONT),...Object.keys(a.BACK)]); if(x.size!==19)process.exit(3);let malformed=false;for(let side of ['front','back']){let paths=a[side.toUpperCase()];for(let [id,s] of Object.entries(paths)){if(!s.startsWith('M'))malformed=true}}if(malformed)process.exit(4);if(r.resolve('unapproved-skin').id!=='stormhorn')process.exit(5);if(r.check(r.skins.stormhorn)!==true)process.exit(6);console.log('PASS: 19 shared zones; restricted skin registration; front/back landmarks')"""
subprocess.check_call(['node','-e',js],cwd=R)
print('PASS: two 941x1672 registered art views and canonical rig templates')