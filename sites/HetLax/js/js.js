$(document).ready(function(){
	//snap.svg
	// var s = Snap('#bubbles'),
	// 	numberOfBubbles = 25;
	// if($(this).scrollTop() < $('.navbar-container').offset().top){
	// 	for(var i = numberOfBubbles; i >= 0; i--){
	// 		console.log("gherk");
	// 		var largest = 15,
	// 			smallest = 5;

	// 		var pWidth = $('#bubbles').width(),
	// 			pHeight = $('#bubbles').height(),
	// 			randX =	randomIntFromInterval(0, pWidth),
	// 			randY = randomIntFromInterval(0, 20),
	// 			newBubble = s.circle(randX, randY, randomIntFromInterval(smallest, largest));
	// 			newBubble.attr({
	// 			    fill: "#CCF4FF",
	// 			});
	// 	}

	// }
	outerAnim();
	innerAnim();

	function outerAnim(){
		$('.scroll-a').animate({
			'top' : -$(this).outerHeight() + 'px'
		}, 500000, "linear", function(){
				$('.scroll-a').css('top', 0);
				outerAnim();
		});
	}

	function innerAnim(){
		$('.scroll-b').animate({
			'top' : -$(this).outerHeight() + 'px'
		}, 200000, "linear", function(){
				$('.scroll-b').css('top', 0);
				innerAnim();
		});
	}

	var paper = Snap('#menu');
	$('#menu').click(function(event) {
		/* Act on the event */
	});

	var leftVal = 0.2,
		topVal = 0.3,
		lengthVal = (1 - (leftVal * 2));

	var posA = [$('#menu').width() * leftVal, $('#menu').height() * topVal, $('#menu').width() * lengthVal];
	var lineA = paper.rect(posA[0], posA[1], posA[2], 2);
	posA[1] = $('#menu').height() * (1-topVal);
	var lineB = paper.rect(posA[0], posA[1], posA[2], 2);
	lineA.attr({fill: '#FF91A4'});
	lineB.attr({fill: '#FF91A4'});
	var myRotate = 45;
	// var newB = s.circle(5, $('#menu').height() - 5, 5);
	// newB.attr({ fill: '#ccf4ff'});



	animateAlongPath = function (path, element, start, dur, callback) {
		// Get the path length, so we know how many frames we will animate over
		var len = Snap.path.getTotalLength(path);
		Snap.animate(start, len, function (value) {
		// movePoint gets the path attributes at a certain frame
		var movePoint = Snap.path.getPointAtLength(path, value);
			// applies the attributes to our element
			element.attr({
				cx: movePoint.x,
				cy: movePoint.y }
			);
		}, dur, mina.easeinout, function () {
			callback(path);
		});
	};


	function randomIntFromInterval(min,max){
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	// s.height(50);

	moveNav();
	$(".navbar-list").children('li').children('a').eq(0).addClass('selected-navbar');

	$(".arrow-up").css({
    	marginLeft:
    		$(".navbar-list").children('li').children('a').eq(0).offset().left
    	 - $(".navbar-list").offset().left
    	 + ($($(".navbar-list").children('li').children('a').eq(0)).width()/2)
    	 - ($(".arrow-up").css("border-bottom"))
	});

	$(window).scroll(function(event){
		moveNav();
	});

	function moveNav(){
		var navbarInner = $('#navbar-inner');
		if( $(this).scrollTop() > $('.navbar-container').offset().top){
			if($('#navbar-inner').hasClass('navbar-regular')){
				$('#navbar-inner').removeClass('navbar-regular');
				$('#navbar-inner').addClass('navbar-fixed');

				var h = $('#navbar-inner').height();
				$('#about').css({
					"padding-top" : parseInt($('#about').css("padding-top")) + h + "px"
				 });
				// console.log("s: " + parseInt($('#about').css("padding-top")) + h);
			}
		}
		else{
			if( $(this).scrollTop() <= $('.navbar-container').offset().top){
				if($('#navbar-inner').hasClass('navbar-fixed')){
					$('#navbar-inner').removeClass('navbar-fixed').addClass('navbar-regular');
					var h = $('#navbar-inner').height();
					$('#about').css({
						"padding-top" : parseInt($('#about').css("padding-top")) - h + "px"
					});
				}
			}
		}

		$('body').children('section').each(function () {
			// console.log( $(this).attr('id') + " minimum: " + $(this).offset().top  + " - current: " + $(window).scrollTop() + " - maximum: " +  ($(this).offset().top + $(this).outerHeight(true)) );
   			if($(window).scrollTop() >= $(this).offset().top &&
				$(window).scrollTop() <= $(this).offset().top + $(this).outerHeight(true) ){
					    $(".navbar-list").children('li').children('a').removeClass('selected-navbar');
						var thisId = "#" + $(this).attr('id'),
							elem = $(".navbar-list").find("a[href='\\" + thisId + "']");
						elem.addClass('selected-navbar');
						s(elem);
			}
		 });

	}

	$(window).resize(function(event) {
		/* Act on the event */
		console.log('width: ' + $(this).width());
		$('.navbar-list').removeClass('show-navbar');
		$('.navbar-list').children('li').children('a').css('padding', 'initial');
		moveNav();
			var aBox = lineA.getBBox();
			var bBox = lineB.getBBox();
			var rotSpeed = 200;
			lineA.animate( { 'transform': "R" + 0 + "," + aBox.x +"," + aBox.y }, rotSpeed );
			lineB.animate( { 'transform': "R" + 0 + "," + bBox.x +"," + bBox.y2 }, rotSpeed );
	});

	function s(elem){
		$(".arrow-up").css({
	    	marginLeft: elem.offset().left - $(".navbar-list").offset().left + (elem.width()/2) - parseInt($(".arrow-up").css("border-left-width"))
		});
	}

	$('.left').click(function(event) {
		/* Act on the event */
		swipeImage($(this));
	});

	$('.right').click(function(event) {
		swipeImage($(this));
	});


	$('.menu-drop-down-button').click(function(event) {
		/* Act on the event */
		if($('.navbar-list').css('max-height') == '0px'){
			$('.navbar-list').addClass('show-navbar');
			$('.navbar-list').children('li').children('a').css('padding', '20px 0px 20px 0px');
			var aBox = lineA.getBBox();
			var bBox = lineB.getBBox();
			var rotSpeed = 300;
			lineA.animate( { 'transform': "R" + myRotate + "," + aBox.x +"," + aBox.y }, rotSpeed );
			lineB.animate( { 'transform': "R" + -myRotate + "," + bBox.x +"," + bBox.y2 }, rotSpeed );
			// $('.navbar-list').css('max-height', '600px');
			// $('.navbar-list').children('li').children('a').css('padding', '20px 0px 20px 0px');
		} else {
			$('.navbar-list').removeClass('show-navbar');
			$('.navbar-list').children('li').children('a').css('padding', 'initial');
			var aBox = lineA.getBBox();
			var bBox = lineB.getBBox();
			var rotSpeed = 300;
			lineA.animate( { 'transform': "R" + 0 + "," + aBox.x +"," + aBox.y }, rotSpeed );
			lineB.animate( { 'transform': "R" + 0 + "," + bBox.x +"," + bBox.y2 }, rotSpeed );
		}
	});

	function swipeImage(clicked){

		var speed = 300,
			list = clicked.parent('div').children('.swipe-horizontal-container').children('ul'),
			elementToMove = list.find('.visible-img').parent('li'),
			firstElement = list.children('li').eq(0),
			currentElementIndex = elementToMove.index();
			console.log('elemtomove: ' + elementToMove.index());
		if(currentElementIndex == 0 && clicked.hasClass('left') ||
			currentElementIndex == list.children('li').length && clicked.hasClass('right')){
				//
				return;
		}

		var direction = 0,
			marginModifier = 0;
		if(clicked.hasClass('left')){
			direction = -1;
			marginModifier = 1;
		} else if(clicked.hasClass('right')){
			direction = 1;
			marginModifier = -1;
		}

		var indexToGoTo = currentElementIndex + direction;
		console.log('index to go to: ' + indexToGoTo);
		firstElement.animate({
			'margin-left' : elementToMove.width() * indexToGoTo,
			'opacity' : 0
		}, speed, function(){
			firstElement.animate({
				'margin-left' : parseInt(firstElement.css('margin-left')) + (parseInt(elementToMove.css('padding-right') * marginModifier)),
			'opacity' : 1
			}, speed, function(){

				list.find('.visible-img').parent('li').children('img').removeClass('visible-img');
				var x = list.children('li').eq(indexToGoTo);
				x.children('img').addClass('visible-img');

				if(list.children('li').eq(indexToGoTo).children('img').hasClass('visible-img')){
					console.log('quack');
				}
				var h = list.find('.visible-img').parent('li');
				console.log('vis img 2: ' + list.children('li').eq(indexToGoTo).children('img').hasClass('visible-img'));
			});
		});
		// var speed = 300;
		// var list = clicked.parent('div').children('.swipe-horizontal-container').children('ul');
		// var elementToMove = list.find('.visible-img').parent('li');
		// var currentVisibleImgIndex = elementToMove.index();
		// var firstElement = list.children('li').eq(0);
		// if(currentVisibleImgIndex == 0 && clicked.hasClass('left') || currentVisibleImgIndex == list.children('li').length && clicked.hasClass('right')){
		// 	return;
		// }
		// var direction = 0;
		// if(clicked.hasClass('right')){
		// 	direction = 1;
		// } else if(clicked.hasClass('left')){
		// 	direction = -1;
		// }

		// firstElement.animate({
		// 	'margin-left': (currentVisibleImgIndex() + direction) *
		// }, speed, function() {

		// });
		// } else {
		// 	var direction = 0;
		// 	if(clicked.hasClass('right')){
		// 		direction = -1;
		// 	}  else if(clicked.hasClass('left')){
		// 		direction = 1;
		// 	}
		// 	var nextIndex = currentVisibleImgIndex + (-1 * direction);

			/*
				move the first element to the left by the width of the current element
				once that's done, make the first element move over by the padding of the current element
				make the next element the current element by giving it the visible-img class
		// 	*/

		// 	firstElement.animate({
		// 		'margin-left' : direction * elementToMove.children('img').width(),
		// 		// 'opacity' : 0
		// 	}, speed, function(){
		// 		console.log('x: ' + direction);
		// 		console.log('mleft: ' + parseInt(firstElement.css('margin-left')));
		// 			console.log('width: ' + parseInt(elementToMove.css('padding-right')));
		// 		firstElement.animate({
		// 			'margin-left' : (direction * parseInt(elementToMove.css('padding-right'))) + parseInt(firstElement.css('margin-left'))
		// 		}, speed, function(){
		// 			list.children('li').eq(nextIndex).children('img').addClass('visible-img');
		// 			elementToMove.children('img').removeClass('visible-img');
		// 		})
		// 		elementToMove.animate({
		// 			// 'opacity' : 0
		// 		}, speed)
		// 	});
		// }
		// if(currentVisibleImgIndex == 0 && clicked.hasClass('left') || currentVisibleImgIndex == list.children('li').length && clicked.hasClass('right')){
		// 	console.log("can't go back");
		// 	return;
		// }

		// var direction = 0;
		// if(clicked.hasClass('left')){ direction = -1 * currentVisibleImgIndex;}
		// else { direction = 1 * currentVisibleImgIndex}


		// elementToMove.animate({
		// 	'margin-left': direction * elementToMove.children('img').width()
		// }, speed, function(){

		// });
		// if(currentVisibleImgIndex > 0){

		// }


	}


	// function swipeImage(clicked, numberToMove){
	// 	var list = clicked.parent('div').children('.swipe-horizontal-container').children('ul');
	// 	var elem = list.find('.visible-img').parent('li');
	// 	var elementToMove = elem.parent('li').eq(0);
	// 	var currentVisibleImgIndex = elem.parent('li').index();

	// 	if(currentVisibleImgIndex == 0 && clicked.hasClass('left') || currentVisibleImgIndex == list.children('li').length && clicked.hasClass('right')){
	// 		console.log("can't go back");
	// 		return;
	// 	}
	// 	var direction = 0;
	// 	if(clicked.hasClass('left')){ direction = 1 * numberToMove;}
	// 	else { direction = -1 * numberToMove;}
	// 	var elementToMoveTo = elem.parent('li').eq(elem.parent('li').index()+direction);

	// 	elementToMove.animate({
	// 		'margin-left': direction * elem.children('img').width()
	// 	}, 200, function(){
	// 		elementToMove.animate({
	// 			'margin-left' : parseInt(elementToMove.css('margin-left')) + parseInt(elem.css('padding-right'));
	// 		}, 200);
	// 	});
	// 	elem.removeClass('.visible-img');
	// 	elementToMove.addClass('.visible-img');
	// }


	$(".navbar-list").children('li').children('a').click(function(event){

		if($('.navbar-list').hasClass('show-navbar')){
			$('.navbar-list').removeClass('show-navbar');
			$('.navbar-list').children('li').children('a').css('padding', 'initial');
			var aBox = lineA.getBBox();
			var bBox = lineB.getBBox();
			var rotSpeed = 300;
			lineA.animate( { 'transform': "R" + 0 + "," + aBox.x +"," + aBox.y }, rotSpeed );
			lineB.animate( { 'transform': "R" + 0 + "," + bBox.x +"," + bBox.y2 }, rotSpeed );
		}

		event.preventDefault();
		var clickedButton = $(this),
			speedVal = $(window).scrollTop() - $( $.attr(this, 'href') ).offset().top;

		if(speedVal < 0){
			speedVal *= -1;
		}
		speedVal = Math.floor(speedVal/100)*100;
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top + 1
	    }, speedVal * .75);
	    $(".navbar-list").children('li').children('a').removeClass('selected-navbar');
	    clickedButton.addClass('selected-navbar');
	    $(".arrow-up").animate({
	    	marginLeft: $(this).offset().left
	    				- $(".navbar-list").offset().left
	    				+ ($(this).width()/2)
	    				- parseInt($(".arrow-up").css("border-left-width"))
		}, 200);
	});

});
