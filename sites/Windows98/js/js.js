$(document).ready(function(){



  var distortInterlace = function(){
    var randomMargin = Math.floor(Math.random() * ((45-(-45))+1) + (-45));
    var eq = Math.floor(Math.random() * ((0-(3))+1) + (3));
    distort = setTimeout(function(){
          $('.interlace-element').eq(eq).css('margin-top', randomMargin + 'px')
      },2800, resetInterlace);
  }

  $('.desktop-icon').each(function(){
    var thisElem = $(this);

  });

  function resetInterlace(){
    $('.interlace-element').css('margin-top', 0 + 'px')
  }

  console.log('length: ' + $('.move-down-line').length);
  for(var z = 0; z < $('.move-down-line').length; z++){
    var val =  (z*2 / 10);
    val += 's';
    var heightVal = $(window).height();
    var devisionVal = heightVal/$('.move-down-line').length;
    console.log('val' + val + '\ndivision: ' + devisionVal + "\nx: " + devisionVal/60);
    var fd = val;
    var q = (.5*z) * Math.round((devisionVal/60)) + 's';
    $('.move-down-line').eq(z).css('animation-delay', q);
    $('.move-down-line').eq(z).css('-webkit-animation-delay: ', q);
  }

  $('.window').mousedown(function(event){
    //dont draw selection box and dont removeclass
    event.stopPropagation();
    var thisWindow = $(this).children('.bar');
    if(thisWindow.hasClass('selected-window')){

    } else {
      $('.selected-window').removeClass('selected-window');
      thisWindow.addClass('selected-window');
    }
  }).mouseup(function(event){

  });


  $('.desktop-icon').click(function(event){
    event.stopPropagation();

  })

  $('.desktop-icon').mousedown(function(event){
    if($(this).hasClass('icon-selected')){
      console.log($('icon-selected').length);
      if($('icon-selected').length > 1){
          $('.icon-selected').removeClass('icon-selected');
          $(this).addClass('icon-selected');
      } else {
        $('.icon-selected').removeClass('icon-selected');
      }
    } else {
      $('.icon-selected').removeClass('icon-selected');
      $(this).addClass('icon-selected');
    }
    var thisElem = $(this),
        startX = event.pageX,
        startY = event.pageY,
        left = thisElem.offset().left,
        w = thisElem.outerWidth(),
        top = thisElem.offset().top,
        differenceX = startX - left,
        differenceY = startY - top;
        thisElem.css('margin-left', startX - differenceX);
        thisElem.css('margin-top', startY -  differenceY);
        thisElem.addClass('moving-icon');
        thisElem.addClass('current-moving-icon');
        thisElem.data('differenceX', differenceX);
        thisElem.data('differenceY', differenceY);
        console.log('startX: ' + startX);
        console.log('startY: ' + startY);
  }).mouseup(function(event){
    var iconToMove = $('.moving-icon');
    iconToMove.data('differenceX', null);
    iconToMove.data('differenceY', null);
    thisElem.removeClass('current-moving-icon');
  });


  $(document).mousemove(function(event){
    var iconToMove = $('.current-moving-icon');
    if(iconToMove.data('differenceY') != null && iconToMove.data('differenceX') != null){
    }
  }).mousemove(function(event){
    var iconToMove = $('.current-moving-icon');
    if(iconToMove.data('differenceX') != null && iconToMove.data('differenceY') != null){
      var differenceX = iconToMove.data('differenceX'),
          differenceY = iconToMove.data('differenceY'),
          currX = event.pageX,
          currY = event.pageY;
          iconToMove.css('margin-left', currX - differenceX);
          iconToMove.css('margin-top', currY - differenceY);
          iconToMove.addClass('icon-selected');
    }
  }).mouseup(function(event){
    var iconToMove = $('.current-moving-icon');
    iconToMove.data('differenceX', null);
    iconToMove.data('differenceY', null);
    iconToMove.removeClass('current-moving-icon');
  });


  $('.desktop-icon').mousedown(function(event){
    event.stopPropagation();
  });

  $('body').mouseleave(function(event){
    if(!$('.selection-box').hasClass('hidden-box')){
      var thisElem = $('.desktop');
      thisElem.data('startX', null);
      thisElem.data('startY', null);
      $('.selection-box').css('height', 0);
      $('.selection-box').css('width', 0);
      $('.selection-box').css('margin-top', 0);
      $('.selection-box').css('margin-left', 0);
      $('.selection-box').addClass('hidden-box');
    }
    $('.current-moving-icon').removeClass('.current-moving-icon');
  });

  /**
   *  Returns the coordinates on the page of the position of each corner of a given element
   */
  function getElementMinsandMaxes(element){
    var h = element.outerHeight(),
        w = element.outerWidth(),
        x = element.offset().left,
        y = element.offset().top;
        return {topLeft : [x, y],
                topRight : [(x + w), y],
                botLeft : [x, (y + h)],
                botRight : [(x + w), (y + h)]
        }
  }

  function checkIfInside(inner, outer){
    var outerCoords = getElementMinsandMaxes(outer),
        innerCoords = getElementMinsandMaxes(inner);
    if(outerCoords.topLeft[0] < innerCoords.botRight[0] && outerCoords.topLeft[1] < innerCoords.botRight[1]){
      if(outerCoords.botRight[0] > innerCoords.botRight[0] && outerCoords.botRight[1] > innerCoords.botRight[1] ||
          outerCoords.botRight[0] > innerCoords.topLeft[0] && outerCoords.botRight[1] > innerCoords.topLeft[1]){
           return true;
      }
    } else {
      return false;
    }
  }

  function getTaskbarHeight(){
    return $('.taskbar').outerHeight();
  }

  $('body').mousedown(function(event){
    $('.selected-window').removeClass('selected-window');
    var startX = event.pageX,
        startY = event.pageY,
        thisElem = $('.desktop');
    if(startY < $(window).height() - getTaskbarHeight()){
      $('.selection-box').css('margin-left', startX);
      $('.selection-box').css('margin-top', startY);
      thisElem.data('startX', startX);
      thisElem.data('startY', startY);
    }
  }).mousemove(function(event){
    var thisElem = $('.desktop'),
        selectionBox = $('.selection-box'),
        startX = thisElem.data('startX'),
        startY = thisElem.data('startY'),
        currX = event.pageX,
        currY = event.pageY;
    if(startX != null && startY != null){
        $('body').addClass('cursor-default');
        var differenceX = Math.abs(startX - currX),
            differenceY = Math.abs(startY - currY);
            selectionBox.removeClass('hidden-box');
        //cursor is dragged lower and to the right
        if(currX >= startX && currY >= startY){
            $('.selection-box').css('width',differenceX);
            $('.selection-box').css('height',differenceY);
        }
        else if(currX >= startX && currY < startY){
            $('.selection-box').css('margin-top',currY);
            $('.selection-box').css('width',differenceX);
            $('.selection-box').css('height',differenceY);
        }
        else if(currX < startX && currY >= startY){
            $('.selection-box').css('margin-left',currX);
            $('.selection-box').css('width',differenceX);
            $('.selection-box').css('height',differenceY);
        }
        else if(currX < startX && currY < startY){
            $('.selection-box').css('margin-left',currX);
            $('.selection-box').css('margin-top',currY);
            $('.selection-box').css('width',differenceX);
            $('.selection-box').css('height',differenceY);
        }
      $('.desktop-icon').each(function(){
          var thisIcon = $(this);
          if(checkIfInside(thisIcon,  $('.selection-box'))){
            thisIcon.addClass('icon-selected');
          } else if(!checkIfInside(thisIcon,  $('.selection-box'))){
            if(thisIcon.hasClass('icon-selected')){
              thisIcon.removeClass('icon-selected');
            }
          }
      });
    }
  }).mouseup(function(event){
      $('body').removeClass('cursor-default');
      var thisElem = $('.desktop');
      thisElem.data('startX', null);
      thisElem.data('startY', null);
      $('.selection-box').css('margin-left', 0);
      $('.selection-box').css('margin-top', 0);
      $('.selection-box').css('height', 0);
      $('.selection-box').css('width', 0);
      $('.selection-box').addClass('hidden-box');
  });

  $('.desktop-icons .desktop-icons *').select(function(event) {
    event.preventDefault();
  });

  $(document).on("click", ":not(.start-button), :not(.start-button *)", function(e){
    if(!$('.start-menu').hasClass('start-hidden')){
        $('.start-menu').toggleClass('start-hidden');
        $('.start-button').toggleClass('start-pressed');
        if(!$('.inner-menu').hasClass('inner-hidden')){
          $('.inner-menu').addClass('inner-hidden');
        }
      }
  }).on("mousedown", ":not(.desktop-icon), :not(.desktop-icon *)", function(e){
    $('.icon-selected').removeClass('icon-selected');
  });


  $('.start-button').click(function(event){
  event.stopPropagation();
      var target = event.target;
      $('.start-menu').toggleClass('start-hidden');
      $(this).toggleClass('start-pressed');
  });

  $('.has-children').mouseenter(function(event){
    var thisElem = $(this),
        showChild = setTimeout(function(){
            thisElem.children('.inner-menu').removeClass('inner-hidden');
          },300);
    thisElem.data('show-child', showChild);
    clearTimeout($(this).data('hide-child'));
  }).mouseleave(function(event){
      clearTimeout($(this).data('show-child'));
      var thisElem = $(this),
          hideChild = setTimeout(function(){
              thisElem.children('.inner-menu').addClass('inner-hidden');
            },300);
      thisElem.data('hide-child', hideChild);
            // $(this).children('.inner-menu').addClass('inner-hidden');
  });

  function getTextToMove(){
    return $('.text-to-move');
  }

  function getCharactersFromAllTextToMove(){
    getTextToMove().each(function(event){
      var text = $(this).html();
      text = text.split('');
      console.log(text);
    });
  }

  function getThisAsCharacters(element){
    return element.html().split('');
  }

  function checkHasNotBeenAffected(element){
    if(element.hasClass('spanned')){ return true; } else { return false; }
  }

  function replaceHtmlWithCharacterSpans(toReplace, replaceWith){
    var newInner = '',
        innerClass = 'inner-span',
        outerClass = 'outer-span',
        spanStart = "<span class='" + outerClass + "'><span class='" + innerClass + "'>",
        spanEnd = '</span></span>',
        characters = getThisAsCharacters(replaceWith);
    for(var i = 0; i < characters.length; i++){
      if(characters[i] == ' '){
        characters[i] = '&nbsp;';
      }
      newInner += spanStart + characters[i] + spanEnd;
    }
    toReplace.html(newInner);
    // toReplace.append(newInner);
    toReplace.addClass('spanned');
    // toReplace.children('span').addClass('inner-span');
  }

  $(document).on('mousemove', '.inner-span', function(event){
    var x = event.pageX,
        y = event.pageY,
        thisElement = $(this);
        console.log('mouse: ' + x + ', ' + y);
        console.log('this: ' + thisElement.offset().left + ', ' + thisElement.offset().top);
    });

    $('.text-to-move').mouseenter(function(event){
      if(!checkHasNotBeenAffected($(this))){
        replaceHtmlWithCharacterSpans($(this), $(this));
      }
    });

    $(document).keyup(function(e){
      console.log(e.metaKey );
    });

    function showText(string, index){
        var textShowElement = $('.text-show'),
            text = string,
            element = '<div class="show-and-hide-text">' + text + '</div>';
            textShowElement.append(element);
    }

    doShowText(['Welcome!']);

    function doShowText(text){
      var stringArray = text;
      for(var i = 0; i < stringArray.length; i++){
        console.log(stringArray[i]);
        showText(stringArray[i], i);
      }
    }

    function shakeText() {
      var thisElem = $('.show-and-hide-text');
      thisElem.addClass('pulse');
      thisElem.css('transition', '1s ease-in-out');
        var randomDegree = Math.floor(Math.random() * ((45-(-45))+1) + (-45));
        thisElem.css('margin-left',  Math.floor(Math.random() * ((100-(-100))+1) + (-100)),
           'margin-top',  Math.floor(Math.random() * ((100-(-100))+1) + (-100))
            , 'transform', 'rotateZ(50deg)');
         console.log(thisElem.css('margin-left') + ': ' + i);
         console.log(thisElem.css('rotate') + ': ' + i);
    }


});
