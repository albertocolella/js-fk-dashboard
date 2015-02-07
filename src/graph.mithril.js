var Graph = function(data){
  if(data===undefined){
    data = {};
  }
  this.backgrounds = ['red', 'green', 'blue', 'yellow', 'black', 'white', 'pink'];
  this.id = m.prop(data.id || 0);
  this.background = m.prop(this.backgrounds[this.id()] || 'purple');

  this.controller = function(data) {
    console.log('controller') 
  };

  this.view = function(ctrl) {
    console.log('view')
    return m("div", {style: {width:"200px", height:"200px", backgroundColor: this.background()}}, "Graph "+ this.id() );
  };
  return this;
}