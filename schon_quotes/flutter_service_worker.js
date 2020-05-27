'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/LICENSE": "e016d58729cd8aacdc0878829dfecda9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "df66518261f982bbc4c6ef7b30212937",
"icons/Icon-192.png": "021d44ee3f75800524c6b5bf32c46ce3",
"icons/Icon-512.png": "0e45797acfc39ce795771d2eb16dc4c8",
"index.html": "83b191b4ff3f69e177cf9cfa660df828",
"/": "83b191b4ff3f69e177cf9cfa660df828",
"main.dart.js": "f727c0f4ed07437e849c8cffc3f059d8",
"manifest.json": "6a998eb9c470b431c7e2d3ab3db6b0c9"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
