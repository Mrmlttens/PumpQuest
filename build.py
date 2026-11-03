from pathlib import Path
import re,base64
root=Path(__file__).parent
html=(root/'index.html').read_text()
css=(root/'styles.css').read_text()
webp=base64.b64encode((root/'assets/storm-titan.webp').read_bytes()).decode()
css=css.replace("./assets/storm-titan.webp",'data:image/webp;base64,'+webp)
html=html.replace('<link rel="stylesheet" href="./styles.css">','<style>'+css+'</style>')
for name in ['data.js','anatomy.js','assets/sculpt.js','scene3d.js','insights.js','importer.js','app.js']:
 text=(root/name).read_text().replace('</script>','<\\/script>')
 html=re.sub(r'<script src="\./'+re.escape(name)+r'" defer></script>',lambda _: '<script>\n'+text+'\n</script>',html)
html=re.sub(r'\s*<link rel="manifest" href="\./manifest.webmanifest">','',html)
html=re.sub(r'\s*<link rel="icon" type="image/svg\+xml" href="\./assets/icon.svg">','',html)
html=re.sub(r'\s*<link rel="apple-touch-icon" href="\./assets/icon-192.png">','',html)
html=html.replace('PumpQuest — Make Every Rep Count','PumpQuest — Cinematic Engine 1.1').replace('src="./assets/storm-titan.webp"','src="data:image/webp;base64,'+webp+'"')
(root.parent/'PumpQuest-PLAY-Release.html').write_text(html)
print('standalone bytes',len(html),'refs remaining',re.findall(r'(?:src|href)="\./[^"]+"',html)[:8])