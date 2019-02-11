
// WebDesktop Window = WDWindow
//
//
//  <div> elements put in each other like so:
//
//
//      ----------------------parentDiv--("window")--------------
//      |                                                       |
//      | ---------header-------------------------------------- |
//      | |  -------------- titleSpan ----  ----- ----- ----- | |
//      | |  |                           |  | - | | M | | X | | |
//      | |  -----------------------------  ----- ----- ----- | |
//      | ----------------------------------------------------- |
//      |                                                       |
//      | ------------main------------------------------------- |
//      | |                                                   | |
//      | | --------------app-------------------------------- | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                User content  ....             | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | ------------------------------------------------- | |
//      | |                                                   | |
//      | | --------------?footer?--------------------------- | |
//      | | |                                               | | |
//      | | ------------------------------------------------- | |
//      ---------------------------------------------------------
//
//
//
//
// Draggable, Resizable and Iconifible window made with <div>
function WDWindow(headerText, app,
    minW=0, maxW=0, minH=0, maxH=0, onclose = null) {

    ////////////////////////////////STATE//////////////////////////////////
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
    // So ya, we have 3x2x2=12 possible states, but we disallow the 2
    // states: full screen with rolled up, leaving us 10 states.
    //
    //
    // Initial display state:
    var displayState = NORMAL_SIZE;
    //
    //
    // So there are 3 state variables: displayState, isHidden, isRolledUp,
    // and to save the window position and size when the "window" is not
    // in the "normal state":
    var normalX, normalY, normalWidth, normalHeight;
    //
    ///////////////////////////////////////////////////////////////////////


    var parentDiv = document.createElement('div');
    parentDiv.className = 'WDParentDiv';

    var header = document.createElement('div');
    header.className = 'WDHeader';
    parentDiv.appendChild(header);

    var titleSpan = document.createElement('span');
    titleSpan.className = 'WDTitleSpan';
    titleSpan.appendChild(document.createTextNode(headerText));
    header.appendChild(titleSpan);

    var body = document.body;
    var html = document.documentElement;

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

    var main = document.createElement('div');
    main.appendChild(app);
    main.className = 'WDMain';
    parentDiv.appendChild(main);


    function desktopWidth() {
        return innerWidth;
    }

    function desktopHeight() {
        return innerHeight;
    }

    const startingHeaderCursor = 'grab';
    header.style.cursor = startingHeaderCursor;


    // These get set in "resize":
    normalX = parentDiv.offsetLeft;
    normalY = parentDiv.offsetTop;

    normalWidth = parentDiv.offsetWidth;
    normalHeight = parentDiv.offsetHeight;

    body.appendChild(parentDiv);

    // We center this window thingy to start.
    //
    main.style.width = app.offsetWidth + 'px';
    main.style.height = app.offsetHeight + 'px';

    parentDiv.style.width = app.offsetWidth + 'px';
    parentDiv.style.height = (app.offsetHeight + header.offsetHeight) + 'px';

    parentDiv.style.left = (desktopWidth() - parentDiv.clientWidth)/2 + 'px';
    parentDiv.style.top = (desktopHeight() - parentDiv.clientHeight)/2 + 'px';

    // initialize what is the normal size:
    normalX = parentDiv.offsetLeft;
    normalY = parentDiv.offsetTop;
    normalWidth = parentDiv.offsetWidth;
    normalHeight = parentDiv.offsetHeight;


    ///////////////////////////////////////////////////////////////////////
    //  At this point all the elements are built.
    ///////////////////////////////////////////////////////////////////////

    xIcon.onclick = function() {
        if(onclose) onclose();
        body.removeChild(parentDiv);
    };

    header.ondblclick = function() {

        if(isRolledUp) {

            isRolledUp = false;
            main.style.display = 'block';
            minIcon.title === 'minify';
            //main.style.visiblity = 'visible';
            return;
        }
        // else isRolledUp === false

        parentDiv.style.height = header.offsetHeight + 'px';

        isRolledUp = true;
        main.style.display = 'none';
        minIcon.title === 'show';
        //main.style.visiblity = 'invisible';
    };

    minIcon.onclick = header.ondblclick;


    function setToNormalSize() {

        // Set this "widow" to a normal size that is not maximized,
        // rolled up, and is showing.  The "resize" will redefine what
        // normal is.

        parentDiv.style.left = normalX + 'px';
        parentDiv.style.top = normalY + 'px';

        parentDiv.style.width = normalWidth + 'px';
        if(isRolledUp)
            parentDiv.style.height = header.offsetHeight + 'px';
        else
            parentDiv.style.height = normalHeight + 'px';

        main.style.width = normalWidth + 'px';
        main.style.height = (normalHeight - header.offsetHeight) + 'px';

        maxIcon.title = 'maximize';
        displayState = NORMAL_SIZE;
    }

    function setToMaximized() {

        let h = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
        //h -= body.offsetTop;

        let w = Math.max(body.scrollWidth, body.offsetWidth,
                html.clientWidth, html.scrollWidth, html.offsetWidth);

        parentDiv.style.width = body.offsetWidth + 'px'

        if(isRolledUp)
            parentDiv.style.height = header.offsetHeight + 'px';
        else
            parentDiv.style.height = h + 'px';

        main.style.width = body.offsetWidth + 'px';
        main.style.height = (h - header.offsetHeight) + 'px';

        parentDiv.style.left = '0px';
        parentDiv.style.top = '0px';

        maxIcon.title = 'normal size';
        displayState = MAXIMIZED;
    }

    maxIcon.onclick = function() {
        if(displayState === NORMAL_SIZE)
            setToMaximized();
        else // displayState === MAXIMIZED || 
            //  displayState === FULL_SCREEN
            setToNormalSize();
    };


    // reference:
    // https://www.w3schools.com/howto/howto_js_draggable.asp

    ////////////////////////////////////////////////
    // Make the parentDiv element draggable by grabbing
    // part of the header, and also make it resizable.
    ////////////////////////////////////////////////

    var x0, y0, left0, top0;
    var marginX, marginY, startX, startY;
    var sx0, sy0;
    var oldBodyCursor;
    var isDragging = false;


    // Prevent the "window top bar" icon buttons from being part of the
    // "grab bar".
    function stop(e) { e.stopPropagation(); }
    xIcon.onmousedown = stop;
    minIcon.onmousedown = stop;
    maxIcon.onmousedown = stop;


    function dreport() {

        console.log('parentDiv.style.top=' + parentDiv.style.top + ' ' +
            'parentDiv.offsetTop=' + parentDiv.offsetTop + '   ' +
            'parentDiv.style.left=' + parentDiv.style.left + ' ' +
            'parentDiv.offsetLeft=' + parentDiv.offsetLeft + ' ' +
            'startX=' + startX + '  ' +
            'startY=' + startY);

    }

    header.onmouseover = function(e) {

        if(!isHidden && !isRolledUp && !isDragging) {

            header.onmousemove = function(e) {

                if(((e.clientX - parentDiv.offsetLeft) < 10 &&
                        (e.clientY - parentDiv.offsetTop) < 10)) {
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
        }
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

        let style = getComputedStyle(parentDiv);
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


        if(x0 - parentDiv.offsetLeft < 10 &&
                y0 - parentDiv.offsetTop < 10) {

            if(isRolledUp || isHidden)
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
                    parentDiv.style.left = e.clientX + 'px';
                    parentDiv.style.top = e.clientY + 'px';

                    main.style.width = (parentDiv.offsetWidth + x0 - 
                            e.clientX) + 'px';
                    main.style.height = (parentDiv.offsetHeight + y0 -
                        e.clientY - header.offsetHeight) + 'px';

                    parentDiv.style.width = (parentDiv.offsetWidth + x0 -
                            e.clientX) + 'px';
                    parentDiv.style.height = (parentDiv.offsetHeight + y0 -
                            e.clientY) + 'px';

                    // reinitialize what is the normal position and size:
                    normalX = parentDiv.offsetLeft;
                    normalY = parentDiv.offsetTop;
                    normalWidth = parentDiv.offsetWidth;
                    normalHeight = parentDiv.offsetHeight;
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

        document.onmouseup = closeDrag;
        // call a function whenever the cursor moves:
        document.onmousemove = drag;
        isDragging = true;
        header.focus();

        header.style.cursor = 'grab';
        xIcon.style.cursor = 'grab';
        minIcon.style.cursor = 'grab';
        maxIcon.style.cursor = 'grab';
    }

    function drag(e) {

        e = e || window.event;
        e.preventDefault();

        if(displayState === MAXIMIZED) {
            normalX = x0 - normalWidth*(x0/header.offsetWidth);
            normalY = y0 - header.offsetHeight/2;
            setToNormalSize();
        }

        // calculate the new cursor position:
        var dx = e.clientX - x0;
        var dy = e.clientY - y0;
        x0 = e.clientX;
        y0 = e.clientY;


        // set the element's new position:
        parentDiv.style.left = (parentDiv.offsetLeft + dx - startX -
                (sx0 - scrollX)) + "px";
        parentDiv.style.top = (parentDiv.offsetTop + dy - startY -
                (sy0 - scrollY)) + "px";

        // TODO: if we move the parentDiv to the right past all
        // the current content, the window scrolls, and then
        // when we move the parentDiv back so the scroll goes away
        // the pointer falls off the parentDiv.

        sx0 = scrollX;
        sy0 = scrollY;

        //dreport();
    }   

    const xshow = 18;

    function closeDrag() {

        isDragging = false;

        // stop moving when the mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        if(parentDiv.offsetLeft - startX + parentDiv.offsetWidth < xshow)
            // fix left
            parentDiv.style.left = xshow - parentDiv.offsetWidth + 'px';
        else if(parentDiv.offsetLeft - startX > desktopWidth() - xshow)
            // fix right
            parentDiv.style.left = desktopWidth() - xshow + 'px';

        if(parentDiv.offsetTop - startY < 0)
            // fix upper
            parentDiv.style.top = '0px';
        else if(parentDiv.offsetTop - startY > desktopHeight() -
                header.offsetHeight)
            // fix lower
            parentDiv.style.top = desktopHeight() - header.offsetTop -
                header.offsetHeight + 'px';

        document.body.style.cursor = oldBodyCursor;

        // reinitialize what is the normal position:
        normalX = parentDiv.offsetLeft;
        normalY = parentDiv.offsetTop;

        header.style.cursor = startingHeaderCursor;
        xIcon.style.cursor = 'pointer';
        minIcon.style.cursor = 'pointer';
        maxIcon.style.cursor = 'pointer';
    }
}

