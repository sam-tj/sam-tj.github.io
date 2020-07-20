'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "fdc794f8aa53113153b236b11ee2cae1",
"assets/FontManifest.json": "73d144618c05781c2d1b74727d14e99e",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/fonts/Pacifico-Regular.ttf": "c1a28478f7a0cc5e25bb395d0543274d",
"assets/fonts/SourceSansPro-Regular.ttf": "5182da425f811908bed9f5b8c72fa44f",
"assets/fonts/SpecialElite-Regular.ttf": "7059acee3b9d8ea9744c26ab45135a8b",
"assets/images/achievements/0.jpg": "f4765547b3c6d0c922280cc89eda8174",
"assets/images/GitHub.png": "472739dfb5857b1f659f4c4c6b4568d0",
"assets/images/LN.png": "0fe349ca0868124d27cb48e5874db8cb",
"assets/images/medium.png": "315ddc44f59890013f9df4bbb595c6a2",
"assets/images/profile1.jpg": "992a03989faf3bcfce2744dcd665298c",
"assets/images/projects/0.jpg": "659b68a907b5949cf5dfe7277f32b0df",
"assets/images/projects/1.jpg": "ad041d95b1e62f04b941763f211c0048",
"assets/images/projects/2.jpg": "4b06aac313ef2a42badbedbee1afb00a",
"assets/images/projects/3.jpg": "69614969d3f07f2326f54935000280df",
"assets/images/projects/4.jpg": "ed812770cc631a57d36311dc676d2e21",
"assets/images/projects/5.jpg": "a359bd3bfbf039cca89a98a3cfa4a610",
"assets/images/projects/6.jpg": "5eecbc9f969c522d51bcb2c64f543662",
"assets/images/projects/7.jpg": "d93b8297d9c20d9de169e1f32b836680",
"assets/images/projects/8.jpg": "3d809c759694906eb3b5ff3809b15807",
"assets/images/projects/9.jpg": "570dc1f2c4cba44a5b85e5882fd80d75",
"assets/images/publications/0.jpg": "12cb7cbd385a145291b685713909dcb0",
"assets/images/publications/1.jpg": "a5a46b2872795a6733e8005d0627db60",
"assets/images/publications/2.jpg": "596972cd22a5d5820c0b9db86d7e7b67",
"assets/images/quora.jpg": "d1daf1252a890280136fd0d6a7673405",
"assets/images/Twitter.png": "1f75d678b5526b783b2918b76f3262e7",
"assets/LICENSE": "4852d43eb814ea5d65bc45ac0cc2e1bc",
"assets/NOTICES": "0f8b5c51550a3aac80ed9ec2e0bcbd74",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "808cf6cca36578467818398380c4375e",
"/": "808cf6cca36578467818398380c4375e",
"main.dart.js": "7b894a7cc83332d875f35827afbf1498",
"manifest.json": "855c6a64f47dae2c3d01d3bb8b5b43f0"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/LICENSE",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.message == 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message = 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.add(resourceKey);
    }
  }
  return Cache.addAll(resources);
}
