function popup(p){
	var id = $("#dialog");
    // var image_url = $(this).attr("src");
    var image_url = p.attr("src");
    console.log(image_url);

    var markup = "<div><img src=" + image_url + " /></div>"
    console.log(markup);

    // $.template( "photoTemplate", markup );

    $( "#popup-photo" ).empty();
    // $.tmpl( "photoTemplate", image_url ).appendTo( "#popup-photo" );
    $( "#popup-photo" ).html(markup);

    //Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    //Set heigth and width to mask to fill up the whole screen
    $('#mask').css({
        'width': maskWidth,
        'height': maskHeight
    });

    //transition effect             
    $('#mask').fadeIn(1000);
    $('#mask').fadeTo("slow", 0.8);

    //Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();

    //Set the popup window to center
    $(id).css('top', winH / 2 - $(id).height() / 2);
    $(id).css('left', winW / 2 - $(id).width() / 2);

    //transition effect
    $(id).fadeIn(2000);
}

//if close button is clicked
$('.window .close').click(function(e) {
    //Cancel the link behavior
    e.preventDefault();

    $('#mask').hide();
    $('.window').hide();
});