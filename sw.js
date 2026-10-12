'use strict';
const VERSION='20261012-front-height-1';
const PREFIX='volley-twin:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const asset=p=>new URL(p,self.registration.scope).href;
const ASSETS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(ASSETS.map(asset));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{const c=await caches.open(CACHE);if(event.request.mode==='navigate'){try{const r=await fetch(event.request);if(r.ok){await c.put(asset('index.html'),r.clone());return r}}catch{}const cached=await c.match(asset('index.html'));if(cached)return cached;return new Response('請先連網開啟 VolleyTwin 完成離線準備。',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})}
 return await c.match(event.request)||fetch(event.request)})());});
self.addEventListener('message',event=>{if(event.data?.type==='OFFLINE_STATUS')event.waitUntil((async()=>{const c=await caches.open(CACHE);const ready=Boolean(await c.match(asset('index.html')));event.ports[0]?.postMessage({ready,version:VERSION})})())});
