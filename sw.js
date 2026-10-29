// Hors-ligne : l'appli (calculs, séances) reste utilisable ; la carte demande du réseau.
const CACHE="foulee-v2";
const SHELL=["./","index.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png",
 "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js","https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  const shell=u.origin===location.origin||u.hostname==="cdnjs.cloudflare.com"||u.hostname.endsWith("fonts.googleapis.com")||u.hostname.endsWith("fonts.gstatic.com");
  if(!shell)return; // tuiles, routage, altitude : réseau direct
  // réseau d'abord (pour recevoir les mises à jour), cache en secours
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
