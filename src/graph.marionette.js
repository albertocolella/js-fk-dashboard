'use strict';

var Chart = require('chart.js');

module.exports = function (Graph, App, Backbone, Marionette, $, _) {

  Graph.Graph = Backbone.Model.extend({
    defaults: {
      id: 0,    
      background: 'red',
      data: []
    },
    url: function() {
      return 'api/1/graphs/'+this.id+'.json';
    },
    initialize: function() {
      this.deferred = this.fetch();
      this.cart = {};
    },
    getData: function (){
      return this.get('data');
    },
    showup: function(){
      var self = this;
      return $.when(
        this.deferred.done(function(){
        })
      ).done(function(){
        var data = self.getData();
        var ctx = $("#graph"+self.id).get(0).getContext("2d");
        $("#graph"+self.id).show();
        self.chart = new Chart(ctx).Doughnut(data, {});
        return self.chart;
      });
    }
  });

  Graph.Collection = Backbone.Collection.extend({
    model: Graph.Graph,
    current: 0,
    url: function() {
      // console.log('user_id:', this.user_id);
      return 'api/1/graphs.json';
    },
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

  Graph.ItemView = Marionette.ItemView.extend({
      tagName: "div",
      template: _.template('<canvas id="graph<%-id%>" class="graph" style="display:none;" width="200" height="200"></canvas>'),
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


  Graph.ListView = Backbone.Marionette.CompositeView.extend({
      template:  _.template('<header class="graph-collection">the graph <%=id%></header>'+
                            '<div></div>'+
                            '<footer><button type="button" class="btn btn-lg btn-primary next">Next</button></footer>'), 
      templateHelpers: function(){
          var modelIndex = this.collection.current;
          return {
              id: modelIndex
          }
      }, 
      childView: Graph.ItemView,
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
        var self = this;
        var rendered = nextgraph.showup();
        rendered.done(function(){
          var id = nextgraph.get('id');
          self.graphs[id] = nextgraph;
          $('.graph-collection').html('the graph '+id);
        });
        
      },
      onDomRefresh: function(){
        // console.log('ListView onDomRefresh');
      },
      next: function() {
        // console.log('ListView next');
        var nextgraph = this.collection.nextGraph();
        $('.graph').hide();
        _.each (this.graphs, function(value, key, list){
          value.chart.destroy();
        });
        var rendered = nextgraph.showup();
        var id = nextgraph.get('id');
        this.graphs[id] = nextgraph;
        $('.graph-collection').html('the graph '+id);
        return false;
      },
      appendHtml: function(collectionView, itemView){
        // console.log('ListView appendHtml');
      }
  });

};

// module.exports = Graph;
