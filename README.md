# jspsych_template

This project was generated using `jspsych_template`. It leverages `jspsych-builder` (and therefore Babel, Webpack and SASS) to easy jsPsych development and automate the build process.

## Getting started

The package manager used is Yarn ([for a quick introduction, see here][1]). Make sure you have it installed in order to use this template to develop jsPsych experiments.

As with every modern Javascript project, after cloning the source code you need to install the project dependencies with `yarn install`. This step is only required at the beginning and when the dependencies change.

## Available commands

### `yarn run dev`

This will spin up the development server under http://localhost:3000. When the experiment timeline is finished, the resulting data will be printed on the browser console.

### `yarn run build`

This will compile and package the source files into a `.zip` file and save it in the `packaged` directory. This file can be served on any webserver or even run locally in a browser. **However, the resulting data is not saved anywhere, but again just printed on the browser console.** This behavior might be adjusted, of course. To learn how, refer to the [`jspsych-builder` docs][2].

### `yarn run build --jatos`

This will compile and package the source files into a `.jzip` file and save it in the `packaged` directory. The package can be imported to a JATOS server (using the GUI option _Import Study_).

[1]: https://yarnpkg.com/getting-started
[2]: https://github.com/bjoluc/jspsych-builder
