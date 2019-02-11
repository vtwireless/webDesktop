
// WebDesktop Window = WDWindow
//
//
//  <div> elements put in each other like so:
//
//
//      --------------------topDiv--("window")----------
//      | ---------header----------------------------- |
//      | |                                          | |
//      | -------------------------------------------- |
//      |                                              |
//      | ------------mainWin------------------------- |
//      | |                                          | |
//      | | --------------app----------------------- | |
//      | | |                                      | | |
//      | | |                                      | | |
//      | | |                                      | | |
//      | | |                                      | | |
//      | | |   User content  ....                 | | |
//      | | |                                      | | |
//      | | |                                      | | |
//      | | |                                      | | |
//      | | |                                      | | |
//      | | |                                      | | |
//      | | ---------------------------------------- | |
//      | -------------------------------------------- |
//      ------------------------------------------------
//
//
//
//
// Draggable, Resizable and Iconifible window made with <div>
function WDWindow(headerText, app,
        minW=0, maxW=0, minH=0, maxH=0,
        onclose = null) {

    // I don't see the point of making a object for constant int values.
    // That would be a waste of memory and CPU.  This is the high
    // performance version of javaScript enumeration.
    //
    // https://stackoverflow.com/questions/287903/what-is-the-preferred-syntax-for-defining-enums-in-javascript/
    //
    ///////////////////////////////////////////////////////////////////////
    //
    // Possible state:
    //
    // Enumeration of the 3 possible "window" display size states as we
    // define them:
    const NORMAL_SIZE = 0, MAXIMIZED = 1, FULL_SCREEN = 3;
    // 
    var isHidden = false;
    var isRolledUp = false;
    //
    // So ya, we have 3x2x2=12 possible states, but we disallow
    // the 3 states [FULL_SCREEN && (hidden || rolledUp)] full screen with
    // hidden or rolled up, leaving us 9 states.
    //

    //
    // Initial display state:
    var displayState = NORMAL_SIZE;
    //
    ///////////////////////////////////////////////////////////////////////


    // To save the old window size when not maximized
    // or rolled up:
    var normalX, normalY, normalWidth, normalHeight;

    var topDiv = document.createElement('div');
    topDiv.className = 'WDWindow';


    var header = document.createElement('div');
    header.className = 'WDHeader';
    topDiv.appendChild(header);

    var span = document.createElement('span');
    span.className = 'WDHeader';
    span.appendChild(document.createTextNode(headerText));
    header.appendChild(span);

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
    mainWin.appendChild(app);
    mainWin.className = 'WDmainWin';
    topDiv.appendChild(mainWin);

    minIcon.onclick = minifyOrShow;
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


    normalX = topDiv.offsetLeft;
    normalY = topDiv.offsetTop;

    normalWidth = topDiv.offsetWidth;
    normalHeight = topDiv.offsetHeight;


    
    ///////////////////////////////////////////////////////////////////////
    // This "window" thing has 5 display states that are set by the next 5
    // setTo* functions:
    ///////////////////////////////////////////////////////////////////////

    function setToNormalSize() {

        // Set this "widow" to a normal size that is not maximized,
        // rolled up, and is showing.  The "resize" will redefine what
        // normal is.

        topDiv.style.left = normalX + 'px';
        topDiv.style.top = normalY + 'px';

        topDiv.style.width = normalWidth + 'px';
        topDiv.style.height = normalHeight + 'px';
                        
        mainWin.style.width = normalWidth + 'px';
        mainWin.style.height = (normalHeight - header.offsetHeight) + 'px';

        maxIcon.title = 'maximize';
        minIcon.title = 'minimize';
    }

    function setToRolledUp() {



    }

    function setToMaximized() {

        let h = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
        h -= body.offsetTop;

        let w = Math.max(body.scrollWidth, body.offsetWidth,
                html.clientWidth, html.scrollWidth, html.offsetWidth);

        normalX = topDiv.offsetLeft;
        normalY = topDiv.offsetTop;

        normalWidth = topDiv.offsetWidth;
        normalHeight = topDiv.offsetHeight;

        topDiv.style.width = body.offsetWidth + 'px'
        topDiv.style.height = h + 'px';

        mainWin.style.width = body.offsetWidth + 'px';
        mainWin.style.height = (h - header.offsetHeight) + 'px';

        topDiv.style.left = '0px';
        topDiv.style.top = '0px';

        maxIcon.title = 'normal size';
    }

    function setToFullScreen() {

    }

    function setToHidden () {

        // In this particular display state there may be an icon bar (or
        // other representative thing) that has a corresponding icon for
        // "showing" this app "window".

    }
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    /////////////////////// Now setup callbacks ///////////////////////////


    xIcon.onclick = function() {
        
        // TODO: Add icon bar and not destroy the app, just close it.
        
        if(onclose) onclose();
        body.removeChild(topDiv);
    };


    maxIcon.onclick = function() {
        if(displayState === NORMAL_SIZE)
             setToMaximized();
        else
            setToNormalSize();
    };


    header.ondblclick = minifyOrShow;

    body.appendChild(topDiv);


    // We center this window thingy to start.
    //

    mainWin.style.width = app.offsetWidth + 'px';
    mainWin.style.height = app.offsetHeight + 'px';

    topDiv.style.width = app.offsetWidth + 'px';
    topDiv.style.height = (app.offsetHeight + header.offsetHeight) + 'px';

    topDiv.style.left = (desktopWidth() - topDiv.clientWidth)/2 + 'px';
    topDiv.style.top = (desktopHeight() - topDiv.clientHeight)/2 + 'px';

    // initialize what is the normal size:
    normalX = topDiv.offsetLeft;
    normalY = topDiv.offsetTop;
    normalWidth = topDiv.offsetWidth;
    normalHeight = topDiv.offsetHeight;


    // reference:
    // https://www.w3schools.com/howto/howto_js_draggable.asp

    ////////////////////////////////////////////////
    // Make the topDiv element draggable by grabbing
    // the grabDiv, and also make it resizable.
    ////////////////////////////////////////////////

    var x0, y0, left0, top0;

    var marginX, marginY, startX, startY, startingHeaderCursor = 'grab';


    // Prevent the "window top bar" icon buttons from being part of the
    // "grab bar".
    function stop(e) { e.stopPropagation(); }
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


        ///////////////////////////////////////////////
        ///////////////////////////////////////////////
        // 
        ///////////////////////////////////////////////


        if(x0 - topDiv.offsetLeft < 10 &&
                y0 - topDiv.offsetTop < 10) {

            if(minIcon.title === 'show')
                // This "window" is not showing so we will not resize it
                // in this case.
                return;

            ///////////////////////////////////////////
            // "Window" resize from the TOP LEFT case:
            ///////////////////////////////////////////
            document.body.style.cursor = 'nw-resize';
            header.style.cursor = 'nw-resize';

            document.onmouseup = function(e) {
        
                document.onmouseup = null;

                document.body.style.cursor = oldBodyCursor;
                header.style.cursor = startingHeaderCursor;

                if(x0 !== e.clientX && y0 !== e.clientY){
                    topDiv.style.left = e.clientX + 'px';
                    topDiv.style.top = e.clientY + 'px';

                    mainWin.style.width = (topDiv.offsetWidth + x0 - 
                            e.clientX) + 'px';
                    mainWin.style.height = (topDiv.offsetHeight + y0 -
                        e.clientY - header.offsetHeight) + 'px';

                    topDiv.style.width = (topDiv.offsetWidth + x0 -
                            e.clientX) + 'px';
                    topDiv.style.height = (topDiv.offsetHeight + y0 -
                            e.clientY) + 'px';

                }

            };

            return;
        }


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

        //dreport();
    }   

    const xshow = 8;

    function closeDragElement() {

        // stop moving when the mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

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

