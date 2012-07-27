(function($) {
	$.fn.slideit = function(options) {
		//********** SETTINGS ************//

		var defaults = {
			speed: 700,
			interval : 8000,
			auto: true,
			slideAreaClass: "body",
			activeClass: "active",
			notActiveClass : "notActive",
			slideEffect : "slide"
		};

		var opts = $.extend(defaults, options);

		//********** END SETTINGS ************//



		//********** PRIVATE VARIABLES ********// 
		
		var slideshowContainer = $(this);
		var containerWidth = slideshowContainer.width();

		var slideArea = {};
		var slideAreaTmp = $(opts.slideAreaClass);

		if(slideAreaTmp.length > 0){
			slideArea = slideAreaTmp;
		}else{
			slideArea = $("." + opts.slideAreaClass);
		}

		var slideshowRunning = false;
		var slideshowTimer = {};
		
		//********** END PRIVATE VARIABLES ********//



		//********** RENDER FUNCTIONS ********//

		var animations = {
			animateSlide : function(current, next, startPos, effect, direction, callback){
				if(effect == "slideAndFade"){
					next.css({"opacity" : 0});
				}
				
				var directionChar = '-';
				if(!direction){
					var directionChar = '+'; 
				}

				$.when(
		            $.Deferred(function (dfd) {
		            	switch(effect){
		            		case "slideAndFade": 
		            			current.animate({
				                    left: directionChar + '=' + startPos,
				                    opacity: 0
				                }, opts.speed, dfd.resolve);		
		            		break;
		            		case "slide":
		            			current.animate({
				                    left: directionChar + '=' + startPos
				                }, opts.speed, dfd.resolve);
		            		break;
		            			current.animate({
				                    left: directionChar + '=' + startPos
				                }, opts.speed, dfd.resolve);
				                break;
		            		default:
		            	}
		                
		            }).promise(),

		            $.Deferred(function (dfd) {
		                switch(effect){
		            		case "slideAndFade": 
		            			next.animate({
				                    left: directionChar + '=' + startPos,
				                    opacity: 1
				                }, opts.speed, dfd.resolve);		
		            		break;
		            		case "slide":
		            			next.animate({
				                    left: directionChar + '=' + startPos
				                }, opts.speed, dfd.resolve);
		            		break;
		            			next.animate({
				                    left: directionChar + '=' + startPos
				                }, opts.speed, dfd.resolve);
				                break;
		            		default:
		            	}
		            }).promise()

		        ).then(callback);
			},

			slideNext: function (current, next, callback) {
		        //place ready for animation
		        var sideLength = (slideArea.width() - containerWidth / 2);
		        var startPos = sideLength + containerWidth;

		        next.css("left", (startPos + "px"));
		        next.show();

		        //animate
		        animations.animateSlide(current, next, startPos, opts.slideEffect, true, callback);
		        // $.when(
		        //     $.Deferred(function (dfd) {
		        //     	switch(slideEffect){
		        //     		case "slideAndFade": 
		        //     			current.animate({
				      //               left: '-=' + startPos,
				      //               opacity: 0
				      //           }, opts.speed, dfd.resolve);		
		        //     		break;
		        //     		case "slide":
		        //     			current.animate({
				      //               left: '-=' + startPos
				      //           }, opts.speed, dfd.resolve);
		        //     		break;
		        //     			current.animate({
				      //               left: '-=' + startPos
				      //           }, opts.speed, dfd.resolve);
				      //           break;
		        //     		default:
		        //     	}
		                
		        //     }).promise(),

		        //     $.Deferred(function (dfd) {
		        //         switch(slideEffect){
		        //     		case "slideAndFade": 
		        //     			next.animate({
				      //               left: '-=' + startPos,
				      //               opacity: 1
				      //           }, opts.speed, dfd.resolve);		
		        //     		break;
		        //     		case "slide":
		        //     			next.animate({
				      //               left: '-=' + startPos
				      //           }, opts.speed, dfd.resolve);
		        //     		break;
		        //     			next.animate({
				      //               left: '-=' + startPos
				      //           }, opts.speed, dfd.resolve);
				      //           break;
		        //     		default:
		        //     	}
		        //     }).promise()

		        // ).then(callback);
		    },
		    slidePrev: function (current, prev, callback) {
		        //place ready for animation
		        var sideLength = (slideArea.width() - containerWidth / 2);
		        var startPos = sideLength + containerWidth;

		        prev.css("left", "-" + startPos + "px");
		        prev.show();

		        //animate
		        animations.animateSlide(current, prev, startPos, opts.slideEffect, false, callback);
		        // $.when(
		        //     $.Deferred(function (dfd) {
		        //         switch(slideEffect){
		        //     		case "slideAndFade": 
		        //     			current.animate({
				      //               left: '+=' + startPos,
				      //               opacity: 0
				      //           }, opts.speed, dfd.resolve);		
		        //     		break;
		        //     		case "slide":
		        //     			current.animate({
				      //               left: '+=' + startPos
				      //           }, opts.speed, dfd.resolve);
		        //     		break;
		        //     			current.animate({
				      //               left: '+=' + startPos
				      //           }, opts.speed, dfd.resolve);
				      //           break;
		        //     		default:
		        //     	}
		        //     }).promise(),

		        //     $.Deferred(function (dfd) {
		        //         prev.animate({
		        //             left: '+=' + startPos,
		        //             opacity: 1
		        //         }, opts.speed, dfd.resolve);
		        //     }).promise()

		        // ).then(callback);
		    },
		    
		    runSlideshowNext: function (callback) {
		        //do nothing if it is already animating
		        if (slideshowRunning) {
		            return;
		        }

		        slideshowRunning = true;

		        //element in focus
		        var current = slideshowContainer.children("." + opts.activeClass);

		        //next or first
		        var nextEl = {};
		        if (current.next().hasClass(opts.notActiveClass)) {
		            nextEl = current.next();
		        } else {
		            nextEl = slideshowContainer.children("div:first");
		        }
		        nextEl.addClass("next");
		        //animate
		        animations.slideNext(current, nextEl, function () {
		            current.removeClass(opts.activeClass).addClass(opts.notActiveClass);
		            nextEl.addClass(opts.activeClass).removeClass("next").removeClass(opts.notActiveClass);
		            slideshowRunning = false;

		            callback();
		        });
		    },
		    runSlideshowPrev: function (callback) {

		        //do nothing if it is already animating
		        if (slideshowRunning) {
		            return;
		        }

		        slideshowRunning = true;


		        var current = slideshowContainer.children("." + opts.activeClass);
		        //prev or first
		        var prevEl = {};
		        if (current.prev().hasClass(opts.notActiveClass)) {
		            prevEl = current.prev();
		        } else {
		            prevEl = slideshowContainer.children("div:last");
		        }

		        prevEl.addClass("prev");

		        //animate
		        animations.slidePrev(current, prevEl, function () {

		            current.removeClass(opts.activeClass).addClass(opts.notActiveClass);
		            prevEl.addClass(opts.activeClass).removeClass("prev").removeClass(opts.activeClass);
		            slideshowRunning = false;

		            callback();
		        });
		    }
		};

		//********** END RENDER FUNCTIONS ********//



		//********** API FUNCTIONS ********//


		var controlFunctions = {
			start : function(){
		    	//clear timeout
		    	clearTimeout(slideshowTimer);

		    	//run slideshow
		    	slideshowTimer = setTimeout(function(){
		    		animations.runSlideshowNext(function(){
		    			controlFunctions.start();
		    		});
		    	}, opts.interval);
		    }
		};

		//********** API FUNCTIONS ********//



		//********** INIT********//

		var initSlideShow = function(){

			var allElements = slideshowContainer.children();

			//only run slideshow if it is more then one slides
			if(allElements.length > 1){
				var currentEl = slideshowContainer.children("div:first");
				var otherEl = slideshowContainer.children("div").not(currentEl);

				//slide show container styles
				slideshowContainer.css("position", "relative");

				//set common style on all slides
				allElements.css("position", "absolute");
				allElements.width(slideshowContainer.width());

				//set active element
				currentEl.addClass(opts.activeClass);

				//set inactive
				otherEl.addClass(opts.notActiveClass);
				otherEl.hide();

				//slide area style
				slideArea.css("overflow", "hidden");

				//reset style
				$("html, body").css("overflow", "hidden");

				//start slide show
				controlFunctions.start();	
			}
			
		};

		initSlideShow();

		//********** END INIT ********//
	};

})(jQuery);