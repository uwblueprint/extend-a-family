# Extend-A-Family

## Stack Choices
**Frontend Language:** React<br>
**Backend Language:** Node (Express)<br>
**Backend API:** REST<br>
**Database:** MongoDB<br>
**User Auth:** Opt-in<br>
**File Storage:** Opt-in<br>

## The Team
### S24
**Project Lead:** Carolyn Zhang<br>
**Product Managers:** Olivia Chan, Aatman Shah<br>
**Designers:** Gaurav Shah, Abeer Das<br>
**Developers:** Aathithan Chandrabalan, Jeffery Hu, Shannon Cui, Jason D'Souza, Jimmy Liu, Cherry Yang, Maggie Chen, Harishan Ravindranathan, Jeffrey Zhao<br>

## Table of Contents
* ⚙️ [Setup](#setup)
* 🧰 [Useful Commands](#useful-commands)
  * ℹ️ [Get Names & Statuses of Running Containers](#get-names--statuses-of-running-containers)
  * ✨ [Linting & Formatting](#linting--formatting)
  * 🧪 [Running Tests](#running-tests)
* 🌳 [Version Control Guide](#version-control-guide)
  * 🌿 [Branching](#branching)
  * 🔒 [Commits](#commits)
* 🚀 [Creating a Release](#creating-a-release)

---

## Setup
Follow the steps here: [Setup Instructions](https://www.notion.so/uwblueprintexecs/Setup-Instructions-d6e0cdeb69cf4bbf93a33c7302370550)!


## Useful Commands

### Get Names & Statuses of Running Containers
```bash
docker ps
```

### Linting & Formatting
```bash
docker exec -it eaf_backend /bin/bash -c "yarn run fix"
docker exec -it eaf_frontend /bin/bash -c "yarn run fix"
```
OR
1. `cd` into the `backend/` directory. Run `yarn run fix`.
2. `cd` into the `frontend/` directory. Run `yarn run fix`.

### Running Tests
```bash
docker exec -it eaf_backend /bin/bash -c "yarn test"
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
