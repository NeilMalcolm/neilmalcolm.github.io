$(document).ready(function(){

	function getCurrentTextString(){
		return "Wassup Drama Alert Nation";
	}

	function getNewTextString(){
		return "Let's get right into the news";
	}

	function getNewTextStringLength(){
		return getNewTextString().length;
	}

	function getNewTextStringAsChars(){
		return getStringAsChars(getNewTextString());
	}

	function getStringAsChars(thisString){
		return thisString.split('');
	}

	function getCurrentTextString(){
		var x = $('.text-string').html();
		return x;
	}

	function getCurrentTextStringLength(){
		return getCurrentTextString().length;
	}


	function getCurrentTextStringAsChars(){
		return getStringAsChars(getCurrentTextString());
	}

	function addStringToPageAsSpans(text){
		var container = $('.text-container');
		
		var textAsChars = getStringAsChars(text);
		var spanText = "";
		$.each(textAsChars, function(index, val) {
			 /* iterate through array or object */
			 spanText+= "<span>" + val + "</span>";
		});
		container.html(spanText);
	}

	console.log(getCurrentTextStringLength());
	console.log(getNewTextStringLength());
	console.log(getNewTextStringAsChars());
	console.log(getCurrentTextStringAsChars());

	addStringToPageAsSpans(getcurrentTextString());
	addStringToPageAsSpans(getNewTextString());
});