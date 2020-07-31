/* ===============================================================
 * Menu Toggle Plugin v1.0.0
 * http://cerebromusic.com/docs/#menus
 * Copyright 2015 Cerebro Music
 * ===============================================================
 * Animates vertical and horizontal menus to slide open. 
 * HTML: Add a class to the elements that will trigger the menu opening.
 * To push page with menu, add class 'menu-push' to the site wrapper
 * JavaScript: $('.trigger').menu('action'); 
 * Actions: 'left slide', 'right slide', 'left push', 'right push'
 * =============================================================== */

(function($) {
	'use strict';
	$.fn.menu = function (action) {
		
	function toggleLeftMenu () {
		$('.menu-left').toggleClass('menu-left-closed');
	}

	function toggleRightMenu () {	
		$('.menu-right').toggleClass('menu-right-closed');
	}

	function pushToRight () {
		$('.menu-push').toggleClass('menu-push-to-right');

	}

	function pushToLeft () {
		$('.menu-push').toggleClass('menu-push-to-left');
	}
		return this.each(function(){
			switch (action) {
				case "left slide":
					$(this).click(function () {
						toggleLeftMenu();
					});
					break;
				case "right slide":
					$(this).click(function () {
						toggleRightMenu();
					});
					break;
				case "right push":
					$(this).click(function () {
						pushToLeft();
						toggleRightMenu();	
					});
					break;
				case "left push":
					$(this).click(function () {
						pushToRight();
						toggleLeftMenu();
					});
					break;
				default:
					console.log('nothing triggered');
			}
		});
};

})(jQuery);

$('.right-toggle').menu('right slide');
      $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      });