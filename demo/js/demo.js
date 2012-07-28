(function(namespace){
	namespace.initSlideshow = function(){
		$("#normalContainer").slideit({"slideArea" : $("#normalContainer")});
		$("#wideContainer").slideit({"slideArea" : $("#wideContainer")});
	};
})(window.slideItDemo = window.slideItDemo || {});

$(function() {
	slideItDemo.initSlideshow();
});