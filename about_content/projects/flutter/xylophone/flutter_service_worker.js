'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "59ff281489d70d6f24821a938bef7677",
"assets/assets/note1.wav": "a2f02d4e6e9d225ebf4e554c0fc9b36b",
"assets/assets/note2.wav": "1760f9313cae8fa1564e9091c58cdcf4",
"assets/assets/note3.wav": "ec8173470a0186fdecf2f6935260eb56",
"assets/assets/note4.wav": "7817b629210c6d879b493439bcded62b",
"assets/assets/note5.wav": "69f4c1dd58b17a67a632ed106f203afc",
"assets/assets/note6.wav": "c713df4bb4bb1b6b11d041d97387d959",
"assets/assets/note7.wav": "bf1ffa7743bbdfdca078cb3f6d80bb77",
"assets/FontManifest.json": "66c145c212efdff188f93462f947d63c",
"assets/fonts/Caveat-Regular.ttf": "b20ff458bc0dc48c039c68a3dc96173c",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/LICENSE": "01e485e682ba73de1fe3f9e85f9996ce",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "d5b242cbcc546323c5836e8f90286304",
"/": "d5b242cbcc546323c5836e8f90286304",
"main.dart.js": "4966529dab645b3c658dfbe6e02f9abd",
"manifest.json": "f5fbf4c59cffbb2103a7b9d4ad34b867"
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
