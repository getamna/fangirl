import commandLineArgs, {
  CommandLineOptions,
  OptionDefinition,
} from "command-line-args";
import commandLineUsage from "command-line-usage";
import * as Main from "./main";

const sections = [
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
        description:
          "Scopes a command down to run only for the specified packages",
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

const usage = commandLineUsage(sections);

/* first - parse the main command */
const mainDefinitions = [{ name: "command", defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});
const argv = mainOptions._unknown || [];

switch (mainOptions.command) {
  case "list":
    {
      // list of all the packages found as defined in package.json
      Main.listAllPackages();
    }
    break;
  case "install":
    {
      const mergeDefinitions: OptionDefinition[] = [
        {
          name: "packages",
          alias: "p",
          type: String,
          multiple: true,
        },
      ];
      const mergeOptions = commandLineArgs(mergeDefinitions, { argv });

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
      const mainOptions = commandLineArgs(mainDefinitions, {
        argv,
        stopAtFirstUnknown: true,
      });

      const branchName = mainOptions.command;

      const subOptions = [
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

      const mergeOptions = commandLineArgs(subOptions, {
        argv: mainOptions._unknown || [],
        stopAtFirstUnknown: true,
      });

      Main.checkOutBranch(
        branchName,
        mergeOptions.convertMaster,
        mergeOptions.packages
      );
    }
    break;
  case "run":
    {
      const mainOptions = commandLineArgs(mainDefinitions, {
        argv,
        stopAtFirstUnknown: true,
      });

      const script = mainOptions.command;
      const subOptions = [
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
      console.log(mainOptions._unknown);
      const mergeOptions = commandLineArgs(subOptions, {
        argv: mainOptions._unknown || [],
        stopAtFirstUnknown: true,
      });
      Main.runAll(
        `npm run ${script}`,
        mergeOptions.parallel,
        mergeOptions.dryRun,
        mergeOptions.packages
      );
    }
    break;
  case "update":
    {
      const mergeDefinitions: OptionDefinition[] = [
        {
          name: "packages",
          alias: "p",
          type: String,
          multiple: true,
        },
      ];
      const mergeOptions = commandLineArgs(mergeDefinitions, { argv });

      Main.updateLinkedVersions(mergeOptions.packages);
    }
    break;
  case "drop":
    {
      const mergeDefinitions: OptionDefinition[] = [
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
      const mergeOptions = commandLineArgs(mergeDefinitions, { argv });
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
