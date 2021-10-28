let pjson = { repos: [] };
try {
  pjson = require(process.cwd() + "/package.json");
} catch (ex) {
  console.log(
    "Not running fangirl within a package. May not work as expected."
  );
}
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

export interface PackageMap {
  [packageName: string]: {
    deps: string[];
    devDeps: string[];
    linkedWith: string[];
    createLink: boolean;
    path: string;
  };
}

export class Helpers {
  static findRequestedPackages() {
    if (!pjson.repos) {
      throw new Error("No package.json exists, and no repos were specified");
    }

    const packageMap: PackageMap = {};

    // get all of the package directories from package.json, and make sure that they have valid package.json
    for (const repo of pjson.repos) {
      const files = fs.readdirSync(repo);
      if (!files.includes("package.json")) {
        throw new Error(
          `${repo} does not have a package.json file. Will not continue.`
        );
      }

      // add package.json to packageMap
      const packageJsonFile = fs
        .readFileSync(path.join(repo, "package.json"))
        .toString("utf-8");
      const packageJson = JSON.parse(packageJsonFile);
      packageMap[packageJson.name] = {
        deps: packageJson.dependencies,
        devDeps: packageJson.devDependencies,
        path: repo,
        createLink: false,
        linkedWith: [],
      };
    }

    // look through all packages, see if they are requested by any of the repos
    for (const packageName in packageMap) {
      packageMap[packageName].linkedWith = [];
      if (packageMap[packageName].deps) {
        for (const depPackage in packageMap[packageName].deps) {
          if (depPackage in packageMap) {
            packageMap[depPackage].createLink = true;
            packageMap[packageName].linkedWith = packageMap[
              packageName
            ].linkedWith.concat([depPackage]);
          }
        }
        for (const depPackage in packageMap[packageName].devDeps) {
          if (depPackage in packageMap) {
            packageMap[depPackage].createLink = true;
            packageMap[packageName].linkedWith = packageMap[
              packageName
            ].linkedWith.concat([depPackage]);
          }
        }
      }
    }

    // if they are, add them to the packageMap as a requestedSymLink
    return packageMap;
  }

  static async doUnstashedChangesExist(
    packageMap: PackageMap,
    targetBranch?: string,
    targetPackages?: string[]
  ) {
    //check if unstashed changes exist in current branch
    for (const packageName in packageMap) {
      if (targetPackages && !targetPackages.includes(packageName)) {
        continue;
      }
      const repoPath = path.resolve(packageMap[packageName].path);
      const git = simpleGit(repoPath);
      const branchExists = await git.branch();
      // if there are unstashed changes on current branch
      const diffSummary = await git.diffSummary();
      // if unstashed changes, throw error
      if (
        diffSummary.files.length > 0 &&
        branchExists.current !== targetBranch
      ) {
        console.log(
          `Unstashed changes exist in ${packageName} in the ${branchExists.current.toUpperCase()} branch. `
        );

        return true;
      }
    }

    return false;
  }
}
