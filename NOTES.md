# Notes

## Issues

- The bundle contains a Microsoft Corporation copyright & MIT license notice. It
  would be better if the notice contained the author's name. Probably solvable
  through a bash-script which runs post-build but ugly af.

## Status

The experiment is fully ported to jsPsych 7. What's left to do:

- Run the full study to check if there are any bugs left, and investigate the
  final data

- Distribute `jspsych-vviq` and `jspsych-lshs` properly, and include them
  in this project via `packages.json` insted of yarn links. To unlink:

  - In this repo: `yarn unlink jspsych-vviq && yarn unlink jspsych-lshs`

  - In both questionnaire repos: `yarn unlink`
