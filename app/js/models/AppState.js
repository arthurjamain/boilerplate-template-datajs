define([
  'joshlib!vendor/backbone'
], function(
  Backbone
) {
  return Backbone.Model.extend({
    defaults: {
      title: 'Default Title'
    }
  });
});