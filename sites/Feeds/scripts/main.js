let expression = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
var regex = new RegExp(expression);

Vue.use(VueLazyload,
{
    preLoad: 1.3,
    error: 'http://rockmasterfestival.com/2018/wp-content/themes/news-code/assets/img/placeholder.jpg',
    loading: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    attempt: 1
});



// { url: "http://feeds.skynews.com/feeds/rss/uk.xml" },
// { url: "http://feeds.skynews.com/feeds/rss/technology.xml" },
// { url: "http://feeds.skynews.com/feeds/rss/us.xml" }

var feedList = new Vue(
    {
        el: "#wrapper",
        // components: { Slick },
        data: 
        {
            slickOptions: {
                slidesToShow: 3,
                // Any other options that can be got from plugin documentation
            },
            feeds: [],
            colors: [
                "blue", "pink", "red", "orange", "green", "yellow"
            ],
            counter: 0,
            currentFeed: '',
            invalidFeed: false,
            displayFeedItems: [],
            displayFeeds: [],
            allFeedObjects: [],
            featuredArticles: [],
            feedsCounter: 0,
            newFeed: '',
            selectedColor: '',
            newsIndex: 5
        },
        methods: {
            clearFeed: function(theFeed)
            {
                console.log("remove");
                let index = this.displayFeeds.indexOf(theFeed);
                if(index >= 0)
                {
                    this.displayFeeds.splice(index, 1);
                    let i = this.displayFeedItems.length;
                    while(i--)
                    {
                        let entry = this.displayFeedItems[i];
                        if(entry.feed.Name === theFeed.Name)
                        {
                            this.displayFeedItems.splice(i, 1);
                        }
                    }
            
                    i = this.featuredArticles.length;
                    while(i--)
                    {
                        let entry = this.featuredArticles[i];
                        if(entry.feed.Name === theFeed.Name)
                        {
                            this.featuredArticles.splice(i, 1);
                        }
                    }
                }
            },

            selectFeed: function(theFeed, event)
            {
                let target = event.currentTarget;
                if(this.displayFeeds.includes(theFeed))
                {
                    // if the selected feed is already selected
                    // remove from the array
                    target.classList.remove("selected-feed");
                    this.clearFeed(theFeed);
                    return;
                }
                target.classList.add("selected-feed");
                
                let feedUrl = theFeed.Url;
                let regex = new RegExp(expression);

                if(feedUrl.match(regex))
                {
                    console.log("matches");
                    this.invalidFeed = false;
                    this.displayFeeds.push(theFeed);

                    // this.displayFeedItems.push({permaLink: "#", summary: "Thingwy", title: "title"})
                    xmlWebAddressToObjects(theFeed)
                    .then(function(result)
                    {
                        feedList.displayFeedItems = feedList.displayFeedItems.concat(result);
                        // for(var i = 0; i < result.length; i++)
                        // {
                        //     feedList.displayFeedItems.push(result[i]);
                        // }
                        
                    });
                }
                else
                {
                    console.log("feed don't match url");
                    this.invalidFeed = true;
                }
            },
            addNewFeed: function()
            {
                let newFeedScreen = document.getElementById("new-feed-screen");
                let newFeedUrl = document.getElementById("feed-url-input").value;
                let newFeedName = document.getElementById("feed-name-input").value;

                
                newFeedScreen.style.display = "none";

                this.feeds.push(
                    {
                        Name: newFeedName,
                        Url: newFeedUrl,
                        Color: this.selectedColor,
                        isSelected: false
                    }
                );

                document.getElementById("feed-url-input").value = "";
                document.getElementById("feed-name-input").value = "";
            },

            addFeed: function()
            {
                let newFeedScreen = document.getElementById("new-feed-screen");
                newFeedScreen.style.display = "flex";
                // let feedInput = document.getElementById("feed-input");
                // let regex = new RegExp(expression);
                // let feed = feedInput.value;

                // if(feed.match(regex))
                // {
                //     console.log("matches");
                //     this.invalidFeed = false
                //     feedList.feeds.push({ url: feed });
                //     xmlWebAddressToObjects(feed);
                //     feedInput.value = "";
                // }
                // else
                // {
                //     console.log("feed don't match url");
                //     this.invalidFeed = true;
                // }
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

var clearNewsForFeed = function(theFeed)
{
    
}

var xmlWebAddressToObjects = function(theFeed)
{
    let address = theFeed.Url;
    let feedName = theFeed.Name;

    return new Promise(function(resolve, reject)
    {
        console.log("start: " + theFeed.Url);
        let tempList = [];
        feednami.load(address)
            .then(feed => 
            {
                setTimeout(function()
                {
                    if(feed.entries.length > 15)
                    {
                        // get first 3 articles and add to 'featured' articles
                        for(let i = 0; i < 3; i++)
                        {
                            feedList.featuredArticles.push
                            (
                                createNewFeedItem(feed.entries[i], theFeed)
                            );
            
                            feed.entries.splice(i, 1);
                            console.log("featuredArticles is greater than 0: " + feedList.featuredArticles.length);
                        }
                    }
                    for(let entry of feed.entries)
                    {
                        tempList.push(
                            createNewFeedItem(entry, theFeed)
                        );
                    }
                    console.log("end:");
                    console.log(tempList);
                    resolve(tempList);
                }, 500);
            });
    });
}

var createNewFeedItem = function(entry, theFeed)
{
    
    let moment = convertDateFormat(entry.pubdate);
    var newEntry = {
        title: entry.title,
        date: new Date(entry.pubdate),
        friendlyDate: moment.format("ddd, Do MMMM YYYY, hh:mm"),
        shortDate: moment.format("D MMM YY, hh:mm"),
        dateMoment: moment,
        image: entry.image.url,
        summary: entry.summary,
        permaLink: entry.permalink,
        feed: theFeed
    };
    console.log("entry is: ");
    console.log(newEntry);

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