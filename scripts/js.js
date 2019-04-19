let lastScrollPosition = 0;
let ticking  = false;
let topBar;
let stickyBar;
let DirectionEnum =
{
	NONE : 0,
	DOWN : 1,
	UP : 2
};

let isHamburgerPressed = false;

let previousDisabledButton= null;

let direction = DirectionEnum.NONE;

let isAnimatedScroll = false;

window.onload = function()
{
    let aboutSection = document.getElementById("about");
    let projectsSection = document.getElementById("projects");
    let contactSection = document.getElementById("contact");
    let aboutButton = document.getElementById("about-button");
    let projectsButton = document.getElementById("project-button");
    let contactButton = document.getElementById("contact-button");
    let aboutTopButton = document.getElementById("top-about-button");
    let projectsTopButton = document.getElementById("top-project-button");
    let contactTopButton = document.getElementById("top-contact-button");

    let hamburgerMenu = document.getElementById("hamburger-menu");
    let stickyBarLinks = document.getElementById("sticky-bar-links");

	topBar = document.getElementById("top-bar");
	stickyBar = document.getElementById("sticky-bar");

	// EventListeners

    window.addEventListener('resize', function()
    {
        checkForBarSize();
        if(window.innerWidth > 600)
        {
            shouldShowStickyBar(window.scrollY);
        }
    });

	let onWindowScroll = function()
    {
        let currentScroll = window.scrollY;
        setDirection(lastScrollPosition, currentScroll);

        lastScrollPosition = currentScroll;

        if (!ticking) {
            window.requestAnimationFrame(function () {
                OnScroll(lastScrollPosition);
                ticking = false;
            });

            ticking = true;
        }
    };

    window.addEventListener('scroll', onWindowScroll);

    hamburgerMenu.addEventListener("click", () => doHamburgerPress());

    aboutButton.addEventListener("click", () => doScrollToElement(aboutSection, aboutButton, document.body));
    aboutTopButton.addEventListener("click", () => doScrollToElement(aboutSection, aboutButton, document.body));

    projectsButton.addEventListener("click", () => scrollToElement(projectsSection,projectsButton));
    projectsTopButton.addEventListener("click", () => scrollToElement(projectsSection, projectsTopButton));

    contactButton.addEventListener("click", () => scrollToElement(contactSection, contactButton));
    contactTopButton.addEventListener("click", () => scrollToElement(contactSection, contactTopButton));

    // End of EventListeners

    // Functions

    // When the window is scrolled fire event
	let OnScroll = function(scroll_position)
	{
        WithinPageSections();

        if(window.innerWidth <= 600)
        {
            stickyBar.classList.add("show-bar");
            return;
        }

        shouldShowStickyBar(scroll_position);
	};

	let shouldShowStickyBar = function(scroll_position)
    {

        // get the bottom of our sticky-bar element
        let triggerPoint = getObjectFurthestYPositionFromTopOfWindow(topBar);

        let isPastTriggerPoint = scroll_position > triggerPoint;
        if(isPastTriggerPoint)
        {
            // show the sticky-bar
            console.log("show");
            stickyBar.classList.add("show-bar");
        }
        else
        {

            let isInUpperTriggerArea = scroll_position <= 10;
            if (isInUpperTriggerArea) {
                // hide the sticky-bar
                stickyBar.classList.remove("show-bar");
            }
        }
    };

	let setDirection = function (prevScroll, currScroll)
	{
		if(prevScroll > currScroll)
		{
			direction = DirectionEnum.UP;
		}
		else if(prevScroll < currScroll)
		{
			direction = DirectionEnum.DOWN;
		}
		else
			direction = DirectionEnum.NONE;
	};

	// Checks the distance of bottom of the element
	let getObjectFurthestYPositionFromTopOfWindow = function (element)
	{
		return element.offsetTop + element.offsetHeight;
	};

    let WithinPageSections = function()
    {
        let bottomReached = scrollY + window.innerHeight >= (document.body.offsetHeight - 100);

        if(bottomReached)
        {
            disableButton(contactButton);
            return;
        }
        getIsWithinBoundary(aboutSection, aboutButton);
        getIsWithinBoundary(projectsSection, projectsButton);
        getIsWithinBoundary(contactSection, contactButton);
    };

	let getIsWithinBoundary = function(element, button)
    {
        let top = element.offsetTop;
        let bottom = top + element.offsetHeight;

        let isWithinBoundaries = window.scrollY > top - 10 && window.scrollY < bottom - 10;
        if(isWithinBoundaries)
        {
            disableButton(button);
        }
    };

	let disableButton = function(button)
    {
        if(button === previousDisabledButton)
        {
            return;
        }
        // alert("within!");
        button.classList.add("disabled-button");

        if(previousDisabledButton != null)
        {
            previousDisabledButton.classList.remove("disabled-button");
        }
        previousDisabledButton = button;
    };

    let scrollToElement = function(element, button)
    {
        isAnimatedScroll = true;
        doScrollToElement(element, button, element);
    };

	let doScrollToElement = function(element, button, elementToScrollTo)
    {
        if(button.classList.contains("disabled-button"))
        {
            return;
        }

        smoothScroll(elementToScrollTo);

        getIsWithinBoundary(element, button);

        if(window.innerWidth <= 600)
        {
            hideLinks();
        }
    };

	let checkForBarSize = function()
    {
        if(window.innerWidth > 600)
        {
            if(!isHamburgerPressed)
            {
                stickyBarLinks.style.display = "block";
                hamburgerMenu.classList.remove("active");
            }

            isHamburgerPressed = false;
        }
        else
        {
            checkShowingStickyBar();
            if(!isHamburgerPressed)
                stickyBarLinks.style.display = "none";
        }
    };

    let checkShowingStickyBar = function()
    {
        if(window.innerWidth <= 600)
        {
            stickyBar.classList.add("show-bar");
        }
    };

	let doHamburgerPress = function()
    {
        if(isHamburgerPressed)
        {
            stickyBarLinks.style.display = "none";
            hamburgerMenu.classList.remove("active");
        }
        else
        {
            stickyBarLinks.style.display = "block";
            hamburgerMenu.classList.add("active");
        }

        isHamburgerPressed = !isHamburgerPressed;
    };

	let hideLinks = function()
    {
        doHamburgerPress();
    };

    function currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
    }


    function elmYPosition(eID) {
        var elm = eID;
        var y = elm.offsetTop;
        var node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        } return y;
    }


    function smoothScroll(eID) {
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        isAnimatedScroll = false;
    }
    // methods to be called onLoad

    checkForBarSize();

    // document.getElementById("projects").classList.remove("off-screen");
};



function submitForm() {
    document.getElementById("submit-form-button").click();
}
