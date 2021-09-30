### Fan Girl

Meet Fangirl. A multi-repo code management CLI. Fangirl is an alternative to [Lerna](https://github.com/lerna/lerna) and [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) which seem to work better with a monorepo solution.

When building Fangirl, our codebase for [Amna](https://getamna.com) is split across mutliple repos. Some of those repos are open-source, and a mono-repo does not work cleanly. It's just a lot of work to shuffle things around.

Fangirl does two things to make working across multiple repos easier (and possibly more in the future):

- abstracts over git to make cross-library feature changes
- links local dependencies

Although each repo may have it's own CI configuration, fangirl is primarily focused on ease of local development environment.

#### Getting Started

To get started, create a folder with a package.json and add a `repos` attribute. Or add it in one of your existing repos.

```json
// in package.json
{
  "repos": [
    "../lo-graph",
    "../lo-graph-sync",
    "../amna-desktop",
    "../amna-browser",
    "../amna-common"
  ]
}
```

Paths in the `repos` attribute do not necessarily have to be separate git repos, you can also point it to a subdirectory of a larger repo that contains the necessary package.

```
npm install -g fangirl
```

To verify fangirl works, run this in the directory with the `package.json`:

```
fangirl list
```

Take a look at our [onboarding repo](https://github.com/getamna/amna-developer). We store a few workspaces files, alongside the repo configuration to help get our developers up and running fast.

### Setting Up

A few commands exist to help with setting up an environment:

| command           | description                            |
| ----------------- | -------------------------------------- |
| `fangirl install` | runs an `npm install` will work        |
| `fangirl link`    | links any dependent libraries together |
| `fangirl unlink`  | unlinks all the dependent libraries    |

### Feature Changes

A few commands exist to help with creating repo cutting feature changes

| command                         | description                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `fangirl checkout <branchname>` | will create or checkout a git branch in all of the requested repos             |
| `fangirl drop`                  | if uncommited changes exist, will drop all the changes across all of the repos |
| `fangirl update`                | upgrades a `patch` version and upates package.json of all dependents           |

Use the `-p` or `--packages` flag to scope thes commands to only to specific packages
Use the `-m` or `--convertMaster` flag to get the equivalent `main` branch even if `master` is getting checked out

### Run Scripts

A few commands exist to help with running commands in specific repos

| command                    | description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| `fangirl run <scriptName>` | will run an `npm run <scriptName>` in all of the repos you ask |

Use the `-p` or `--packages` flag to scope thes commands to only to specific packages
Use the `--parallel` flag to run all of the commands at once. Perfect for _watching_ multiple repos
