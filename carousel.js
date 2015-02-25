/*! carousel.js v1.0 | MIT License | git.io/carouseljs */
(function($){
	$.fn.carousel = function(options){
		
		// settings
		var settings = $.extend({}, {
			paging: false,
            navigation: false,
			movethreshold: 10,
			swipethreshold: 10,
			oninit: false,
			onupdate: false,
            destroy: false
		}, options);
        
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
                    carousel.data('carousel-item-count', shaker.children().size());

                    // add classes
                    $(carousel).addClass('ui-carousel');
                    $(shaker).addClass('ui-carousel-shaker');

                    // paging?
                    if(settings.paging){

                        // previous
                        var previous = $('<button class="previous"><span class="icon-arrow-left5"></span></button>');
                        previous.on('click', function(e){
                            e.preventDefault();
                            carousel.trigger('carousel-retreat');
                        });
                        carousel.append(previous);

                        // next
                        var next = $('<button class="next"><span class="icon-arrow-right5"></span></button>');
                        next.on('click', function(e){
                            e.preventDefault();
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
                            var button = $('<button><span>' + (i+1) + '</span></button>');
                            button.data('carousel-item', i);
                            button.on('click', function(e){
                                e.preventDefault();
                                
                                // set new position
                                var p = $(this).data('carousel-item');
                                var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                                p = p * slidewidth * -1;
                                carousel.data('carousel-position', p);

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

                    // oninit?
                    if(settings.oninit){
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
                        if(settings.onupdate){
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
                            change = slidewidth;
                        }
                        else if(change <= settings.swipethreshold * -1){
                            var slidewidth = shaker.children('li:eq(0)').width() / shaker.width() * 100;
                            change = slidewidth * -1;
                        }

                        // update
                        carousel.data('carousel-position', position + change);

                        // contain
                        carousel.trigger('carousel-contain');

                        // transform
                        carousel.trigger('carousel-slide');

                    }

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
                        p = 0;
                    }
                    else if(p < slidewidth * (slides - slidesinview) * -1){
                        p = slidewidth * (slides - slidesinview) * -1;
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

            // resize
            $(window).on('resize', function(e){
                $('.ui-carousel').trigger('carousel-slide');
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
