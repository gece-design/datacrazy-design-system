/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // o dia do build: o selo "new" da vitrine compara com ele (components/ds/novidade.tsx)
  env: { NEXT_PUBLIC_DATA_DO_BUILD: new Date().toISOString().slice(0, 10) },
};
export default nextConfig;
