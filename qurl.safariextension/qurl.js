
// Per window code to get current selection
document.addEventListener("contextmenu", contextMenu, false);

function contextMenu(event) {
    var el = document.elementFromPoint(event.clientX, event.clientY);
    if(el != null) {
        if(el.tagName != 'A' && el.parentElement != null)
            el = el.parentElement;

        if(el.tagName == 'A' && el.href != '') {
            var name = (el.textContent.length <= 1) ? el.href : el.textContent;
            safari.self.tab.setContextMenuEventUserInfo(event, { href: el.href, name: name });
            return;
        }
    }

    var sel = window.parent.getSelection().toString();
    sel = sel.replace(/^\s+|\s+$/g,"");
    if(sel != '') {
        // Add in url detection
        safari.self.tab.setContextMenuEventUserInfo(event, { href: sel, name: sel});
        return;
    }

    safari.self.tab.setContextMenuEventUserInfo(event, null);
}
