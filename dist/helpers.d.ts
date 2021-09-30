export interface PackageMap {
    [packageName: string]: {
        deps: string[];
        devDeps: string[];
        linkedWith: string[];
        createLink: boolean;
        path: string;
    };
}
export declare class Helpers {
    static findRequestedPackages(): PackageMap;
    static doUnstashedChangesExist(packageMap: PackageMap, targetBranch?: string, targetPackages?: string[]): Promise<boolean>;
}
