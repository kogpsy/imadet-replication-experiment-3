# Notes

## Issues

- The bundle contains a Microsoft Corporation copyright & MIT license notice. It would be better if the notice contained the author's name. Probably solvable through a bash-script which runs post-build but ugly af.

## Status

- The `jspsych-vviq` package is included via `yarn link`. To undo this, run `yarn unlink jspsych-vviq` in this repo, and `yarn unlink` in the `jspsych-vviq` repo.
- The detection practice timeline was extracted and ported successfully.
- The staircase detection timeline was extracted and ported successfully.

- NOTE/TODO: the gratingVisibility level at the end of each block must be saved in some way, to be accessible later on!!!
- Next step: Figure out what data is used further down the timeline, and how to save that data in an appropriate way.
- Then: Start with the main experiment portation

## Tasks

- [x] VVIQ package
- [x] LSHS package
  - [x] Basic structure
  - [x] English strings
  - [x] German strings
- [ ] What is the best way to distribute the package (jspsych-contrib vs npm package). Wrote mail to dev, response: Not formalized yet. Made suggestion and awaiting reply.
- [ ] Distribute
- [ ] Adapt gratings experiment 3 to jsPsych 7 (with typescript)
  - WIP
