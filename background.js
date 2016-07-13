// background.js
var githubbaseURL = "https://api.github.com/";
var githubCallbackURL = "https://chrome-gist-extension-server.herokuapp.com/github_access";
var namespace = "chrome.gist.extension.data";

chrome.runtime.onInstalled.addListener(
    function(details) {
        //add context menu when the extension is installed
        var parent = chrome.contextMenus.create({
            "title": "Add to Gist as",
            "id":"chrome-gist-extension-menu",
            "contexts": ["selection"]
        });
        var javascript = chrome.contextMenus.create({
            "title": "js",
            "parentId": parent,
            "id": "js",
            "contexts": ["selection"],
        });
        var text = chrome.contextMenus.create({
            "title": "txt",
            "parentId": parent,
            "id": "txt",
            "contexts": ["selection"],
        });
        var java = chrome.contextMenus.create({
            "title": "java",
            "parentId": parent,
            "id": "java",
            "contexts": ["selection"],
        });
        var ruby = chrome.contextMenus.create({
            "title": "ruby",
            "parentId": parent,
            "id": "rb",
            "contexts": ["selection"],
        });
        var html = chrome.contextMenus.create({
            "title": "html",
            "parentId": parent,
            "id": "html",
            "contexts": ["selection"],
        });
        var css = chrome.contextMenus.create({
            "title": "css",
            "parentId": parent,
            "id": "css",
            "contexts": ["selection"],
        });
        var python = chrome.contextMenus.create({
            "title": "python",
            "parentId": parent,
            "id": "py",
            "contexts": ["selection"],
        });


    });
var clickHandler = function(info, tab) {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var curr_hours = d.getHours();
    var curr_minutes = d.getMinutes();
    var curr_seconds = d.getSeconds();
    var partFileName = curr_date + "_" + curr_month + "_" + curr_year + "_" + curr_hours + "_" + curr_minutes + "_" + curr_seconds;

    var files = {};
    var filename = "cge_" + partFileName + "." + info.menuItemId;
    files[filename] = {
        content: info.selectionText
    };
    var gistObject = {
        "description": "This is random ." + info.menuItemId + " gist created by chrome-gist-extension. Url for the same is " + tab.url,
        "public": false,
        "files": files
    }
    getAccessToken(function(err, access_token) {
        if (err) {
            return;
        }
        gistObject = JSON.stringify(gistObject);
        var url = githubbaseURL + "gists?access_token=" + access_token;
        var options = {
            method: "POST",
            url: url,
            successCallback: function(result) {
                alert("Gist created successfully!! :D");
            },
            errorCallback: function(result) {
                alert("Gist creation error!! :(");
            },
            data: gistObject,
        };
        jsAjax.request(options);

    });

}
chrome.contextMenus.onClicked.addListener(clickHandler);




/*// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});*/

//close the tab after authentication information has been saved.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "SAVE_AUTH_TOKEN") {
            saveSetting(namespace, "access_token", request.access_token, function(err, success) {
                if (err) {
                    console.log("error occured while saving the token");
                    alert("error occured while saving the token");
                }
                chrome.tabs.remove(request.tab_id);
            });
        }
    });


//data received from github save it to local storage
chrome.tabs.onUpdated.addListener(function(tabId, info) {
    if (info.status == "complete") {
        chrome.tabs.query({
            'active': true,
            'lastFocusedWindow': true
        }, function(tabs) {
            currentTab = tabs[0];
            var url = currentTab.url;
            if (url.indexOf(githubCallbackURL + "?code=") !== -1) {
                //autohorised by github add the access token to local cache
                chrome.tabs.sendMessage(currentTab.id, {
                    "message": "AUTHENTICATED",
                    "tab_id": currentTab.id
                });
            }
        });

    }
});

var getAccessToken = function(callback) {
    getSetting("chrome.gist.extension.data", "access_token", function(err, value) {
        callback(null, value);
    })
}



var saveSetting = function(namespacep, key, value, callback) {

    //first get the settings and append new settings to it and then save.
    chrome.storage.sync.get(namespacep, function(items) {
        var data = items[namespacep] || {};

        //append and save the settings
        data[key] = value;
        var dataToSave = {};
        dataToSave[namespacep] = data;
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set(dataToSave, function() {
            callback(null);
        });
    });
}

var getSetting = function(namespacep, key, callback) {
    // get it using the Chrome extension storage API.
    chrome.storage.sync.get(namespacep, function(items) {
        var data = items[namespacep] || {};
        callback(null, data[key]);
    });
}