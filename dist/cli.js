"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_args_1 = __importDefault(require("command-line-args"));
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var Main = __importStar(require("./main"));
var sections = [
    {
        header: "Fangirl",
        content: "Makes it easy to switch between multiple repos and manage them",
    },
    {
        header: "Synopsis",
        content: "$ fangirl <command> <options>",
    },
    {
        header: "Command List",
        content: [
            {
                name: "install",
                summary: "Install all of the dependencies within each package",
            },
            {
                name: "list",
                summary: "List all repos that have been detected",
            },
            { name: "help", summary: "Display command usage about Fangirl." },
            {
                name: "link",
                summary: "Link repos that depend on each other together",
            },
            { name: "unlink", summary: "Unlink all repos that depend on each other" },
            { name: "run", summary: "Run a script across multiple packages " },
            {
                name: "checkout",
                summary: "Creates and checkout a branch in all repos",
            },
            {
                name: "drop",
                summary: "Drops any uncommited changes in the current branch",
            },
            {
                name: "update",
                summary: "Updates linked repos with a patch, and its dependents",
            },
        ],
    },
    {
        header: "Helpful flags",
        optionList: [
            {
                name: "packages",
                description: "Scopes a command down to run only for the specified packages",
                alias: "p",
                type: String,
                multiple: true,
            },
            {
                name: "convertMaster",
                alias: "m",
                description: "Try converting master to main when checking out",
                type: Boolean,
            },
        ],
    },
];
var usage = command_line_usage_1.default(sections);
var mainDefinitions = [{ name: "command", defaultOption: true }];
var mainOptions = command_line_args_1.default(mainDefinitions, {
    stopAtFirstUnknown: true,
});
var argv = mainOptions._unknown || [];
switch (mainOptions.command) {
    case "list":
        {
            Main.listAllPackages();
        }
        break;
    case "install":
        {
            var mergeDefinitions = [
                {
                    name: "packages",
                    alias: "p",
                    type: String,
                    multiple: true,
                },
            ];
            var mergeOptions = command_line_args_1.default(mergeDefinitions, { argv: argv });
            Main.install(mergeOptions.packages);
        }
        break;
    case "link":
        {
            Main.handleSymLinks(false);
        }
        break;
    case "unlink":
        {
            Main.handleSymLinks(true);
        }
        break;
    case "checkout":
        {
            var mainOptions_1 = command_line_args_1.default(mainDefinitions, {
                argv: argv,
                stopAtFirstUnknown: true,
            });
            var branchName = mainOptions_1.command;
            var subOptions = [
                {
                    name: "convertMaster",
                    alias: "m",
                    type: Boolean,
                },
                {
                    name: "packages",
                    alias: "p",
                    type: String,
                    multiple: true,
                },
            ];
            var mergeOptions = command_line_args_1.default(subOptions, {
                argv: mainOptions_1._unknown || [],
                stopAtFirstUnknown: true,
            });
            Main.checkOutBranch(branchName, mergeOptions.convertMaster, mergeOptions.packages);
        }
        break;
    case "run":
        {
            var mainOptions_2 = command_line_args_1.default(mainDefinitions, {
                argv: argv,
                stopAtFirstUnknown: true,
            });
            var script = mainOptions_2.command;
            var subOptions = [
                {
                    name: "packages",
                    alias: "p",
                    type: String,
                    multiple: true,
                },
                {
                    name: "dry-run",
                    alias: "d",
                    type: Boolean,
                },
                {
                    name: "parallel",
                    type: Boolean,
                },
            ];
            console.log(mainOptions_2._unknown);
            var mergeOptions = command_line_args_1.default(subOptions, {
                argv: mainOptions_2._unknown || [],
                stopAtFirstUnknown: true,
            });
            Main.runAll("npm run " + script, mergeOptions.parallel, mergeOptions.dryRun, mergeOptions.packages);
        }
        break;
    case "update":
        {
            var mergeDefinitions = [
                {
                    name: "packages",
                    alias: "p",
                    type: String,
                    multiple: true,
                },
            ];
            var mergeOptions = command_line_args_1.default(mergeDefinitions, { argv: argv });
            Main.updateLinkedVersions(mergeOptions.packages);
        }
        break;
    case "drop":
        {
            var mergeDefinitions = [
                {
                    name: "packages",
                    alias: "p",
                    type: String,
                    multiple: true,
                },
                {
                    name: "dryRun",
                    alias: "d",
                    type: Boolean,
                },
            ];
            var mergeOptions = command_line_args_1.default(mergeDefinitions, { argv: argv });
            console.log(mergeOptions);
            Main.dropUncommitedChanges(mergeOptions.packages, mergeOptions.dryRun);
        }
        break;
    case "help":
        {
            console.log(usage);
        }
        break;
    default: {
        console.log("Unknown command. Try running: fangirl  help");
    }
}
