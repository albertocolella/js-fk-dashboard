'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

var _ = require('underscore');
var TheForm = {};

TheForm.TheForm = Backbone.Model.extend({
  defaults: {
    id: 0,
    site: '',
    path: '',    
    fields: []
  },
  url: function() {
    return 'api/1/forms/'+this.id+'.json';
  },
  initialize: function() {
    //this.deferred = this.fetch();
    this.cart = {};
  },
  getData: function (){
    return this.get('data');
  }
});

TheForm.FormCollection = Backbone.Collection.extend({
  model: TheForm.TheForm,
  current: 0,
  url: function() {
    // console.log('user_id:', this.user_id);
    return 'api/1/forms.json';
  },
  initialize: function(){

  }
  //localStorage: new Backbone.LocalStorage('forms-backbone'),
});

TheForm.FormItemView = Marionette.ItemView.extend({
    tagName: "tr",
    template: _.template('<td><a href="" id="form-link-<%-id%>" class="form-link"><%-path%></a></td>' + 
                         '<td><div class="btn-group" role="group">' + 
                         '<button type="button" value="<%-id%>" class="btn  btn-default glyphicon glyphicon-pencil" />' + 
                         '</div></td>'),
    model: TheForm.TheForm,
    onShow: function(){
      // console.log('ItemView onshow');
    },
    onDomRefresh: function(){
      // console.log('ItemView onDomRefresh');
    },
    onBeforeRender: function () {
      // console.log('ItemView onbeforerender');
      // this.id = this.model.get('id');
    },
    onRender: function () {
      // console.log('ItemView onrender');
    },
    initialize: function(){
      // console.log('ItemView initialize');
    }
});


TheForm.FormListView = Backbone.Marionette.CompositeView.extend({
    template:  _.template('<table data-toggle="table" class="table table-striped table-bordered table-hover">' + 
                          '<thead><tr><th>Name</th><th>Actions</th></tr></thead>' +
                          '<tbody></tbody>' +
                          '</table>'
    ), 
    /*templateHelpers: function(){
        var modelIndex = this.collection.current;
        return {
            id: modelIndex
        }
    }, */
    childView: TheForm.FormItemView,
    childViewContainer: 'tbody',
    initialize: function( ) {
      // console.log('ListView initialize');
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
    },
    onDomRefresh: function(){
      // console.log('ListView onDomRefresh');
    }
});

module.exports = TheForm;
