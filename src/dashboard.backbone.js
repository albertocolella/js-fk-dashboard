
$(document).ready(function () {
  
  //Lets create a pre-populated collection
  var g1 = new Graph({ id: 1, background: "green" });
  var g2 = new Graph({ id: 2, background: "yellow" });
  var gc = new GraphCollection([g1, g2]);
  var gcv = new GraphCollectionView({el: $('#content'), model: gc});
  gcv.render();

});
