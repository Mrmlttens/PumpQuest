from pathlib import Path
import re,base64
root=Path(__file__).parent
html=(root/'index.html').read_text()
css=(root/'styles.css').read_text()+'\n'+(root/'illustrated.css').read_text()
image=lambda p:'data:image/webp;base64,'+base64.b64encode((root/p).read_bytes()).decode()
# CSS fallback artwork must remain self-contained.
css=css.replace('./assets/storm-titan.webp',image('assets/storm-titan.webp'))
html=html.replace('<link rel="stylesheet" href="./styles.css">','<style>'+css+'</style>')
html=html.replace('  <link rel="stylesheet" href="./illustrated.css">','')
art_assets='window.PQ_ART_ASSETS={front:'+repr(image('assets/champion-stormhorn-front.webp'))+',back:'+repr(image('assets/champion-stormhorn-back.webp'))+'};'
for name in ['data.js','anatomy.js','artmap.js','assets/sculpt.js','scene3d.js','insights.js','importer.js','app.js']:
 text=(root/name).read_text().replace('</script>','<\\/script>')
 if name=='artmap.js':text=art_assets+'\n'+text
 html=re.sub(r'<script src="\./'+re.escape(name)+r'" defer></script>',lambda _: '<script>\n'+text+'\n</script>',html)
html=re.sub(r'\s*<link rel="manifest" href="\./manifest.webmanifest">','',html)
html=re.sub(r'\s*<link rel="icon" type="image/svg\+xml" href="\./assets/icon.svg">','',html)
html=re.sub(r'\s*<link rel="apple-touch-icon" href="\./assets/icon-192.png">','',html)
html=html.replace('src="./assets/storm-titan.webp"','src="'+image('assets/storm-titan.webp')+'"')
(root.parent/'PumpQuest-PLAY-Anatomy-v1.2.html').write_text(html)
print('standalone chars',len(html),'external refs',re.findall(r'(?:src|href)="\./[^"]+"',html)[:9])