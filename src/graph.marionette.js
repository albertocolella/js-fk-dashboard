
var Graph = Backbone.Model.extend({
  defaults: {
    id: 0,    
    background: 'red'
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

var GraphItemView = Marionette.ItemView.extend({
    tagname: "div",
    template: _.template('<div style="background-color: <%-background%>;">Graph <%-id%></div>'),
    model: Graph,
    onRender: function () {
      console.log('ItemView onrender')
    },
    render: function (){
      this.$el.html(this.template({id: this.model.get('id'), background: this.model.get('background')})); 
      return this;
    }
});


var GraphListView = Backbone.Marionette.CompositeView.extend({
    template:  _.template('the graph <%=graph%> <br /><a href="#" class="next">next</a>'),  
    childView: GraphItemView,
    initialize: function( ) {
        this.current = 0;
    },
    events: {
      "click .next" : "render"
    },
    onRender: function () {
      console.log('ListView onrender')
    },
    render: function() {
      var self = this;
      var graph = new GraphItemView({model: this.collection.nextGraph()});
      graph.render();
      this.$el.html(this.template({graph: graph.$el.html()}));
      return this;
    }
});
