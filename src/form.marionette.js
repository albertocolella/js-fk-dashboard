'use strict';

module.exports = function (Form, App, Backbone, Marionette, $, _) {

  Form.Form = Backbone.Model.extend({
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

  Form.Collection = Backbone.Collection.extend({
    model: Form.Form,
    current: 0,
    url: function() {
      // console.log('user_id:', this.user_id);
      return 'api/1/forms.json';
    },
    initialize: function(){

    }
    //localStorage: new Backbone.LocalStorage('forms-backbone'),
  });

  Form.ItemView = Marionette.ItemView.extend({
      tagName: "tr",
     /* template: _.template('<td><a href="" id="form-link-<%-id%>" class="form-link"><%-path%></a></td>' + 
                           '<td><div class="btn-group" role="group">' + 
                           '<button type="button" value="<%-id%>" class="btn btn-default glyphicon glyphicon-pencil form-edit" />' + 
                           '</div></td>'),*/
      model: Form.Form,
      events: {
        "click .form-edit" : "formEdit",
        "click .form-close" : "formClose",
        "click .form-save": "formSave"
      },
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
      },
      getFormData: function(el){
        // console.log('ItemView initialize');
        JSON.stringify(el);
      },
      formClose: function(){
        console.log('ItemView formClose');
        this.model.set("show", false);
        this.render();
      },
      formEdit: function(){
        console.log('ItemView formEdit');
        this.model.set("show", true);
        this.render();
      },
      formSave: function(aaa, bbb){
        console.log('ItemView formSave');
        this.model.set("show", false);
        var data = this.getFormData(this.$el.find('form'));
        console.log('DATA:', data);
        this.model.set(data);
        this.model.save(); 
        /*var form_data = this.getFormData( this.$el.find('form') );
        this.model.save(form_data);*/
        this.render();
      },
      getTemplate: function(){
        if (this.model.get("show")){
          return _.template('<form>' + 
                            '<div class="input-group">' + 
                            '<span class="input-group-addon" id="sizing-addon2">path</span>' +
                            '<input type="text" value="<%= site%>" name="site"/>' +
                            '<span class="input-group-addon" id="sizing-addon2">name</span>' +
                            '<input type="text" value="<%= path%>" name="path"/>' +                          
                            '<button type="button" value="<%-id%>" class="btn btn-success glyphicon glyphicon-ok form-save" />' +
                            '<button type="button" value="<%-id%>" class="btn btn-danger glyphicon glyphicon-remove form-close" />' +
                            '</div>' +
                            '</form>');
        } else {
          return _.template('<td><a href="" id="form-link-<%-id%>" class="form-link"><%-path%></a></td>' + 
                           '<td><div class="btn-group" role="group">' + 
                           '<button type="button" value="<%-id%>" class="btn btn-default glyphicon glyphicon-pencil form-edit" />' + 
                           '</div></td>');
        }
      }/*,
      serializeData : function() {
          return {
              'path': this.model.get('path'),
              'site': this.model.get('site'),
              'id': this.model.get('id')
          };
      }*/
  });


  Form.ListView = Backbone.Marionette.CompositeView.extend({
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
      childView: Form.ItemView,
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

  Form.getForm = function(id){
    var form = new App.Form.Form({id: id});
    var deferred = $.Deferred();
    var formView = null;
    $.when(
      form.fetch({
        dataType: "json",
        success: function(data) {
          return deferred.resolve();
        },
        error: function(collection, response, options) {
          console.error('Form error', response.responseText);
          return deferred.fail();
        }
      })
    ).then(function(){
      formView = new App.Form.FormView({
        model: form
      });
    });
    return formView;
  };

  Form.FormView = Marionette.ItemView.extend({
      //tagName: "tr",
      template: _.template('<form>' + 
                            '<div class="input-group">' + 
                            '<span class="input-group-addon" id="sizing-addon2">path</span>' +
                            '<input type="text" value="" name="site"/>' +
                            '</div>' +
                            '<div class="input-group">' + 
                            '<span class="input-group-addon" id="sizing-addon2">name</span>' +
                            '<input type="text" value="" name="path"/>' +                          
                            '</div>' +
                            '<button type="button" value="" class="btn btn-success glyphicon glyphicon-ok form-save" />' +
                            '<button type="button" value="" class="btn btn-danger glyphicon glyphicon-remove form-close" />' +
                            '</form>'),
     // model: Form.Form,
      ui: {
        'site': 'input[name=site]',
        'path': 'input[name=path]',
        'close': '.form-close',
        'save': '.form-save'
      },
      events: {
        "click .form-close" : "formClose",
        "click .form-save": "formSave"
      },
      formClose: function(){
        console.log('ItemView formClose');
        App.navigate("home");
      },
      formSave: function(aaa, bbb){
        console.log('ItemView formSave');
        var data = this.getFormData(this.$el.find('form'));
        this.model = new App.Form.Form(data);
        this.model.save(); 
        App.navigate("home");
        // App.router.navigate('#tasks/' + this.model.get('id'), {trigger: true})
      },
      getFormData: function(el){
        // console.log('ItemView initialize');
        return {
          site: this.ui.site.get(0).value,
          path: this.ui.path.get(0).value,
          id: 5
        };
      }
  });

};
// module.exports = TheForm;
