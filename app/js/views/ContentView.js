define([
  'joshlib!utils/woodman',
  'joshlib!vendor/underscore',
  'joshlib!ui/slidepanel',

  'views/ListView',
  'views/GridView'
], function(
  woodman,
  _,
  SlidePanel,

  ListView,
  GridView
) {
  var logger = woodman.getLogger('views.ContentView');

  return SlidePanel.extend({
    className: 'content',
    viewFactoryIncrementor: 0,
    gcThreshold: 10,

    initialize: function(options) {
      logger.info('initialize');
      this.appController = options.appController;
      this.on('statechange', _.bind(this.onStateChange, this));
      SlidePanel.prototype.initialize.call(this, options);
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
      this.render();
      this.showChild(theView.vId, state.get('transition'));
    },
    /**
    * Based on the class name passed as a param,
    * checks existing views for a matching, available one
    * or creates one if need be.
    **/
    getView: function(state) {
      if (state && state.get('viewOptions')) {
        logger.log('get view', state.get('viewOptions').type);
        var view = this.getExistingView(state.get('viewOptions')),
            now = Date.now();

        if (!view) {
          switch(state.get('viewOptions').type) {
            case 'home':
              view = this.createGridChildView(state.get('viewOptions'));
              break;
            case 'someotherpage':
              view = this.createListChildView(state.get('viewOptions'));
              break;
          }
        }

        view.lastUsedDate = now;
        this.collect();
        return view;
      }

      return null;
    },

    /**
    * Whenever called, checks the number of child views
    * in the content. If this number is above the
    * gcthreshold, delete the view which was last used
    * the longest time ago.
    **/
    collect: function() {
      if (_.size(this.children) > this.gcThreshold) {
        logger.log('collect oldest view');
        var oldest = null,
            oldestKey = null;
        _.each(this.children, function(el, key) {
          if (!oldest || el.lastUsedDate < oldest.lastUsedDate) {
            oldest = el;
            oldestKey = key;
          }
        });
        delete this.children[oldestKey];
        this.setChildren(this.children);
      }
    },

    /**
    * If the view we want to display already exists —
    * meaning a view exists of the same type which uses
    * the very same data — this function finds it and
    * returns it.
    **/
    getExistingView: function(viewOptions) {
      logger.log('get existing view', viewOptions.type);
      _.each(this.children, function(el) {
        if (viewOptions.type === el.type &&
            (viewOptions.model === el.model ||
            viewOptions.collection === el.collection)) {
          logger.log('existing view found');
          return el;
        }
      });
      logger.log('existing view not found');
      return null;
    },

    /**
    * View Factory Methods
    **/
    createGridChildView: function(opt) {
      logger.log('create grid view');
      var theView = new GridView(opt),
        children = this.children || {},
        vId = this.generateViewId();
      children[vId] = theView;
      theView.vId = vId;
      this.setChildren(children);
      return theView;
    },
    createListChildView: function(opt) {
      logger.log('create list view');
      var theView = new ListView(opt),
        children = this.children || {},
        vId = this.generateViewId();
      children[vId] = theView;
      theView.vId = vId;
      this.setChildren(children);
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
