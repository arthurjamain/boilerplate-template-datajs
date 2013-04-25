define([
  'joshlib!utils/woodman',
  'joshlib!ui/layout'
], function(
  woodman,
  Layout
) {
  var logger = woodman.getLogger('views.SidebarView');

  return Layout.extend({
    className: 'sidebar',
    initialize: function(options) {
      logger.info('initialize');
      Layout.prototype.initialize.call(this, options);
    }
  });
});
