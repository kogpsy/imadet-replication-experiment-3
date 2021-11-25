# Notes

## Issues

- The bundle contains a Microsoft Corporation copyright & MIT license notice. It would be better if the notice contained the author's name. Probably solvable through a bash-script which runs post-build but ugly af.

## Status

- The `jspsych-vviq` package is included via `yarn link`. To undo this, run `yarn unlink jspsych-vviq` in this repo, and `yarn unlink` in the `jspsych-vviq` repo.
- The detection practice timeline was extracted and ported successfully.
- The staircase detection timeline was extracted and ported successfully.
- The imagination practice timeline was extracted and ported successfully.
- The main experiment timeline was extracted and ported successfully.

- Next step: check if data of staircase should be saved on each cycle or so
  - Catch all TODOs

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
