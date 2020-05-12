'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "3c2ece57c6ccf40fa89da78866f484fa",
"assets/FontManifest.json": "73d144618c05781c2d1b74727d14e99e",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/fonts/Pacifico-Regular.ttf": "c1a28478f7a0cc5e25bb395d0543274d",
"assets/fonts/SourceSansPro-Regular.ttf": "5182da425f811908bed9f5b8c72fa44f",
"assets/fonts/SpecialElite-Regular.ttf": "7059acee3b9d8ea9744c26ab45135a8b",
"assets/images/1LN.png": "a37a0a39efe754578e63682d0eb5d690",
"assets/images/GitHub.png": "472739dfb5857b1f659f4c4c6b4568d0",
"assets/images/LN.png": "0fe349ca0868124d27cb48e5874db8cb",
"assets/images/profile.jpg": "fbfd548d09c7fa974874493150cb9adc",
"assets/images/profile1.jpg": "992a03989faf3bcfce2744dcd665298c",
"assets/images/Twitter.png": "1f75d678b5526b783b2918b76f3262e7",
"assets/LICENSE": "59844a026d05c04ff832a90250bb1baa",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "c099dbebba20d4eb7da3f485b25fec89",
"/": "c099dbebba20d4eb7da3f485b25fec89",
"main.dart.js": "6afe751853dd23498ec0ac6d4e2ba5a7",
"manifest.json": "185d82f4e3e5a8cafd0545fccbb37a7f"
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
