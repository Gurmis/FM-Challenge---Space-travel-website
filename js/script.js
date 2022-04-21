String.prototype.capitalize = function () { return this.charAt(0).toUpperCase() + this.slice(1); };
(function ($) {

    // nastavenie spravnej velkosti pozadia pri nacitani domovskej stranky
    // var bgWidth = window.matchMedia('(min-width: 601px) and (max-width: 768px)').matches? '100%' : 'auto',
    //     heightVhDifference = ($('html').height()-window.innerHeight)*0.4,
    //     bgHeight = $('html').height()>window.innerHeight? 'calc(100% + ' + heightVhDifference.toString() + 'px)' : 'calc(100%)'

    // $('html').css('backgroundSize', bgWidth + ' ' + bgHeight);

    //nastavenie spravnej sirky pozadia pri zmene velkosti okna
    // $(window).on('resize', function(){
    //     var bgWidth = window.matchMedia('(min-width: 601px) and (max-width: 768px)').matches? '100%' : 'auto';

    //     $('html').css('backgroundSize', bgWidth + ' ' + bgHeight);
    // });

    //breakpoints
    var breakpoint,
        bgSizeWidth,
        bgType;

    function checkScreen() {
        if (window.matchMedia('(min-width: 1051px)').matches) { breakpoint = 'extraLarge' }
        else if ((window.matchMedia('(min-width: 769px) and (max-width: 1050px)')).matches) { breakpoint = 'desktop' }
        else if ((window.matchMedia('(min-width: 601px) and (max-width: 768px)')).matches) { breakpoint = 'tablet' }
        else if ((window.matchMedia('(min-width: 526px) and (max-width: 600px)')).matches) { breakpoint = 'largeMobile' }
        else if ((window.matchMedia('(min-width: 451px) and (max-width: 525px)')).matches) { breakpoint = 'mediumMobile' }
        else if ((window.matchMedia('(min-width: 372px) and (max-width: 450px)')).matches) { breakpoint = 'smallMobile' }
        else if ((window.matchMedia('(max-width: 371px)')).matches) { breakpoint = 'extraSmall' };
        // console.log(breakpoint)

        bgSizeWidth = {
            extraLarge: '100%',
            desktop: 'auto',
            tablet: '100%',
            largeMobile: '100%',
            mediumMobile: 'auto',
            smallMobile: 'auto',
            extraSmall: 'auto'
        };

        bgType = {
            extraLarge: 'desktop',
            desktop: 'desktop',
            tablet: 'tablet',
            largeMobile: 'tablet',
            mediumMobile: 'tablet',
            smallMobile: 'tablet',
            extraSmall: 'tablet'
        };

        // console.log('width: ' + bgSizeWidth[breakpoint]);
        // console.log('type: ' + bgType[breakpoint]);
    }

    checkScreen();
    $(window).on('resize', function () {
        checkScreen();
        setBackgroundSize();
        // console.log(breakpoint)
    });

    //nastavenie velkosti pozadia podla VH po nacitani
    var html = $('html');

    function setBackgroundSize() {
        if (window.innerHeight < html.height()) {
            var extraBgSize = (html.height() - window.innerHeight) * 0.4;

            html.css('backgroundSize', bgSizeWidth[breakpoint] + ' ' + 'calc(100vh + ' + extraBgSize + 'px' + ')')
            console.log(bgSizeWidth[breakpoint] + ' ' + 'calc(100vh + ' + extraBgSize + 'px' + ')')
        }
    };

    setBackgroundSize();


    //aktivovanie parllax efektu na pozadie
    $('html').parallax({ friction: 0.4 });


    //fetch html data
    var newDataCall = $.ajax({
        url: 'sections.html',
        type: 'GET',
        dataType: 'html'

    }).promise();

    var jsonCall = $.ajax({
        url: 'data.json',
        type: 'GET',
        dataType: 'json'

    }).promise().done(function (data) {
        var destinationsList = data.destination
        // console.log(destinationsList)
        destinationsList.forEach(function (item, index) {
            // console.log("'" + 'url(' + item.images.webp + ")'" + index)
            $('#preloader' + (index + 1)).css({ background: 'url(' + item.images.webp + ')' });
            // console.log('$(' + '"' + '#preloader' + (index + 1) + '"' + ')')

        });

    });



    //prva sekcia na kliknutie velkym buttonom
    $('body').on('click', '.btn-main', function (event) {
        event.preventDefault();
        var a = $('.destination'),
            mainClass = 'destination';

        //oznaci sekciu na klik
        a.addClass('selected')
            .parent().siblings().children().removeClass('selected');

        $('body').animate({ opacity: 0 }, 200, function () {
            $('html').css('background-image', 'url(./assets/destination/background-destination-' + bgType[breakpoint] + '.jpg)');

            newDataCall.then(function (data) {
                var newData = $(data).find('main' + '.' + mainClass);

                $('.container').removeClass()
                    .addClass('container ' + mainClass);
                $('main').html(newData.html())
                    .attr({ class: mainClass });
                setBackgroundSize();
            });
        })
            .animate({ opacity: 1 }, 300);



    });


    //prepnutie sekcie na kliknutie hlavnej navigacie
    $('.navigation li').on('click', function (event) {
        event.preventDefault();
        var li = $(this)
        a = li.children('a'),
            mainClass = a.attr('class');

        //oznaci sekciu na klik
        if (a.hasClass('selected')) return;
        else {
            a.addClass('selected')
                .parent().siblings().children().removeClass('selected');



            //navigacia - zmeni background na body + vlozi patricnu sekciu na klik

            $('html').css('background-image', 'url(./assets/' + a.text().slice(2) + '/background-' + a.text().slice(2) + '-' + bgType[breakpoint] + '.jpg)')
            newDataCall.then(function (data) {
                var newData = $(data).find('main' + '.' + mainClass);

                if (newData.length == 1) {
                    $('.container').removeClass()
                        .addClass('container ' + mainClass);
                    $('main').html(newData.html())
                        .attr({ class: mainClass });
                    setBackgroundSize();
                    if (window.matchMedia('(min-width: 1051px)').matches) { $('.vehicle').appendTo('.content') }
                    else { $('.vehicle').insertAfter('.title') };

                    if (window.matchMedia('(min-width: 601px)').matches) {
                        $('.person').appendTo('.content');
                        $('.selector').insertAfter('.bio');
                    }
                    else {
                        $('.person').insertAfter('.title');
                        $('.selector').insertAfter('.person');
                    };
                }
                else {
                    $('main').html('');
                }
            });

            //pri mobilnej verzii skryje menu+overlay
            if (window.matchMedia("(max-width: 600px)").matches) {
                mobileNavClose();
            }


            // $('body').fadeOut('fast', function(){
            //                             $('html').css('background-image', 'url(./assets/' + a.text().slice(2) + '/background-' + a.text().slice(2) + '-desktop.jpg)')
            //                             newDataCall.then(function(data){
            //                                 var newData = $(data).find('main' + '.' + mainClass);                                        

            //                                 if (newData.length == 1) {
            //                                     $('.container').removeClass()
            //                                                    .addClass('container ' + mainClass);
            //                                     $('main').html(newData.html())
            //                                              .attr({class: mainClass});
            //                                 }
            //                                 else {
            //                                     $('main').html('');
            //                                 }
            //                             });
            //                         })
            //          .fadeIn('fast');

        };
    });

    //sub navigacia - zmeni podsekciu na klik
    $('body').on('click', '.sub-navigation li a', function (event) {
        event.preventDefault();
        var a = $(this),
            aIndex = a.parent().index(),
            mainClass = $('main').attr('class');

        //oznaci sekciu na klik
        if (a.hasClass('selected')) return;
        else {
            a.addClass('selected')
                .parent().siblings().children().removeClass('selected');

            //zmeni podsekciu 
            jsonCall.then(function (data) {



                $('.planet').fadeOut(50, function () {


                    $('.planet').css({ backgroundImage: 'url(' + data[mainClass][aIndex].images.webp + ')' });
                    $('.title.pick').html(data[mainClass][aIndex].name);
                    $('.description').html(data[mainClass][aIndex].description);
                    $('.distance').html(data[mainClass][aIndex].distance);
                    $('.travel').html(data[mainClass][aIndex].travel);
                });

                $('.planet').fadeIn();


                $('.vehicle').fadeOut(50, function () {
                    var imageOrientation = window.matchMedia('(min-width: 1051px)').matches ? 'portrait' : 'landscape';

                    $('.vehicle').css({ backgroundImage: 'url(' + data[mainClass][aIndex].images[imageOrientation] + ')' });
                    $('.description').html(data[mainClass][aIndex].description);
                    $('.name').html(data[mainClass][aIndex].name);
                });
                $('.vehicle').fadeIn();
            });
        };
    });

    //selector - zmeni podsekciu na klik
    $('body').on('click', '.selector li a', function (event) {
        event.preventDefault();

        var a = $(this),
            aIndex = a.parent().index(),
            mainClass = $('main').attr('class');

        //oznaci sekciu na klik
        if (a.hasClass('selected')) return;
        else {
            a.addClass('selected')
                .parent().siblings().children().removeClass('selected');

            //zmeni podsekciu 
            jsonCall.then(function (data) {

                $('.person').fadeOut(50, function () {
                    $('.person').css({ backgroundImage: 'url(' + data[mainClass][aIndex].images.webp + ') ' });
                    $('.role').html(data[mainClass][aIndex].role);
                    $('.name').html(data[mainClass][aIndex].name);
                    $('.bio').html(data[mainClass][aIndex].bio);
                });
                $('.person').fadeIn();

            });
        };
    });





    //jquery media queries
    var toggler = $('.toggler'),
        overlay = $('.overlay');
    mobileNav = $('.navigation.top');


    function mobileNavClose() {
        toggler[0].checked = false;
        $('.overlay').fadeOut();
    }

    toggler.on('click', function () {
        if (toggler.is(':checked')) {
            overlay.fadeIn();
            mobileNav.css('display', 'flex');
        }
        else { overlay.fadeOut() }
    });

    overlay.on('click', function () {
        mobileNavClose();
    })

    // $(window).on('resize', function(){
    //     if (window.matchMedia("(max-width: 600px)").matches) {          
    //         if(mobileNav.is(':not(:visible)')) {
    //             mobileNav.css('display', 'flex');
    //         }
    //     }
    //     else if(window.matchMedia("(min-width: 600px)").matches) {
    // mobileNav.css('display', 'none')
    //     }
    // });
    $(window).on('resize', function () {
        // console.log(bgType[breakpoint])
        var mainClass = $('main').attr('class');

        $('html').css('background-image', 'url(./assets/' + mainClass + '/background-' + mainClass + '-' + bgType[breakpoint] + '.jpg)')

        if ($('.container.technology').length == 1) {
            jsonCall.then(function (data) {
                var a = $('.sub-navigation a.selected'),
                    aIndex = a.parent().index(),
                    imageOrientation = window.matchMedia('(min-width: 1051px)').matches ? 'portrait' : 'landscape';

                $('.vehicle').css({ backgroundImage: 'url(' + data[mainClass][aIndex].images[imageOrientation] + ')' });
                if (window.matchMedia('(min-width: 1051px)').matches) { $('.vehicle').appendTo('.content') }
                else { $('.vehicle').insertAfter('.title') }
            });
        }

        else if ($('.container.crew').length == 1) {
            if (window.matchMedia('(min-width: 601px)').matches) {
                $('.person').appendTo('.content');
                $('.selector').insertAfter('.bio');
            }
            else {
                $('.person').insertAfter('.title');
                $('.selector').insertAfter('.person');
            };
        };
    });






})(jQuery);


