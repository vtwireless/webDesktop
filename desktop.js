



// WebDesktop Window = WDWindow
//
// Draggable, Resizable and Iconifible window like <div>
function WDWindow(headerText, parentNode, child) {

    var div = document.createElement('div');
    div.className = 'WDWindow';

    var header = document.createElement('div');
    header.className = 'WDHeader';
    div.appendChild(header);

    var span = document.createElement('span');
    span.className = 'WDHeader';
    span.appendChild(document.createTextNode(headerText));
    header.appendChild(span);

    /*var spacer = document.createElement('div');
    spacer.className = 'spacer';
    header.appendChild(spacer);
*/
    var minIcon = document.createElement('img');
    minIcon.className = 'minIcon';
    minIcon.src = 'min.png';
    header.appendChild(minIcon);

    this.getElement = function() {
        return div;
    };

    parentNode.appendChild(div);
    div.appendChild(child);

    // Make the DIV element draggable:
    _makeDragElement(div, header);


    var body = document.body,
    html = document.documentElement;

    var h = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    let w = Math.max(body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth);

    // We center this window thingy.
    //
    div.style.left = (w - div.clientWidth)/2 + 'px';
    div.style.top = (h - div.clientHeight)/2 + 'px';
}

// reference:
// https://www.w3schools.com/howto/howto_js_draggable.asp

// Make the DIV element draggable:
function _makeDragElement(elmnt, header) {

    var x0, y0, left0, top0;

    var marginX, marginY;

    // if present, the header is where you move the DIV from:
    header.onmousedown = dragMouseDown;
    header.style.cursor = 'grab';

    function dreport() {

        console.log('elmnt.style.top=' + elmnt.style.top + ' ' +
            'elmnt.offsetTop=' + elmnt.offsetTop + '   ' +
            'elmnt.style.left=' + elmnt.style.left + ' ' +
            'elmnt.offsetLeft=' + elmnt.offsetLeft + ' ' +
            'startX=' + startX + '  ' +
            'startY=' + startY);

    }

    var sx0, sy0;

    //var oldBodyCursor;

    function dragMouseDown(e) {

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        x0 = e.clientX;
        y0 = e.clientY;

        let style = getComputedStyle(elmnt);
        let hStyle = getComputedStyle(header);
        startX = parseInt(style.marginLeft);
        startY = parseInt(style.marginTop);
        startingCursor = hStyle.cursor;

        sx0 = scrollX;
        sy0 = scrollY;

        //oldBodyCursor = getComputedStyle(document.body).cursor

        //document.body.style.cursor = 'move';
        header.style.cursor = 'move';
        //dreport();

        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        var dx = e.clientX - x0;
        var dy = e.clientY - y0;
        x0 = e.clientX;
        y0 = e.clientY;

        // set the element's new position:
        elmnt.style.left = (elmnt.offsetLeft + dx - startX -
                (sx0 - scrollX)) + "px";
        elmnt.style.top = (elmnt.offsetTop + dy - startY -
                (sy0 - scrollY)) + "px";

        // TODO: if we move the elmnt to the right past all
        // the current content, the window scrolls, and then
        // when we move the elmnt back so the scroll goes away
        // the pointer falls off the elmnt.

        sx0 = scrollX;
        sy0 = scrollY;

        //dreport();
    }   

    const xfug = 20;

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        header.style.cursor = 'grab';
        if(elmnt.offsetLeft - startX + elmnt.offsetWidth < xfug)
            elmnt.style.left = xfug - elmnt.offsetWidth + 'px';
        if(elmnt.offsetTop - startY < 0)
            elmnt.style.top = '0px';

        //document.body.style.cursor = oldBodyCursor;
        header.style.cursor = 'grab';

    }
}

