// cookie names for data we store
// YOUR API KEY DOES NOT GO IN THIS CODE; don't paste it in.
QUERY = "";
var aspect = "All";
var count = 20;
var offset = 0;
API_KEY_COOKIE   = "bing-search-api-key";
CLIENT_ID_COOKIE = "bing-search-client-id";

// Bing Search API endpoint
BING_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
ID = "results";
localJSON = "";

// Various browsers differ in their support for persistent storage by local
// HTML files (IE won't use localStorage, but Chrome won't use cookies). So
// use localStorage if we can, otherwise use cookies.
try {
    localStorage.getItem;   // try localStorage

    window.retrieveValue = function (name) {
        return localStorage.getItem(name) || "";
    }
    window.storeValue = function(name, value) {
        localStorage.setItem(name, value);
    }
} catch (e) {
    window.retrieveValue = function (name) {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var keyvalue = cookies[i].split("=");
            if (keyvalue[0].trim() === name) return keyvalue[1];
        }
        return "";
    }
    window.storeValue = function (name, value) {
        var expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        document.cookie = name + "=" + value.trim() + "; expires=" + expiry.toUTCString();
    }
}

// get stored API subscription key, or prompt if it's not found
function getSubscriptionKey() {
    var key = retrieveValue(API_KEY_COOKIE);
    while (key.length !== 32) {
        key = prompt("Enter Bing Search API subscription key:", "").trim();
    }
    // always set the cookie in order to update the expiration date
    storeValue(API_KEY_COOKIE, key);
    return key;
}

// invalidate stored API subscription key so user will be prompted again
function invalidateSubscriptionKey() {
    storeValue(API_KEY_COOKIE, "");
}


// format plain text for display as an HTML <pre> element
function preFormat(text) {
    text = "" + text;
    return "<pre>" + text.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</pre>"
}

// put HTML markup into a <div> and reveal it
function showDiv(id, html) {
    var content = document.getElementById("_" + id)
    if (content) content.innerHTML = html;
    var wrapper = document.getElementById(id);
    if (wrapper) wrapper.style.display = html.trim() ? "block" : "none";
    if (wrapper) wrapper.style.display = html.trim() ? "block" : "none";
}

// hides the specified <div>s
function hideDivs() {
    for (var i = 0; i < arguments.length; i++) {
        var element = document.getElementById(arguments[i])
        if (element) element.style.display = "none";
    }
}


// render functions for various types of search results
searchItemRenderers = {
    images: function (item, index, count) {
        var height = 200;
        //var width = Math.max(Math.round(height * item.thumbnail.width / item.thumbnail.height), 120);
        var width= 200;
        var html = [];
        var bigH = 400;
        var bigW = Math.max(Math.round(height * item.thumbnail.width / item.thumbnail.height), 400);
        html.push("<a href='#"+ item.imageId +"'>");
        html.push("<img class='hover-shadow cursor' src='"+ item.thumbnailUrl + "&h=" + height + "&w=" + width +
            "' height=" + height + " width=" + width + "'></a>");
        html.push("<a href='#_' class='lightbox' id='"+item.imageId+"'>");
        html.push("<img src='"+ item.thumbnailUrl + "'height=" + bigH + " width=" + bigW + "'></a>");
        return html.join("");
    },

}


// render image search results
function renderImageResults(items) {
    var len = items.length;
    var html = [];
    if (!len) {

        return "";
    }
    for (var i = 0; i < len; i++) {
        html.push(searchItemRenderers.images(items[i], i, len));
    }
    return html.join("\n\n");
}



// render the search results given the parsed JSON response
function renderSearchResults(results) {
    showDiv(ID, renderImageResults(results.value));
}

function renderErrorMessage(message) {
    showDiv("error", preFormat(message));
    showDiv("noresults", "No results.");
}




// perform a search given query, options string, and API key
function bingImageSearch(query, options, key, id) {
    // scroll to top of window
    window.scrollTo(0, 0);
    if (!query.trim().length) return false;     // empty query, do nothing

    showDiv("noresults", "Working. Please wait.");
    hideDivs(ID,  "error");

    var request = new XMLHttpRequest();
    var queryurl = BING_ENDPOINT + "?q=" + encodeURIComponent(query) + "&" + options;

    // open the request
    try {
        request.open("GET", queryurl);
    }
    catch (e) {
        renderErrorMessage("Bad request (invalid URL)\n" + queryurl);
        return false;
    }

    // add request headers
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key);
    request.setRequestHeader("Accept", "application/json");
    var clientid = retrieveValue(CLIENT_ID_COOKIE);
    if (clientid) request.setRequestHeader("X-MSEdge-ClientID", clientid);

    // event handler for successful response
    request.addEventListener("load", handleBingResponse);

    // event handler for erorrs

    request.addEventListener("error", function() {
        renderErrorMessage("Error completing request");
    });

    // event handler for aborted request
    request.addEventListener("abort", function() {
        renderErrorMessage("Request aborted");
    });

    // send the request
    request.send();
    return false;
}


