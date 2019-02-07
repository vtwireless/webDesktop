



// WebDesktop Window = WDWindow
//
// Draggable, Resizable and Iconifible window made with <div>
function WDWindow(headerText, child, onclose = null) {

    

    var topDiv = document.createElement('div');
    topDiv.className = 'WDWindow';


    var header = document.createElement('div');
    header.className = 'WDHeader';
    topDiv.appendChild(header);

    var span = document.createElement('span');
    span.className = 'WDHeader';
    span.appendChild(document.createTextNode(headerText));
    header.appendChild(span);

    function showOrHide(el, button) {
        if(getComputedStyle(el).visibility == 'hidden') {
            button.title = 'minify';
            el.style.visibility = 'visible';
        } else {
            button.title = 'show';
            el.style.visibility = 'hidden';
        }
    }

    var body = document.body,
    html = document.documentElement;

    var xIcon = document.createElement('img');
    xIcon.className = 'WDXIcon';
    xIcon.src = 'x.png';
    xIcon.title = 'close';
    xIcon.setAttribute("tabIndex", 0);
    header.appendChild(xIcon);

    var maxIcon = document.createElement('img');
    maxIcon.className = 'WDMaxIcon';
    maxIcon.src = 'max.png';
    maxIcon.title = 'maximize';
    maxIcon.setAttribute("tabIndex", 0);
    header.appendChild(maxIcon);


    var minIcon = document.createElement('img');
    minIcon.className = 'WDMinIcon';
    minIcon.src = 'min.png';
    minIcon.title = 'minify';
    minIcon.setAttribute("tabIndex", 0);
    header.appendChild(minIcon);

    header.setAttribute("tabIndex", 0);


    var mainWin = document.createElement('div');
    mainWin.appendChild(child);
    topDiv.appendChild(mainWin);

    minIcon.onclick = function() { showOrHide(mainWin, minIcon); };
    xIcon.onclick = function() {
        if(onclose) onclose();
        body.removeChild(topDiv);
    };

    var body = document.body,
    html = document.documentElement;


    var normalX, normalY, normalWidth, normalHeight;

    maxIcon.onclick = function() {
        if(maxIcon.title === 'maximize') {

            let h = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            h -= header.offsetHeight;
            h -= body.offsetTop;
            h -= 10;

            let w = Math.max(body.scrollWidth, body.offsetWidth,
                html.clientWidth, html.scrollWidth, html.offsetWidth);

            normalX = topDiv.offsetLeft;
            normalY = topDiv.offsetTop;

            normalWidth = child.offsetWidth;
            normalHeight = child.offsetHeight;

            child.style.width = body.offsetWidth + 'px'
            child.style.height = h + 'px';

            console.log('h=' + h);

            topDiv.style.left = '0px';
            topDiv.style.top = '0px';

            maxIcon.title = 'normal size';

        } else {

            topDiv.style.left = normalX + 'px';
            topDiv.style.top = normalY + 'px';

            child.style.width = normalWidth + 'px';
            child.style.height = normalHeight + 'px';
            
            maxIcon.title = 'maximize';
        }
    };


    header.ondblclick = function() { showOrHide(mainWin, minIcon); };

    body.appendChild(topDiv);

    // Make the DIV element draggable:
    _makeDragElement(topDiv, header);


    var body = document.body,
    html = document.documentElement;

    let h = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    let w = Math.max(body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth);

    // We center this window thingy.
    //
    topDiv.style.left = (w - topDiv.clientWidth)/2 + 'px';
    topDiv.style.top = (h - topDiv.clientHeight)/2 + 'px';
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
        header.focus();
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

    const xshow = 20;

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        header.style.cursor = 'grab';
        if(elmnt.offsetLeft - startX + elmnt.offsetWidth < xshow)
            elmnt.style.left = xshow - elmnt.offsetWidth + 'px';
        if(elmnt.offsetTop - startY < 0)
            elmnt.style.top = '0px';

        //document.body.style.cursor = oldBodyCursor;
        header.style.cursor = 'grab';

    }
}

