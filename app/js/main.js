/**
 * @fileOverview Main entry point for the application.
 *
 * The require.js config makes it possible to use specific versions of a view
 * for a specific HTML entry point of the application without having to update
 * the code of the controller. The framework now correctly picks up this
 * configuration.
 *
 * An example:
 * requirejs.config({
 *   paths: {
 *     'views/GridView': 'views/GridView.tablet',
 *     'base': '.',
 *     'text': 'lib/text'
 *   }
 * });
 *
 * The "text" path must always be set.
 */
/*global requirejs, woodmanConfig*/

requirejs.config({
  paths: {
    'text': 'lib/text'
  }
});

requirejs([
  'Controller',
  'joshlib!utils/woodman',
  'joshlib!utils/onready'
], function (Controller, woodman, onReady) {
  // If defined, Woodman's configuration is in a global "woodmanConfig" object.
  // Note the configuration is typically not defined in the production version
  // of the application.
  var config = {};
  if (typeof woodmanConfig !== 'undefined') {
    config = woodmanConfig;
  }

  // Initialize Woodman and start the application once done
  woodman.load(config, function () {
    var logger = woodman.getLogger('main');
    logger.log('woodman initialized');

    onReady(function () {
      logger.info('application started');
      // Debug only
      // Debug only
      window.app = new Controller();
      logger.log(window.app);
      window.app.start();
      // Debug only
      // Debug only
    });
  });
});
