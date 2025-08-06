// logger.ts
import axios from "axios";
import chalk from "chalk";
import { format } from "date-fns";
import { config, getApiUrl } from "./config";

/**
 * Logger utility to handle different logging styles.
 */
class Logger {
	private static readonly TIMESTAMP_FORMAT = "yyyy-MM-dd HH:mm:ss";

	private static getTimestamp(): string {
		return format(new Date(), this.TIMESTAMP_FORMAT);
	}

	static error(message: string, meta?: object): void {
		console.log(
			`${chalk.bgRed.black.bold(" ERROR ")} ${chalk.gray(this.getTimestamp())} - ${chalk.red(
				message
			)}`,
			meta
		);
		// Logger.sendToServer("ERROR", message, meta);
	}

	static info(message: string, meta?: object): void {
		console.log(
			`${chalk.bgBlue.black.bold(" INFO  ")} ${chalk.gray(
				this.getTimestamp()
			)} - ${chalk.blue(message)}`,
			meta
		);
		// Logger.sendToServer("INFO", message, meta);
	}
	static warning(message: string, meta?: object): void {
		console.log(
			`${chalk.bgYellow.black.bold(" WARN  ")} ${chalk.gray(
				this.getTimestamp()
			)} - ${chalk.yellow(message)}`,
			meta
		);
		// Logger.sendToServer("WARN", message, meta);
	}

	static success(message: string, meta?: object): void {
		console.log(
			`${chalk.bgGreen.black.bold(" SUCCESS ")} ${chalk.gray(
				this.getTimestamp()
			)} - ${chalk.green(message)}`,
			meta
		);
		// Logger.sendToServer("SUCCESS", message, meta);
	}

	static debug(message: string, meta?: object): void {
		console.log(
			`${chalk.bgMagenta.black.bold(" DEBUG ")} ${chalk.gray(
				this.getTimestamp()
			)} - ${chalk.magenta(message)}`,
			meta
		);
		// Logger.sendToServer("DEBUG", message, meta);
	}

	private static sendToServer(
		level: string,
		message: string,
		data?: object
	): void {
		// Only send logs to server if logging is enabled
		if (config.features.enableLogging) {
			axios.post(
				getApiUrl("/logs/create-new"),
				{ message, level, meta: data },
				{
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	}
}

export default Logger;
