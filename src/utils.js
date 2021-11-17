/*
 * imadet-replication-experiment-3
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains some utilities.
 */

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
    responses = ['F', 'J']; /* yes - no*/
    responsePrompt = 'Yes [' + responses[0] + '] or no [' + responses[1] + ']';
  } else {
    responses = ['J', 'F'];
    responsePrompt = 'No [' + responses[1] + '] or yes [' + responses[0] + ']';
  }
  // Finally return the mapping wrapped into an object
  return {
    responses,
    responsePrompt,
  };
};
