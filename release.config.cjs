module.exports = {
  branches: [
    "main",
    { name: "release/*", prerelease: false }
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/exec",
      {
        prepareCmd: "git checkout -b release/${nextRelease.version} && git push origin release/${nextRelease.version}"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["./package.json", "./CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version} [skip ci]",
        push: false
      }
    ],
    "@semantic-release/github"
  ]
};