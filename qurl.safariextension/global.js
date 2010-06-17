// Contextual Menu item
safari.application.addEventListener("command", qURLCommand, false);
safari.application.addEventListener("validate", qURLValidate, false);

// Toolbar Item
safari.application.addEventListener("command", qNextURLCommand, false);
safari.application.addEventListener("validate", qNextURLValidate, false);

// Message from index page
safari.application.addEventListener("message", messageHandler, false);



{
    var urlPage = null;
    var urlQueue = safari.extension.settings.urlQueue;
    if(urlQueue === undefined)
        urlQueue = new Array();

    function updatedQueue() {
        safari.extension.settings.urlQueue = urlQueue;
        for(var i in safari.extension.toolbarItems) {
            safari.extension.toolbarItems[i].disabled = !urlQueue.length;
            safari.extension.toolbarItems[i].badge = safari.extension.settings.showbadge ? urlQueue.length : 0;
        }
    }



    function messageHandler(event) {
        if(event.name === "sendQueue")
            event.target.page.dispatchMessage("URLQueue", urlQueue);

        if(event.name == "removeURL") {
            var idx = event.message;
            if(idx >= 0 && idx < urlQueue.length) {
                urlQueue.splice(idx, 1);
                updatedQueue();
                event.target.page.dispatchMessage("URLQueue", urlQueue);
            }
        }
    }


    function qURLValidate(event) {
        if(event.command !== "qurl")
            return;

        try {
            var ui = event.userInfo;
            if(ui === undefined || ui == null) {
                event.target.disabled = true;
            } else {
                event.target.disabled = false;
            }
        } catch(e) {
            event.target.disabled = true;
        }
    }

    function qURLCommand(event) {
        if(event.command !== "qurl")
            return;
        
        try {
            var ui = event.userInfo;
            urlQueue.push(ui);
            updatedQueue();
            if(urlPage != null) 
                urlPage.page.dispatchMessage("URLQueue", urlQueue);
        } catch(e) {
        }

    }


    function qNextURLValidate(event) {
        if(event.command !== 'qurlbutton')
            return;
        
        if(urlQueue.length == 0)
            event.target.disabled = true;
        else
            event.target.disabled = false;

        event.target.badge = safari.extension.settings.showbadge ? urlQueue.length : 0;
    }


    function qNextURLCommand(event) {
        if(event.command !== 'qurlbutton')
            return;

        if(urlQueue.length > 0) {
            if(safari.extension.settings.buttonmode == 1) {
                var next = urlQueue.shift();
                safari.application.activeBrowserWindow.activeTab.url = next.href;
                updatedQueue();
            } else {
                if(urlPage == null || urlPage.browserWindow === undefined) {
                    urlPage = safari.application.activeBrowserWindow.openTab("foreground");
                } else {
                    urlPage.activate();
                }
                urlPage.url = safari.extension.baseURI + "index.html";
            }
        }
    }
}