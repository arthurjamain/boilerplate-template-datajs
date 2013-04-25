define([
  'joshlib!utils/woodman',
  'joshlib!ui/item',
  'text!templates/loginTemplate.ejs'
], function(
  woodman,
  Item,
  Template
) {
  var logger = woodman.getLogger('views.LoginView');

  return Item.extend({

    className: 'login',
    
    events: {
      'click': 'close'
    },

    initialize: function(options) {
      logger.log('initialize LoginView');
      options.template = Template;
      Item.prototype.initialize.call(this, options);
    },

    close: function(e) {
      // if(e.target.className.indexOf('frame') < 0)
        // this.hide();
    }

  });
});
