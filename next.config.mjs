/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/hakkimizda", destination: "/hakkimizda.html" },
      { source: "/careers", destination: "/careers.html" },
      { source: "/founder", destination: "/founder.html" },
      { source: "/future", destination: "/future.html" },
      { source: "/momentum", destination: "/momentum.html" },
      { source: "/starcard", destination: "/starcard.html" },
      { source: "/waitlist", destination: "/waitlist.html" },
      { source: "/thank-you", destination: "/thank-you.html" },
      { source: "/medastare-office-gallery", destination: "/medastare-office-gallery.html" },
    ];
  },
};

export default nextConfig;
