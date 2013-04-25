define([
  'joshlib!utils/woodman',
  'joshlib!vendor/underscore',
  'joshlib!vendor/backbone',
  'joshlib!ui/layout',

  'views/TitlebarView',
  'views/SidebarView',
  'views/ContentView'
], function(
  woodman,
  _,
  Backbone,
  Layout,
  
  TitlebarView,
  SidebarView,
  ContentView
) {
  var logger = woodman.getLogger('views.AppLayoutView');

  return Layout.extend({

    initialize: function(options) {
      logger.info('initialize');
      options = options || {};
      /**
      * Create the children elements.
      * In this case, basically the whole interface.
      **/
      var titlebar = new TitlebarView({
        appController: options.appController,
        tagName: 'header'
      });
      var sidebar = new SidebarView({
        appController: options.appController
      });
      var content = new ContentView({
        appController: options.appController
      });

      options.children = {
        titlebar: titlebar,
        sidebar: sidebar,
        content: content
      };
      Layout.prototype.initialize.call(this, options);
      options.appController.on('statechange', _.bind(this.onStateChange, this));
    },
    onStateChange: function(state) {
      logger.info('state change detected to', state.get('title'));
      if(this.sidebarVisible) {
        return this.hideSidebar(_.bind(function() {
          this.propagate('statechange', state);
        }, this));
      }
      return this.propagate('statechange', state);
    },
    propagate: function(evt, state) {
      logger.log('propage state change to children');
      _.each(this.children, function(el) {
        el.trigger(evt, state);
      });
      return null;
    },
    showSidebar: function(cb) {
      logger.log('show sidebar');
      this.$el.addClass('sidebar-shown');
      this.sidebarVisible = true;
      setTimeout(function() {
        logger.log('sidebar shown');
        if (typeof cb === 'function') cb();
      }, 400);
    },
    hideSidebar: function(cb) {
      logger.log('hide sidebar');
      this.$el.removeClass('sidebar-shown');
      this.sidebarVisible = false;
      setTimeout(function() {
        logger.log('sidebar hidden');
        if (typeof cb === 'function') cb();
      }, 400);
    }

  });
});
