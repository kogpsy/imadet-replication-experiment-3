/**
 * @title IMADET Experiment 3 Replication
 * @description Replication of the third experiment of the IMADET stude (see README).
 * @version 0.1.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 */

// Terser requires license comments not to be in the toplevel scope, which is
// why we need to create a function to make terser extract to comment.
export function licenseComment() {
  /*! **************************************************************************
  Copyright © Robin Bürkli and the University of Bern

  This software is released under the MIT license:

  ---
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the “Software”), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  ---

  License notices from modules used in this project are listed below.
  *************************************************************************** */
}

// Import stylesheet
import '../styles/main.scss';

import { initJsPsych } from 'jspsych';

import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
import PreloadPlugin from '@jspsych/plugin-preload';

// Import constants
import { GRATING_VISIBILITY_LEVEL_INIT } from './constants';

// Import utils
import {
  getFixationCross,
  getRandomResponseMapping,
  curateData,
} from './utils';

// Import trials
import { getPraciceDetectionTimeline } from './practiceDetectionTimeline';
import { getStaircaseDetectionTimeline } from './staircaseDetectionTimeline';
import { getPracticeImaginationTimeline } from './practiceImaginationTimeline';
import { getMainExperimentTimeline } from './mainExperimentTimeline';
import SurveyTextPlugin from '@jspsych/plugin-survey-text';

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

  // Add some debrief questions to the timeline
  timeline.push({
    type: SurveyTextPlugin,
    data: {
      test_part: 'post_experiment_survey',
    },
    questions: [
      { prompt: 'Was ist Ihr Geschlecht?', rows: 2, columns: 40 },
      { prompt: 'Wie alt sind Sie?', rows: 2, columns: 40 },
      { prompt: 'In welchem Land leben Sie?', rows: 2, columns: 40 },
      {
        prompt: `
          Haben Sie sich die Gittermuster in den Blöcken wirklich vorgestellt,
          als wir Sie darum baten? (Die Antwort auf diese Frage wird Ihre
          Belonung nicht beeinflussen.)
        `,
        rows: 2,
        columns: 40,
      },
      {
        prompt: `
          Haben Sie das Gefühl, dass sich das Vorstellen der Gittermuster auf
          Ihre Antworten bei der Aufgabe ausgewirkt hat?
        `,
        rows: 2,
        columns: 40,
      },
      { prompt: 'Haben Sie weitere Anmerkungen?', rows: 2, columns: 40 },
    ],
    button_label: 'Weiter',
  });

  await jsPsych.run(timeline);

  // Get the resulting data
  const resultData = curateData(jsPsych.data.get());
  // If the experiment is run by JATOS, pass the resulting data to the server
  // in CSV form.
  if (environment === 'jatos') {
    jatos.submitResultData(resultData.json(), jatos.startNextComponent);
  }
  // In every other environment, print the data to the browser console in JSON
  // form. Here you can adjust what should happen to the data if the experiment
  // is served, e.g. by a common httpd server.
  else {
    console.log('End of experiment. Results:');
    console.log(resultData);
    resultData.localSave('json', 'data.json');
  }
}
