'use strict';

module.exports = function (Feedback, App, Backbone, Marionette, $, _) {

  Feedback.Feedback = Backbone.Model.extend({
    defaults: {
    }
  });

  Feedback.Collection = Backbone.PageableCollection.extend({
    model: Feedback.Feedback,
    url: function() {
      // return 'api/v1/feedbacks.json';
      return App.getApiUrl() + '/feedbacks'; //.json';
    },
    parse: function(response, options){
      // console.log('response:', response);
      return response.feedbacks;        
    }, 
    state: {
      firstPage: 1,
      currentPage: 1,
      pageSize: 3
    },
    queryParams: {
      currentPage: "page",
      pageSize: "pageResults"
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
                            '</table>' +
                            '<ul class="pagination">' +                              
                            '</ul>'
      ),
      childView: Feedback.ItemView,
      childViewContainer: 'tbody',
      onBeforeRender: function () {
         console.log('FeedbackListview onbeforerender');
      },
      onShow: function(){
        console.log('FeedbackListview onshow');
        var pagingItems = '<li><a href="#">Prev</a></li>'+
                          '<li><a href="#" class="active">1</a></li>'+
                          '<li class="disabled"><span>...</span></li>'+
                          '<li><a href="#">5</a></li>'+
                          '<li><a href="#">Next</a></li>';
        $('.pagination').append(pagingItems);
      },
      onRender: function(){
        console.log('FeedbackListview onrender');
        
                              
      }
  });


};