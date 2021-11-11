/*
 * imadet-replication-experiment-3
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains constant variables that control some aspects of the experiment.
 * Defaults are taken from the source code of the initial study by Dijkstra et al. (2021).
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
