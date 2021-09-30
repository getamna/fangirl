export declare function listAllPackages(): {
    name: string;
    path: string;
    linkedWith: string[];
}[];
export declare function install(targetPackages?: string[]): void;
export declare function checkOutBranch(branchName: string, convertMasterToMain?: boolean, targetPackages?: string[]): Promise<void>;
export declare function handleSymLinks(shouldRemove: boolean): void;
export declare function runAll(script: string, parallel?: boolean, dryRun?: boolean, targetPackages?: string[]): void;
export declare function dropUncommitedChanges(targetPackages?: string[], dryRun?: boolean): Promise<void>;
export declare function deleteBranch(branchName: string, targetPackages?: string[]): Promise<void>;
export declare function updateLinkedVersions(targetPackages?: string[]): Promise<void>;
