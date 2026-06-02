import firebaseConfiguration from "../src/config/firebase-config.json";

// 1. Import Firebase compat SDK scripts
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// 2. Initialize Firebase configuration
firebase.initializeApp(firebaseConfiguration);

const messaging = firebase.messaging();

// 3. Listen to background push messages when the app tab is closed
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);
  
  const title = payload.notification?.title || payload.data?.title || "New Notification";
  const options = {
    body: payload.notification?.body || payload.data?.content || "",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

// 4. Handle notification clicks to open the application link
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
