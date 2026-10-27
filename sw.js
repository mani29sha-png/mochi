/* Mochi service worker: keeps the app and the explainer audio available offline */
var APP='mochi-app-v1',AUD='mochi-audio-v1';
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){
 var r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 if(u.pathname.indexOf('/audio/')>=0){
  e.respondWith(caches.open(AUD).then(function(c){return c.match(u.href).then(function(m){
   if(m)return m;
   return fetch(u.href).then(function(n){if(n&&n.ok)c.put(u.href,n.clone());return n})})}));return}
 if(r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname)){
  e.respondWith(fetch(r).then(function(n){var cp=n.clone();caches.open(APP).then(function(c){c.put(u.pathname,cp)});return n}).catch(function(){return caches.open(APP).then(function(c){return c.match(u.pathname).then(function(m){return m||c.match('/')||c.keys().then(function(k){return k.length?c.match(k[0]):Response.error()})})})}))}
});
