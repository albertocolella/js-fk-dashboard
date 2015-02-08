'use strict';
var Graph = require('./graph.marionette.js');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');


var App = new Backbone.Marionette.Application();

App.addRegions({
  mainRegion: '#content'
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

  App.mainRegion.show(graphList);/**/
});

// App.start();
module.exports = App;
