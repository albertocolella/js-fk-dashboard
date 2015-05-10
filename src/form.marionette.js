'use strict';

module.exports = function (Form, App, Backbone, Marionette, $, _) {

  Form.Form = Backbone.Model.extend({
    defaults: {
      id: App.createId(),
      url: '',    
      data: {
        fields: []
      }
    },
    url: function() {
      console.log('URL:', App.getApiUrl());
      return App.getApiUrl() + '/forms/'+this.id; //+'.json';
    },
    /*initialize: function(id) {
      console.log('initialize:', id);
    },*/
    parse : function(response, options){
      console.log('parse:', response);
      if(response.form && response.form.length){
        if(typeof response.form[0].data == "string"){
          response.form[0].data = JSON.parse(response.form[0].data);
        }
        if(!_.isArray(response.form[0].data.fields)){
          response.form[0].data.fields = [response.form[0].data.fields];
        }
        return response.form[0];
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
      console.log('parse:', response);
      return response.forms;
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
        // console.log('ItemView initialize', el);
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
        App.navigate("form/"+this.model.get("id"));
        //this.render();
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
                            '<span class="input-group-addon" id="sizing-addon2">url</span>' +
                            '<input type="text" value="<%= url%>" name="url"/>' +
                            // '<span class="input-group-addon" id="sizing-addon2">name</span>' +
                            // '<input type="text" value="<%= name%>" name="name"/>' +                          
                            '<button type="button" value="<%-id%>" class="btn btn-success glyphicon glyphicon-ok form-save" />' +
                            '<button type="button" value="<%-id%>" class="btn btn-danger glyphicon glyphicon-remove form-close" />' +
                            '</div>' +
                            '</form>');
        } else {
          // console.log(this.model);
          return _.template('<td><a href="" id="form-link-<%-id%>" class="form-link"><%-url%></a></td>' + 
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

 /* Form.FormView = Marionette.ItemView.extend({
      //tagName: "tr",
      template: _.template('<form>' + 
                            '<div class="input-group">' + 
                            '<span class="input-group-addon" id="sizing-addon2">url</span>' +
                            '<input type="text" value="<%= url%>" name="url"/>' +                          
                            '</div>' +
                            '<%= fields %>' +
                            '<button type="button" value="" class="btn btn-success glyphicon glyphicon-ok form-save" />' +
                            '<button type="button" value="" class="btn btn-danger glyphicon glyphicon-remove form-close" />' +
                            '</form>'),
      templateHelpers: function(){
        return {
            fields: this.renderFormFields()
        }
      },
      model: Form.Form,
      ui: {
        // 'site': 'input[name=site]',
        'url': 'input[name=url]',
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
          // site: this.ui.site.get(0).value,
          url: this.ui.url.get(0).value,
          id: 5
        };
      },
      renderFormFields: function(){
        console.log('renderFormFields:', this.model.get('data'))
        var data = this.model.get('data');
        var output = '';
        if(data){
          for(var i=0; i<data.fields.length; i++){
            var f = data.fields[i];
            switch(f.type){
              case 'textarea':
                output += '<div class="form-group">' +
                            '<textarea class="form-control" rows="3">' +

                            '</textarea>' +
                          '</div>';

              break;
            }
          }
        }
        return output;
      }
  });*/

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
        this.collection = new Backbone.Collection(this.model.get('data').fields);
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
        if(data.fields){
          data.data = {};
          data.data.fields = data.fields;
          delete data.fields;
        }
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
    initialize: function (form) {
      this.listenTo(this.model,'sync',this.showSuccess);
      // $.fn.editable.defaults.mode = 'inline';   
    },
    showSuccess: function(){
      this.firstCol.show(new Form.Edit.View({model: this.model}));
      //this.firstCol.show(new Form.Edit.View({collection: new Backbone.Collection(this.model.get('data').fields)}));
    },
    regions: {
      firstCol: "form"
    }
  });
  

};
// module.exports = TheForm;
