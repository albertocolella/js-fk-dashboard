'use strict';

module.exports = function (Feedback, App, Backbone, Marionette, $, _) {

  Feedback.Feedback = Backbone.Model.extend({
    defaults: {
    }
  });

  Feedback.Collection = Backbone.Collection.extend({
    model: Feedback.Feedback,
    url: function() {
      // return 'api/v1/feedbacks.json';
      return App.getApiUrl() + '/feedbacks'; //.json';
    },
    parse: function(response, options){
      console.log('response:', response);
      return response.feedbacks;        
    }, 
    pagination : function(perPage, page) {
       page = page-1;
       var collection = this;
       collection = _(collection.rest(perPage*page));
       collection = _(collection.first(perPage));    
       return collection.map( function(model) { return model.toJSON() } ); 
    }
  });

  Feedback.ItemView = Marionette.ItemView.extend({
      tagName: "tr",
      template: _.template('<td><%-url%></td>' +
                           '<td><%-data%></td>' +
                           '<td><%-created_at%></td>'),
      model: Feedback.Feedback,
      templateHelpers: function(){
        var cad = new Date(this.model.get('created')*1000);
        return {
            created_at: cad.toISOString().substr(0,10)
        }
      },
  });

  Feedback.ListView = Backbone.Marionette.CompositeView.extend({
      template:  _.template('<table data-toggle="table" class="table table-striped table-bordered table-hover">' + 
                            '<thead><tr><th>URL</th><th>Data</th><th>Date</th></tr></thead>' +
                            '<tbody></tbody>' +
                            '</table>'
      ),
      childView: Feedback.ItemView,
      childViewContainer: 'tbody',
  });


};