# imadet-replication-experiment-3

This project aims to refactor the code used in experiment 3 of the IMADET study
by [Dijkstra et al. (2021)][3] in a clean and modular way. It leverages
`jspsych-builder` (and therefore Babel, Webpack and SASS) to ease jsPsych
development, reach a high browser compatibility and automate the build process.

The broader goal is to replicate the findings of the aforementioned study, and
on the way there generate useful software modules which can be used in other
studies.

## About the experiment

This experiment investigates how imagination influences perception. Participants
are shown [tilted Gabor patches][4] (called gratings) while (sometimes) also
imagining gratings of either congruent or incongruent tilt. There are four major
parts:

**Detection - practice**

In this part, participants practice to detect gratings in noise.

**Detection - staircase calibration**

Here the individual detection abilities are tried to be measured using a
staircase approach.

**Imagination - practice**

Participants practice to imagine a certain grating while looking at an animation
on the screen.

**Main experiment**

Participants are shown left- and right-tilted grating animations with grating
visibility at their individual level. They are sometimes asked to imagine a
grating (either a left tilted or a right tilted one), sometimes asked to imagine
nothing. 50% of the presented animations do not contain a grating at all.

The idea is to figure out if the gratings are detected more accurately, if the
participants imagine a (congruently tilted) grating while viewing the
animations.

## Getting started

The package manager used is yarn ([for a quick introduction, see here][1]). Make
sure you have it installed in order start development.

As with every modern JavaScript project, after cloning the source code you need
to install the project dependencies with `yarn install`. This step is only
required at the beginning and when the dependencies change.

**Pro tipp**: To edit the experimental instructions, the VS Code Extension
_Template Literal Editor_ comes in quite handy.

## Available commands

### `yarn run dev`

This will spin up the development server under http://localhost:3000. When the
experiment timeline is finished, the resulting data will be printed on the
browser console.

### `yarn run build`

This will compile and package the source files into a `.zip` file and save it in
the `packaged` directory. This file can be served on any webserver or even run
locally in a browser. **However, the resulting data is not saved anywhere, but
again just printed on the browser console.** This behavior might be adjusted, of
course. To learn how, refer to the [`jspsych-builder` docs][2].

### `yarn run build --jatos`

This will compile and package the source files into a `.jzip` file and save it
in the `packaged` directory. The package can be imported to a JATOS server
(using the GUI option _Import Study_).

[1]: https://yarnpkg.com/getting-started
[2]: https://github.com/bjoluc/jspsych-builder
[3]: https://doi.org/10.1016/j.cognition.2021.104719
[4]: https://duckduckgo.com/?q=gabor+patch&iax=images&ia=images
