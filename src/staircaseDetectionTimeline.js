/*
 * imadet-replication-experiment-3
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains the staircase timeline of the experiment.
 *
 * The staircase detection part consists of two blocks randomized in order. One
 * time left tilted gratings are presented, the other time right tilted gratings
 * are presented.
 *
 * The goal is to find the individual detection accuracy of a participant. To
 * do so, in each block, there are several sub-blocks (called cycles), within
 * which some gratings are presented with a certain visibility. After each
 * cycle, the accuracy is estimated, and, if above a certain threshold, the
 * difficulty is increased (i.e. the visibility of the gratings gets decreased).
 */

// Import plugins
import AnimationPlugin from '@jspsych/plugin-animation';
import CallFunctionPlugin from '@jspsych/plugin-call-function';
import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
// Import constants
import {
  ANIMATION_DURATION,
  ANIMATION_FRAMES,
  GRATING_VISIBILITY_LEVEL_INIT,
  STAIRCASE_ACCURACY_LOWER_BOUND,
  STAIRCASE_ACCURACY_TARGET,
  STAIRCASE_ACCURACY_UPPER_BOUND,
  STAIRCASE_CYCLES,
  STAIRCASE_TRIALS_PER_CYCLE,
} from './constants';
// Import image sequence utils
import { generateImageSequence, ImageSequenceType } from './imageSequence';
import { calculateStaircaseStats } from './utils';

/**
 * Builds the timeline for the detection staircase part of the experiment.
 *
 * @param {Object} jsPsychInstance The jsPsych instance to be used
 * @param {Object} responseMapping An object containing the response mapping for
 * the current experimental session
 * @param {Object} fixationCross A jsPsych trial which briefly shows a fixation
 * cross
 * @param {Object} participantGratingVisibility A "shared" object which holds
 * the grating visibility levels of the current participant. Contains a setter
 * which is used here.
 * @returns {Object} A jsPsych nested timeline
 */
