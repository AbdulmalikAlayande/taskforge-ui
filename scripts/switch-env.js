#!/usr/bin/env node

/**
 * Environment Switcher Script
 *
 * This script helps you quickly switch between different environments
 * by copying the appropriate environment file to .env.local
 *
 * Usage:
 *   npm run env:dev     - Switch to development
 *   npm run env:prod    - Switch to production
 *   npm run env:local   - Switch to local override
 */

import fs from "fs";
import path from "path";

const environments = {
	development: ".env.development",
	production: ".env.production",
	local: ".env.local.backup", // Keep a backup of local overrides
};

function switchEnvironment(targetEnv) {
	const sourceFile = path.join(process.cwd(), environments[targetEnv]);
	const targetFile = path.join(process.cwd(), ".env.local");

	if (!fs.existsSync(sourceFile)) {
		console.error(`❌ Environment file not found: ${sourceFile}`);
		process.exit(1);
	}

	// Backup current .env.local if it exists
	if (fs.existsSync(targetFile)) {
		const backupFile = `${targetFile}.backup.${Date.now()}`;
		fs.copyFileSync(targetFile, backupFile);
		console.log(
			`📋 Backed up current .env.local to ${path.basename(backupFile)}`
		);
	}

	// Copy the target environment file
	fs.copyFileSync(sourceFile, targetFile);
	console.log(`✅ Switched to ${targetEnv} environment`);
	console.log(`📄 Copied ${path.basename(sourceFile)} to .env.local`);

	// Show current API URL
	const envContent = fs.readFileSync(targetFile, "utf8");
	const apiUrlMatch = envContent.match(/NEXT_PUBLIC_API_URL="([^"]+)"/);
	if (apiUrlMatch) {
		console.log(`🔗 API URL: ${apiUrlMatch[1]}`);
	}
}

function showCurrentEnvironment() {
	const envFile = path.join(process.cwd(), ".env.local");
	if (!fs.existsSync(envFile)) {
		console.log("❌ No .env.local file found");
		return;
	}

	const content = fs.readFileSync(envFile, "utf8");
	const nodeEnvMatch = content.match(/NODE_ENV=(\w+)/);
	const apiUrlMatch = content.match(/NEXT_PUBLIC_API_URL="([^"]+)"/);

	console.log("📊 Current Environment Status:");
	console.log(`   NODE_ENV: ${nodeEnvMatch ? nodeEnvMatch[1] : "not set"}`);
	console.log(`   API URL: ${apiUrlMatch ? apiUrlMatch[1] : "not set"}`);
}

// Main execution
const command = process.argv[2];

switch (command) {
	case "dev":
	case "development":
		switchEnvironment("development");
		break;
	case "prod":
	case "production":
		switchEnvironment("production");
		break;
	case "status":
	case "current":
		showCurrentEnvironment();
		break;
	case "help":
	case "--help":
	case "-h":
		console.log(`
🔧 Environment Switcher

Usage:
  node switch-env.js <command>

Commands:
  dev, development    Switch to development environment
  prod, production    Switch to production environment  
  status, current     Show current environment status
  help                Show this help message

Examples:
  node switch-env.js dev      # Switch to development
  node switch-env.js prod     # Switch to production
  node switch-env.js status   # Show current environment
    `);
		break;
	default:
		console.error("❌ Unknown command. Use --help for usage information");
		process.exit(1);
}
