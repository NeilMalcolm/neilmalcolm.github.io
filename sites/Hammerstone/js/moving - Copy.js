// function Student(name, age){
// 	this.name = name;
// 	this.age = age;
// 	this.course = null;
// }

// Student.prototype.getInfo = function(){
// 	return this.name + ' ' + this.age + ' ' + this.course;
// };

// Student.prototype.setName = function(name){
// 	this.name = name;
// }

// Student.prototype.setAge = function(age){
// 	this.age = age;
// }

// Student.prototype.setCourse = function(course){
// 	this.course = course;
// }

// function Course(courseName, courseCode ,spaces){
// 	this.name = courseName;
// 	this.code = courseCode;
// 	this.spaces = spaces;
// 	this.students = new Array(spaces);
// 	this.numberOfStudents = 0;
// }

// Course.prototype.checkSpaces = function(){
// 	return this.spaces;
// }

// Course.prototype.addStudent = function(newStudent){
// 	if(this.numberOfStudents < this.spaces){
// 		this.students.push(newStudent);
// 		newStudent.setCourse(this.code);
// 		this.numberOfStudents++;
// 	} else {
// 		return alert('you are unable to add a new student');
// 	}
// }

// Course.prototype.getNumberOfStudents = function(){
// 	return this.numberOfStudents;
// }

// Course.prototype.removeStudent = function(StudentToRemove){

// }

// Course.prototype.getStudentNameByIndex = function(theIndex){
// 	return this.students[theIndex];
// }

// function Courses = function(){
// 	this
// }

// var compCode = 'CM000'

// var s = new Student('Barry', 21);
// var c = new Course('Computing', compCode, 50);
// c.addStudent(s);
// var x = c.getStudentNameByIndex(0);
// alert(s.getInfo());
//
// var today = new Date();
// var hourNow = today.getHours();
// var greeting;
//
// if (hourNow > 18) {
//     greeting = 'Good evening!';
// } else if (hourNow > 12) {
//     greeting = 'Good afternoon!';
// } else if (hourNow > 0) {
//     greeting = 'Good morning!';
// } else {
//     greeting = 'Welcome!';
// }
//
// document.write('<h3>' + greeting + '</h3>');

$(document).ready(function(){

    console.log('curr img: ' + getCurrentImageIndex());
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
     console.log('curr: ' + getCurrentImageIndex());
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
      console.log('x' + theIndex);
      buttonFunction(theIndex);
   });

   $('.dropdown-button').click(function(event){
      event.preventDefault();
      $('.inner').toggle();

   });
});
