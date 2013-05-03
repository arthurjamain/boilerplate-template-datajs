define([
  'joshlib!utils/woodman',
  'joshlib!vendor/backbone'
], function (woodman, Backbone) {
  var logger = woodman.getLogger('Router');

  var Router = Backbone.Router.extend({
    initialize: function(opt) {
      logger.info('initialize');
      this.appController = opt.appController;
      Backbone.Router.prototype.initialize.call(this);
    },

    setRoutes: function() {
      /**
      * WARNING : This configuration may become unstable.
      * Backbone.Router seems to rely on the order in
      * which the routes are defined to define their priority.
      * But, the routes are stored in an Object using keys —
      * meaning there is no actual order inside the object.
      * This mechanism actually relies on the JS engine
      * executing backbone, which although at the time
      * poses no problems could eventually become one.
      **/
      this.route('*path'  , 'default' , this.defaultRoute);
      this.route('home'   , 'home'    , this.homeRoute);
      this.route('page/1' , 'page1'   , this.firstPageRoute);
      this.route('page/2' , 'page2'   , this.secondPageRoute);
    },

    defaultRoute: function() {
      logger.info('run default route');
      this.navigate('home', {
        trigger: true
      });
    },

    /**
    * Routes define state objects which are then pushed
    * into the state stack.
    * params : URL parameters
    * viewOptions: object that's passed as param when
    * target view will be created/recovered.
    **/
    homeRoute: function() {
      logger.info('run home route');

      var stateObj = {
        params: {
          page: 'home'
        },
        viewOptions: {
          itemTemplate: '<%=item.name%>'
        },
        depth: 0,
        title: 'Home Page !'
      };

      this.appController.setPageState(stateObj);
    },

    firstPageRoute: function() {
      logger.info('run page route 1');

      var stateObj = {
        params: {
          page: 'firstpage'
        },

        viewOptions: {
          itemTemplate: '<%=item.name%>'
        },

        depth: 1,
        title: 'First Page !'
      };

      this.appController.setPageState(stateObj);
    },

    secondPageRoute: function() {
      logger.info('run page route 2');

      var stateObj = {
        params: {
          page: 'secondpage'
        },

        viewOptions: {
          itemTemplate: '<%=item.name%>'
        },

        depth: 1,
        title: 'Second page !'
      };

      this.appController.setPageState(stateObj);
    }
  });

  return Router;
});