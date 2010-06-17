
safari.self.addEventListener("message", messageHandler, false);
safari.self.tab.dispatchMessage("sendQueue", null);

function messageHandler(event) {
    if(event.name !== "URLQueue")
        return;

    var urlQueue = event.message;
    showQueue(urlQueue);
}


function removeURL(urlId) {
    safari.self.tab.dispatchMessage("removeURL", urlId);
    return true;
}


function showQueue(urlQueue) {
    var html = "<ul>\n";

    for(var i in urlQueue) {
        var url = urlQueue[i].href;
        var name = urlQueue[i].name;
        html += '<li><a href="' + url + '" onclick="removeURL('+ i + ');">' + name + "</a>\n";
    }
    html += "</ul>\n";
    document.getElementById("queue").innerHTML = html;
}
