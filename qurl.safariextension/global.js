// Contextual Menu and Toolbar item
safari.application.addEventListener("command", qURLCommand, false);
safari.application.addEventListener("validate", qURLValidate, false);

// Messages from code in URL page display
safari.application.addEventListener("message", messageHandler, false);


{
    var urlPage = null;
    var urlQueue = safari.extension.settings.urlQueue || [];

    function updatedQueue() {
        safari.extension.settings.urlQueue = urlQueue;
        for(var i = 0; i < safari.extension.toolbarItems.length; i++) {
            safari.extension.toolbarItems[i].disabled = !urlQueue.length;
            safari.extension.toolbarItems[i].badge = safari.extension.settings.showbadge && urlQueue.length;
        }
    }


    function messageHandler(event) {
        if(event.name === "sendQueue") {
            event.target.page.dispatchMessage("URLQueue", urlQueue);
        }

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
        if(event.command === "qurl" || event.command === "qpage") {
            event.target.disabled = true;
            try {
                var ui = event.userInfo;  // This can throw an error

                if(event.command === "qurl" && ui.href !== undefined)
                    event.target.disabled = false;

                else if(event.command === "qpage" && ui.curpage !== undefined && ui.href === undefined)
                    event.target.disabled = false;

            } catch(e) {
            }
        } else if(event.command === 'qurlbutton') {
            event.target.disabled = !urlQueue.length;
            event.target.badge = safari.extension.settings.showbadge && urlQueue.length;
        }
    }


    function qURLCommand(event) {
        if(event.command === "qurl" || event.command === "qpage") {
            try {
                var ui = event.userInfo;
                if(event.command === "qpage") {
                    ui.href = ui.curpage;
                    ui.name = ui.title;
                }
                urlQueue.push(ui);
                updatedQueue();
                if(urlPage != null)
                    urlPage.page.dispatchMessage("URLQueue", urlQueue);
            } catch(e) {
            }
        } else if(event.command === 'qurlbutton' && urlQueue.length > 0) {
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