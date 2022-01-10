// tslint:disable-next-line:no-var-requires
import debug from "debug";
import colors from "picocolors"

const defaultNamespace = "virtual-tsc";
export type SubNamespaces = "server" | "host" | "util" | "vfs";
export type Severity = "info" | "warn" | "debug" | "error" | "silly";

export type LoggerFunction = (message: string, severity?: Severity) => void;

let customLogger: LoggerFunction | false;
export function setCustomLogger(logger: LoggerFunction | false): void {
	customLogger = logger;
}

const formatters = {
	info: (message: string) => colors.blue(message),
	warn: (message: string) => colors.yellow(message),
	debug: (message: string) => colors.white(message),
	error: (message: string) => colors.red(message),
	silly: (message: string) => colors.white(message),
};

export function log(message: string, severity: Severity): void;
export function log(namespace: SubNamespaces, message: string, severity: Severity): void;
export function log(...args: any[]) {

	if (customLogger === false) return;

	// we only accept strings
	if (!args || !args.length || !args.every(arg => typeof arg === "string")) {
		throw new Error("Invalid arguments passed to log()");
	}

	let namespace: string = "";
	let message: string;
	let severity: Severity;
	if (args.length === 2) {
		([message, severity] = args);
	} else if (args.length === 3) {
		([namespace, message, severity] = args);
		// add the namespace separator to append the namespace to the default one
		if (typeof namespace === "string" && namespace !== "") namespace = ":" + namespace;
	}

	function defaultLogger() {
		let prefix: string = "";
		if (severity !== "info") {
			prefix = `[${severity.toUpperCase()}] `;
		}
		debug(defaultNamespace + namespace)(`${prefix}${formatters[severity](message)}`);
	}

	(customLogger || defaultLogger)(message, severity);
}
