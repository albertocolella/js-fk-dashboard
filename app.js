// Vendors
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
Marionette.$ = Backbone.$;
window.jQuery = $;
require('bootstrap');
//var bootstrap_less = require('bootstrap/package').less


// app bootstrap
//var app = new Marionette.Application();
var Dashboard = require('./src/dashboard.marionette.js');
var app = Dashboard;
// ...
app.start();
Backbone.history.start();

module.exports = app;