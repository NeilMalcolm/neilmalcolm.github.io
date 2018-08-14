let expression = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
var regex = new RegExp(expression);

Vue.use(VueLazyload,
{
    preLoad: 1.3,
    error: 'http://rockmasterfestival.com/2018/wp-content/themes/news-code/assets/img/placeholder.jpg',
    loading: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    attempt: 1
});

const skyUkurl = { url: "http://feeds.skynews.com/feeds/rss/uk.xml" };
const skyTechurl = { url: "http://feeds.skynews.com/feeds/rss/technology.xml" };
const skyUsurl = { url: "http://feeds.skynews.com/feeds/rss/us.xml" };

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

                let newFeed = 
                {
                    _id: new Date().toISOString(),
                    Name: newFeedName,
                    Url: newFeedUrl,
                    Color: this.selectedColor,
                    isSelected: false
                };

                this.feeds.push(newFeed);
                writeToDb(newFeed)

                document.getElementById("feed-url-input").value = "";
                document.getElementById("feed-name-input").value = "";
            },

            addFeed: function()
            {
                if(feedList.selectedColor !== "" && feedList.selectedColor !== null)
                {
                    document.getElementById(feedList.selectedColor).classList.remove("selected-color");
                }
                feedList.selectedColor = "blue";
                document.getElementById("blue").classList.add("selected-color");

                let newFeedScreen = document.getElementById("new-feed-screen");
                let search = document.getElementById("search");
                let closeNewFeed = document.getElementById("close-new-feed");
                search.style.display = "none";
                newFeedScreen.style.display = "flex";
                closeNewFeed.style.display = "block";
            },

            closeNewFeedScreen: function()
            {
                let newFeedScreen = document.getElementById("new-feed-screen");
                let closeNewFeed = document.getElementById("close-new-feed");
                let search = document.getElementById("search");
                newFeedScreen.style.display = "none";
                closeNewFeed.style.display = "none";
                search.style.display = "block";
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
                    console.log(feedList.displayFeeds);
                    console.log(theFeed);

                    let feedListContainsThisFeed = feedList.displayFeeds.includes(theFeed);
                    console.log("does contain? " + feedListContainsThisFeed);
                    if(feedListContainsThisFeed)
                    {
                        resolve(tempList);
                    }
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


var writeToDb = function(item)
{
    console.log("write to db");
    db.put(item, function callback(err, result)
    {
        if(!err)
            console.log("Successfully put item");
        else
            console.log("ERROR: " + err);
    });
}

var getFeedsFromDb = function()
{
    db.allDocs({include_docs: true, descending: false}).then(function(result)
    {
        console.log(result.rows);
        var feeds = result.rows.map(a => a.doc);
        feedList.feeds = feeds;
    });
}

var db = new PouchDB('FeedDb');


getFeedsFromDb();