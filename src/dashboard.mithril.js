var Dashboard = {};

Dashboard.model = function (data) {

};
Dashboard.vm = {  
    graphs: m.prop([new Graph()]),
    init: function(data){
      if(data==undefined){
        data = {};
      }
      this.currentGraph = m.prop(data.currentGraph || 0);
    }
};
Dashboard.controller = function() {
  var vm = Dashboard.vm
  vm.init();
  var ctrl = this;
  ctrl.current = function () {
    return vm.graphs()[vm.currentGraph()]
  };
  ctrl.add = function () {
    var newModel = new Graph({id:vm.currentGraph()})
    vm.graphs().push(newModel)
  };
  ctrl.remove = function (idx) {
    vm.graphs().splice(idx, 1)
  };
  ctrl.next = function(){
    console.log('next!');
    vm.currentGraph(vm.currentGraph()+1);
    ctrl.add();
    return vm.graphs()[vm.currentGraph()];
  };
}
Dashboard.view = function(ctrl) {
  var vm = Dashboard.vm;
  var nx = ctrl.current();
  console.log('DB_view', nx);
  return nx.view({onclick: ctrl.next, id:vm.currentGraph.bind(vm)});
};

m.module(document.body, Dashboard);