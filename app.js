// Vendors
console.log('ok')
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
Marionette.$ = Backbone.$;

// app bootstrap
//var app = new Marionette.Application();
var Dashboard = require('./src/dashboard.marionette.js');
var app = Dashboard;
// ...
app.start();
Backbone.history.start();

module.exports = app;