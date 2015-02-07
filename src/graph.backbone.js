var Graph = Backbone.Model.extend({
  defaults: {
    id: 0,    
    background: 'red'
  },
  idAttribute: "id",
  initialize: function(){
    // todo
  },
  constructor: function (attributes, options) {
    Backbone.Model.apply(this, arguments);
  }
});

var GraphView = Backbone.View.extend({
    tagname: "div",
    className: "graph",
    template: null, 
    model: Graph,
    render: function (){
      this.$el.html('<div style="background-color:' + this.model.get("background") + ';">'+'Graph '+this.model.get('id')+'</div>');
      return this;

    }
});

var GraphCollection = Backbone.Collection.extend({
  model: Graph,
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

var GraphCollectionView = Backbone.View.extend({
    model: GraphCollection,    
    className: "graphcollection",
    template: null, 
    initialize: function( collection ) {
        this.current = 0;
    },
    events: {
      "click .next" : "render"
    },
    render: function() {
      var self = this;
      var graph = new GraphView({model: self.model.nextGraph()});
      graph.render();
      this.$el.html(graph.$el.html() + '<a href="#" class="next">next</a>'); 
      return this;
    }
});