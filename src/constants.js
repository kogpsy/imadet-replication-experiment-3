/*
 * imadet-replication-experiment-3
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains constant variables that control some aspects of the experiment.
 * Defaults are taken from the source code of the initial study by Dijkstra et al. (2021).
 */

/**
 *
 * General settings
 *
 */

// Define whether the VVIQ and LSHS questionnaires are shown to paticipants
// Default: false
export const SHOW_QUESTIONNAIRES = false;

// Define how many frames the animations should have
// Default: 20
export const ANIMATION_FRAMES = 20;

// Define how long the animation should take (in milliseconds)
// Default: 2000
export const ANIMATION_DURATION = 2000;

// Define how long the fixation cross should be displayed (in milliseconds)
// Default: 200
export const FIXATION_CROSS_DURATION = 200;

// Define the start level of the visibility of the gratings (from 1 to 50)
// Default: 46
export const GRATING_VISIBILITY_LEVEL_INIT = 46;

/**
 *
 * Settings regarding the detection practice task
 *
 */

// Define how many times the practice trial procedure should be carried out. A
// single procedure contains 3 grating animations.
// Default: 2
export const PRACTICE_DETECTION_REPETITIONS = 2;

/**
 *
 * Settings regarding the staircase detection calibration task
 *
 */

// The desired accuracy to staircase to. For each participant we want to figure
// out the grating visibility level at which they detect 70% correctly.
// Default: 70
export const STAIRCASE_ACCURACY_TARGET = 70;

// If after a cycle the accuracy is higher than this value,  we increase the
// difficulty.
// Default: 75
export const STAIRCASE_ACCURACY_UPPER_BOUND = 75;

// If after a cycle the accuracy is lower than this value,  we decrease the
// difficulty.
// Default: 65
export const STAIRCASE_ACCURACY_LOWER_BOUND = 65;

// Controls how many grating animations are shown per accuracy estimation cycle.
// This must be an even number, so that in exactly 50% of the trials a grating
// vs. a noise animation can be shown.
// Default: 10
export const STAIRCASE_TRIALS_PER_CYCLE = 10;

// Controls how many accuracy estimation cycles are carried out.
// Default: 12
export const STAIRCASE_CYCLES = 12;

/**
 *
 * Settings regarding the imagination practice task
 *
 */

// Controls how many noise animations are shown per grating tilt.
// Default: 10
export const PRACTICE_IMAGINATION_TRIALS_PER_TILT = 10;

/**
 *
 * Settings regarding the main part of the experiment
 *
 */

// Controls how many times all the conditions are repeated. There are six
// conditions (left tilted gratings without imagination, left tilted gratings
// with imagination of left tilted gratings, left tilted gratings with
// imagination of right tilted gratings, and the same for right tilted
// gratings).
// Default: 2
export const MAIN_EXPERIMENT_CONDITION_REPETITIONS = 2;

// Controls how many animations are shown in each of the above mentioned
// conditions. This must be an even number, so that in exactly 50% of the trials
// a grating vs. a noise animation can be shown.
// Default: 24
export const MAIN_EXPERIMENT_TRIALS_PER_CONDITION = 24;
