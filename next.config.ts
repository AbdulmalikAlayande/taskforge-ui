import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL("https://avatars.githubusercontent.com/"),
			{
				protocol: "https",
				hostname: "**",
			},
		],
		unoptimized: true,
	},
	// eslint: {
	// 	ignoreDuringBuilds: true,
	// },
};

export default nextConfig;
