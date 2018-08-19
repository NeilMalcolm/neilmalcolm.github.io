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
            newsIndex: 5,
            showNewFeed: false,
            showSettings: false
        },
        methods: {
            toggleSettings: function()
            {
                this.showSettings = !this.showSettings;
                if(this.showSettings)
                {
                    document.getElementById("search").style.display = "none";
                }
                else
                {
                    document.getElementById("search").style.display = "block";
                }
            },
            deleteFeed: function(theFeed, event)
            {
                console.log("DO DELETE");
                console.log(JSON.stringify(theFeed));
                
                // See if the feed exists in our feeds array
                var feedsIndex = this.feeds.indexOf(theFeed);
                console.log(feedsIndex);
                if(feedsIndex !== -1)
                {
                    // if the feed exists, try to delete from db
                    deleteFromDb(theFeed).then(function(result)
                    {
                        // if result is false, we don't want to remove anything from anything
                        if(!result) return;
                        // only if our feed we wish to delete is being 
                        // displayed do we want to remove it

                        // remove from displayFeeds
                        let displayFeedIndex = feedList.displayFeeds.indexOf(theFeed);
                        if(displayFeedIndex !== -1)
                        {
                            console.log("delete displayfeeds");
                            feedList.displayFeeds.splice(displayFeedIndex, 1);

                            // remove all elements from displayFeedItems which
                            // belong to the removed feed
                            feedList.displayFeedItems = feedList.displayFeedItems.filter(e => e.feed !== theFeed);
                        }
                        let feedLiToDelete = event.target.parentNode.parentNode;
                        feedLiToDelete.classList.add("deleted-feed");
                        window.setTimeout(function(){
                            feedLiToDelete.classList.remove("deleted-feed");
                            feedList.feeds = remove(feedList.feeds, theFeed);
                        }, 1000);
                        
                    }).catch(function(result)
                    {
                        console.log("failed to delete big time");
                        console.log(result);
                    });
                }
            
            },

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
                if(target.classList.contains("deleted-feed"))
                {
                    return;
                }
                console.log(event.target);
                if(event.target.classList.contains("feed-delete"))
                {
                    console.log("FEED DELETE");
                    this.deleteFeed(theFeed, event);
                    return;
                }
                console.log("do select feed");
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
                        let news = result[0];
                        let featured = result[1];
                        feedList.displayFeedItems = feedList.displayFeedItems.concat(news);

                        if(featured.length > 0)
                        {
                            feedList.featuredArticles = feedList.featuredArticles.concat(featured);
                        }
                    });
                }
                else
                {
                    console.log("feed don't match url");
                    target.classList.remove("selected-feed");
                    this.invalidFeed = true;
                }
            },
            addNewFeed: function()
            {
                let newFeedScreen = document.getElementById("new-feed-screen");
                let newFeedUrl = document.getElementById("feed-url-input").value;
                let newFeedName = document.getElementById("feed-name-input").value;

                hideFeedScreen();

                let newFeed = 
                {
                    _id: new Date().toISOString(),
                    Name: newFeedName,
                    Url: newFeedUrl,
                    Color: this.selectedColor,
                    isSelected: false,
                    showFeed: true
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

                this.showNewFeed = true;
                let search = document.getElementById("search");
                let closeNewFeed = document.getElementById("close-new-feed");
                search.style.display = "none";
                
                closeNewFeed.style.display = "block";
            },

            closeNewFeedScreen: function()
            {
                hideFeedScreen();
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

var remove = function(array, element)
{
    return array.filter(x => x !== element);
};

var clearNewsForFeed = function(theFeed)
{
    
}

var xmlWebAddressToObjects = function(theFeed)
{
    let address = theFeed.Url;
    let feedName = theFeed.Name;

    return new Promise(function(resolve, reject)
    {
        let tempList = [];
        let featured = [];
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
                            featured.push
                            (
                                createNewFeedItem(feed.entries[i], theFeed)
                            );
            
                            feed.entries.splice(i, 1);
                        }
                    }
                    for(let entry of feed.entries)
                    {
                        tempList.push(
                            createNewFeedItem(entry, theFeed)
                        );
                    }

                    let feedListContainsThisFeed = feedList.displayFeeds.includes(theFeed);
                    if(feedListContainsThisFeed)
                    {
                        resolve([tempList, featured]);
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

var hideFeedScreen = function()
{
    feedList.showNewFeed = false;
    let closeNewFeed = document.getElementById("close-new-feed");
    let search = document.getElementById("search");
    closeNewFeed.style.display = "none";
    search.style.display = "block";
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

var deleteFromDb = function(item)
{
    return new Promise(function(resolve, reject)
    { 
        console.log('delete: ' + item._id);
        db.get(item._id)
        .then(function (doc) {
            console.log("delete it");
            db.remove(doc);
            resolve(true);
        }).catch(function (err) {
            console.log("failed to delete");
            console.log(err);
            reject(err);
        });
    });
}

var getFeedsFromDb = function()
{
    db.allDocs({include_docs: true, descending: false}).then(function(result)
    {
        console.log(result.rows);
        var feeds = result.rows.map(a => a.doc)
        feedList.feeds = feeds;
    });
}

var db = new PouchDB('FeedDb');


getFeedsFromDb();