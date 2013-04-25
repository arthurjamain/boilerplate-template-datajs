define([
  'joshlib!utils/woodman',
  'joshlib!vendor/underscore',
  'joshlib!ui/layout'
], function(
  woodman,
  _,
  Layout
) {
  var logger = woodman.getLogger('views.TitlebarView');

  return Layout.extend({
    className: 'titlebar',

    initialize: function(options) {
      logger.info('initialize');
      this.appController = options.appController;
      this.on('statechange', _.bind(this.onStateChange, this));
      Layout.prototype.initialize.call(this, options);
    },

    onStateChange: function(state) {
      logger.info('state change detected to', state.get('title'));
      this.el.innerHTML = state.get('title');
    }

  });
});
