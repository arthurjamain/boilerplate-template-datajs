define([
  'joshlib!utils/woodman',
  'joshlib!vendor/underscore',
  'joshlib!vendor/backbone',
  'views/AppLayoutView',
  'models/AppState',
  'errors/ParamError',
  'Router'
], function (woodman, _, Backbone, AppLayoutView, AppState,
  ParamError, Router) {
  // Retrieve the module's logger
  var logger = woodman.getLogger('Controller');


  /**
  * Constructor of the App. Should be as clean as possible.
  **/
  var Controller = function () {
    logger.info('create');

    this.router = new Router({
      appController: this
    });
    /**
    * Here, the layout privately creates its own
    * child views/templates.
    **/
    this.layout = new AppLayoutView({
      appController: this,
      el: '#main'
    });

    logger.info('created');
  };

  /**
  * Extend Backbone.Events as well so we can bind the controller
  * to events and let it trigger stuff (such as statechange evts)
  **/
  _.extend(Controller.prototype, Backbone.Events, {

    /**
    * Holds the stack of states the app has gone through.
    * Plus a reference to the current one (which is put aside
    * for potential conveniency issues)
    **/
    stateStack: {
      previous: [],
      current: null
    },

    /**
    * Safe main
    **/
    start: function() {
      logger.info('start');
      this.layout.render();
      this.router.setRoutes();
      Backbone.history.start();
    },

    /**
    * Create the app state, forward it to the state pusher.
    * Although not very useful at the time, this extra layer
    * of logic may come handy later on.
    **/
    setPageState: function(opt) {
      logger.info('set page state');
      opt.stateUri = document.location.hash;
      var state = new AppState(opt);
      /**
       * For the sake of simplicity, the controller
       * fills the states' data. It would likely be
       * better to delegate this to some sort of
       * data processing object
       */
      this.setStateData(state);
      this.setAppState(state);
    },

    /**
    * Fills the state with the corresponding data
    * depending on the states' params.
    * Pretty much the same thing contentview.getview()
    * does but with data instead of views.
    **/
    setStateData: function (state) {

      var sp = state.get('params'),
          collection,
          model;
      /**
      * This sample comparison is pretty basic. Once again,
      * this may be more suited to a datastore or something
      * of the same kind.
      **/
      if(sp.page === 'home') {
        collection = new Backbone.Collection([
          new Backbone.Model({name: 'An item !'}),
          new Backbone.Model({name: 'Another item !'})
        ]);
      } else if (sp.page === 'firstpage') {
        collection = new Backbone.Collection([
          new Backbone.Model({name: '6 * 9 = 42'}),
          new Backbone.Model({name: 'Watermelons Rock'})
        ]);
      } else if (sp.page === 'secondpage') {
        collection = new Backbone.Collection([
          new Backbone.Model({name: 'The cake is a (sweet) lie'}),
          new Backbone.Model({name: 'Who watches the Watchmen ?'})
        ]);
      }

      /**
      * Doesn't matter if they're undefined.
      **/
      state.get('viewOptions').collection = collection;
      state.get('viewOptions').model = model;

    },
    /**
    * Sets the passed state as the current one.
    * Views are expected to listen to the statechanged event.
    * The state itself is passed as data of the evt
    * and contains most of the necessary informations
    * for any view to be updated as expected.
    **/
    setAppState: function(state) {
      logger.info('set app state', state.get('title'));

      if (this.stateStack.current) {
        this.stateStack.previous.push(this.stateStack.current);
      }
      if (!state.get('transition')) {
        state.set({
          'transition': this.getTransition(this.stateStack.current, state)
        });
      }

      this.stateStack.current = state;
      this.trigger('statechange', this.stateStack.current);
    },
    /**
    * Restores a previous state of the app of which the
    * depth level is inferior to that of the current
    * one. Triggers a statechanged event.
    * In its current form, this function is incomplete.
    * It lacks details provided by the context in which
    * the app is developed.
    **/
    restorePreviousAppState: function() {
      logger.info('restore a previous app state');
      var recoveredState;

      if (this.stateStack.previous.length) {
        var prev = this.stateStack.current,
            pile = this.stateStack.previous;

        /**
        * Loop on all the previous entries and delete them
        * until one is found for which the depth level is
        * actually different.
        **/
        for(var i = (pile.length-1); i >= 0; i--) {
          if(prev.get('depth') > pile[i].get('depth')) {
            break;
          }
          pile.pop();
        }

        recoveredState = this.stateStack.previous.pop();
        recoveredState.set({
          'transition': this.getTransition(this.stateStack.current, recoveredState)
        });

        this.stateStack.current = recoveredState;
        this.trigger('statechange', this.stateStack.current);
        this.router.navigate(this.stateStack.current.get('stateUri'), {
          trigger: false,
          replace: true
        });
        return this.stateStack;
      }
      return null;
    },

    /**
    * Based on depth, determines how the outgoing
    * and incoming views are animated. Outputs a string
    * animation descriptor. It is expected by a Transitionpanel
    **/
    getTransition: function(fromState, toState) {
      var transitionDescriptor;
      if(!fromState || typeof fromState.get('depth') === 'undefined') {
        return 'none';
      }

      logger.info('transition from', fromState.get('title'),
        'to', toState.get('title'));
      if(fromState.get('depth') > toState.get('depth')) {
        transitionDescriptor = 'slide:left';
      }
      else if(fromState.get('depth') < toState.get('depth')) {
        transitionDescriptor = 'slide:right';
      }
      else {
        transitionDescriptor = 'fade:cross';
      }

      logger.info('get transition :', transitionDescriptor);
      return transitionDescriptor;
    }

  });

  return Controller;
});