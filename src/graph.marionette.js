'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var Chart = require('chart.js');

var _ = require('underscore');
var Graph = {};

Graph.Graph = Backbone.Model.extend({
  defaults: {
    id: 0,    
    background: 'red'
  },
  getData: function (){
    var value_a = (Math.random() * 100) + 1;
    var value_b = (Math.random() * value_a) + 1;
    var value_c = 100 - value_a - value_b;
    return [
      {
          value: value_a,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Red"
      },
      {
          value: value_b,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Green"
      },
      {
          value: value_c,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: "Yellow"
      }
    ];
  },
  showup: function(){
    var data = this.getData();
    var ctx = $("#graph"+this.id).get(0).getContext("2d");
    $("#graph"+this.id).show();
    return new Chart(ctx).Doughnut(data, {});
  }
});

Graph.GraphCollection = Backbone.Collection.extend({
  model: Graph.Graph,
  current: 0,
  //localStorage: new Backbone.LocalStorage('graphs-backbone'),
  currentGraph: function() {
    if ( !this.length || this.current >= this.length ) {
      this.current = 0;
    }
    var res = this.at(this.current);
    return res;
  },
  nextGraph: function() {
    if ( !this.length || this.current >= this.length ) {
      this.current = 0;
    }
    var res = this.at(this.current);
    this.current++;
    return res;
  }
});

Graph.GraphItemView = Marionette.ItemView.extend({
    tagname: "div",
    template: _.template('<canvas id="graph<%-id%>" class="graph" style="display:none;" width="400" height="400"></canvas>'),
    //template: _.template('<div style="background-color: <%-background%>;">Graph <%-id%></div>'),
    model: Graph.Graph,
    onShow: function(){
      // console.log('ItemView onshow');
    },
    onDomRefresh: function(){
      // console.log('ItemView onDomRefresh');
    },
    onBeforeRender: function () {
      // console.log('ItemView onbeforerender');
      this.id = this.model.get('id'); 
    },
    onRender: function () {
      // console.log('ItemView onrender');      
    },
    initialize: function(){
      // console.log('ItemView initialize');
    }
});


Graph.GraphListView = Backbone.Marionette.CompositeView.extend({
    template:  _.template('<header class="graph-collection">the graph <%=id%></header>'+
                          '<div></div>'+
                          '<footer><a href="#" class="next">next</a></footer>'), 
    templateHelpers: function(){
        var modelIndex = this.collection.current;
        return {
            id: modelIndex
        }
    }, 
    childView: Graph.GraphItemView,
    childViewContainer: 'div',
    initialize: function( ) {
      this.collection.current = 0;
      this.graphs = {};
    },
    events: {
      "click .next" : "next"
    },
    onBeforeRender: function () {
      // console.log('ListView onbeforerender');
    },
    onRender: function () {
      // console.log('ListView onrender');
      // console.debug(this.collection.current);
      // console.debug(this.collection['_byId'][this.collection.current]);
    },
    onShow: function(){
      // console.log('ListView onshow');
      var nextgraph = this.collection.nextGraph();
      $('.graph').hide();
      var rendered = nextgraph.showup();
      var id = nextgraph.get('id');
      this.graphs[id] = rendered;
      $('.graph-collection').html('the graph '+id);
    },
    onDomRefresh: function(){
      // console.log('ListView onDomRefresh');
    },
    next: function() {
      // console.log('ListView next');
      var nextgraph = this.collection.nextGraph();
      $('.graph').hide();
      _.each (this.graphs, function(value, key, list){
        value.destroy();
      });
      var rendered = nextgraph.showup();
      var id = nextgraph.get('id');
      this.graphs[id] = rendered;
      $('.graph-collection').html('the graph '+id);
    },
    appendHtml: function(collectionView, itemView){
      // console.log('ListView appendHtml');
    }
});

module.exports = Graph;
