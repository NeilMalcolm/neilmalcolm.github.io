let expression = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
var regex = new RegExp(expression);


// { url: "http://feeds.skynews.com/feeds/rss/uk.xml" },
// { url: "http://feeds.skynews.com/feeds/rss/technology.xml" },
// { url: "http://feeds.skynews.com/feeds/rss/us.xml" }

var parser = new DOMParser();

var feedList = new Vue(
    {
        el: "#wrapper",
        data: 
        {
            feeds: [],
            colors: [
                "blue", "pink", "red", "orange", "green", "yellow"
            ],
            counter: 0,
            currentFeed: '',
            invalidFeed: false,
            display: [],
            allFeedObjects: [],
            featuredArticles: [],
            feedsCounter: 0,
            newFeed: '',
            selectedColor: ''
        },
        methods: {
            addFeed: function()
            {
                let feedInput = document.getElementById("feed-input");
                let regex = new RegExp(expression);
                let feed = feedInput.value;

                if(feed.match(regex))
                {
                    console.log("matches");
                    this.invalidFeed = false
                    feedList.feeds.push({ url: feed });
                    xmlWebAddressToObjects(feed);
                    feedInput.value = "";
                }
                else
                {
                    console.log("feed don't match url");
                    this.invalidFeed = true;
                }
            },

            feedInputChanged: function()
            {
                console.log("changed");
                if(this.invalidFeed)
                {
                    this.invalidFeed = !this.invalidFeed;
                }
            },

            changeNewFeedScreenState: function(shouldShow)
            {
                let newFeedScreen = document.getElementById("new-feed-screen");

                if(shouldShow)
                    newFeedScreen.classList.add("show");
                else
                    newFeedScreen.classList.remove("show");
            },

            selectColor: function(color, event)
            {
                let selectedButton = document.getElementById(color);
                let button = document.getElementById("add-new-feed-button");

                // if our selectedColor is different from the previously selected color
                if(this.selectedColor !== '' && this.selectedColor !== color)
                {
                    document.getElementById(this.selectedColor).classList.remove("selected-color");
                }
                //set color to newly selected color
                this.selectedColor = color
                selectedButton.classList.add("selected-color");
            },

            selectCustomColor: function()
            {

            }
        }
    }
);

var xmlWebAddressToObjects = function(address)
{
    console.log("start");
    let tempList = [];
    feednami.load(address)
        .then(feed => 
        {
            if(feed.entries.length > 15)
            {
                for(let i = 0; i < 3; i++)
                {
                    feedList.featuredArticles.push
                    (
                        createNewFeedItem(feed.entries[i])
                    );
    
                    feed.entries.splice(i, 1);
                }
            }
            for(let entry of feed.entries)
            {
                tempList.push(
                    createNewFeedItem(entry)
                );
            }
            feedList.allFeedObjects = tempList
            console.log("done");
        });
}

var createNewFeedItem = function(entry)
{
    let moment = convertDateFormat(entry.pubdate);
    var newEntry = {
        title: entry.title,
        date: entry.date,
        friendlyDate: moment.format("ddd, Do MMMM YYYY, hh:mm"),
        shortDate: moment.format("D MMM YY, hh:mm"),
        dateMoment: moment,
        image: entry.image.url,
        summary: entry.summary,
        permaLink: entry.permalink
    };

    if(entry.permalink === undefined)
    {
        console.log("link is empty");
        newEntry.permaLink = entry.link;
    }

    if(newEntry.image == undefined || Object.keys(newEntry.image).length == 0)
    {
        // console.log("has empty image");
        if(entry["media:content"] !== undefined )
        {
            if(Object.keys(entry["media:content"]).length > 0)
            {
                if(Array.isArray(entry["media:content"]))
                {
                    let array = entry["media:content"];
                    console.log(`there are ${array.length} images in the array`);
                    if(array.length >= 2)
                        newEntry.image = entry["media:content"][1]["@"].url;
                    else
                        newEntry.image = entry["media:content"][0]["@"].url;
                }
                else
                {
                    if(entry["media:content"]["@"] === undefined)
                    {
                        newEntry.image = entry["media:content"].url;
                    }
                    else
                    {
                        newEntry.image = entry["media:content"]["@"].url;
                    }
                }
            }
        }
    }


    return newEntry;
}

var convertDateFormat = function(date)
{
    var newMoment = moment(date);
    if(newMoment.isValid)
    {
        return newMoment;
    }
    else
    {
        return "";
    }
}