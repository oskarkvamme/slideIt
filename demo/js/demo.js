(function(namespace){
	namespace.initSlideshow = function(){
		$("#normalContainer").slideit({"slideArea" : $("#normalContainer"), "nextButton" : $(".nextB"), "previousButton" : $(".prevB"), "pagination" : true});


		// $("#wideContainer").slideit({"slideArea" : $("#wideContainer")});
	};
})(window.slideItDemo = window.slideItDemo || {});

$(function() {
	slideItDemo.initSlideshow();
});