// handle Bing search request results
function handleBingResponse() {
    hideDivs("noresults");
    var json = this.responseText.trim();

    var jsobj = {};

    // try to parse JSON results
    try {
        if (json.length) jsobj = JSON.parse(json);
    } catch(e) {
        renderErrorMessage("Invalid JSON response");
    }

    // show raw JSON and HTTP request
    showDiv("json", preFormat(JSON.stringify(jsobj, null, 2)));
    showDiv("http", preFormat("GET " + this.responseURL + "\n\nStatus: " + this.status + " " +
        this.statusText + "\n" + this.getAllResponseHeaders()));

    // if HTTP response is 200 OK, try to render search results
    if (this.status === 200) {
        var clientid = this.getResponseHeader("X-MSEdge-ClientID");
        if (clientid) retrieveValue(CLIENT_ID_COOKIE, clientid);
        if (json.length) {
            if (jsobj._type === "Images") {
                //if (jsobj.nextOffset) document.forms.bing.nextoffset.value = jsobj.nextOffset;
                renderSearchResults(jsobj);
            } else {
                renderErrorMessage("No search results in JSON response");
            }
        } else {
            renderErrorMessage("Empty response (are you sending too many requests too quickly?)");
        }
    }

    // Any other HTTP response is an error
    else {
        // 401 is unauthorized; force re-prompt for API key for next request
        if (this.status === 401) invalidateSubscriptionKey();

        // some error responses don't have a top-level errors object, so gin one up
        var errors = jsobj.errors || [jsobj];
        var errmsg = [];

        // display HTTP status code
        errmsg.push("HTTP Status " + this.status + " " + this.statusText + "\n");

        // add all fields from all error responses
        for (var i = 0; i < errors.length; i++) {
            if (i) errmsg.push("\n");
            for (var k in errors[i]) errmsg.push(k + ": " + errors[i][k]);
        }

        // also display Bing Trace ID if it isn't blocked by CORS
        var traceid = this.getResponseHeader("BingAPIs-TraceId");
        if (traceid) errmsg.push("\nTrace ID " + traceid);

        // and display the error message
        renderErrorMessage(errmsg.join("\n"));
    }
}

// build query options from the HTML form
function bingSearchOptions() {

    var options = [];
    options.push("aspect=" + aspect);
    options.push("count=" + count);
    options.push("offset=" + offset);

    return options.join("&");
}

//main beginning function
function newBingImageSearch(query, id) {
    //form.offset.value = "0";
    //form.stack.value = "[]";
    changeID(id);

    return bingImageSearch(query, bingSearchOptions(), getSubscriptionKey(), id);
}

//the id where images will load
function changeID(id){
    ID = id;
}

//load the selected question when page loads
function loadQuestion(question){
    document.getElementById("showQuestion").innerHTML=question;
}


//load json, and check the answer, the answer will be regarded as search words for bing and youtube
function loadJSON(selected_value){
    // Javascript function JSON.parse to parse JSON data
    jsonObj = localJSON;
    var current = $.grep(jsonObj, function (Q) {
        return Q.question == selected_value;
    });
    var myJSON = JSON.stringify(current);
    var myObj = JSON.parse(myJSON);

    QUERY = myObj[0].answer;
    //store the answer, as query for the image/video search
    localStorage.setItem("query",QUERY);
}


//load the local json
var json = function () {
    var jsonTemp = null;
    $.ajax({
        'async': false,
        'url': "qa.json",
        'success': function (data) {
            jsonTemp = data;
        }
    });
    return jsonTemp;
}();


localJSON = json;

//autocomplete the questions by using all the questions in the JSON
$(document).ready(function () {
    src = $.map(localJSON, function (el) {
        return {
            value: el.question
        };
    });

    $("#question").autocomplete({
        source: src,
        select: function() {
            selected_value = $("#question").val();
            alert(selected_value);

            //store the question
            localStorage.setItem("question",selected_value);
            loadJSON(selected_value);
            window.location.href="resource.html";

        }
    });
});


