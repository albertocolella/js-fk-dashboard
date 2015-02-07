var App = new Backbone.Marionette.Application();

App.addRegions({
  mainRegion: '#content'
});

App.on("start", function(){
  var graphs = new GraphCollection([
    { id: 1, background: "green" },
    { id: 2, background: "yellow" },
    { id: 3, background: "blue" }
  ]);
  var graph = new Graph();
  var graphList = new GraphListView({
    collection: graphs
  });

  App.mainRegion.show(graphList);
});

App.start();

