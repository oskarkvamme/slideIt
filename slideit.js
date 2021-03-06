﻿(function($) {
	$.fn.slideit = function(options) {


		//********** PRIVATE VARIABLES ********//
		var el = $(this);

		var slideshowContainer = el;
		var containerWidth = slideshowContainer.width();

		var slideshowRunning = false;
		var slideshowTimer = {};

		//********** END PRIVATE VARIABLES ********//



		//********** SETTINGS ************//

		var defaults = {
			speed: 700,
			interval : 4000,
			auto: true,
			slideArea: slideshowContainer,
			activeClass: "active",
			notActiveClass : "notActive",
			slideEffect : "slide",
			nextButton : {},
			previousButton : {},
			pagination: false,
			paginationUl : {}
		};

		var opts = $.extend(defaults, options);

		//********** END SETTINGS ************//


		//********** HELPERS ************//

		var isEmpty = function (ob){
   			
   			for(var i in ob){ 
   				return false;
   			}
			return true;
		};

		//********** END HELPERS ************//


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
		        var sideLength = (opts.slideArea.width() - containerWidth / 2);
		        var startPos = sideLength + containerWidth;

		        next.css("left", (startPos + "px"));
		        next.show();

		        animations.setActivePagination(parseInt(next.attr("data-elIndex"), 10));

		        //animate
		        animations.animateSlide(current, next, startPos, opts.slideEffect, true, callback);
		    },
		    slidePrev: function (current, prev, callback) {
		        //place ready for animation
		        var sideLength = (opts.slideArea.width() - containerWidth / 2);
		        var startPos = sideLength + containerWidth;

		        prev.css("left", "-" + startPos + "px");
		        prev.show();

		        animations.setActivePagination(parseInt(prev.attr("data-elIndex"), 10));

		        //animate
		        animations.animateSlide(current, prev, startPos, opts.slideEffect, false, callback);
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

		            if(typeof callback !== "undefined"){
			            callback();
		            }
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
		            prevEl.addClass(opts.activeClass).removeClass("prev").removeClass(opts.notActiveClass);
		            slideshowRunning = false;

		            if(typeof callback !== "undefined"){
			            callback();
		            }
		        });
		    },

		    slideToElement : function(element, callback){
		    	if (slideshowRunning) {
		            return;
		        }

		    	var current = slideshowContainer.children("." + opts.activeClass);

		    	slideshowRunning = true;

		    	element.addClass("next");


		        animations.slideNext(current, element, function () {
		            current.removeClass(opts.activeClass).addClass(opts.notActiveClass);
		            element.addClass(opts.activeClass).removeClass("next").removeClass(opts.notActiveClass);
		            slideshowRunning = false;

		            if(typeof callback !== "undefined"){
			            callback();
		            }
		        });
		    },

		    setActivePagination : function(index){
		    	if(opts.pagination){
		    		var lis = opts.paginationUl.children();
			    	lis.removeClass(opts.activeClass).addClass(opts.notActiveClass);

			    	$(lis[index]).addClass(opts.activeClass).removeClass(opts.notActiveClass);
		    	}
		    	
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
		    },
		    stop : function(){
		    	clearTimeout(slideshowTimer);
		    }
		};


		//********** API FUNCTIONS ********//



		//********** INIT********//
		var initFunctions = {
			
			initNavigation : function(show){
				if(!isEmpty(opts.nextButton)){
					if(show){
						opts.nextButton.click(function(){
							if(opts.auto){
								controlFunctions.stop();
								animations.runSlideshowNext(function(){
									controlFunctions.start();
								});
							}else{
								animations.runSlideshowNext();
							}
						});
					}else{
						opts.nextButton.hide();
					}
					
				}

				if(!isEmpty(opts.previousButton)){
					if(show){
						opts.previousButton.click(function(){
							if(opts.auto){
								controlFunctions.stop();
								animations.runSlideshowPrev(function(){
									controlFunctions.start();
								});
							}else{
								animations.runSlideshowPrev();
							}
						});
					}else{
						opts.previousButton.hide();
					}
					
				}
			},

			initPagination : function(){
				if(opts.pagination){
					if(isEmpty(opts.paginationUl)){
						var tmpPaginationContainer = $("<ul class='pagination' />");
						el.after(tmpPaginationContainer);
						opts.paginationUl = tmpPaginationContainer;
					}
				}

				el.children().each(function(index, elm){
					var element = $(elm);

					var li = $("<li></li>").attr("data-elIndex", index);
					
					if(element.hasClass(opts.activeClass)){
						li.addClass(opts.activeClass);
					}else{
						li.addClass(opts.notActiveClass);
					}

					li.appendTo(opts.paginationUl);


					li.click(function(){
						var currLi = $(this);
						var slideToElementIndex = currLi.attr("data-elIndex");
						var slideToIndex = parseInt(slideToElementIndex, 10);
						var slide = slideshowContainer.children().eq(slideToIndex);

						if(slide.hasClass(opts.activeClass)){
							return;
						}

						if(opts.auto){
							controlFunctions.stop();
							animations.slideToElement(slide, function(){
								controlFunctions.start();
							});

						}else{
							animations.slideToElement(slide);
						}
						

					})
				});
			},

			initSlideShow : function(){

				var allElements = slideshowContainer.children();

				//only run slideshow if it is more then one slides
				if(allElements.length > 1){

					allElements.each(function(index, elem){
						$(elem).attr("data-elIndex", index);
					});

					var currentEl = slideshowContainer.children("div:first");
					var otherEl = slideshowContainer.children("div").not(currentEl);

					//slide show container styles
					if(slideshowContainer.css("position") == "static"){
						slideshowContainer.css("position", "relative");
					}

					//set common style on all slides
					allElements.css("position", "absolute");
					allElements.width(slideshowContainer.width());

					//set active element
					currentEl.addClass(opts.activeClass);
					currentEl.css("left", 0);

					//set inactive
					otherEl.addClass(opts.notActiveClass);
					otherEl.hide();

					//slide area style
					opts.slideArea.css("overflow", "hidden");

					//reset style
					//$("html, body").css("overflow", "hidden");

					//start slide show
					if(opts.auto){
						controlFunctions.start();	
					}

					initFunctions.initNavigation(true);
					initFunctions.initPagination();

				}else{
					initFunctions.initNavigation(false);
				}
			}
		};
		

		initFunctions.initSlideShow();
		
		

		//********** END INIT ********//
	};

})(jQuery);