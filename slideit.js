(function($) {
	$.fn.slideit = function(options) {
		//********** SETTINGS ************//

		var defaults = {
			speed: 700,
			interval : 8000,
			auto: true,
			slideAreaClass: "body",
			activeClass: "active",
			notActiveClass : "notActive"
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
			slideNext: function (current, next, callback) {
		        //place ready for animation
		        var slideLength = (slideArea.width() - containerWidth / 2);
		        var startPos = slideLength + containerWidth;

		        next.css("left", (startPos + "px"));
		        next.css("opacity", "0");
		        next.show();

		        //animate
		        $.when(
		            $.Deferred(function (dfd) {
		                current.animate({
		                    //translateX: '-=' + startPos,  
		                    left: '-=' + startPos,
		                    opacity: 0
		                }, opts.speed, dfd.resolve);
		            }).promise(),

		            $.Deferred(function (dfd) {
		                next.animate({
		                    //translateX: '-=' + startPos, 
		                    left: '-=' + startPos,
		                    opacity: 1
		                }, opts.speed, dfd.resolve);
		            }).promise()

		        ).then(callback);
		    },
		    slidePrev: function (current, prev, callback) {
		        //place ready for animation
		        var sideLength = (slideArea.width() - containerWidth / 2);
		        var startPos = sideLength + containerWidth;

		        prev.css("left", "-" + startPos + "px");
		        prev.css("opacity", "0");
		        prev.show();

		        //animate
		        $.when(
		            $.Deferred(function (dfd) {
		                current.animate({
		                    left: '+=' + startPos,
		                    //                    translateX: '+=' + startPos,
		                    opacity: 0
		                }, opts.speed, dfd.resolve);
		            }).promise(),

		            $.Deferred(function (dfd) {
		                prev.animate({
		                    left: '+=' + startPos,
		                    //                    translateX: '+=' + startPos, 
		                    opacity: 1
		                }, opts.speed, dfd.resolve);
		            }).promise()

		        ).then(callback);
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