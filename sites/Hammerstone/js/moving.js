$(document).ready(function(){
    doVisibilityChecks();

    function getRadialIndex(){
      return $('.current-radial').index();
    }

    function removeRadialClass(){
      $('.controls').children('div').removeClass('current-radial');
    }

    function addRadialClass(index){
      $('.controls').children('div').eq(index).addClass('current-radial');
    }

    function getNumberOfRadials(){
      return  $('.controls').children('div').length;
    }

    function getAllOtherRadial(){
      return $('.controls').children('div').not('.current-radial');
    }

    function getInnerOfRadials(radial){
      return radial.children('.radial-inner');
    }

    function getNextRadialIndex(){
      if(getRadialIndex() < getNumberOfRadials()){
        return getRadialIndex()+1;
      } else {
        return 0;
      }
    }

    function getNextRadial(){
      return $('.controls').children('div').eq(getNextRadialIndex());
    }

    function switchRadial(index){
      removeRadialClass();
      addRadialClass(index);
    }

    function getCurrentImageIndex(){
      return $('.current-image').index();
    }

    function getCurrentImage(){
      return $('.current-image');
    }

    function removeCurrentImage(){
      getCurrentImage().removeClass('current-image');
    }

    function addCurrentImage(index){
      $('.moving-container').children('.move-elem').eq(index).addClass('current-image');
    }

    function switchCurrentImage(index){
      removeCurrentImage();
      addCurrentImage(index);
    }

    function getImageAtIndex(index){
      return $('.moving-container').children('.move-elem').eq(index);
    }

    function getNumberOfImages(){
      return $('.moving-container').children('.move-elem').length;
    }

    function removeOtherImage(index){
      getImageAtIndex(index).removeClass('other-image');
    }

    function toggleOtherImage(index){
      getImageAtIndex(index).toggleClass('other-image');
    }

    function addOtherImage(index){
      getImageAtIndex(index).addClass('other-image');
    }

    function getAllOtherImages(){
      return $('.moving-container').find('.other-image');
    }

    function countdownWidthIncrement(duration){
      getInnerOfRadials(getNextRadial()).animate({
        width: '100%'
      }, duration).promise.done(moveImage(getNextRadialIndex()));
    }

    /**
     * This function handles the movement of the image that is to move away from view
     * that is to say, the image which has been shown and now should no longer be shown
     * This method moves the image from its current position by animating the removal of
     * its left margin
     */
   function moveImage(index){
     //if the desired image to be shown is NOT the current one shown

     if(index != getCurrentImageIndex()){
       var moveToMargin = 0;
       var largeMargin = 750;
       var image = getImageAtIndex(index);
       switchCurrentImage(index);
        addOtherImage(getCurrentImageIndex());
        removeOtherImage(index);
       return image.index();
     } else {
       return 'failed'
     }
   }

   function buttonFunction(index){
     if(moveImage(index) != 'failed'){
       switchRadial(index);
     } else {
     }
   }

   function changeButtonState(button){
     var buttonToChange = button;
     buttonToChange.toggleClass('arrow-no-hover');
     buttonToChange.toggleClass('arrow-allow-hover');
   }

  function updateArrows(index){
    if(index > getCurrentImageIndex()){
        //pushed right button
        if(getCurrentImageIndex() == 0){
          var backButton = $('.back').children('svg');
          changeButtonState(backButton);
        }
        if(index == (getNumberOfImages()-1)){
          var fwdButton = $('.forward').children('svg');
          changeButtonState(fwdButton);
        }
    } else if(index < getCurrentImageIndex()){
        //pushed left button
        if(index == 0){
          var backButton = $('.back').children('svg');
          changeButtonState(backButton);
        }
        if(getCurrentImageIndex() == (getNumberOfImages()-1)){
          var fwdButton = $('.forward').children('svg');
          changeButtonState(fwdButton);
        }
    }
  }

   $('.move-button').click(function(event){
     if($(this).hasClass('back')){
       if(getCurrentImageIndex() > 0){
         updateArrows(getCurrentImageIndex()-1);
         changeValue = getCurrentImageIndex()-1;
         buttonFunction(changeValue);
       }
      } else {
       if(getCurrentImageIndex() < getNumberOfImages()-1){
         updateArrows(getCurrentImageIndex()+1);
         changeValue = getCurrentImageIndex()+1;
         buttonFunction(changeValue);
       }
     }
   });

   $('.controls').children('div').click(function(event){
      var theIndex = $(this).index();
      updateArrows(theIndex);
      buttonFunction(theIndex);
   });

   $('.dropdown-button').click(function(event){
      event.preventDefault();
        $('.inner').toggle('block');
   });

   $(window).click(function(event){
     var thisEvent = $(event.target);
     var thisEventClass = thisEvent.attr('class');
     var thisUl = thisEvent.children('ul');
     var compareElement = $('.dropdown-button');
     var compareElementUl = compareElement.children('ul');
     var compareElementLi = compareElementUl.children('li');
     if( thisEventClass !== compareElement.attr('class')){
       if(thisUl == compareElementUl || thisUl.children('li') == compareElementLi){
       } else {
         if($('.inner').css('display') == 'block'){
           $('.inner').toggle('block');
         }
       }
     }
   });

    $('.round-ended-ul').children('li').click(function(event){
      var thisIndex = $(this).index();
      var thisObj = $(this);
      var container =  $(this).parent('ul');
      if(thisIndex !== container.find('.rounded-ended-buttons-pressed').index()){
        var ulElements = $(this).parent('ul').children('li');
        var noOfElements = ulElements.length;
        container.children('li').removeClass('rounded-ended-buttons-first-pressed');
        container.children('li').removeClass('rounded-ended-buttons-last-pressed');
        container.children('li').removeClass('rounded-ended-buttons-pressed');
        switch (thisIndex) {
          case 0:
            $(this).addClass('rounded-ended-buttons-first-pressed');
            break;
          case 2:
            $(this).addClass('rounded-ended-buttons-last-pressed');
            break;
          default:
            $(this).addClass('rounded-ended-buttons-pressed');
            break;
        }
      }
    });


    //functions for get in touch elements

    function getCurrentGt(){
      return $('.current-gt');
    }

    function getCurrentGtIndex(){
      return $('.current-gt').index();
    }

    function removeCurrentGt(){
      getCurrentGt().removeClass('current-gt');
    }

    function getElementList(){
      return $('.gt-elem-container').children('.gt-elem');
    }

    function addCurrentByIndex(index){
      getElementList().eq(index).addClass('current-gt');
    }

    function getCurrentTab(){
      return $('.current-tab');
    }

    function getTabs(){
      return $('.gt-tabs').children('li');
    }

    function removeCurrentTab(){
      getCurrentTab().removeClass('current-tab');
    }

    function addTabAtIndex(index){
      getTabs().eq(index).addClass('current-tab');
    }

    function changeGtTab(index){
      removeCurrentTab();
      addTabAtIndex(index);
    }

    $('.gt-tabs').children('li').click(function(event){
      var elementToShowIndex = $(this).index();
      removeCurrentGt();
      addCurrentByIndex(elementToShowIndex);
      changeGtTab(elementToShowIndex);
    });


    $('.gt-tabs').children('li').hover(function(event) {
        $('.gt-elem').trigger(event.type);
    })



    //DO MOVE OBJECTS UP WHEN IN view

    function defineMarginBuffer(val){
      return val;
    }

    function getWindowHeight(){
        return $(window).height();
    }

    function getScrollTop(){
      return $(window).scrollTop();
    }

    function getElementDistanceFromTop(element){
      return element.offset().top;
    }

    function getElementOuterHeight(element){
      return element.outerHeight();
    }

    function calculateElementOnScreen(element, val){
      return getScrollTop() + getWindowHeight() >= (getElementDistanceFromTop(element) + val) ;
    }

    function caclulateElementPassed(element){
      return getScrollTop() > (getElementDistanceFromTop(element) + getElementOuterHeight(element));
    }

    function makeVisibleUpwards(element){
      var duration = 700;
      $(element).css('display', 'inline-block');
      if(element.hasClass('rote')){
        $(element).animate({
          'opacity': 1,
          'padding-top': 0
        }, duration);
        $(element).addClass('rotate-anim');
      } else {
        $(element).animate({
          'opacity': 1,
          'margin-top': 0
        }, duration);
      }
    }

    function makeVisibleLeft(element){
      var duration = 1000;
      $(element).css('display', 'inline-block');
      if(element.index() !=  element.parent().children().length-1 && element.index() != 0){
        var val = parseInt(element.css('margin-right')) * .33;
      } else {
          var val = parseInt(element.css('margin-right')) * .66;
      }
      $(element).animate({
        'opacity' : 1,
        'margin-right' : val
      }, duration);
    }

    function makeVisibleRight(element){
      var duration = 1000;
      $(element).css('display', 'inline-block');
      if(element.index() != element.parent().children().length-1 && element.index() != 0){
        var val = parseInt(element.css('margin-left')) * .33;
      } else {
          var val = parseInt(element.css('margin-left')) * .66;
      }
      $(element).animate({
        'opacity' : 1,
        'margin-left' : val
      }, duration);
    }
      function makeVisible(element){
        var duration = 1000;
        $(element).css('display', 'inline-block');
        $(element).animate({
          'opacity' : 1,
        }, duration);
      }

    function checkElemVisible(element){
      return element.css('opacity') == 0;
    }


    function doVisibilityChecks(){
      var elemA = $('.student-info');
      if(elemA.length){
        elemA.each(function(index){
          if(!$(this).hasClass('rotate-anim')){
            if(calculateElementOnScreen($(this), defineMarginBuffer(80)) && checkElemVisible($(this)) && !caclulateElementPassed($(this))){
              makeVisibleUpwards($(this));
            }
          }
        });
      }
      var elemB = $('.customer-testimony');
      if(elemB.length){
        if(calculateElementOnScreen(elemB, defineMarginBuffer(80)) && checkElemVisible(elemB)  && !caclulateElementPassed(elemB)){
            elemB.each(function(index){
              var indexMultiplier = (index+1) * 200;
              setTimeout(function(){
                makeVisibleUpwards(elemB.parent().children().eq(index));
              }, indexMultiplier);

            });
        }
      }
      var elemC = $('.element-to-make-visible-left');
      if(elemC.length){
        elemC.each(function(index){
          if(calculateElementOnScreen($(this), defineMarginBuffer(80)) && checkElemVisible($(this))  && !caclulateElementPassed($(this))){
                makeVisibleLeft($(this));
          }
        });
      }
      var elemD = $('.element-to-make-visible-right');
      if(elemD.length){
        elemD.each(function(index){
          if(calculateElementOnScreen($(this), defineMarginBuffer(80)) && checkElemVisible($(this))  && !caclulateElementPassed($(this))){
                makeVisibleRight($(this));
          }
        });
      }
      var elemF= $('.element-to-make-visible');
      if(elemF.length){
        elemF.each(function(index){
          if(calculateElementOnScreen($(this), defineMarginBuffer(80)) && checkElemVisible($(this))  && !caclulateElementPassed($(this))){
              makeVisible($(this));
          }
        });
      }
    }

    function checkIfExists(element){
      if(element.length){return true;} else {return false;}
    }

    $(window).scroll(function(){
        doVisibilityChecks();
    });


    $(window).resize(function(){
      doVisibilityChecks();
    });
});
