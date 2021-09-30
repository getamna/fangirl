import concurrently from "concurrently";
import fs, { link } from "fs";
import path from "path";
import shell from "shelljs";
import randomColor from "randomcolor";
import semver from "semver";

import simpleGit, { SimpleGit } from "simple-git";
import { Helpers, PackageMap } from "./helpers";

// dump of package.json+version + all deps
export function listAllPackages() {
  const packageMap = Helpers.findRequestedPackages();

  const packages = [];
  for (const packageName in packageMap) {
    const pkg = packageMap[packageName];
    packages.push({
      name: packageName,
      path: pkg.path,
      linkedWith: pkg.linkedWith,
    });
  }

  console.log(packages);
  return packages;
}

export function install(targetPackages?: string[]) {
  // run npm install in all the package repos
  runAll("install", false, false, targetPackages);
}

export async function checkOutBranch(
  branchName: string,
  convertMasterToMain?: boolean,
  targetPackages?: string[]
) {
  const packageMap = Helpers.findRequestedPackages();

  const unstashedChanges = await Helpers.doUnstashedChangesExist(
    packageMap,
    undefined,
    targetPackages
  );
  if (unstashedChanges) {
    throw new Error(
      "Unstashed Changes: Cannot checkout branch if repos have uncommited changes"
    );
  }

  for (const packageName in packageMap) {
    // skip if not in target packages
    if (
      targetPackages &&
      targetPackages.length > 0 &&
      !targetPackages.includes(packageName)
    )
      continue;
    // for each package,
    const repoPath = path.resolve(packageMap[packageName].path);
    const git = simpleGit(repoPath);
    try {
      // check if branch exists
      const branchExists = await git.branch();
      // if branch does not exist, create it
      if (!branchExists.all.includes(branchName)) {
        if (convertMasterToMain && branchName === "master") {
          // do nothing. Otherwise it will create a new branch called master
        } else {
          await git.branch([`${branchName}`]);
        }
      }

      await git.checkout(branchName);
      console.log(`Switched to ${branchName} in ${packageName}`);
    } catch (ex) {
      if (convertMasterToMain) {
        console.log("Re-trying as Main Branch...");
        // check if branch exists
        const branchExists = await git.branch();
        // if branch does not exist, create it
        if (!branchExists.all.includes("main")) {
          await git.branch({ branch: "main" });
        }
        await git.checkout(`main`);
        console.log(`Switched to main in ${packageName}`);
      } else {
        console.log(ex);
        throw new Error(
          "Something went wrong.. please verify the proper branches are checked out"
        );
      }
    }
  }
}

export function handleSymLinks(shouldRemove: boolean) {
  const packageMap = Helpers.findRequestedPackages();

  if (!shouldRemove) {
    for (const packageName in packageMap) {
      const repoPath = path.resolve(packageMap[packageName].path);
      if (packageMap[packageName].createLink) {
        const cmd = `cd ${repoPath} && npm link`;

        shell.exec(cmd);
        console.log(`Creating Sym Link in ${packageName}`);
      }
    }
  }

  for (const packageName in packageMap) {
    if (packageMap[packageName].linkedWith) {
      const repoPath = path.resolve(packageMap[packageName].path);
      for (const linkedPackage of packageMap[packageName].linkedWith) {
        const cmd = `cd ${repoPath} && npm ${
          shouldRemove ? "unlink --no-save" : "link"
        }  ${linkedPackage}`;
        console.log(cmd);
        shell.exec(cmd);
        console.log(
          `${
            shouldRemove ? "Unlinked" : "Linked"
          } ${linkedPackage} to ${packageName}`
        );
      }
    }
  }
}

export function runAll(
  script: string,
  parallel?: boolean,
  dryRun?: boolean,
  targetPackages?: string[]
) {
  const packageMap = Helpers.findRequestedPackages();

  const commands = [];

  for (const packageName in packageMap) {
    if (
      targetPackages &&
      targetPackages.length > 0 &&
      !targetPackages.includes(packageName)
    )
      continue;
    const repoPath = path.resolve(packageMap[packageName].path);
    const cmd = `cd ${repoPath} && npm ${script}`;
    if (dryRun) {
      console.log(`Will run command in repo: ${cmd}`);
    }
    commands.push({
      command: cmd,
      name: path.basename(repoPath),
      prefixColor: randomColor(),
    });
  }

  if (dryRun) return;
  if (!parallel) {
    for (const cmd of commands) {
      shell.exec(cmd.command);
    }
  }

  if (parallel) {
    concurrently(commands, {});
  }
}

