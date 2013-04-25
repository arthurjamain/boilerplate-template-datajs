define([
  'joshlib!utils/woodman',
  'joshlib!ui/list'
], function(
  woodman,
  List
) {
  var logger = woodman.getLogger('views.GridView');

  return List.extend({
    initialize: function(options) {
      logger.info('initialize');
      options = options || {};
      this.type = options.type || 'Thing';
      List.prototype.initialize.call(this, options);
    }

  });
});
