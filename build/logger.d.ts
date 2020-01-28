export declare type SubNamespaces = "server" | "host" | "util" | "vfs";
export declare type Severity = "info" | "warn" | "debug" | "error" | "silly";
export declare type LoggerFunction = (message: string, severity?: Severity) => void;
export declare function setCustomLogger(logger: LoggerFunction | false): void;
export declare function log(message: string, severity: Severity): void;
export declare function log(namespace: SubNamespaces, message: string, severity: Severity): void;
