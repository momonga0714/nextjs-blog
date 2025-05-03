/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポートを有効化
  output: 'export',

  // 画像最適化を無効化（export 時のエラー対策）
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
