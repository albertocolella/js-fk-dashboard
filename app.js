// Vendors
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
Marionette.$ = Backbone.$;
window.jQuery = $;
require('bootstrap');
var _ = require('underscore');
var Dashboard = require('./src/dashboard.marionette.js');
var Form = require('./src/form.marionette.js');
var Graph = require('./src/graph.marionette.js');


var TheApp = Backbone.Marionette.Application.extend({});

//TheApp.Controller = Marionette.Controller.extend({});
//TheApp.Router = Marionette.AppRouter.extend({});

var App = new TheApp();

App.navigate = function(route, options = {trigger: true}){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

App.getCurrentRoute = function(){
 return Backbone.history.fragment
};

App.getApiUrl = function(){
  return 'http://localhost:8080';
};

App.addRegions({
  mainRegion: '#wrapper'
});


// App modules
App.module('Form', Form);
App.module('Graph', Graph);
App.module('Dashboard', Dashboard);


// App start
App.on("start", function(){
  if (Backbone.history){
    if(!Backbone.history.started){
      Backbone.history.start();
    }
    if(App.getCurrentRoute() === ""){
      App.navigate("home");
    }
  }
});

App.start();

module.exports = App;

// 138196437