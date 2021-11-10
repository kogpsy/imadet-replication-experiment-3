# Notes

## Issues

- The bundle contains a Microsoft Corporation copyright & MIT license notice. It would be better if the notice contained the author's name. Probably solvable through a bash-script which runs post-build but ugly af.

## Status

- Integrated Lato font for standardization. Not sure if the preloading is done correctly, though.
- Next step: Then create VVIQ package.
- The `jspsych-vviq` package is included via `yarn link`. To undo this, run `yarn unlink jspsych-vviq` in this repo, and `yarn unlink` in the `jspsych-vviq` repo.

## Tasks

Remember: now working with code oss.

- [x] VVIQ package
- [ ] LSHS package
  - [x] Basic structure
  - [x] English strings
  - [ ] German strings
- [ ] What is the best way to distribute the package (jspsych-contrib vs npm package). Wrote mail to dev, awaiting response.
- [ ] Distribute
- [ ] Adapt gratings experiment 3 to jsPsych 7 (with typescript)
