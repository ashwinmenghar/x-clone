/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "ashwin-portfolio-site.netlify.app",
      "lh3.googleusercontent.com",
      "ashwin-twitter-dev.s3.ap-south-1.amazonaws.com",
      "i.imgur.com",
    ],
  },
};

export default nextConfig;
