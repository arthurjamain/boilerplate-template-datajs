define([
  'joshlib!utils/woodman',
  'joshlib!vendor/underscore',
  'joshlib!ui/list',
  'joshlib!ui/transitionpanel'
], function(
  woodman,
  _,
  List,
  TransitionPanel
) {
  var logger = woodman.getLogger('views.ContentView');

  return TransitionPanel.extend({
    className: 'content',
    viewFactoryIncrementor: 0,
    gcThreshold: 10,

    initialize: function(options) {
      logger.info('initialize');
      this.appController = options.appController;

      this.on('statechange', _.bind(this.onStateChange, this));

      TransitionPanel.prototype.initialize.call(this, options);
    },

    onStateChange: function(state) {
      logger.info('state change detected to', state.get('title'));
      var theView = this.getView(state);
      /**
      * WARNING / TODO : rendering here will definitely NOT be
      * the right thing to do. We actually need some sort
      * of partial rendering, allowing the contentview to
      * insert a newly added subview into the dom without
      * re-rendering the whole thing.
      **/
      if(_.values(this.children).indexOf(theView) === -1) {
        this.addChild(theView.vId, theView);
      }

      this.showChild(theView.vId, state.get('transition'));
    },
    /**
    * Based on the class name passed as a param,
    * checks existing views for a matching, available one
    * or creates one if need be.
    **/
    getView: function(state) {
      if (state && state.get('params')) {
        logger.log('get view', state.get('params'));

        var view = this.getExistingView(state),
            now = Date.now();

        if (!view) {
          var p = state.get('params'),
              vo = state.get('viewOptions') || {},
              vId = this.generateViewId(),
              vd = vo.data || {};

          _.extend(vo, {
            data: _.extend(vd, {
              params: p,
              depth: state.get('depth')
            }),
            appController: this.appController
          });

          /**
           * This block should actually create the
           * view given some arbitrary conditions
           * depending on the state params.
           * Implement your own view factories.
           * Some edge cases can be treated in the
           * factories. (which slightly different
           * kind of view do I want, etc.)
           */
          switch(state.get('params').page) {
          case 'home':
            view = this.createGridChildView(vo);
            break;
          default:
            view = this.createListChildView(vo);
            break;
          }
          /*
          * View should be OK now.
          */


          view.vId = vId;
        }
        // lastUsedDate is used in the collect() process.
        // It is refreshed every time getview selects
        // the view.
        view.lastUsedDate = now;
        this.collect();
        return view;
      }

      return null;
    },

    /**
    * Whenever called, checks the number of child views
    * in the content. If this number exceeds the
    * gcthreshold, delete the view which was last used
    * the longest time ago.
    **/
    collect: function() {
      if (this.children && _.size(this.children) > this.gcThreshold) {
        logger.log('collect oldest view');
        var oldest = null,
            oldestKey = null;

        _.each(this.children, function(el, key) {
          if (!oldest || el.lastUsedDate < oldest.lastUsedDate) {
            oldest = el;
            oldestKey = key;
          }
        });

        if(oldestKey) { this.removeChild(oldestKey); }
      }
    },

    /**
    * If the view we want to display already exists —
    * meaning a view exists of the same type which uses
    * the very same parameters — this function finds it and
    * returns it.
    * This mechanism on the params part of appstates
    * which reflect the parameters of the STATE, not
    * that of the view ; Although it should theorically
    * be the same thing.
    **/
    getExistingView: function(state) {
      logger.log('get existing view', state);
      var sp = state.get('params');

      for(var el in this.children) {
        if (_.isEqual(sp, this.children[el].data.params)) {
          return this.children[el];
        }
      }

      logger.log('existing view not found');
      return null;
    },

    /**
    * View Factory Methods
    **/
    createGridChildView: function(opt) {
      logger.log('create grid view');
      var theView = new List(opt);
      return theView;
    },
    createListChildView: function(opt) {
      logger.log('create list view');
      var theView = new List(opt);
      return theView;
    },

    /**
    * custom generated id to reference child views.
    **/
    generateViewId: function() {
      this.viewFactoryIncrementor++;
      return 'view' + this.viewFactoryIncrementor;
    }
  });
});
