import type { NextConfig } from "next";

/**
 * 根域名用户站：https://<username>.github.io
 * 若改为项目页（例如 https://<username>.github.io/<repo>/），请取消注释并改成你的仓库名：
 *   basePath: "/仓库名",
 *   assetPrefix: "/仓库名",
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
