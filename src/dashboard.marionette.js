'use strict';
var Graph = require('./graph.marionette.js');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var _ = require('underscore');

var AppLayout = Backbone.Marionette.LayoutView.extend({
  template: '#layout-view-template',
  onShow: function(){
    // console.log('LayoutView onshow');
  },
  onDomRefresh: function(){
    // console.log('LayoutView onDomRefresh');
  },
  onBeforeRender: function () {
    // console.log('LayoutView onbeforerender');
  },
  onRender: function () {
    // console.log('LayoutView onrender');      
  },
  regions: {
    content: "#content"
  }
});

var layout = new AppLayout();

var App = new Backbone.Marionette.Application();

App.addRegions({
  mainRegion: '#wrapper'
});

App.on("start", function(){
  var graphs = new Graph.GraphCollection(null, {user_id:1});
  var deferred = $.Deferred();
  $.when(
    graphs.fetch({
      dataType: "json",
      success: function(data) {
        return deferred.resolve();
      },
      error: function(collection, response, options) {
        console.log('error', collection);
        console.log('error', response);
        console.log('error', options);
        return deferred.fail();
      }
    })
  ).then(function(){
    var graphList = new Graph.GraphListView({
      collection: graphs
    });
    App.getRegion('mainRegion').show(layout);
    layout.getRegion('content').show(graphList);
  });

});

module.exports = App;
