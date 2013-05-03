define([
  'joshlib!utils/woodman',
  'joshlib!ui/layout',
  'joshlib!ui/List'
], function(
  woodman,
  Layout,
  List
) {
  var logger = woodman.getLogger('views.SidebarView');

  return Layout.extend({
    className: 'sidebar',
    events: {
      'click .back': 'goBack'
    },

    initialize: function(options) {
      logger.info('initialize');
      this.appController = options.appController;
      options.template = '<a class="back">< Back</a> <%=children.menu%>',
      options.children = {
        menu: new List({
          collection: new Backbone.Collection([
            new Backbone.Model({title: 'Home'   , url: '#home'}),
            new Backbone.Model({title: 'Page 1' , url: '#page/1'}),
            new Backbone.Model({title: 'Page 2' , url: '#page/2'})
          ]),
          itemTemplate: '<a href="<%=item.url%>"><%=item.title%></a>'
        })
      };
      Layout.prototype.initialize.call(this, options);
    },

    goBack: function() {
      this.appController.restorePreviousAppState();
    }
  });
});
