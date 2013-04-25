/**
 * @fileOverview Dev configuration for Woodman
 *
 * This configuration is only used in the development version of the
 * application. In particular, the configuration is not used when the
 * application is built with Grunt.
 *
 * The configuration is exposed in a global "woodmanConfig" object and is
 * picked up by the main.js script. While the settings of this configuration
 * are likely to evolve over time, note this file is shared among developers
 * that work on the app and should not be modified for personal purpose so as
 * not to propagate these changes. To setup a local configuration file for
 * Woodman, create a local HTML entry point that does not import this file and
 * expose your own "woodmanConfig" object.
 *
 * In other words, create:
 *  app/index.local.html
 * ... that includes something such as:
 *  <script type="text/javascript">
 *    var woodmanConfig = { ... };
 *  </script>
 */

var woodmanConfig = {
  appenders: [
    {
      type: 'console',
      name: 'console',
      layout: {
        type: 'pattern',
        pattern: '%-5.5p [%c] %m%n'
      }
    }
  ],
  loggers: [
    {
      level: 'all',
      appenders: [
        'console'
      ]
    }
  ]
};