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
}
export declare function startsWith(str: string, match: string): boolean;
export declare function resolveTypings(typings: string): string;
