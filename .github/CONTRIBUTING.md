# SSW Contributing Guidelines

- Checkout a new branch off of main: `git checkout -b "initials/feature-name"`
  - i.e. `git checkout -b "af/onboarding-page"`
- Start commit messages with a capital letter and use _imperative_ mode (i.e. "Fix homepage" instead of "Fixes/Fixed homepage" - this is in line with GitHub best practices and auto-generated commit messages
- Commit early and often!
- Make sure to run `yarn format` in both the `client` and `api` directories
- Make sure PRs are small (ideally only 2-3 files changed) - try to split up your feature into multiple related PRs
- Open up a **draft PR** immediately after you've made your first change on your branch - this is to help the rest of the team know what you're working on and that you are indeed working on it
- Follow the PR template prompts
  - Make sure to reference the related issue number (i.e. "Closes #4")
- Once your feature is fully functional, mark it as "Ready for Review"
  - If it's a frontend feature and there's user interaction, record your screen using Loom and attach the video to the PR
  - Request @Alice Fang and @Sahithi Muthyala as reviewers
  - Also feel free to request reviews from other members you worked with, or if it's a UI-related issue request @Mustafa Ali's review
- Once you've addressed comments left on your PR, re-request reviews from everyone who requested changes
- Once your PR is ready to be merged, hit "Squash and merge" and write a good general commit message - this will consolidate all your commits to the branch into one single commit so we don't clutter the commit history of the main branch
