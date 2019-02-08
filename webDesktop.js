
// WebDesktop Window = WDWindow
//
// Draggable, Resizable and Iconifible window made with <div>
function WDWindow(headerText, child,
        minW=0, maxW=0, minH=0, maxH=0,
        onclose = null) {


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

    // Make the close button:
    var xIcon = document.createElement('img');
    xIcon.className = 'WDXIcon';
    xIcon.src = 'x.png';
    xIcon.title = 'close';
    xIcon.setAttribute("tabIndex", 0);
    header.appendChild(xIcon);

    // Make the maximize button:
    var maxIcon = document.createElement('img');
    maxIcon.className = 'WDMaxIcon';
    maxIcon.src = 'max.png';
    maxIcon.title = 'maximize';
    maxIcon.setAttribute("tabIndex", 0);
    header.appendChild(maxIcon);

    // Make the minify button:
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

    function desktopWidth() {
        return innerWidth;
    }

    function desktopHeight() {
        return innerHeight;
    }

    var normalX, normalY, normalWidth, normalHeight;

    maxIcon.onclick = function() {
        if(maxIcon.title === 'maximize') {

            let h = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            h -= header.offsetHeight;
            h -= body.offsetTop;

            let w = Math.max(body.scrollWidth, body.offsetWidth,
                html.clientWidth, html.scrollWidth, html.offsetWidth);

            normalX = topDiv.offsetLeft;
            normalY = topDiv.offsetTop;

            normalWidth = child.offsetWidth;
            normalHeight = child.offsetHeight;

            child.style.width = body.offsetWidth + 'px'
            child.style.height = h + 'px';

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

    // We center this window thingy.
    //
    topDiv.style.left = (desktopWidth() - topDiv.clientWidth)/2 + 'px';
    topDiv.style.top = (desktopHeight() - topDiv.clientHeight)/2 + 'px';

    // reference:
    // https://www.w3schools.com/howto/howto_js_draggable.asp

    ////////////////////////////////////////////////
    // Make the topDiv element draggable by grabbing
    // the grabDiv, and also make it resizable.
    ////////////////////////////////////////////////

    var x0, y0, left0, top0;

    var marginX, marginY, startX, startY, startingHeaderCursor = 'grab';

    function stop(e) { e.stopPropagation(); }

    // Prevent the "window top bar" icon buttons from being part of the
    // "grab bar".
    xIcon.onmousedown = stop;
    minIcon.onmousedown = stop;
    maxIcon.onmousedown = stop;


    header.style.cursor = startingHeaderCursor;


    function dreport() {

        console.log('topDiv.style.top=' + topDiv.style.top + ' ' +
            'topDiv.offsetTop=' + topDiv.offsetTop + '   ' +
            'topDiv.style.left=' + topDiv.style.left + ' ' +
            'topDiv.offsetLeft=' + topDiv.offsetLeft + ' ' +
            'startX=' + startX + '  ' +
            'startY=' + startY);

    }

    var sx0, sy0;
    var oldBodyCursor;


    header.onmouseover = function(e) {

        console.log('got header hover');

        header.onmousemove = function(e) {

            if(((e.clientX - topDiv.offsetLeft) < 10 &&
                    (e.clientY - topDiv.offsetTop) < 10)) {
                ///////////////////////////////////////////
                // "Window" resize from the TOP LEFT case:
                ///////////////////////////////////////////
                header.style.cursor = 'nw-resize';
            } else {

                 header.style.cursor = startingHeaderCursor;
            }
        };

        header.onmousemove(e);

        header.onmouseout = function(e) {

            header.style.cursor = startingHeaderCursor;
            header.onmouseout = null;
            header.onmousemove = null;
        };
    };


    // mouse down callback
    header.onmousedown = function(e) {

        if(header.onblur)
            // Undo the onmouseover (hover)
            header.onmouseout(e);

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        x0 = e.clientX;
        y0 = e.clientY;
        // As we drag the "window" past a right or bottom edge the
        // dimensions of the desktop can change to allow the "window" to
        // move.  So we need to get the desktop dimensions not before the
        //

        let style = getComputedStyle(topDiv);
        let hStyle = getComputedStyle(header);
        startX = parseInt(style.marginLeft);
        startY = parseInt(style.marginTop);
        oldBodyCursor = getComputedStyle(document.body).cursor;

        sx0 = scrollX;
        sy0 = scrollY;

        console.log('topDiv at=' + topDiv.offsetLeft + ' , ' +
                topDiv.offsetTop);
        console.log('pointer at=' + e.clientX + ' , ' + e.clientY);
        console.log('diff=' +  (e.clientX - topDiv.offsetLeft) + 
                ' , ' + (e.clientY - topDiv.offsetTop));



          
        ///////////////////////////////////////////////
        ///////////////////////////////////////////////
        // 
        ///////////////////////////////////////////////


        if(((e.clientX - topDiv.offsetLeft) < 10 &&
                (e.clientY - topDiv.offsetTop) < 10)) {
            ///////////////////////////////////////////
            // "Window" resize from the TOP LEFT case:
            ///////////////////////////////////////////

            document.body.style.cursor = 'nw-resize';
            header.style.cursor = 'nw-resize';

            document.onmouseup = function(e) {

                if(
                elementDrag(e);
                closeDragElement(e);
            };

            return;
        }

        ///////////////////////////////////////////////
        ///////////////////////////////////////////////



        ///////////////////////////////////////
        // For the grab and move case:
        ///////////////////////////////////////
        document.body.style.cursor = 'move';
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
        topDiv.style.left = (topDiv.offsetLeft + dx - startX -
                (sx0 - scrollX)) + "px";
        topDiv.style.top = (topDiv.offsetTop + dy - startY -
                (sy0 - scrollY)) + "px";

        // TODO: if we move the topDiv to the right past all
        // the current content, the window scrolls, and then
        // when we move the topDiv back so the scroll goes away
        // the pointer falls off the topDiv.

        sx0 = scrollX;
        sy0 = scrollY;

        console.log('topDiv at=' + topDiv.offsetLeft + ' , ' +
                topDiv.offsetTop);
        console.log('pointer at=' + e.clientX + ' , ' + e.clientY);
        console.log('diff=' +  (e.clientX - topDiv.offsetLeft) + 
                ' , ' + (e.clientY - topDiv.offsetTop));
        //dreport();
    }   

    const xshow = 20;

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        header.style.cursor = 'grab';
        
        if(topDiv.offsetLeft - startX + topDiv.offsetWidth < xshow)
            // fix left
            topDiv.style.left = xshow - topDiv.offsetWidth + 'px';
        else if(topDiv.offsetLeft - startX > desktopWidth() - xshow)
            // fix right
            topDiv.style.left = desktopWidth() - xshow + 'px';

        if(topDiv.offsetTop - startY < 0)
            // fix upper
            topDiv.style.top = '0px';
        else if(topDiv.offsetTop - startY > desktopHeight() -
                header.offsetHeight)
            // fix lower
            topDiv.style.top = desktopHeight() - header.offsetTop -
                header.offsetHeight + 'px';

        document.body.style.cursor = oldBodyCursor;
        header.style.cursor = startingHeaderCursor;

    }
}

