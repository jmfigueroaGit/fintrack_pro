if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>n(e,i),o={module:{uri:i},exports:c,require:r};s[i]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/192x192.jpg",revision:"9c20d307a161ad85a09ae26ac53f50be"},{url:"/512x512.jpg",revision:"e796fddc0a60532ecc9de5bfc3984f40"},{url:"/_next/app-build-manifest.json",revision:"dc6aa5ed52903a6e10460b61f2197e3d"},{url:"/_next/static/chunks/0e5ce63c-62ab0440100eacd6.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/183-94913e578f3599f9.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/23-48e7857785c8802a.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/231-13336c609e002649.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/276-3afde68e286ca8a7.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/509-20e2f4eeb4c1d176.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/593-a521ce84b25333b5.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/674-04c9ae8354b3aba4.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/683-c2cc29e3a97942f8.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/938-ce6ba0a27187d54a.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/998-652b0827a3a7a987.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/(auth)/login/page-02e65200ca4a27a0.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/(protected)/budget/page-1458d108b7cd0cb5.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/(protected)/layout-8a80cd37ed02768e.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/(protected)/page-f542a5311878d384.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/(protected)/receipts/page-490c446f4dcfd2ab.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/(protected)/transactions/page-a03136153661a4e0.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/_not-found/page-0f9725694ce7ee86.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/layout-33b89b45a1bcfd64.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/not-found-b3de2a5ecd65d5dc.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/app/offline/page-ff393a77e017e142.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/fd9d1056-47199b51060597f8.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/framework-00a8ba1a63cfdc9e.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/main-92ddfdd036c3f7a8.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/main-app-6c0158aaa2551b50.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/pages/_app-037b5d058bd9a820.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/pages/_error-6ae619510b1539d6.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-6aeec9c3dbd5a4cb.js",revision:"pCULTW8AoSekyrrQA9Qn8"},{url:"/_next/static/css/d0ec35cd462f9597.css",revision:"d0ec35cd462f9597"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/pCULTW8AoSekyrrQA9Qn8/_buildManifest.js",revision:"a0ae24e7f29dd3809ab75b5dd91a79dc"},{url:"/_next/static/pCULTW8AoSekyrrQA9Qn8/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/logo.jpg",revision:"5f8f2e07b5348cb522931c6683903a48"},{url:"/manifest.json",revision:"63e2deb210acc417831f9f0bb806994e"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
