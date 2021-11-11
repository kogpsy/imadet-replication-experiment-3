/*
 * imadet-replication-experiment-3
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains tools to generate image sequences.
 */

const IMAGE_LOCATION = '../media/images/';
const IMAGE_FILE_EXTENSION = '.png';

/**
 * Enum that defines the different types of image sequences that exist.
 * @readonly
 * @enum {(0|1|2)}
 */
export const ImageSequenceType = {
  Noise: 0,
  LeftTiltedGrating: 1,
  RightTiltedGrating: 2,
};

/**
 * Takes various parameters to generate a sequence of images which can then be
 * animated.
 *
 * @param {Object} jsPsychInstance The jsPsychInstance which should be used for
 * the randomization tasks.
 * @param {number} gratingVisibilityLevelStart Defines the visibility of the
 * grating when the animation starts (1 to 50).
 * @param {number} gratingVisibilityLevelEnd Defines the visibility of the
 * grating when the animation ends (1 to 50).
 * @param {number} sequenceLength Defines how many images the sequence should
 * contain. This should not exceed the number of images available.
 * @param {(0|1|2)} sequenceType Defines the type of image sequence. Use the
 * ImageSequenceType enum.
 *
 * @returns {Array} An array of filenames which are the frames of the animation
 */
export const generateImageSequence = (
  jsPsychInstance,
  gratingVisibilityLevelStart,
  gratingVisibilityLevelEnd,
  sequenceLength,
  sequenceType
) => {
  // Initialize the array to be constructed
  let imageSequence = [];

  // If a noise sequence was requested
  if (sequenceType === ImageSequenceType.Noise) {
    // Shuffle an array containing numbers from 1 to 20.
    const shuffeledNumberSequence = jsPsychInstance.randomization.shuffle([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
    // Now for each of these numbers, add a noise image to to imageSequence
    // array. This creates a random sequence.
    shuffeledNumberSequence.forEach((number) => {
      imageSequence.push(
        IMAGE_LOCATION + 'noise_' + number + IMAGE_FILE_EXTENSION
      );
    });
  }
  // Otherwise, assume a gratings sequence was requested
  else {
    // Since there might be a greater range of visibility requested than the
    // requested sequence length, it's necessary to calculate which images are
    // needed to provide a sequence from, let's say 1 to 42, with only 20
    // images.
    const step =
      (gratingVisibilityLevelEnd - gratingVisibilityLevelStart) /
      (sequenceLength - 1);
    for (let i = 0; i < sequenceLength; i++) {
      const gratingVisibilityLevel = Math.round(
        gratingVisibilityLevelStart + step * i
      );
      imageSequence.push(
        IMAGE_LOCATION +
          'stim_' +
          sequenceType +
          '_vis_' +
          gratingVisibilityLevel +
          IMAGE_FILE_EXTENSION
      );
    }
  }
  // Return the sequence
  return imageSequence;
};
