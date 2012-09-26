(function($){

  var qstring;

  var Photo = Backbone.Model.extend({
  });      
  
  var Photos = Backbone.Collection.extend({
    model: Photo
  });  

  var photos_list = new Photos();

  var PhotoView = Backbone.View.extend({
    tagName: 'div',
    className: 'thumb',

    events: {
      "click img": "clicked",
      "click .close": "close_popup"
    },

    initialize: function(){
      _.bindAll(this, 'render');
    },

    clicked: function(e) {
      e.preventDefault();
      var image_url = this.model.get("url_m");
      var title = this.model.get("title");
      console.log(image_url);
      console.log(title);
      popup(image_url, title);
    },

    close_popup: function(e){
      console.log("inside close popup");
      e.preventDefault();
      $('#mask').hide();
      $('.window').hide();
    },

    render: function(){
      $(this.el).html("<img src=" + this.model.get('url_n') + " class='photo'/>");
      return this; // for chainable calls, like .render().el
    }

  });

  var PhotosView = Backbone.View.extend({    
    el: $('body'),

    events: {
      'submit form': 'search_flickr',
    },

    initialize: function(){
      _.bindAll(this, 'render', 'search_flickr', 'appendPhoto', 'load_more');

      this.collection = photos_list;
      this.collection.bind('add', this.appendPhoto); // collection event binder

      this.page = 1;
      this.per_page = 9;

      $(window).scroll($.debounce(50 , this.load_more ));   
       
       this.render();
    },
    
    render: function(){
      $(this.el).append("<h1>Flickr Search</h1>");
      $(this.el).append("<form action='#'><div><input type='text' /><input type='submit' /></div></form>");
      $(this.el).append("<div id='images'></div>");

      _(this.collection.models).each(function(photo){ // in case collection is not empty
        self.appendPhoto(photo);
      }, this)
    },

    search_flickr: function(e){
      qstring = $("input:first").val();

      if (e) {
        this.page = 1;
        $("#images").html("");  
      }

      var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=880e34e574e5ce69aafe7dbc440a6595&text=" + qstring + "&per_page=" + this.per_page + "&page=" + this.page + "&extras=url_n,url_m"

      var src;
      $.getJSON(url + "&format=json&jsoncallback=?", function(data){

        if (data.stat == "ok"){
          $.each(data.photos.photo, function(i,item){

              var photo = new Photo();
              photo.set({
                id: item.id,
                title: item.title,
                url_m: item.url_m,
                url_n: item.url_n
              });
              photos_list.add(photo);
            }); 
        }
        else {
          alert("Error occured while loading photos");
        }
          
      });

      return false;

    },

    appendPhoto: function(item){
      var photoView = new PhotoView({
        model: item
      });
      $("#images").append(photoView.render().el);
    },

    load_more: function(){

      if  ($(window).scrollTop() == $(document).height() - $(window).height()){
           this.page = this.page + 1;
           this.search_flickr(); 
        }

    }


  });

  // Instantiate main app view.
  var photosView = new PhotosView();
})(jQuery);