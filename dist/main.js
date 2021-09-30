"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLinkedVersions = exports.deleteBranch = exports.dropUncommitedChanges = exports.runAll = exports.handleSymLinks = exports.checkOutBranch = exports.install = exports.listAllPackages = void 0;
var concurrently_1 = __importDefault(require("concurrently"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var shelljs_1 = __importDefault(require("shelljs"));
var randomcolor_1 = __importDefault(require("randomcolor"));
var semver_1 = __importDefault(require("semver"));
var simple_git_1 = __importDefault(require("simple-git"));
var helpers_1 = require("./helpers");
function listAllPackages() {
    var packageMap = helpers_1.Helpers.findRequestedPackages();
    var packages = [];
    for (var packageName in packageMap) {
        var pkg = packageMap[packageName];
        packages.push({
            name: packageName,
            path: pkg.path,
            linkedWith: pkg.linkedWith,
        });
    }
    console.log(packages);
    return packages;
}
exports.listAllPackages = listAllPackages;
function install(targetPackages) {
    runAll("install", false, false, targetPackages);
}
exports.install = install;
function checkOutBranch(branchName, convertMasterToMain, targetPackages) {
    return __awaiter(this, void 0, void 0, function () {
        var packageMap, unstashedChanges, _a, _b, _i, packageName, repoPath, git, branchExists, ex_1, branchExists;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    packageMap = helpers_1.Helpers.findRequestedPackages();
                    return [4, helpers_1.Helpers.doUnstashedChangesExist(packageMap, undefined, targetPackages)];
                case 1:
                    unstashedChanges = _c.sent();
                    if (unstashedChanges) {
                        throw new Error("Unstashed Changes: Cannot checkout branch if repos have uncommited changes");
                    }
                    _a = [];
                    for (_b in packageMap)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3, 17];
                    packageName = _a[_i];
                    if (targetPackages &&
                        targetPackages.length > 0 &&
                        !targetPackages.includes(packageName))
                        return [3, 16];
                    repoPath = path_1.default.resolve(packageMap[packageName].path);
                    git = simple_git_1.default(repoPath);
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 9, , 16]);
                    return [4, git.branch()];
                case 4:
                    branchExists = _c.sent();
                    if (!!branchExists.all.includes(branchName)) return [3, 7];
                    if (!(convertMasterToMain && branchName === "master")) return [3, 5];
                    return [3, 7];
                case 5: return [4, git.branch(["" + branchName])];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7: return [4, git.checkout(branchName)];
                case 8:
                    _c.sent();
                    console.log("Switched to " + branchName + " in " + packageName);
                    return [3, 16];
                case 9:
                    ex_1 = _c.sent();
                    if (!convertMasterToMain) return [3, 14];
                    console.log("Re-trying as Main Branch...");
                    return [4, git.branch()];
                case 10:
                    branchExists = _c.sent();
                    if (!!branchExists.all.includes("main")) return [3, 12];
                    return [4, git.branch({ branch: "main" })];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12: return [4, git.checkout("main")];
                case 13:
                    _c.sent();
                    console.log("Switched to main in " + packageName);
                    return [3, 15];
                case 14:
                    console.log(ex_1);
                    throw new Error("Something went wrong.. please verify the proper branches are checked out");
                case 15: return [3, 16];
                case 16:
                    _i++;
                    return [3, 2];
                case 17: return [2];
            }
        });
    });
}
exports.checkOutBranch = checkOutBranch;
function handleSymLinks(shouldRemove) {
    var packageMap = helpers_1.Helpers.findRequestedPackages();
    if (!shouldRemove) {
        for (var packageName in packageMap) {
            var repoPath = path_1.default.resolve(packageMap[packageName].path);
            if (packageMap[packageName].createLink) {
                var cmd = "cd " + repoPath + " && npm link";
                shelljs_1.default.exec(cmd);
                console.log("Creating Sym Link in " + packageName);
            }
        }
    }
    for (var packageName in packageMap) {
        if (packageMap[packageName].linkedWith) {
            var repoPath = path_1.default.resolve(packageMap[packageName].path);
            for (var _i = 0, _a = packageMap[packageName].linkedWith; _i < _a.length; _i++) {
                var linkedPackage = _a[_i];
                var cmd = "cd " + repoPath + " && npm " + (shouldRemove ? "unlink --no-save" : "link") + "  " + linkedPackage;
                console.log(cmd);
                shelljs_1.default.exec(cmd);
                console.log((shouldRemove ? "Unlinked" : "Linked") + " " + linkedPackage + " to " + packageName);
            }
        }
    }
}
exports.handleSymLinks = handleSymLinks;
function runAll(script, parallel, dryRun, targetPackages) {
    var packageMap = helpers_1.Helpers.findRequestedPackages();
    var commands = [];
    for (var packageName in packageMap) {
        if (targetPackages &&
            targetPackages.length > 0 &&
            !targetPackages.includes(packageName))
            continue;
        var repoPath = path_1.default.resolve(packageMap[packageName].path);
        var cmd = "cd " + repoPath + " && npm " + script;
        if (dryRun) {
            console.log("Will run command in repo: " + cmd);
        }
        commands.push({
            command: cmd,
            name: path_1.default.basename(repoPath),
            prefixColor: randomcolor_1.default(),
        });
    }
    if (dryRun)
        return;
    if (!parallel) {
        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
            var cmd = commands_1[_i];
            shelljs_1.default.exec(cmd.command);
        }
    }
    if (parallel) {
        concurrently_1.default(commands, {});
    }
}
exports.runAll = runAll;
function dropUncommitedChanges(targetPackages, dryRun) {
    return __awaiter(this, void 0, void 0, function () {
        var packageMap, _a, _b, _i, packageName, repoPath, git;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    packageMap = helpers_1.Helpers.findRequestedPackages();
                    _a = [];
                    for (_b in packageMap)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 5];
                    packageName = _a[_i];
                    if (targetPackages &&
                        targetPackages.length > 0 &&
                        !targetPackages.includes(packageName))
                        return [3, 4];
                    repoPath = path_1.default.resolve(packageMap[packageName].path);
                    if (!!dryRun) return [3, 3];
                    git = simple_git_1.default(repoPath);
                    return [4, git.reset(["--hard", "HEAD"])];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    console.log("Dropping uncommited changes in " + packageName);
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3, 1];
                case 5: return [2];
            }
        });
    });
}
exports.dropUncommitedChanges = dropUncommitedChanges;
function deleteBranch(branchName, targetPackages) {
    return __awaiter(this, void 0, void 0, function () {
        var packageMap, unstashedChanges, _a, _b, _i, packageName, repoPath, git;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    packageMap = helpers_1.Helpers.findRequestedPackages();
                    return [4, helpers_1.Helpers.doUnstashedChangesExist(packageMap, branchName, targetPackages)];
                case 1:
                    unstashedChanges = _c.sent();
                    if (unstashedChanges) {
                        throw new Error("Unstashed Changes: Cannot delete branch if repos have uncommited changes");
                    }
                    _a = [];
                    for (_b in packageMap)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3, 5];
                    packageName = _a[_i];
                    if (targetPackages &&
                        targetPackages.length > 0 &&
                        !targetPackages.includes(packageName))
                        return [3, 4];
                    repoPath = path_1.default.resolve(packageMap[packageName].path);
                    git = simple_git_1.default(repoPath);
                    return [4, git.branch(["-d ${branchName}"])];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5: return [2];
            }
        });
    });
}
exports.deleteBranch = deleteBranch;
function updateLinkedVersions(targetPackages) {
    return __awaiter(this, void 0, void 0, function () {
        var packageMap, packageName, pkg, repoPath, packageJson, packageName, pkg, originalRepoPath, originalPackageJson, _i, _a, linkedPackageName, linkedPkg, linkedPath, linkedPackageJson;
        return __generator(this, function (_b) {
            packageMap = helpers_1.Helpers.findRequestedPackages();
            for (packageName in packageMap) {
                if (targetPackages &&
                    targetPackages.length > 0 &&
                    !targetPackages.includes(packageName))
                    continue;
                pkg = packageMap[packageName];
                if (!pkg.createLink)
                    continue;
                repoPath = path_1.default.resolve(pkg.path);
                packageJson = JSON.parse(fs_1.default.readFileSync(repoPath + "/package.json", "utf8"));
                packageJson.version = semver_1.default.inc(packageJson.version, "patch");
                fs_1.default.writeFileSync(repoPath + "/package.json", JSON.stringify(packageJson, undefined, 2));
                console.log("Bumping version of " + packageName + " to " + packageJson.version);
            }
            for (packageName in packageMap) {
                pkg = packageMap[packageName];
                originalRepoPath = path_1.default.resolve(pkg.path);
                originalPackageJson = JSON.parse(fs_1.default.readFileSync(originalRepoPath + "/package.json", "utf8"));
                if (pkg.linkedWith) {
                    for (_i = 0, _a = pkg.linkedWith; _i < _a.length; _i++) {
                        linkedPackageName = _a[_i];
                        linkedPkg = packageMap[linkedPackageName];
                        linkedPath = path_1.default.resolve(linkedPkg.path);
                        linkedPackageJson = JSON.parse(fs_1.default.readFileSync(linkedPath + "/package.json", "utf8"));
                        if (originalPackageJson.dependencies[linkedPackageName]) {
                            originalPackageJson.dependencies[linkedPackageName] =
                                linkedPackageJson.version;
                        }
                        if (originalPackageJson.devDependencies[linkedPackageName]) {
                            originalPackageJson.devDependencies[linkedPackageName] =
                                linkedPackageJson.version;
                        }
                        fs_1.default.writeFileSync(originalRepoPath + "/package.json", JSON.stringify(originalPackageJson, undefined, 2));
                        console.log("Updated dependency of " + linkedPackageName + " in " + packageName + " to latest " + linkedPackageJson.version);
                    }
                }
            }
            return [2];
        });
    });
}
exports.updateLinkedVersions = updateLinkedVersions;
