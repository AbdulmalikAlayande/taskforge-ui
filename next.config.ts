import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL("https://avatars.githubusercontent.com/")],
	},
	// eslint: {
	// 	ignoreDuringBuilds: true,
	// },
};

export default nextConfig;
