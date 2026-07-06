import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\/hunt\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "hunt-pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 86400,
        },
        networkTimeoutSeconds: 5,
      },
    },
    {
      urlPattern: /^https:\/\/.*\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 604800,
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\/images\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 604800,
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "others",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 86400,
        },
        networkTimeoutSeconds: 5,
      },
    },
  ],
});

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
