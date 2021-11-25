/**
 * @title Gratings Replication Experiment 1
 * @description In diesem Experiment geht es um ... (anpassen in experiment.js).
 * @version 0.1.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 */

// You can import stylesheets (.scss or .css).
import '../styles/main.scss';

import { initJsPsych } from 'jspsych';

import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
import PreloadPlugin from '@jspsych/plugin-preload';

// TODO: These are linked via yarn link, and hence not defined in package.json
import { vviqGerman } from 'jspsych-vviq';
import { lshsGerman } from 'jspsych-lshs';

// Import constants
import {
  GRATING_VISIBILITY_LEVEL_INIT,
  SHOW_QUESTIONNAIRES,
} from './constants';

// Import utils
import { getFixationCross, getRandomResponseMapping } from './utils';

// Import trials
import { getPraciceDetectionTimeline } from './practiceDetectionTimeline';
import { getStaircaseDetectionTimeline } from './staircaseDetectionTimeline';
import { getPracticeImaginationTimeline } from './practiceImaginationTimeline';
import { getMainExperimentTimeline } from './mainExperimentTimeline';

/**
 * This method will be executed by jsPsych Builder and is expected to run the
 * jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the
 * JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context
 * in which the experiment is run: `development` for `yarn run dev`,
 * `production` for `yarn run build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];,
 * misc: string[];}} options.assetPaths An object with lists of file paths for
 * the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  // Initialize jsPsych
  const jsPsych = initJsPsych();

  // Generate a random response key mapping
  const responseMapping = getRandomResponseMapping();
  // Get the fixation cross trial
  const fixationCross = getFixationCross(jsPsych);

  // Create the timeline array
  const timeline = [];

  // Declare variables which will hold the grating visibility levels estimated
  // during the staircase calibration part of the experiment.
  const participantGratingVisibility = {
    // Default values, in case the main experiment is run without the
    // running the staircase calibration first.
    left: GRATING_VISIBILITY_LEVEL_INIT,
    right: GRATING_VISIBILITY_LEVEL_INIT,
    // Setters and getters
    setLeft: function (level) {
      this.left = level;
    },
    setRight: function (level) {
      this.right = level;
    },
    getLeft: function () {
      return this.left;
    },
    getRight: function () {
      return this.right;
    },
  };

  // When the experiment is run, first preload all assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
  });

  // Push the welcome screen to the timeline
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <p>
        Willkommen zum Experiment! Drücken Sie eine beliebige Taste, um zu
        starten.
      </p>
    `,
  });

  // Push questionnaires to timeline, if defined so in ./constants.js
  if (SHOW_QUESTIONNAIRES) {
    // VVIQ
    timeline.push(vviqGerman);
    // LSHS
    timeline.push(lshsGerman);
  }

  // Push the main explanation of the experiment to the timeline
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <p>
        Während diesem Experiment werden Sie nach <strong>verrauschten
          Gittermustern</strong> suchen (siehe unten).
      </p>
      <p>
        <strong>Gittermuster</strong> bestehen aus schwarz-weiss gestreiften
        Linien (links).
      </p>
      <p>
        Das <strong>Rauschen</strong> ist eine Sammlung von zufällig
        angeordneten schwarzen und weissen Punkten (mitte).
      </p>
      <p>
        Ihre Aufgabe besteht darin, bei jedem Durchgang anzugeben, ob Sie ein 
        Gittermuster gesehen haben oder nicht (rechts).
      </p>
      <div class="vertical_spacer"></div>
      <div class="vertical_spacer"></div>
      <img src='../media/images/example_stim-01.png' width=600 ></img>
      <div class="vertical_spacer"></div>
      <p>Drücken Sie die [Leertaste], um fortzufahren.</p>
    `,
    choices: [' '],
  });

  // Add the detection practice timeline
  timeline.push(
    getPraciceDetectionTimeline(jsPsych, responseMapping, fixationCross)
  );

  // Add the detection staircase timeline
  timeline.push(
    getStaircaseDetectionTimeline(
      jsPsych,
      responseMapping,
      fixationCross,
      participantGratingVisibility
    )
  );

  // Add the imagiantion practice timeline
  timeline.push(getPracticeImaginationTimeline(jsPsych, fixationCross));

  // Add the main experiment timeline
  timeline.push(
    getMainExperimentTimeline(
      jsPsych,
      responseMapping,
      fixationCross,
      participantGratingVisibility
    )
  );

  await jsPsych.run(timeline);

  // Get the resulting data
  const resultData = jsPsych.data.get();
  // If the experiment is run by JATOS, pass the resulting data to the server
  // in CSV form.
  if (environment === 'jatos') {
    jatos.submitResultData(resultData.csv(), jatos.startNextComponent);
  }
  // In every other environment, print the data to the browser console in JSON
  // form. Here you can adjust what should happen to the data if the experiment
  // is served, e.g. by a common httpd server.
  else {
    console.log('End of experiment. Results:');
    console.log(resultData);
  }
}
