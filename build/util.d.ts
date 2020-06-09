export interface Diagnostic {
    type: "error" | "warning" | "message";
    lineNr: number;
    charNr: number;
    sourceLine: string;
    description: string;
    annotatedSource: string;
}
export declare function repeatString(str: string, count: number): string;
export interface CompileResult {
    success: boolean;
    diagnostics: Diagnostic[];
    result?: string;
    declarations?: string;
}
export declare function startsWith(str: string, match: string): boolean;
export declare function endsWith(str: string, match: string): boolean;
export declare function setTypeScriptResolveOptions(options: {
    paths: string[];
} | undefined): void;
export declare function getTypeScriptResolveOptions(): {
    paths: string[];
} | undefined;
export declare function getTypeScript(): typeof import("typescript");
export declare function resolveTypings(typings: string): string;
export declare function resolveLib(libFile: string): string;
export declare function enumLibFiles(): string[];
