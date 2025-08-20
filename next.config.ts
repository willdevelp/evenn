import type { NextConfig } from "next";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add MiniCssExtractPlugin in client-side build
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[id].[contenthash].css',
        })
      );
    }
    return config;
  },
};

export default nextConfig;
