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
      this.pagination_links = response._links;
      this.state.totalPages = response.totalPages;
      this.state.lastPage = response.totalPages;
      return response.feedbacks;        
    }, 
    state: {
      firstPage: 1,
      currentPage: 1,
      pageSize: 2
    },
    queryParams: {
      currentPage: "page",
      pageSize: "pageResults",
      totalPages: "totalPages"
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
      template:  _.template('<div class="panel panel-default">' +
                              '<div class="panel-heading">Feedbacks' +
                              '</div>' +
                              '<div class="panel-body">' +
                              '<span class="glyphicon glyphicon-question-sign"></span> Your form feedbacks are listed here below.' +
                              '</div>' +
                              '<table data-toggle="table" class="table table-striped table-bordered table-hover">' + 
                                '<thead><tr><th>URL</th><th>Data</th><th>Date</th></tr></thead>' +
                                '<tbody></tbody>' +
                                '<tfoot><tr><td colspan="3"><ul class="pagination"><%=paginationItems%></ul></td></tr></tfoot>' +
                              '</table>' +
                              
                            '</div>'
      ),
      templateHelpers: function(){
        var pagingItems = '';
        var last = this.collection.state.totalPages;
        var current = this.collection.state.currentPage;
        pagingItems += '<li><a href="#" data-role="prev">Prev</a></li>';
        var offset = 3;
        var pre_offset_setted = false;
        var post_offset_setted = false;
        for(var i=1;i<=last;i++){
          if(i==1){
            if(i==current){
              var classes = ['active'];
            }
            pagingItems += '<li><a href="#" data-role="first" class="'+classes.join(' ')+'" data-num="'+i+'">'+i+'</a></li>';
            classes = [];
          } else if(i==last){
            if(i==current){
              var classes = ['active'];
            }
            pagingItems += '<li><a href="#" data-role="last" class="'+classes.join(' ')+'" data-num="'+i+'">'+i+'</a></li>';
            classes = [];
          } else if(i==current){
            var classes = ['active'];
            pagingItems += '<li><a href="#" data-role="num" class="'+classes.join(' ')+'" data-num="'+i+'">'+i+'</a></li>';
            classes = [];
          } else if(i<current){
            if(i>(current-offset)){
              pagingItems += '<li><a href="#" data-role="num" data-num="'+i+'">'+i+'</a></li>';
            } else if(!pre_offset_setted) {
              pagingItems += '<li class="disabled"><span>...</span></li>';
              pre_offset_setted = true;
            }
          } else if(i>current){
            if(i<(current+offset)){
              pagingItems += '<li><a href="#" data-role="num" data-num="'+i+'">'+i+'</a></li>';
            } else if(!post_offset_setted) {
              pagingItems += '<li class="disabled"><span>...</span></li>';
              post_offset_setted = true;
            }
          }
        }
        pagingItems += '<li><a href="#" data-role="next">Next</a></li>';
        return {
            paginationItems: pagingItems
        }
      },
      childView: Feedback.ItemView,
      childViewContainer: 'tbody',
      events: {
        'click .pagination [data-role=prev]':   'prevResultPage',
        'click .pagination [data-role=first]':  'firstResultPage',
        'click .pagination [data-role=num]':    'numResultPage',
        'click .pagination [data-role=last]':   'lastResultPage',
        'click .pagination [data-role=next]':   'nextResultPage',
      },
      prevResultPage: function (e) {
        e.preventDefault();
        if(this.collection.hasPreviousPage()){
          this.collection.getPreviousPage();
        }
      },
      nextResultPage: function (e) {
        e.preventDefault();
        if(this.collection.hasNextPage()){
          this.collection.getNextPage();
        }
      },
      numResultPage: function (e) {
        e.preventDefault();
        var num = $(e.target).attr('data-num');
        num = parseInt(num);
        if(num == NaN){
          num = 1;
        }
        this.collection.getPage(num);
      },
      lastResultPage: function (e) {
        e.preventDefault();
        this.collection.getLastPage();
      },
      firstResultPage: function (e) {
        e.preventDefault();
        this.collection.getFirstPage();
      },
  });


};