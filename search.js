(function($){

  var qstring;
  // var page = 1;
  // var per_page = 9;
  // var photos = new Photos();

  var Photo = Backbone.Model.extend({
    // defaults: {
    //   part1: 'hello',
    //   part2: 'world'
    // }
  });      
  
  // **List class**: A collection of `Item`s. Basically an array of Model objects with some helper functions.
  var Photos = Backbone.Collection.extend({
    model: Photo
  });  

  var photos_list = new Photos();

  var PhotoView = Backbone.View.extend({
    tagName: 'div',
    className: 'thumb',

    initialize: function(){
      _.bindAll(this, 'render');
    },
    render: function(){
      // $(this.el).html('<span>'+this.model.get('part1')+' '+this.model.get('part2')+'</span>');
      // $("<img/>").attr("src", this.model.get('url_n')).addClass("photo").appendTo("#images");
      // console.log('<img src=' + this.model.url_n + ' />');
      // console.log("inside photo render view model value --- ");
      // console.log(this.model.get('url_n'));
      $(this.el).html("<img src=" + this.model.get('url_n') + " class='photo'/>");
      return this; // for chainable calls, like .render().el
    }

  });

  var PhotosView = Backbone.View.extend({    
    el: $('body'),

    events: {
      'submit form': 'search_flickr',
      // 'click button#add': 'addItem'
      // 'click .photo': 'larger'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'search_flickr', 'appendPhoto', 'load_more');
      // _.bindAll(this, 'render', 'addItem');

      this.collection = photos_list;
      this.collection.bind('add', this.appendPhoto); // collection event binder

      this.page = 1;
      this.per_page = 9;

      $(window).scroll($.debounce(50 , this.load_more ));   
       
       this.render();
    },
    
    render: function(){
      $(this.el).append("<h1>Flickr Search</h1>");
      // $(this.el).append("<button id='add'>Add list item</button>");
      $(this.el).append("<form action='#'><div><input type='text' /><input type='submit' /></div></form>");
      $(this.el).append("<div id='images'></div>");

      _(this.collection.models).each(function(photo){ // in case collection is not empty
        self.appendPhoto(photo);
      }, this)
    },

    // larger: function(e){
    //   // e.preventDefault();
    //   console.log("inside larger image");
    //   // popup(this.model);

    //   e.preventDefault();

    //     current_photo = $(this)[0];

    //     popup(current_photo);
      
    // },

    search_flickr: function(e){
    // addItem: function(e){
      // e.preventDefault();
      qstring = $("input:first").val();

      if (this.page == 1) {
        $("#images").html("");  
      }
      

      // console.log("Searching with");
      // console.log(qstring);
      // console.log(page);
      // console.log(per_page);

      // $('div', this.el).append("display search results");
      // $('#images').append("display search results here......");

      var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=880e34e574e5ce69aafe7dbc440a6595&text=" + qstring + "&per_page=" + this.per_page + "&page=" + this.page + "&extras=url_n,url_m"

      var src;

      // console.log(photos);
      // console.log(photos_list);

      $.getJSON(url + "&format=json&jsoncallback=?", function(data){

        // console.log(photos);

        if (data.stat == "ok"){
          $.each(data.photos.photo, function(i,item){

              var photo = new Photo();
              photo.set({
                id: item.id,
                title: item.title,
                url_m: item.url_m,
                url_n: item.url_n
                // part2: item.get('part2') + this.counter // modify item defaults
              });

              // console.log(photo);

              // this.collection.add(photo); // add item to collection; view is updated via event 'add'
              // photos.add(photo);
              photos_list.add(photo);


              
            }); 
        }
        else {
          alert("Error occured while loading photos");
        }
          
      });

      return false;

    },

    // appendPhoto: function(item){
    //   // $("<img/>").attr("src", item.get('url_n')).addClass("photo").appendTo("#images");
    //   // $('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>");
    // }

    appendPhoto: function(item){
      var photoView = new PhotoView({
        model: item
      });
      // $('ul', this.el).append(itemView.render().el);
      $("#images").append(photoView.render().el);
    },

    load_more: function(){

      if  ($(window).scrollTop() == $(document).height() - $(window).height()){
           this.page = this.page + 1;
           // search_flickr(qstring);
           this.search_flickr(); 
        }

    }


  });

  // **listView instance**: Instantiate main app view.
  var photosView = new PhotosView();   

  // endless scroll
  // .debounce prevent loading from firing twice
  // $(window).scroll($.debounce(50 , photosView.load_more ));   
})(jQuery);