/**
 * @title Gratings Replication Experiment 1
 * @description In diesem Experiment geht es um ... (anpassen in experiment.js).
 * @version 0.1.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 * @audioDir audio
 * @videoDir video
 * @miscDir misc
 */

// You can import stylesheets (.scss or .css).
import '../styles/main.scss';

import { initJsPsych } from 'jspsych';

import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
import PreloadPlugin from '@jspsych/plugin-preload';

// TODO: These are linked via yarn link, and hence not defined in package.json
import { itemsGerman as vviqItemsGerman } from 'jspsych-vviq';
import { itemsGerman as lshsItemsGerman } from 'jspsych-lshs';

// Import constants
import { SHOW_QUESTIONNAIRES } from './constants';

// Import tools to create image sequences
import { ImageSequenceType } from './imageSequence';
import { generateImageSequence } from './imageSequence';

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  const jsPsych = initJsPsych();

  const timeline = [];

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
    misc: assetPaths.misc,
  });

  // Welcome screen
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus:
      '<p>Willkommen zum Experiment! Drücken Sie eine beliebige Taste, um zu starten.<p/>',
  });

  // Add questionnaire items to timeline, if defined so in ./constants.js
  if (SHOW_QUESTIONNAIRES) {
    // VVIQ
    timeline.push(vviqItemsGerman.instruction);
    timeline.push(vviqItemsGerman.itemBlock1);
    timeline.push(vviqItemsGerman.itemBlock2);
    timeline.push(vviqItemsGerman.itemBlock3);
    timeline.push(vviqItemsGerman.itemBlock4);
    // LSHS
    timeline.push(lshsItemsGerman.instruction);
    timeline.push(lshsItemsGerman.itemBlock1);
    timeline.push(lshsItemsGerman.itemBlock2);
  }

  // Test image sequence generation function
  const s = generateImageSequence(
    jsPsych,
    1,
    35,
    20,
    ImageSequenceType.LeftTiltedGrating
  );
  console.log(s);

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
