/*
 * imadet-replication-experiment-3
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains the detection practice trials of the experiment.
 */

import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
import AnimationPlugin from '@jspsych/plugin-animation';

import {
  ANIMATION_DURATION,
  ANIMATION_FRAMES,
  GRATING_VISIBILITY_LEVEL_INIT,
  PRACTICE_DETECTION_REPETITIONS,
} from './constants';
import { generateImageSequence, ImageSequenceType } from './imageSequence';

import { calculatePracticeStats } from './utils';

/**
 * Builds the timeline for the detection practice part of the experiment.
 *
 * @param {Object} jsPsychInstance The jsPsych instance to be used
 * @param {Object} responseMapping An object containing the response mapping for
 * the current experimental session
 * @param {Object} fixationCross A jsPsych trial which briefly shows a fixation
 * cross
 * @returns {Object} A jsPsych nested timeline
 */
export const getPraciceDetectionTimeline = (
  jsPsychInstance,
  responseMapping,
  fixationCross
) => {
  // Declare the sub-timeline array
  let timeline = [];
  // Set the visibility level of the gratings to the specified init level
  let gratingVisibility = GRATING_VISIBILITY_LEVEL_INIT;

  // Define the instruction trial
  const practiceInstruction = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <p> Wir starten nun mit einigen Übungsdurchgängen. </p>
      <p>
        Es erscheinen nach links und rechts geneigte Gittermuster im Rauschen.
        Wenn Sie nach der Animation ein Gittermuster gesehen haben, drücken Sie
        die <strong>Taste [ ${responseMapping.responses[0]} ]</strong>. Wenn Sie
        nach der Animation kein Gittermuster gesehen haben, drücken Sie die
        <strong>Taste [ ${responseMapping.responses[1]} ]</strong>.
      </p>
      <div class="vertical_spacer"></div>
      <p> Drücken Sie die [Leertaste] um die Übungsdurchgänge zu beginnen. </p>`,
    choices: [' '],
  };
  timeline.push(practiceInstruction);

  // Define the animation screen. Stimuli are taken from the "timeline
  // variables" of jsPsych.
  const animationScreen = {
    type: AnimationPlugin,
    stimuli: jsPsychInstance.timelineVariable('stimulus'),
    choices: 'NO_KEYS',
    frame_time: Math.round(ANIMATION_DURATION / ANIMATION_FRAMES),
  };

  // Define the response screen with logic to assess whether the response was
  // correct.
  const responseScreen = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<p>War ein Gittermuster in der Animation zu sehen?</p>',
    choices: responseMapping.responses,
    prompt: responseMapping.responsePrompt,
    // Additionally store to this this trial the correct response and a note
    // about it being a practice trial.
    data: jsPsychInstance.timelineVariable('data'),
    on_finish: function (data) {
      // When the trial is finished, add an addtitional key to the data object
      // which tells whether the response was correct.
      data.correct = jsPsychInstance.pluginAPI.compareKeys(
        data.correct_response,
        data.response
      );
    },
  };

  // Combine the above two into a trial procedure, so that multiple animations
  // and response screens are shown with random stimuli.
  const practiceProcedure = {
    timeline: [fixationCross, animationScreen, responseScreen],
    // Here the stimuli are added to the timeline variables. An array of images
    // is constructed for left and right tilted gratings as well as for a noise
    // animation.
    // For each stimulus, another timeline variable called data is created which
    // contains the correct response and note about it being a practice trial.
    timeline_variables: [
      {
        stimulus: generateImageSequence(
          jsPsychInstance,
          1,
          gratingVisibility,
          ANIMATION_FRAMES,
          ImageSequenceType.LeftTiltedGrating
        ),
        data: {
          test_part: 'practice_detection',
          correct_response: responseMapping.responses[0],
        },
      },
      {
        stimulus: generateImageSequence(
          jsPsychInstance,
          1,
          gratingVisibility,
          ANIMATION_FRAMES,
          ImageSequenceType.RightTiltedGrating
        ),
        data: {
          test_part: 'practice_detection',
          correct_response: responseMapping.responses[0],
        },
      },
      {
        stimulus: generateImageSequence(
          jsPsychInstance,
          1,
          gratingVisibility,
          ANIMATION_FRAMES,
          ImageSequenceType.Noise
        ),
        data: {
          test_part: 'practice_detection',
          correct_response: responseMapping.responses[1],
        },
      },
    ],
    // Repeat the practice procedure according to the ./constants.js file
    sample: {
      type: 'fixed-repetitions',
      size: PRACTICE_DETECTION_REPETITIONS,
    },
  };

  // Give the participant feedback about his/her performance
  const practiceFeedbackScreen = {
    type: HtmlKeyboardResponsePlugin,
    choices: [' '],
    stimulus: function () {
      // Calcualte accuracy
      const stats = calculatePracticeStats(
        jsPsychInstance,
        PRACTICE_DETECTION_REPETITIONS
      );
      // And give feedback accordingly
      if (stats.accuracy > 74) {
        return `
          <p>
           Ausgezeichnet, Sie haben ${stats.correctResponses} von
           ${stats.trialCount} Durchgängen richtig beantwortet.
          </p>
          <p>Drücken Sie die [Leertaste], um fortzufahren.</p>
          `;
      } else {
        return `
          <p>
            Sie haben ${stats.correctResponses} von ${stats.trialCount}
            Durchgängen richtig beantwortet. Es werden nun weitere
            Übungsdurchgänge folgen.
          </p>
          <p>Drücken Sie die [Leertaste], um fortzufahren.</p>
          `;
      }
    },
  };

  // Loop the practice procedure and the feedback screen until an accuracy of
  // at least 75% is reached. For each failed run, decrease difficulty.
  const practiceMainLoop = {
    timeline: [practiceProcedure, practiceFeedbackScreen],
    loop_function: function (data) {
      // Calculate accuracy
      const stats = calculatePracticeStats(
        jsPsychInstance,
        PRACTICE_DETECTION_REPETITIONS
      );
      // Stop the loop if a high enough accuracy is reached.
      if (stats.accuracy > 74) {
        return false;
      } else {
        // If it isn't reached, decrease difficulty by making the grating more
        // visible.
        gratingVisibility++;
        return true;
      }
    },
  };

  // Push this main loop to the timeline
  timeline.push(practiceMainLoop);

  // Return a jsPsych nested timeline object
  return {
    timeline,
  };
};
