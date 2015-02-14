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
    this.prev = this.current
    this.current++;
    return res;
  }
});

Graph.GraphItemView = Marionette.ItemView.extend({
    tagname: "div",
    template: _.template('<canvas id="graph<%-id%>" width="400" height="400"></canvas>'),
    //template: _.template('<div style="background-color: <%-background%>;">Graph <%-id%></div>'),
    model: Graph.Graph,
    onShow: function(){
      console.log('ItemView onshow');
    },
    onDomRefresh: function(){
      console.log('ItemView onDomRefresh');
    },
    onRender: function () {
      console.log('ItemView onrender');      
    },
    getData: function (){
      return [
        {
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        }
      ];
    },
    render: function (){
      console.log('ItemView render');
      this.$el.html(this.template({id: this.model.get('id'), background: this.model.get('background')})); 
      return this;
    }
});


Graph.GraphListView = Backbone.Marionette.CompositeView.extend({
    template:  _.template('the graph <%=graph%> <br /><a href="#" class="next">next</a>'),  
    childView: Graph.GraphItemView,
    initialize: function( ) {
        this.current = 0;
        this.prev = 0;
    },
    events: {
      "click .next" : "render"
    },
    onRender: function () {
      console.log('ListView onrender');      
    },
    onShow: function(){
      console.log('ListView onshow');
      var data = this.childView.getData();
      var ctx = $("#graph"+this.collection.current).get(0).getContext("2d");
      var myPieChart = new Chart(ctx).Doughnut(data, {});
    },
    onDomRefresh: function(){
      console.log('ListView onDomRefresh');
    },
    render: function() {
      var self = this;
      this.childView = new Graph.GraphItemView({model: this.collection.nextGraph()});
      this.childView.render();
      this.$el.html(this.template({graph: this.childView.$el.html()}));
      return this;
    }
});

module.exports = Graph;
