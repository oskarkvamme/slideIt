// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {

	var pluginName = 'slideit',
      	document = window.document,
      	defaults = {
        	speed: 700,
			interval : 4000,
			auto: true,
			slideArea: $("body"),
			activeClass: "active",
			notActiveClass : "notActive",
			slideEffect : "slide"
      	};

		// The constructor
		function SlideIt( element, options ) {
			this.element = element;

			this.options = $.extend( {}, defaults, options) ;

			this._defaults = defaults;
			this._name = pluginName;

			this.init();
		}

		SlideIt.prototype.init = function () {
			// Place initialization logic here
			// You already have access to the DOM element and the options via the instance, 
			// e.g., this.element and this.options
			var opts = this.options;
			var el = $(this.element);

			//********** PRIVATE VARIABLES ********//
		
			var slideshowContainer = opts.slideArea;
			var containerWidth = slideshowContainer.width();

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
			        var sideLength = (opts.slideArea.width() - containerWidth / 2);
			        var startPos = sideLength + containerWidth;

			        next.css("left", (startPos + "px"));
			        next.show();

			        //animate
			        animations.animateSlide(current, next, startPos, opts.slideEffect, true, callback);
			    },
			    slidePrev: function (current, prev, callback) {
			        //place ready for animation
			        var sideLength = (opts.slideArea.width() - containerWidth / 2);
			        var startPos = sideLength + containerWidth;

			        prev.css("left", "-" + startPos + "px");
			        prev.show();

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
			    },

			    stop : function(){
			    	clearTimeout(slideshowTimer);
			    },

			    next : function(){
			    	console.log("next");
			    },

			    prev : function(){
					console.log("prev");
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
				}
				
			};

			initSlideShow();

			//********** END INIT ********//
		};

		// A really lightweight plugin wrapper around the constructor, 
		// preventing against multiple instantiations
		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new SlideIt( this, options ));
				}
		});
}

}(jQuery, window));