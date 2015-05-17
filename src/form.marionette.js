'use strict';

module.exports = function (Form, App, Backbone, Marionette, $, _) {

  Form.Form = Backbone.Model.extend({
    defaults: {
      id: App.createId(),
      url: '',
      fields: []
    },
    url: function() {
      console.log('URL:', App.getApiUrl());
      return App.getApiUrl() + '/forms/'+this.id; //+'.json';
    },
    parse : function(response, options){
      // console.log('parse:', response);
      if(response.form){
        return response.form;
      };
      return response;
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
      return App.getApiUrl() + '/forms'; //.json';
    },    
    parse : function(response, options){
      // console.log('parse:', response);
      return response.forms;
    },
    initialize: function(){
      
    }
    //localStorage: new Backbone.LocalStorage('forms-backbone'),
  });

  Form.ItemView = Marionette.ItemView.extend({
      tagName: "tr",
      template: _.template('<td><a href="" id="form-link-<%-id%>" class="form-link"><%-url%></a></td>' + 
                           '<td>'+
                             '<div class="btn-group" role="group">' + 
                              '<button type="button" value="<%-id%>" class="btn btn-default glyphicon glyphicon-pencil form-edit" />' + 
                             '</div>' +
                            '</td>'),
      model: Form.Form,
      events: {
        "click .form-edit" : "formEdit",
        "click .form-link" : "formFeedbacks"
      },
      formFeedbacks: function(e){
        e.preventDefault();
        App.navigate("form/"+this.model.get("id")+"/feedbacks");
      },
      formEdit: function(e){
        e.preventDefault();
        App.navigate("form/"+this.model.get("id"));
      }
  });

  Form.EmptyTableView = Marionette.ItemView.extend({
    template:  _.template('<tr><td colspan="2">No forms created yet. You can <a href="#forms/add">add a new form</a> now.</td></tr>')
  });

  Form.ListView = Backbone.Marionette.CompositeView.extend({
      template:  _.template('<div class="panel panel-default">' +
                              '<div class="panel-heading">Forms' +
                              '</div>' +
                              '<div class="panel-body">' +
                              '<span class="glyphicon glyphicon-question-sign"></span> Your forms are listed here below.' +
                              '</div>' +
                              '<table data-toggle="table" class="table table-striped table-bordered table-hover">' + 
                              '<thead><tr><th>Name</th><th>Actions</th></tr></thead>' +
                              '<tbody></tbody>' +
                              '</table>' +                              
                            '</div>'
      ), 
      /*templateHelpers: function(){
          var modelIndex = this.collection.current;
          return {
              id: modelIndex
          }
      }, */
      childView: Form.ItemView,
      childViewContainer: 'tbody',
      emptyView: Form.EmptyTableView,
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

  Form.Edit = {};
  Form.Edit.Field = {};
  Form.Edit.Field.View = Marionette.ItemView.extend({
      //el: ".form-wrapper",
      template: _.template('<div class="row form-field-group"><%= field%></div>'),
      templateHelpers: function(){
        return {
            field: this.renderFormFields()
        }
      },
      onShow: function(){
        // this.$el.find('.editable').editable();
        this.$el.find("[type='checkbox']").bootstrapSwitch();
      },
      renderFormFields: function(){
        var output = '';
        var index = this.options.index;
        var type = this.model.get('type');
        var id_raw = this.model.get('id');
        var id = id_raw.replace(" ", "_");
        var label =  this.model.get('label');
        var checked = this.model.get('required')? 'checked="checked"' : '';
        switch(type){
          case 'text':
          case 'textarea':
            output +=   '<h4 class="col-sm-12">' + type +'</h4>' +  
                        '<div class="form-group col-sm-8">' +
                          '<input type="hidden" name="fields[][id]" value="'+id_raw+'" />' +
                          '<input type="hidden" name="fields[][type]" value="'+type+'" />' +
                          //'<label class="">label: ' + 
                          // '<span data-type="textarea" class="editable" id="' + id +'-label">'+label+'</span>' +
                          //'</label>' +  
                          '<div class="input-group">' +
                            '<div class="input-group-addon">label </div>' +
                            '<input type="text" data-type="text" class="editable form-control col-sm-10" id="' + id +'-label" name="fields[][label]" value="'+label+'" />' +
                          '</div>' +  

                        '</div>' +
                          '<div class="checkbox col-sm-4"">' +
                            '<label>' +
                              '<input type="checkbox" id="' + id +'-required" data-on-text="Required" data-off-text="Not required" data-size="small" value="required" ' + checked +'  name="fields[][required]" />' +
                            '</label>' +
                        '</div>';                                    
          break;
        }
        return output;
      }
  });

  Form.Edit.View = Backbone.Marionette.CompositeView.extend({
      //tagName: 'form',
      template:  _.template('<div>' + 
                              '<button type="button" value="" class="btn btn-success glyphicon glyphicon-plus form-field-add" />' +
                            '</div>' +
                            '<div class="clearfix visible-xs-block"></div>' +
                            '<div class="col-md-8 form-group fields-area">' + 
                            //'<input type="hidden" name="id" value="<%-id%>" />' +
                            '</div>' +
                            '<div class="col-md-4 form-group">' +
                              '<div class="input-group col-sm-10">' +
                                '<div class="input-group-addon">URL</div>' +  
                                '<input type="text" name="url" value="<%-url%>" class="form-control" />' +
                              '</div>' +  
                              '<div class="clearfix visible-xs-block"></div>' +                        
                              '<button type="button" value="" class="btn btn-success glyphicon glyphicon-ok form-save" />' +
                              '<button type="button" value="" class="btn btn-danger glyphicon glyphicon-remove form-close" />' +
                            '</div>'
      ),
      childView: Form.Edit.Field.View,
      childViewContainer: '.fields-area',
      childViewOptions: function(model) {
          return {
            index: this.collection.indexOf(model)
          };
      },
      initialize: function() {
        this.collection = new Backbone.Collection(this.model.get('fields'));
      },
      events: {
        "click .form-field-add" : "formFieldAdd",
        "click .form-close" : "formClose",
        "click .form-save": "formSave"
      },
      formClose: function(){
        App.navigate('home');
      },
      formSave: function(){
        var data = this.$el.parent().serializeJSON();
        this.model.set(data);
        this.model.save(); 
       // App.navigate('home');
      },
      formFieldAdd: function(){
        this.collection.add({id: App.createId(), type: 'text'});
      }/*,
      onShow: function(){
        // this.$el.find('.editable').editable();
        this.$el.find("[type='checkbox']").bootstrapSwitch();
      }*/
  });  

  Form.Edit.Layout = Backbone.Marionette.LayoutView.extend({
    template: _.template( '<form>' +
                          '</form>'
    ),
   /* initialize: function (form) {
      console.log('init000', this.model);
      this.listenTo(this.model,'sync',this.showSuccess);
      // $.fn.editable.defaults.mode = 'inline';   
    },
    showSuccess: function(){
      console.log('init000');
      this.firstCol.show(new Form.Edit.View({model: this.model}));
      //this.firstCol.show(new Form.Edit.View({collection: new Backbone.Collection(this.model.get('data').fields)}));
    },*/
    onBeforeShow: function() {
      this.showChildView('firstCol', new Form.Edit.View({model: this.model}));
    },
    regions: {
      firstCol: "form"
    }
  });
  

};
// module.exports = TheForm;
