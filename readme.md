### Fan Girl

Meet Fangirl. A multi-repo code management tool.

Fangirl is similar to [Lerna](https://github.com/lerna/lerna) and [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) but designed to work in a non monorepo structure.

Our codebase for [Amna](https://getamna.com) is split across mutliple repos. Some of those repos are open-source as well, meaning we can't move to a large monorepo. This means that we were constantly working across multiple repos, tied with `npm link`.

Fangirl does three (possibly more) things to make working across multiple repos easier :

- links local dependencies
- runs scripts in any repo
- abstracts over git to make cross-library feature changes

Fangirl is not designed for CI workflows, it's mainly about developer experience, and making it fast to manage working with multiple repos.

#### Getting Started

To get started, create a folder with a package.json and add a `repos` attribute. Or add it in one of your existing packages.

We added it in the package.json of our client-ui because that's often where features begin.

```json
// in any package.json add your repos
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

Note, the paths in the `repos` attribute do not necessarily have to be git repos, they are really just the directories that contain packages, and can even be subdirectories in a larger repo.

```
npm install -g fangirl
```

To verify fangirl works, run this in the directory with the `package.json`:

```
fangirl list
```

Here is the [onboarding repo](https://github.com/getamna/amna-developer) we use with our new developers and our fangirl scripts.

### Setting Up

A few commands exist to help with setting up an environment:

| command           | description                                  |
| ----------------- | -------------------------------------------- |
| `fangirl install` | runs an `npm install` in all listed packages |
| `fangirl link`    | links any dependent libraries together       |
| `fangirl unlink`  | unlinks all the dependent libraries          |

### Feature Changes

A few commands exist to help with creating repo cutting feature changes

| command                     | description                                                                    |
| --------------------------- | ------------------------------------------------------------------------------ |
| `fangirl checkout <branch>` | will create or checkout a git branch in all of the requested repos             |
| `fangirl drop`              | if uncommited changes exist, will drop all the changes across all of the repos |
| `fangirl update`            | upgrades to new package version and updates the package.json of all dependents |

- Use the `-p` or `--packages` flag to scope these commands to only to specific packages
- Use the `-m` or `--convertMaster` flag to get the `main` branch even if `master` was requested

### Run Scripts

A few commands exist to help with running commands in specific repos

| command                    | description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| `fangirl run <scriptName>` | will run an `npm run <scriptName>` in all of the repos you ask |

- Use the `-p` or `--packages` flag to scope thes commands to only to specific packages
- Use the `--parallel` flag to run all of the commands at once. Think `npm run watch` in all of your repos

### Testing Locally

After cloning this repo:

```
npm install
tsc -w
node dist/cli.js {args here}
```

No warranty. Feel free to open an issue, or contribute any changes. Could use some tests!
