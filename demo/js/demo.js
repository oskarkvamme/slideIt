(function(namespace){
	namespace.initSlideshow = function(){
		$("#container").slideit();
	};
})(window.slideItDemo = window.slideItDemo || {});

$(function() {
	slideItDemo.initSlideshow();
});