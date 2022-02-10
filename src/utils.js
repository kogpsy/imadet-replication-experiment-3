/*
 * imadet-replication-experiment-3
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains some utilities.
 */

// Import required jsPsych plugins
import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';

// Import constants
import {
  FIXATION_CROSS_DURATION,
  STAIRCASE_ACCURACY_LOWER_BOUND,
  STAIRCASE_ACCURACY_TARGET,
  STAIRCASE_ACCURACY_UPPER_BOUND,
  STAIRCASE_TRIALS_PER_CYCLE,
} from './constants';

/**
 * Generates a random response mapping.
 *
 * @returns An object with the keys 'responses' and 'responsePrompt' which can
 * be used in jsPsych trials.
 */
export const getRandomResponseMapping = () => {
  // Declare variables
  let responses, responsePrompt;
  // Create a random boolean variable
  const randomBool = Math.random() < 0.5;
  // And map the response keys accordingly
  if (randomBool) {
    responses = ['F', 'J'];
    responsePrompt =
      'Ja [ ' + responses[0] + ' ] oder nein [ ' + responses[1] + ' ]';
  } else {
    responses = ['J', 'F'];
    responsePrompt =
      'Nein [ ' + responses[1] + ' ] oder ja [ ' + responses[0] + ' ]';
  }
  // Finally return the mapping wrapped into an object
  return {
    responses,
    responsePrompt,
  };
};

/**
 * Returns the fixation cross trial object
 *
 * @param {Object} jsPsychInstance The jsPsychInstance which should be used.
 * @returns {Object} A jsPsych trial object
 */
export const getFixationCross = (jsPsychInstance) => {
  return {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<div class="fixation_cross">+</div>',
    choices: 'NO_KEYS',
    trial_duration: FIXATION_CROSS_DURATION,
    data: { test_part: 'fixation_cross' },
  };
};

/**
 * Takes a jsPsych instance and the number of practice procedure repetitions to
 * calculate how accuratly the participant did respond.
 *
 * @param {Object} jsPsychInstance A jsPsych instance where the data is gathered
 * from
 * @param {number} practiceRepetitions Number of times the practice procedure
 * is repeated
 * @returns {Object} An object containing accuracy, number of correct responses
 * and the trial count
 */
export const calculatePracticeStats = (
  jsPsychInstance,
  practiceRepetitions
) => {
  // Get the most recent trials from the data object.
  // We take practiceRepetitions * 3 * 3 becauses during each practice procedure
  // 3 grating tasks are presented, and each of those consists of a fixation
  // cross, the animation itself and the response screen. We need all these
  // trials to filter out the ones containing the data we want.
  const trials = jsPsychInstance.data
    .get()
    .last(practiceRepetitions * 3 * 3)
    .filter({ test_part: 'practice_detection' });
  const correctResponses = trials.filter({ correct: true }).count();
  const accuracy = Math.round((correctResponses / trials.count()) * 100);

  // Return an object containing all the interesting data
  return {
    correctResponses,
    accuracy,
    trialCount: trials.count(),
  };
};

/**
 * Calculates participand response accuracy of the previous staircase cycle and
 * suggests a new grating visibility level.
 *
 * @param {Object} data The data object containing the relevant trials to
 * calculate the stats.
 * @param {number} previousGratingVisibility An integer variable containing the
 * previous gratingVisibility.
 * @returns {Object} An object containing the accuracy and the suggested new
 * grating visibility level.
 */
export const calculateStaircaseStats = (data, previousGratingVisibility) => {
  // Declare a variable for the newly calculated gratingVisibility
  let newGratingVisibility = previousGratingVisibility;

  // Get all trials of the previous cycle which contain relevant data
  const relevantTrials = data
    // Multiplied by 3 since for each response trial, there is also an
    // animation and a fixation cross trial
    .last(STAIRCASE_TRIALS_PER_CYCLE * 3)
    .filter({ test_part: 'staircase_test' });
  // Based on that data, calcualte the number of correct responses and the
  // accuracy.
  const correctResponses = relevantTrials.filter({ correct: true }).count();
  const accuracy = Math.round(
    (correctResponses / relevantTrials.count()) * 100
  );

  // If the measured accuracy differs to strongly from the target accuracy,
  // adjust the difficulty.
  if (accuracy > STAIRCASE_ACCURACY_UPPER_BOUND) {
    // Make it harder (less visible)
    newGratingVisibility =
      previousGratingVisibility -
      Math.round((accuracy - STAIRCASE_ACCURACY_TARGET) / 10);
  } else if (accuracy < STAIRCASE_ACCURACY_LOWER_BOUND) {
    // Make it easier (more visible)
    newGratingVisibility =
      previousGratingVisibility +
      Math.round((STAIRCASE_ACCURACY_TARGET - accuracy) / 10);
  }
  // Make sure we are not getting out of bounds
  if (newGratingVisibility > 50) {
    newGratingVisibility = 50;
  }

  return {
    newGratingVisibility,
    accuracy,
  };
};
