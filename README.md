# Extend-A-Family

## Stack Choices
**Frontend Language:** React
**Backend Language:** Node (Express)<br>
**Backend API:** REST<br>
**Database:** MongoDB<br>
**User Auth:** Opt-in<br>
**File Storage:** Opt-in<br>

## Table of Contents
* 📝 [Documentation](#documentation)
* ❗❗ [Reporting Issues](#reporting-issues)
* 👨‍💻 [Getting Started: Users](#getting-started-users)
* 👷 [Getting Started: Internal Tools Developers](#getting-started-internal-tools-developers)
  * ✔️ [Prerequisites](#prerequisites)
  * ⚙️ [Set up](#set-up)
* 🚀 [Creating a Release](#creating-a-release)
* 🧰 [Useful Commands](#useful-commands)
  * ℹ️ [Get Names & Statuses of Running Containers](#get-names--statuses-of-running-containers)
  * ✨ [Linting & Formatting](#linting--formatting)
  * 🧪 [Running Tests](#running-tests)
* ✍️ [Updating Documentation](#updating-documentation)
* 🌳 [Version Control Guide](#version-control-guide)
  * 🌿 [Branching](#branching)
  * 🔒 [Commits](#commits)

## Documentation

https://uwblueprint.github.io/starter-code-v2


## Reporting Issues

You can open an issue in this GitHub repository, or message the #internal-tools-help channel in UW Blueprint’s Slack workspace.


## Getting Started: Users

Please follow the instructions in this [guide](https://uwblueprint.github.io/starter-code-v2/docs/getting-started) to generate and set up Starter Code. Starter Code must be preprocessed through the [`create-bp-app`](https://www.npmjs.com/package/@uwblueprint/create-bp-app) CLI tool before being used, so **please do not clone and run this repository directly**.

---

## Getting Started: Internal Tools Developers

### Prerequisites

* Install Docker Desktop ([MacOS](https://docs.docker.com/docker-for-mac/install/) | [Windows (Home)](https://docs.docker.com/docker-for-windows/install-windows-home/) | [Windows (Pro, Enterprise, Education)](https://docs.docker.com/docker-for-windows/install/) | [Linux](https://docs.docker.com/engine/install/#server)) and ensure that it is running
```bash
# these commands should give error-free output
docker info
docker-compose --version
```
* Ask a member of the Internal Tools team to be added to our Firebase and MongoDB Atlas projects
* Set up Vault client for secret management, see instructions [here](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e)


### Set up

1. Clone this repository and `cd` into the project folder
```bash
git clone https://github.com/uwblueprint/starter-code-v2.git
cd starter-code-v2
```
2. Comment out one of the backend services in `docker-compose.yml`
3. Follow through our [public docs](https://uwblueprint.github.io/starter-code-v2/docs/getting-started)
4. In the root `.env` file, change the name of the MongoDB database according to the backend you're using: either `typescript-test` or `python-test`
5. Run the application
```bash
docker-compose up --build
```

The backend runs at http://localhost:8080 and the frontend runs at http://localhost:3000.


## Creating a Release
To update the release branch with commits from main:
1. Create a new branch off the release branch
2. Merge main into the new branch
3. Open a PR from your new branch -> release branch
4. Reviewers should be able to see just the changes from the new main commits
5. Merge the PR, it should just show up as a single commit in the commit history of the release branch
6. Tag the most recent `main` commit included in the release
```bash
git tag <semver> <short-hash-of-main-commit>
git push origin --tags
```


## Useful Commands

### Get Names & Statuses of Running Containers
```bash
docker ps
```

### Linting & Formatting
TypeScript backend and frontend:
```bash
# linting & formatting warnings only
docker exec -it scv2_ts_backend /bin/bash -c "yarn lint"

# linting with fix & formatting
docker exec -it scv2_ts_backend /bin/bash -c "yarn fix"
```

### Running Tests
TypeScript backend and frontend:
```bash
docker exec -it scv2_ts_backend /bin/bash -c "yarn test"
```


## Version Control Guide

### Branching
* Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your name. The branch name should be in kebab case and it should be short and descriptive. E.g. `sherry/readme-update`
* To integrate changes on `main` into your feature branch, **use rebase instead of merge**

```bash
# currently working on feature branch, there are new commits on main
git pull origin main --rebase

# if there are conflicts, resolve them and then:
git add .
git rebase --continue

# force push to remote feature branch
git push -f
```

### Commits
* Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
* Trivial commits (e.g. fixing a typo in the previous commit, formatting changes) should be squashed or fixup'd into the last non-trivial commit

```bash
# last commit contained a typo, fixed now
git add .
git commit -m "Fix typo"

# fixup into previous commit through interactive rebase
# x in HEAD~x refers to the last x commits you want to view
git rebase -i HEAD~2
# text editor opens, follow instructions in there to fixup

# force push to remote feature branch
git push -f
```

* Commit messages and PR names are descriptive and written in **imperative tense**<sup>1</sup>. The first word should be capitalized. E.g. "Create user REST endpoints", not "Created user REST endpoints"
* PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.

---

1: From Git's own [guidelines](https://github.com/git/git/blob/311531c9de557d25ac087c1637818bd2aad6eb3a/Documentation/SubmittingPatches#L139-L145)
