const fs = require("fs");

const branch = process.env.CI_COMMIT_BRANCH;

const config = {
  branches: ["master", "exactflow-v1", "next"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: branch === "master" ? "CHANGELOG.md" : "EF-CHANGELOG.md",
        changelogTitle:
          "# Changelog\n\nAll notable changes to this project will be documented in this file. See\n[Conventional Commits](https://conventionalcommits.org) for commit guidelines.",
      },
    ],
    [
      "@semantic-release/git",
      {
        message: "chore: Release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        assets: [branch === "master" ? "CHANGELOG.md" : "EF-CHANGELOG.md"],
      },
    ],
  ],
};

fs.writeFileSync("../../.releaserc.json", JSON.stringify(config, null, 2));
