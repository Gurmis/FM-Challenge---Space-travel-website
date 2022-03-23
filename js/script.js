String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1);};
(function($) {

        //fetch html data
        var newDataCall =$.ajax({
            url: 'sections.html',
            type: 'GET',
            dataType: 'html'
            
        }).promise();

        var jsonCall =$.ajax({
            url: 'data.json',
            type: 'GET',
            dataType: 'json'
            
        }).promise();



        //prva sekcia na kliknutie velkym buttonom
        $('body').on('click', '.btn-main', function(event){
            event.preventDefault();
            var a         = $('.destination'),
                mainClass = 'destination';

            //oznaci sekciu na klik
            a.addClass('selected') 
                .parent().siblings().children().removeClass('selected');

            $('body').fadeOut('fast', function(){
                $(this).css('background-image', 'url(./assets/destination/background-destination-desktop.jpg)');
                
                newDataCall.then(function(data){
                    var newData = $(data).find('main' + '.' + mainClass);                                        

                    $('main').html(newData.html())
                                    .attr({class: mainClass});
                });
            })
                    .fadeIn('fast');
        });

        
        //prepnutie sekcie na kliknutie hlavnej navigacie
        $('.navigation li').on('click', 'a', function(event){
            event.preventDefault();
            var a         = $(this),
                mainClass = a.attr('class');
            
        //oznaci sekciu na klik
        if (a.hasClass('selected')) return;
        else {
            a.addClass('selected')
                .parent().siblings().children().removeClass('selected');



        //navigacia - zmeni background na body + vlozi patricnu sekciu na klik
        $('body').fadeOut('fast', function(){
                                    $(this).css('background-image', 'url(./assets/' + a.text().slice(2) + '/background-' + a.text().slice(2) + '-desktop.jpg)')
                                    newDataCall.then(function(data){
                                        var newData = $(data).find('main' + '.' + mainClass);                                        

                                        if (newData.length == 1) {
                                            $('main').html(newData.html())
                                                     .attr({class: mainClass});
                                        }
                                        else {
                                            $('main').html('');
                                        }
                                    });
                                })
                 .fadeIn('fast');
                
        };
    });

        //sub navigacia - zmeni podsekciu na klik
        $('body').on('click', '.sub-navigation li a', function(event){
            event.preventDefault();
            var a         = $(this),
                aIndex    = a.parent().index(),
                mainClass = $('main').attr('class');
                
                //oznaci sekciu na klik
            if (a.hasClass('selected')) return;
            else {
                a.addClass('selected')
                .parent().siblings().children().removeClass('selected');

                //zmeni podsekciu 
                jsonCall.then(function(data){
                    $('.planet').fadeOut(50, function(){
                        $('.planet').css({background: 'url(' + data[mainClass][aIndex].images.webp + ')'});
                        $('.title.pick').html(data[mainClass][aIndex].name);
                        $('.description').html(data[mainClass][aIndex].description);
                        $('.distance').html(data[mainClass][aIndex].distance);
                        $('.travel').html(data[mainClass][aIndex].travel);
                    });
                    $('.planet').fadeIn();

                    $('.vehicle').fadeOut(50, function(){
                        $('.vehicle').css({backgroundImage: 'url(' + data[mainClass][aIndex].images.portrait + ')'});
                        $('.description').html(data[mainClass][aIndex].description);
                        $('.name').html(data[mainClass][aIndex].name);
                    });
                    $('.vehicle').fadeIn();
                });
            };
        });

        //selector - zmeni podsekciu na klik
        $('body').on('click', '.selector li a', function(event){
            event.preventDefault();

            var a         = $(this),
                aIndex    = a.parent().index(),
                mainClass = $('main').attr('class');

            //oznaci sekciu na klik
            if (a.hasClass('selected')) return;
            else {
                a.addClass('selected')
                 .parent().siblings().children().removeClass('selected');

                //zmeni podsekciu 
                jsonCall.then(function(data){
                    $('.person').fadeOut(50, function(){
                        $('.person').css({background: 'url(' + data[mainClass][aIndex].images.webp + ') center bottom no-repeat'})
                        $('.role').html(data[mainClass][aIndex].role)
                        $('.name').html(data[mainClass][aIndex].name)
                        $('.bio').html(data[mainClass][aIndex].bio)
                    });
                    $('.person').fadeIn();
                });
            };
        });


    //aktivovanie parllax efektu na pozadie
    $('body').parallax({ friction: 0.4 });
          
})(jQuery); 