export async function dropUncommitedChanges(
  targetPackages?: string[],
  dryRun?: boolean
) {
  const packageMap = Helpers.findRequestedPackages();

  for (const packageName in packageMap) {
    if (
      targetPackages &&
      targetPackages.length > 0 &&
      !targetPackages.includes(packageName)
    )
      continue;
    const repoPath = path.resolve(packageMap[packageName].path);
    if (!dryRun) {
      const git = simpleGit(repoPath);
      await git.reset(["--hard", "HEAD"]);
    }
    console.log(`Dropping uncommited changes in ${packageName}`);
  }
}

export async function deleteBranch(
  branchName: string,
  targetPackages?: string[]
) {
  const packageMap = Helpers.findRequestedPackages();

  const unstashedChanges = await Helpers.doUnstashedChangesExist(
    packageMap,
    branchName,
    targetPackages
  );

  if (unstashedChanges) {
    throw new Error(
      "Unstashed Changes: Cannot delete branch if repos have uncommited changes"
    );
  }

  for (const packageName in packageMap) {
    if (
      targetPackages &&
      targetPackages.length > 0 &&
      !targetPackages.includes(packageName)
    )
      continue;
    const repoPath = path.resolve(packageMap[packageName].path);
    const git = simpleGit(repoPath);
    await git.branch(["-d ${branchName}"]);
  }
}

export async function updateLinkedVersions(targetPackages?: string[]) {
  // in a given directory,

  const packageMap = Helpers.findRequestedPackages();

  // increment the version of the package
  for (const packageName in packageMap) {
    if (
      targetPackages &&
      targetPackages.length > 0 &&
      !targetPackages.includes(packageName)
    )
      continue;

    const pkg = packageMap[packageName];

    // only update versions of linked packages
    if (!pkg.createLink) continue;

    const repoPath = path.resolve(pkg.path);
    // get the package.json
    const packageJson = JSON.parse(
      fs.readFileSync(`${repoPath}/package.json`, "utf8")
    );

    // bump the version
    packageJson.version = semver.inc(packageJson.version, "patch");

    // write the file back with the new version
    fs.writeFileSync(
      `${repoPath}/package.json`,
      JSON.stringify(packageJson, undefined, 2)
    );

    console.log(`Bumping version of ${packageName} to ${packageJson.version}`);
  }

  for (const packageName in packageMap) {
    const pkg = packageMap[packageName];
    const originalRepoPath = path.resolve(pkg.path);
    const originalPackageJson = JSON.parse(
      fs.readFileSync(`${originalRepoPath}/package.json`, "utf8")
    );

    if (pkg.linkedWith) {
      for (const linkedPackageName of pkg.linkedWith) {
        const linkedPkg = packageMap[linkedPackageName];
        const linkedPath = path.resolve(linkedPkg.path);
        // get the package.json
        const linkedPackageJson = JSON.parse(
          fs.readFileSync(`${linkedPath}/package.json`, "utf8")
        );

        // bump the version
        if (originalPackageJson.dependencies[linkedPackageName]) {
          originalPackageJson.dependencies[linkedPackageName] =
            linkedPackageJson.version;
        }

        if (originalPackageJson.devDependencies[linkedPackageName]) {
          originalPackageJson.devDependencies[linkedPackageName] =
            linkedPackageJson.version;
        }

        // write the file back with the new version
        fs.writeFileSync(
          `${originalRepoPath}/package.json`,
          JSON.stringify(originalPackageJson, undefined, 2)
        );

        console.log(
          `Updated dependency of ${linkedPackageName} in ${packageName} to latest ${linkedPackageJson.version}`
        );
      }
    }
  }
}