export const getStaircaseDetectionTimeline = (
  jsPsychInstance,
  responseMapping,
  fixationCross,
  participantGratingVisibility
) => {
  // Declare and initiate a timeline array
  let timeline = [];
  // Define some "global" variables
  let gratingVisibility = GRATING_VISIBILITY_LEVEL_INIT;
  let cyclesCarriedOut = 0;

  // Define the main instruction for the staircase timeline
  const staircaseMainInstruction = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <p> Nun werden zwei Kalibrierungsblöcke durchgeführt. </p>
      <p>
        Bei 75% der Durchgänge wird ein Gitter im Rauschen erscheinen. Mit der
        Zeit wird es immer schwerer das Gitter zu sehen. Machen Sie sich keine
        Sorgen, wenn Sie unsicher sind, ob Sie etwas gesehen haben oder nicht.
        Versuchen Sie einfach ihr Bestes bei jedem Versuch.
      </p>
      <p> Jeder Klaibrierungsblock dauert etwa 5 Minuten. </p>
      <div class="vertical_spacer"></div>
      <p> Drücken Sie die [ Leertaste ] um fortzufahren. </p>`,
    choices: [' '],
  };
  timeline.push(staircaseMainInstruction);

  // Define the instruction for each of the two blocks
  const staircaseBlockInstruction = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () => {
      // Construct instruction string based on timeline variable
      const gratingTiltString =
        jsPsychInstance.timelineVariable('imageSequenceType') ===
        ImageSequenceType.LeftTiltedGrating
          ? 'links'
          : 'rechts';
      return `
        <p>
          Während dieses Blocks werden Sie nach ${gratingTiltString} geneigte
          Gittermuster sehen.
        </p> 
        <p>
          Drücken Sie die [ Leertaste ] um fortzufahren
        </p>`;
    },
    choices: [' '],
  };

  // Defines a dynamic trial object, which can be either a left or right tilted
  // grating, or a noise only animation. This is used further down in the code.
  const dynamicAnimationTrial = {
    type: AnimationPlugin,
    stimuli: () => {
      // Based on timeline variable 'noiseOnly', display either noise or grating
      const noiseOnly = jsPsychInstance.timelineVariable('noiseOnly');
      if (noiseOnly) {
        const imageSequence = generateImageSequence(
          jsPsychInstance,
          1,
          1,
          ANIMATION_FRAMES,
          ImageSequenceType.Noise
        );
        return imageSequence;
      } else {
        // If a grating was requested, figure out which tilt based on timeline
        // varialbe 'imageSequenceType
        const imageSequenceType =
          jsPsychInstance.timelineVariable('imageSequenceType');
        const imageSequence = generateImageSequence(
          jsPsychInstance,
          1,
          gratingVisibility,
          ANIMATION_FRAMES,
          imageSequenceType
        );
        return imageSequence;
      }
    },
    choices: 'NO_KEYS',
    frame_time: Math.round(ANIMATION_DURATION / ANIMATION_FRAMES),
  };

  // Define the response screen trial, which will be shown after each animation
  // trial, to capture the response and store the data accordingly.
  const animationTrialResponseScreen = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<p>War ein Gittermuster in der Animation zu sehen?</p>',
    choices: responseMapping.responses,
    prompt: responseMapping.responsePrompt,
    // Modify the stored data
    on_finish: (data) => {
      // Figure out which response would be correct during this specific trial
      const wasNoise = jsPsychInstance.timelineVariable('noiseOnly');
      const correctResponse = wasNoise
        ? responseMapping.responses[1]
        : responseMapping.responses[0];
      // Compare correct to actual response and store
      data.correct = jsPsychInstance.pluginAPI.compareKeys(
        data.response,
        correctResponse
      );
      // Add a test_part label to the data object to be able to identify trials
      // later on.
      data.test_part = 'staircase_test';
    },
  };

  // Define one cycle
  // The grating animation trial are carried out once with noiseOnly set to
  // true, meaning there will be no grating appearing in the noise, and once
  // with noiseOnly set to false. This is repeated as specified in the
  // './constants.js' file, and randomized.
  const staircaseCycle = {
    timeline: [
      fixationCross,
      dynamicAnimationTrial,
      animationTrialResponseScreen,
    ],
    timeline_variables: [
      {
        noiseOnly: true,
      },
      {
        noiseOnly: false,
      },
    ],
    sample: {
      type: 'fixed-repetitions',
      // We divide by two beacuse per repetition two trials are carried out
      // (one for each set of timeline variables)
      size: STAIRCASE_TRIALS_PER_CYCLE / 2,
    },
  };

  const logCycleData = {
    type: CallFunctionPlugin,
    func: () => {
      // Do nothing.
    },
    data: () => {
      const { newGratingVisibility, accuracy } = calculateStaircaseStats(
        jsPsychInstance.data.get(),
        gratingVisibility
      );
      return {
        test_part: 'staircase_cycle_data_log',
        accuracy,
        newGratingVisibility,
      };
    },
  };

  // Loop the staircaseCycle as many times as defined in './constants.js'. If
  // the desired numbers of runs is reached, store the final data.
  const staircaseCycleLoop = {
    timeline: [staircaseCycle, logCycleData],
    loop_function: (data) => {
      // Increase cycle count
      cyclesCarriedOut++;
      // Check if another cycle should be carried out
      if (cyclesCarriedOut >= STAIRCASE_CYCLES) {
        // If the finished cycle presented left tilted gratings
        if (
          jsPsychInstance.timelineVariable('imageSequenceType') ===
          ImageSequenceType.LeftTiltedGrating
        ) {
          // Store the according visibility level in a data property
          jsPsychInstance.data.addProperties({
            participantGratingVisibilityLevelLeft: gratingVisibility,
          });
          // Also store it in the RAM (participantGratingVisibility object)
          participantGratingVisibility.setLeft(gratingVisibility);
        } else {
          // If, however, right tilted gratings were presented, also store, but
          // in different property, of course.
          jsPsychInstance.data.addProperties({
            participantGratingVisibilityLevelRight: gratingVisibility,
          });
          // Also store it in the RAM (participantGratingVisibility object)
          participantGratingVisibility.setRight(gratingVisibility);
        }
        // Reset gratingVisibility and the cycles count and stop this block
        cyclesCarriedOut = 0;
        gratingVisibility = GRATING_VISIBILITY_LEVEL_INIT;
        return false;
      }

      // Calculate accuracy and adjusted grating visibility level
      const { newGratingVisibility } = calculateStaircaseStats(
        data,
        gratingVisibility
      );
      // And set it accordingly
      gratingVisibility = newGratingVisibility;

      // Then continue the loop
      return true;
    },
  };

  // Here the cycle loop is carried out two times with different grating tilt.
  const staircaseBlockProcedure = {
    timeline: [staircaseBlockInstruction, staircaseCycleLoop],
    // Define the two tilts as timeline variables which chan then be accessed
    // by each block and cycle
    timeline_variables: [
      {
        imageSequenceType: ImageSequenceType.LeftTiltedGrating,
      },
      {
        imageSequenceType: ImageSequenceType.RightTiltedGrating,
      },
    ],
    // Randomize which tilt comes first
    randomize_order: true,
  };
  timeline.push(staircaseBlockProcedure);

  // Return a jsPsych nested timeline object
  return {
    timeline,
  };
};
