function startUp(event) {
    // if page is from the cache, reload it else we dont receive messages anymore
    if(event && event.persisted)
        window.location.reload(); 

    safari.self.addEventListener("message", messageHandler, false);
    safari.self.tab.dispatchMessage("sendQueue", null);
}


function messageHandler(event) {
    if(event.name === "URLQueue") {
        var urlQueue = event.message;
        showQueue(urlQueue);
    }
}


function removeURL(urlId) {
    safari.self.tab.dispatchMessage("removeURL", urlId);
    return true;
}


function showQueue(urlQueue) {
    var html = "<ul>\n";

    for(var i = 0; i < urlQueue.length; i++) {
        var item = urlQueue[i];
        html += '<li><a href="' + item.href + '" onclick="removeURL('+ i + ');">' + item.name + "</a>\n";
    }
    html += "</ul>\n";
    document.getElementById("queue").innerHTML = html;
}
