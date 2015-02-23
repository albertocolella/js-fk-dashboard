'use strict';
var Graph = require('./graph.marionette.js');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var _ = require('underscore');

var AppLayout = Backbone.Marionette.LayoutView.extend({
 // template: _.template('<div id="content">vvvvv</div>'),
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
  var graphs = new Graph.GraphCollection([
    { id: 1, background: "green" },
    { id: 2, background: "yellow" },
    { id: 3, background: "blue" }
  ]);
  //var graph = new Graph.Graph();
  var graphList = new Graph.GraphListView({
    collection: graphs
  });

  App.getRegion('mainRegion').show(layout);
  //App.mainRegion.show(layout);

  layout.getRegion('content').show(graphList);


  /*App.mainRegion.show(graphList);/**/
});

// App.start();
module.exports = App;
