export declare class VirtualFileSystem {
    provideFile(filename: string, content: string, override?: boolean): void;
    fileExists(filename: string): boolean;
    deleteFile(filename: string): void;
    readFile(filename: string): string;
    private files;
}
