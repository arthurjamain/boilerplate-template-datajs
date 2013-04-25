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
  
  var Controller = function () {
    logger.info('create');
    this.router = new Router({
      appController: this
    });
    this.layout = new AppLayoutView({
      appController: this,
      el: '#main'
    });
    logger.info('created');
  };

  _.extend(Controller.prototype, Backbone.Events, {
    
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
      this.setAppState(new AppState(opt));
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
      if(!state.get('transition')) {
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
    **/
    restorePreviousAppState: function() {
      logger.info('restore a previous app state');
      if(this.stateStack.previous.length) {
        var prev = this.stateStack.current,
            pile = this.stateStack.previous;

        /**
        * Loop on all the previous entries and delete them
        * until one is found for which the depth level is
        * actually different.
        **/
        for(var i = (pile.length-1); i >= 0; i--) {
          if(prev.depth < pile[i].depth) {
            break;
          }
          pile.pop();
        }
        var recoveredState = this.stateStack.previous.pop();
        recoveredState.set({
          'transition': this.getTransition(this.stateStack.current, recoveredState)
        });

        this.stateStack.current = recoveredState;
        this.stateStack.previous.push(prev);

        this.trigger('statechange', this.stateStack.current);
        
        return this.stateStack;
      }
      return null;
    },
    /**
    * Based on depth, determines how the outgoing
    * and incoming views are animated.
    **/
    getTransition: function(fromState, toState) {
      var transitionDescriptor;
      if(!fromState || typeof fromState.get('depth') === 'undefined') {
        return 'none';
      }

      logger.info('transition from', fromState.get('title'),
        'to', toState.get('title'));
      if(fromState.get('depth') > toState.get('depth')) {
        transitionDescriptor = 'left';
      }
      else if(fromState.get('depth') < toState.get('depth')) {
        transitionDescriptor = 'right';
      }
      else {
        transitionDescriptor = 'fade:inout';
      }

      logger.info('transition', transitionDescriptor);
      return transitionDescriptor;
    },

    /**
    * TODO later on.
    * In the event of a web user landing on a view with a depth
    * > 1, reconstitute a stack so that the back button actually does
    * something.
    **/
    fillDefaultStateStack: function() {

    }

  });

  return Controller;
});