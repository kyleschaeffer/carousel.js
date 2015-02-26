/*! carousel.js v1.0 | MIT License | https://github.com/oldrivercreative/carousel */
(function($){
    $.fn.carousel = function(options){
        
        // settings
        var settings = $.extend({}, {
            paging: false,
            navigation: false,
            loop: false,
            autoplay: false,
            delay: 12000,
            buttons: {
                previous: 'Previous',
                next: 'Next',
                navigation: '%i'
            },
            movethreshold: 10,
            swipethreshold: 10,
            oninit: false,
            onupdate: false,
            destroy: false
        }, options);
        
        // autoplay timer
        var timer = false;
        
        // transform?
        window.optimusPrime = false;
        if('WebkitTransform' in document.body.style || 'MozTransform' in document.body.style || 'transform' in document.body.style){
            window.optimusPrime = true;
        }
        
        // carousel
        this.each(function(){
            
            // get objects
            var carousel = $(this);
            var shaker = carousel.find('ul:eq(0)');
            
            // destroy?
            if(settings.destroy){
                carousel.trigger('carousel-destroy');
            }
            
            // create
            else {
                
                // init
                carousel.on('carousel-init', function(){

                    // data
                    carousel.data('carousel-position', 0);
                    carousel.data('carousel-touch-change', 0);
                    carousel.data('carousel-last-touch', false);
                    carousel.data('carousel-item-count', shaker.children().size());

                    // add classes
                    carousel.addClass('ui-carousel');
                    shaker.addClass('ui-carousel-shaker');

                    // paging?
                    if(settings.paging){

                        // previous
                        var previous = $('<button class="previous"><span>' + settings.buttons.previous + '</span></button>');
                        previous.on('click', function(e){
                            e.preventDefault();
                            
                            // not a touch gesture
                            carousel.data('carousel-last-touch', false);
                            
                            // retreat
                            carousel.trigger('carousel-retreat');
                            
                        });
                        carousel.append(previous);

                        // next
                        var next = $('<button class="next"><span>' + settings.buttons.next + '</span></button>');
                        next.on('click', function(e){
                            e.preventDefault();
                            
                            // not a touch gesture
                            carousel.data('carousel-last-touch', false);
                            
                            // advance
                            carousel.trigger('carousel-advance');
                            
                        });
                        carousel.append(next);

                    }
                    
                    // navigation?
                    if(settings.navigation){
                        
                        // nav list
                        var ul = $('<ul class="ui-carousel-nav"/>');
                        for(var i = 0; i < carousel.data('carousel-item-count'); i++){
                            
                            // <button>
                            var navlabel = settings.buttons.navigation.replace('%i', (i+1));
                            var button = $('<button><span>' + navlabel + '</span></button>');
                            button.data('carousel-item', i);
                            button.on('click', function(e){
                                e.preventDefault();
                                
                                // set new position
                                var p = $(this).data('carousel-item');
                                var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                                p = p * slidewidth * -1;
                                carousel.data('carousel-position', p);
                                
                                // not a touch gesture
                                carousel.data('carousel-last-touch', false);

                                // contain
                                carousel.trigger('carousel-contain');
                                
                                // slide
                                carousel.trigger('carousel-slide');
                                
                            });
                            
                            // <li>
                            var li = $('<li/>');
                            li.append(button);
                            
                            // active?
                            if(i == 0){
                                li.addClass('ui-active');
                            }
                            
                            // add to nav list
                            ul.append(li);
                            
                        }
                        
                        // add
                        carousel.append(ul);
                        
                    }
                    
                    // contain
                    carousel.trigger('carousel-contain');
                    
                    // autoplay?
                    if(settings.autoplay){
                        carousel.trigger('carousel-queue');
                    }

                    // oninit?
                    if(typeof(settings.oninit) == 'function'){
                        settings.oninit();
                    }

                });

                // touch-down
                carousel.on('carousel-touch-down', function(e, position){

                    // add classes
                    carousel.addClass('ui-touch-threshold');

                    // starting point
                    carousel.data('carousel-touch-start', {
                        x: position.x,
                        y: $(window).scrollTop()
                    });
                    
                    // disable autoplay while swiping
                    if(settings.autoplay){
                        carousel.trigger('carousel-dequeue');
                    }

                });

                // touch-move
                carousel.on('carousel-touch-move', function(e, position){

                    // threshold?
                    if(carousel.hasClass('ui-touch-threshold')){

                        // get starting position
                        var start = carousel.data('carousel-touch-start');

                        // scrolling?
                        if(Math.abs($(window).scrollTop() - start.y) >= settings.movethreshold){
                            carousel.removeClass('ui-touch-threshold');
                        }

                        // swiping?
                        else if(Math.abs(position.x - start.x) >= settings.movethreshold){
                            carousel.removeClass('ui-touch-threshold').addClass('ui-touch-swiping');
                            $('body').addClass('ui-swiping');
                        }

                    }

                    // swiping?
                    if(carousel.hasClass('ui-touch-swiping')){

                        // position
                        var start = carousel.data('carousel-touch-start');
                        var distance = position.x - start.x;
                        var position = carousel.data('carousel-position');
                        var change = distance / shaker.width() * 100;
                        carousel.data('carousel-touch-change', change);

                        // shake it
                        var p = position + change;
                        if(window.optimusPrime){
                            shaker.css({
                                WebkitTransform: 'translateX(' + p + '%)',
                                MozTransform: 'translateX(' + p + '%)',
                                transform: 'translateX(' + p + '%)'
                            });
                        }
                        else{
                            shaker.css('left', p + '%');
                        }

                        // onupdate?
                        if(typeof(settings.onupdate) == 'function'){
                            settings.onupdate(p);
                        }

                    }

                });

                // touch-up
                carousel.on('carousel-touch-up', function(){

                    // threshold?
                    if(carousel.hasClass('ui-touch-threshold')){

                        // remove classes
                        carousel.removeClass('ui-touch-threshold');

                    }

                    // swiping?
                    else if(carousel.hasClass('ui-touch-swiping')){

                        // remove classes
                        carousel.removeClass('ui-touch-swiping');
                        $('body').removeClass('ui-swiping');

                        // position
                        var position = carousel.data('carousel-position');
                        var change = carousel.data('carousel-touch-change');
                        
                        // swipe?
                        if(change >= settings.swipethreshold){
                            var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                            if(change <= slidewidth){
                                change = slidewidth;
                            }
                        }
                        else if(change <= settings.swipethreshold * -1){
                            var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                            if(change >= slidewidth * -1){
                                change = slidewidth * -1;
                            }
                        }

                        // touch gesture
                        carousel.data('carousel-last-touch', true);
                        
                        // update
                        carousel.data('carousel-position', position + change);

                        // contain
                        carousel.trigger('carousel-contain');

                        // transform
                        carousel.trigger('carousel-slide');

                    }
                    
                    // queue next transition
                    if(settings.autoplay){
                        carousel.trigger('carousel-queue');
                    }

                });
                
                // queue next transition
                carousel.on('carousel-queue', function(){
                    
                    // set timer
                    timer = setTimeout(function(){
                        carousel.trigger('carousel-advance');
                    }, settings.delay);
                    
                });
                
                // de-queue transitions
                carousel.on('carousel-dequeue', function(){
                    
                    // unset timer
                    clearTimeout(timer);
                    
                });

                // advance
                carousel.on('carousel-advance', function(){

                    // advance one slide
                    var p = carousel.data('carousel-position');
                    var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                    p -= slidewidth;
                    carousel.data('carousel-position', p);

                    // contain
                    carousel.trigger('carousel-contain');

                    // slide
                    carousel.trigger('carousel-slide');
                    
                    // autoplay?
                    if(settings.autoplay){
                        carousel.trigger('carousel-dequeue');
                        carousel.trigger('carousel-queue');
                    }

                });

                // retreat
                carousel.on('carousel-retreat', function(){

                    // retreat one slide
                    var p = carousel.data('carousel-position');
                    var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                    p += slidewidth;
                    carousel.data('carousel-position', p);

                    // contain
                    carousel.trigger('carousel-contain');

                    // slide
                    carousel.trigger('carousel-slide');
                    
                    // autoplay?
                    if(settings.autoplay){
                        carousel.trigger('carousel-dequeue');
                        carousel.trigger('carousel-queue');
                    }

                });

                // contain
                carousel.on('carousel-contain', function(){

                    // get slide width
                    var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                    var slidesinview = Math.round(100 / slidewidth);
                    var slides = carousel.data('carousel-item-count');

                    // contain
                    var p = carousel.data('carousel-position');
                    p = Math.round(p / slidewidth) * slidewidth;
                    if(p > 0){
                        if(settings.loop && !carousel.data('carousel-last-touch')){
                            p = slidewidth * (slides - slidesinview) * -1;
                        }
                        else{
                            p = 0;
                        }
                    }
                    else if(p < slidewidth * (slides - slidesinview) * -1){
                        if(settings.loop && !carousel.data('carousel-last-touch')){
                            p = 0;
                        }
                        else{
                            p = slidewidth * (slides - slidesinview) * -1;
                        }
                    }
                    
                    // disable paging
                    if(!settings.loop && settings.paging && p >= 0){
                        carousel.children('button.previous').prop('disabled', true);
                    }
                    else if(!settings.loop && settings.paging){
                        carousel.children('button.previous[disabled]').prop('disabled', false);
                    }
                    if(!settings.loop && settings.paging && p <= slidewidth * (slides - slidesinview) * -1){
                        carousel.children('button.next').prop('disabled', true);
                    }
                    else if(!settings.loop && settings.paging){
                        carousel.children('button.next[disabled]').prop('disabled', false);
                    }

                    // update
                    carousel.data('carousel-position', p);
                    
                    // update navigation?
                    if(settings.navigation){
                        var i = Math.round(Math.abs(p) / slidewidth);
                        var navlist = carousel.children('ul.ui-carousel-nav');
                        navlist.children().removeClass('ui-active');
                        navlist.children().eq(i).addClass('ui-active');
                    }

                });

                // slide
                carousel.on('carousel-slide', function(){

                    // shake it
                    var p = carousel.data('carousel-position');
                    if(window.optimusPrime){
                        shaker.css({
                            WebkitTransform: 'translateX(' + p + '%)',
                            MozTransform: 'translateX(' + p + '%)',
                            transform: 'translateX(' + p + '%)'
                        });
                    }
                    else{
                        shaker.animate({
                            left: p + '%'
                        }, 300);
                    }

                    // onupdate?
                    if(settings.onupdate){
                        settings.onupdate(p);
                    }

                });

                // destroy
                carousel.on('carousel-destroy', function(){

                    // remove data
                    carousel.removeData('carousel-position');
                    carousel.removeData('carousel-item-count');

                    // remove events
                    carousel.off('carousel-init carousel-advance carousel-retreat carousel-slide');

                    // remove paging
                    carousel.children('button.previous,button.next').remove();

                    // remove classes
                    carousel.removeClass('ui-carousel');
                    shaker.removeClass('ui-carousel-shaker');
                    if(window.optimusPrime){
                        shaker.css({
                            WebkitTransform: 'translateX(0%)',
                            MozTransform: 'translateX(0%)',
                            transform: 'translateX(0%)'
                        });
                    }
                    else{
                        shaker.css('left', '0%');
                    }

                    // cancel events?
                    if($('.ui-carousel').size() == 0){
                        $(window).off('resize');
                        $(document).off('mousedown touchstart mousemove touchmove mouseup touchend touchleave touchcancel');
                        $('body').removeClass('ui-draggables-listen');
                    }

                });

                // init
                carousel.trigger('carousel-init');
                
            }

        });

        // listen?
        if(!$('body').hasClass('ui-draggables-listen')){

            // add classes
            $('body').addClass('ui-draggables-listen');

            // resize / orientation
            $(window).on('resize orientationchange', function(e){
                $('.ui-carousel').trigger('carousel-slide');
                $('.ui-carousel').trigger('carousel-contain');
            });

            // touch down
            $(document).on('mousedown touchstart', function(e){
                if(e.pageX || e.originalEvent.touches){

                    // dragging carousel?
                    if($(e.target).is('.ui-carousel,.ui-carousel *:not(.slider-handle,.slider-handle *)') && e.which != 3){

                        // touchdown!
                        var carousel = $(e.target).closest('.ui-carousel');
                        $(carousel).trigger('carousel-touch-down', [
                            {
                                x: e.pageX ? e.pageX : e.originalEvent.touches[0].pageX,
                                y: e.pageY ? e.pageY : e.originalEvent.touches[0].pageY
                            }
                        ]);

                        // prevent cancel in android
                        if(navigator.userAgent.match(/Android/i)){
                            //e.preventDefault();
                        }

                    }

                }
            });

            // touch move
            $(document).on('mousemove touchmove', function(e){
                if(e.pageX || e.originalEvent.touches){

                    if($('body').hasClass('ui-swiping')){
                        e.preventDefault();
                    }

                    // update threshold/swiping carousel
                    $('.ui-carousel.ui-touch-threshold,.ui-carousel.ui-touch-swiping').each(function(){
                        $(this).trigger('carousel-touch-move', [
                            {
                                x: e.pageX ? e.pageX : e.originalEvent.touches[0].pageX,
                                y: e.pageY ? e.pageY : e.originalEvent.touches[0].pageY
                            }
                        ]);
                    });

                }
            });

            // touch up
            $(document).on('mouseup touchend touchleave touchcancel', function(e){

                // end threshold/swiping carousel
                $('.ui-carousel.ui-touch-threshold,.ui-carousel.ui-touch-swiping').each(function(){
                    $(this).trigger('carousel-touch-up');
                });

            });

        }
        
        // done
        return this;
        
    };
}(jQuery));
