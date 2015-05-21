// Vendors
var $ = global.jQuery = require("jquery")
require('jquery-serializejson');
require('bootstrap');
require('bootstrap-switch');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var PageableCollection = require("backbone.paginator");
Marionette.$ = Backbone.$;
window.jQuery = $;
var _ = require('underscore');
require('x-editable');
var Dashboard = require('./src/dashboard.marionette.js');
var Form = require('./src/form.marionette.js');
var Feedback = require('./src/feedback.marionette.js');
var Graph = require('./src/graph.marionette.js');


var TheApp = Backbone.Marionette.Application.extend({});

//TheApp.Controller = Marionette.Controller.extend({});
//TheApp.Router = Marionette.AppRouter.extend({});

var App = new TheApp();

App.navigate = function(route, options){
  options || (options = {trigger: true});
  Backbone.history.navigate(route, options);
};

App.getCurrentRoute = function(){
 return Backbone.history.fragment
};

App.getApiUrl = function(){
  switch( window.location.hostname ){
    case "localhost":
    case "127.0.0.1":
      return 'http://localhost/feedback/fk-server/api';    
    default:
      return 'https://fk.patrizio.me/api';
  }
};

App.signinUser = function(authResult){
   if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    document.getElementById('signinButton').setAttribute('style', 'display: none');
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
};

App.disconnectUser = function(access_token) {
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
      access_token;

  // Esecuzione di una richiesta GET asincrona.
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
      // Esegui un'azione, l'utente è disconnesso
      // La risposta è sempre indefinita.
    },
    error: function(e) {
      // Gestione dell'errore
      // console.log(e);
      // Puoi indirizzare gli utenti alla disconnessione manuale in caso di esito negativo
      // https://plus.google.com/apps
    }
  });
}


App.serializeForm = function(form){
  var o = {};
  var a = form.serializeArray();
  $.each(a, function() {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
   });
   return o;
};

App.createId = function(){
  var o = new ObjectId();
  return o.toString();
};


App.addRegions({
  mainRegion: '#wrapper'
});


// App modules
App.module('Form', Form);
App.module('Feedback', Feedback);
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