'use strict';

module.exports = function (Dashboard, App, Backbone, Marionette, $, _) {
  Dashboard.Controller = Marionette.Controller.extend({
    home: function() {
      var forms = new App.Form.Collection(null, {user_id:1});
      var feedbacks = new App.Feedback.Collection(null, {user_id:1});
      //var graphs = new App.Graph.Collection(null, {user_id:1});
      var deferred = $.Deferred();
      $.when(
        /*graphs.fetch({
          dataType: "json",
          success: function(data) {
            return deferred.resolve();
          },
          error: function(collection, response, options) {
            console.error('Graph error', response.responseText);
            return deferred.fail();
          }
        }),*/
        feedbacks.fetch({
          dataType: "json",
          success: function(data) {
            // console.log('fetched:', data);
            return deferred.resolve();
          },
          error: function(collection, response, options) {
            console.error('Feedback error', response.responseText);
            return deferred.fail();
          }
        }),
        forms.fetch({
          dataType: "json",
          success: function(data) {
            // console.log('fetched:', data);
            return deferred.resolve();
          },
          error: function(collection, response, options) {
            console.error('Form error', response.status+': '+response.statusText);
            return deferred.fail();
          }
        })
      ).then(function(){
        /*var graphList = new App.Graph.ListView({
          collection: graphs
        });*/
      
        if(forms.length){
          var formList = new App.Form.ListView({
            collection: forms
          });
        }
        var feedbackList = new App.Feedback.ListView({
          collection: feedbacks
        });
        var layout = new Dashboard.Layout();
        App.getRegion('mainRegion').show(layout);
        if(formList){
          layout.getRegion('firstRow').show(formList);
        }
        layout.getRegion('secondRow').show(feedbackList);
        //layout.getRegion('secondRow').show(graphList);
      });
    },
    addForm: function() {
      console.log('form/add');
      var new_form = new App.Form.FormView()
      App.getRegion('mainRegion').show(new_form);
    },
    editForm: function(form_id) {
      console.log('form/edit', form_id);
      var new_form = new App.Form.Form({id:form_id});
      new_form.fetch({
        dataType: "json",
        success: function(data) {
          /*var form_view = new App.Form.FormView({model: data});
          App.getRegion('mainRegion').show(form_view);*/
          var lt = new App.Form.Edit.Layout({model: data});
          App.getRegion('mainRegion').show(lt);
        },
        error: function(collection, response, options) {
          console.error('Form error', response.responseText);
          return "Error";
        }
      });

    }
  });

  Dashboard.Router = Marionette.AppRouter.extend({
    //controller: dashboard,
    appRoutes: {
      "home": "home",
      "form/add": "addForm",
      "form/:id": "editForm"
    }
  });

  Dashboard.Layout = Backbone.Marionette.LayoutView.extend({
    template: '#layout-view-template',
    onShow: function(){
      // console.log('LayoutView onshow');
    },
    onDomRefresh: function(){
      // console.log('LayoutView onDomRefresh');
    },
    onBeforeRender: function () {
      // console.log('LayoutView onbeforerender');
    },
    onRender: function () {
      // console.log('LayoutView onrender');      
    },
    regions: {
      firstRow: ".row-1",
      secondRow: ".row-2"
    }
  });


  App.on('start', function () {
    var controller = new Dashboard.Controller();
    controller.router = new Dashboard.Router({
      controller: controller
    });
  });

};
