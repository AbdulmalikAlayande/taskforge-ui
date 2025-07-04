import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL("avatars.githubusercontent.com")],
	},
};

export default nextConfig;
