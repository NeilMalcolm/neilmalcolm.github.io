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
    $('.nav-link').click(function(event){
      event.preventDefault();
      $(this).parent('li').parent('ul').children('li').removeClass('on');
      $(this).parent('li').addClass('on')
    });
});
