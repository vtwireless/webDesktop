// There are many other web desktops.  We wanted one that did not require
// a server; so it's just client side javaScript and CSS; and you can use
// it from a single small HTML file.  Not a full-featured desktop.  Just
// a very simple app containers in a browser.
//
//
// https://en.wikipedia.org/wiki/Web_desktop
// https://en.wikipedia.org/wiki/Desktop_metaphor
//

//
// WebDesktop App = WDApp
//
//
//  <div> elements put in each other like so:
//
//
//      ----------------------topDiv--("window")--------------
//      |                                                       |
//      | ---------header-------------------------------------- |
//      | |  --- ---------- titleSpan ----  ----- ----- ----- | |
//      | |  |@| |                       |  | - | | M | | X | | |
//      | |  --- -------------------------  ----- ----- ----- | |
//      | ----------------------------------------------------- |
//      |                                                       |
//      | ------------main------------------------------------- |
//      | |                                                   | |
//      | | --------------app-------------------------------- | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |                                               | | |
//      | | |            User app content  ....             | | |
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
//      | ----------------------------------------------------- |
//      ---------------------------------------------------------
//
//

//
// Draggable, Resizable, RollUpable, and Iconifible window app made with
// <div>
//
function WDApp(headerText, app, onclose = null, opts = null) {

    if(!opts)
        var opts = {};

    if(opts.appIcon === undefined)
        opts.appIcon = 'defaultAppIcon.png';

    var dcount = 0; 


    ////////////////////////////////STATE//////////////////////////////////
    //
    // Possible state:
    //
    // Enumeration of the 3 possible "window" display size states as we
    // define them:
    const NORMAL_SIZE = 0, MAXIMIZED = 1, FULL_SCREEN = 3;
    // 
    var isHidden = false;   // in the docker
    var isRolledUp = false; // just header showing
    //
    // So ya, we have 3x2x2=12 possible states, but we disallow the 1
    // state: full screen with rolled up, leaving us 11 states.
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


    var topDiv = document.createElement('div');
    topDiv.className = 'WDTopDiv';

    var header = document.createElement('div');
    header.className = 'WDHeader';
    topDiv.appendChild(header);

    var appIcon =  document.createElement('img');
    appIcon.className = 'WDAppIcon';
    appIcon.src = opts.appIcon;
    appIcon.setAttribute("tabIndex", 0);
    header.appendChild(appIcon);

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
    topDiv.appendChild(main);


    function desktopWidth() {
        return innerWidth;
    }

    function desktopHeight() {
        return innerHeight;
    }

    const startingHeaderCursor = 'grab';
    header.style.cursor = startingHeaderCursor;

    body.appendChild(topDiv);

    // We center this window thingy to start.
    //
    main.style.width = app.offsetWidth + 'px';
    main.style.height = app.offsetHeight + 'px';

    // ref:
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight
    // NOTE: offsetWidth and offsetHeight include padding and border.
    topDiv.style.width = app.offsetWidth + 'px';
    topDiv.style.height = (app.offsetHeight + header.offsetHeight) + 'px';

    topDiv.style.left = (desktopWidth() - topDiv.clientWidth)/2 + 'px';
    topDiv.style.top = (desktopHeight() - topDiv.clientHeight)/2 + 'px';

    // Element offsetWidth and offsetHeight do not include the padding.

    let pdstyle = getComputedStyle(topDiv);
    var topDivPaddingLeft = parseInt(pdstyle.getPropertyValue('padding-left'));
    var topDivPaddingTop = parseInt(pdstyle.getPropertyValue('padding-top'));
    var topDivPaddingWidth = topDivPaddingLeft +
            parseInt(pdstyle.getPropertyValue('padding-right'));
    var topDivPaddingHeight = topDivPaddingTop +
            parseInt(pdstyle.getPropertyValue('padding-bottom'));

    // Keep the app from inheriting the cursor from topDiv
    main.style.cursor = 'default';

    var x0, y0, left0, top0;
    var marginX, marginY, startX, startY;
    var sx0, sy0;

    // initialize what is the normal size:
    normalX = topDiv.offsetLeft;
    normalY = topDiv.offsetTop;
    // The style width and height do not include padding,
    // but offsetWidth and offsetHeight do include padding.
    normalWidth = topDiv.offsetWidth - topDivPaddingWidth;
    normalHeight = topDiv.offsetHeight - topDivPaddingHeight;


    this.topDiv = topDiv;
    this.zIndex = ++(WDApp.zIndexMax);

    WDApp.stackingOrder[this.zIndex] = this;
    topDiv.style.zIndex = this.zIndex;

    // We need access to this object in some of the functions here in.
    var This = this;


    ///////////////////////////////////////////////////////////////////////
    //  At this point all the elements are built.
    ///////////////////////////////////////////////////////////////////////

    function pushBackOthers() {
        // Push back all the other "windows" that are in front of this one.
        for(var i=This.zIndex+1; i<=WDApp.zIndexMax; ++i) {
            var app = WDApp.stackingOrder[i];
            app.topDiv.style.zIndex = i-1;
            app.zIndex = i-1;
            WDApp.stackingOrder[i-1] = app;
        }
    }

    function popForward() {

        // Change the "window" stacking order.

        if(This.zIndex === WDApp.zIndexMax)
            // This is the top "window" already.
            return;
        pushBackOthers();
        This.zIndex = WDApp.zIndexMax;
        WDApp.stackingOrder[This.zIndex] = This;
        // Put this "window" on top in the at the zIndexMax
        topDiv.style.zIndex = This.zIndex;
    }

    xIcon.onclick = function() {
        if(onclose) onclose();
        body.removeChild(topDiv);
        // Fix the stacking order of all the "windows":
        pushBackOthers();
        delete WDApp.stackingOrder[WDApp.zIndexMax];
        --WDApp.zIndexMax;
    };


    header.ondblclick = function() {

        popForward();

        if(isRolledUp) {

            isRolledUp = false;
            main.style.display = 'block';
            minIcon.title === 'minify';
            main.style.visiblity = 'visible';
            if(displayState === NORMAL_SIZE)
                setToNormalSize();
            else if(displayState === MAXIMIZED)
                setToMaximized();
            return;
        }
        // else isRolledUp === false

        topDiv.style.height = header.offsetHeight + 'px';

        isRolledUp = true;
        main.style.display = 'none';
        minIcon.title === 'show';
        main.style.visiblity = 'invisible';
    };

    minIcon.onclick = header.ondblclick;


    function setToNormalSize() {

        // Set this "widow" to a normal size that is not maximized,
        // rolled up, and is showing.  The "resize" will redefine what
        // normal is.

        topDiv.style.left = normalX + 'px';
        topDiv.style.top = normalY + 'px';

        topDiv.style.width = normalWidth + 'px';
        if(isRolledUp)
            topDiv.style.height = header.offsetHeight + 'px';
        else
            topDiv.style.height = normalHeight + 'px';

        main.style.width = normalWidth + 'px';
        main.style.height = (normalHeight - header.offsetHeight) + 'px';

        maxIcon.title = 'maximize';
        displayState = NORMAL_SIZE;
    }


    function setToMaximized() {

        var style = getComputedStyle(topDiv);

        let h = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);

        topDiv.style.width = body.offsetWidth + 'px'

        if(isRolledUp)
            topDiv.style.height = header.offsetHeight + 'px';
        else
            topDiv.style.height = h + 'px';

        main.style.width = body.offsetWidth + 'px';
        main.style.height = (h - header.offsetHeight) + 'px';

        topDiv.style.left = ( -topDivPaddingLeft) + 'px';
        topDiv.style.top = (-topDivPaddingTop) + 'px';

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
    // Make the topDiv element draggable by grabbing
    // part of the header, and also make it resizable.
    ////////////////////////////////////////////////



    // Prevent the "window top bar" icon buttons from being part of the
    // "grab bar".
    function stop(e) { e.stopPropagation(); }
    xIcon.onmousedown = stop;
    minIcon.onmousedown = stop;
    maxIcon.onmousedown = stop;


    // TODO: remove this
    function dreport() {

        console.log('topDiv.style.top=' + topDiv.style.top + ' ' +
            'topDiv.offsetTop=' + topDiv.offsetTop + '   ' +
            'topDiv.style.left=' + topDiv.style.left + ' ' +
            'topDiv.offsetLeft=' + topDiv.offsetLeft + ' ' +
            'startX=' + startX + '  ' +
            'startY=' + startY);

    }


    topDiv.addEventListener('mousedown', function(e) {
        popForward();
    }, true);


    // Enumeration so we do not keep setting the cursor again and
    // again.  Values are X + Y*3 where 
    // X = [0,  1,  2] and Y = [0,  1,  2]
    //     min mid max         min mid max
    //      W       E           N       S
    //
    //  X increasing to the east and
    //  Y is increasing to the south
    //   (1,0)(2,1)(1,2)(0,1) (2,0) (0,0) (2,2) (0,2)
    const N=1, E=5, S=7, W=3, NE=2, NW=0, SE=8, SW=6;
    // We use these constants to select a cursor and
    // designate the mode of resize.
    var cursorIndex = 4;
    var cursors = [
        'nw-resize', 'n-resize', 'ne-resize',
        'w-resize', '4-notUsed', 'e-resize', 
        'sw-resize', 's-resize', 'se-resize'
    ];


    function setCursors(cursor=null) {

        if(cursor) {
            header.style.cursor = cursor;
            xIcon.style.cursor = cursor;
            minIcon.style.cursor = cursor;
            maxIcon.style.cursor = cursor;
            appIcon.style.cursor = cursor;
            topDiv.style.cursor = cursor;

            main.style.cursor = cursor;
            document.body.style.cursor = cursor;
            return;
        }

        // Normal mode cursors
        header.style.cursor = 'grab';
        xIcon.style.cursor = 'pointer';
        minIcon.style.cursor = 'pointer';
        maxIcon.style.cursor = 'pointer';
        appIcon.style.cursor = 'pointer';
        topDiv.style.cursor = 'default';
        // reset topDiv.style.cursor index so that
        // if knows that it has a different cursor in
        // checkChangeCursor() in the resize code.
        cursorIndex = 4;
        main.style.cursor = 'default';
        document.body.style.cursor = 'default';
    }


    var counter = 1;

    // onmouseover is like hover:
    topDiv.onmouseover = function(e) {

        console.log('mouse over');

        function checkChangeCursor(e)  {

            // This function just changes the cursor and it's index
            // while the mouse is not pressed.

            if(e.buttons&01/*left mouse down*/||!mouseIsInPadding(e)) return;
            // The left mouse down seems buggy so this:
            if(WDApp.activeTransitionState !== WDApp.STATE_NONE) return;

            //console.log('[' + (counter++) + '] mouse move');
            /////////////////////////////////////////////////////
            //  We are on the padding edge of the whole "window"
            //  so we change the cursor to a resize cursor.

            let x = ((e.clientX - topDiv.offsetLeft) < topDivPaddingWidth)?0:
                (((e.clientX - topDiv.offsetLeft) >
                    topDiv.offsetWidth - topDivPaddingWidth)?2:1);
            let y = ((e.clientY - topDiv.offsetTop) < topDivPaddingHeight)?0:
                (((e.clientY - topDiv.offsetTop) >
                    topDiv.offsetHeight - topDivPaddingHeight)?2:1);
            let newCursorIndex = x + y * 3;

            //console.log('[' + counter++ + ']  x=' + x + '  y=' + y +
            //    '     ==> x + 3*y=' + newCursorIndex);

            // Don't change the cursor if we don't need to.
            if(cursorIndex != newCursorIndex)
                topDiv.style.cursor = cursors[cursorIndex = newCursorIndex];
        }

        function mouseIsInPadding(e) {

            // We assume that the mouse (pointer) is in the topDiv
            // somewhere.
            if(e.clientX < topDiv.offsetLeft + topDivPaddingLeft ||
                e.clientX > topDiv.offsetLeft + topDiv.offsetWidth - topDivPaddingLeft ||
                e.clientY < topDiv.offsetTop + topDivPaddingTop ||
                e.clientY > topDiv.offsetTop + topDiv.offsetHeight - topDivPaddingTop)
                // The mouse pointer is in the padding of the topDiv
                // element.
                return true;
            return false;
        }
            
        function doResize(e) {

            // This does not seem to help:
            //e.stopPropagation();
            /////////////////////////// Do the RESIZE //////////////////////////
            //
            // Note: We are resizing x and y independently in these
            // two separate if blocks.
            //
            // Keep in mind:
            // element offsetWidth and offsetHeight include the element padding
            //
            //
            //
            // Find region that the mouse down event occurred one of 4
            // corners or one of the 4 sides.  cursorIndex = x + 3*y
            let xi = cursorIndex % 3; // xi = [ 0, 1, 2 ]
            let yi = (cursorIndex - xi)/3; // yi = [ 0, 1, 2 ]

            //console.log('x=' + xi + ' y=' + yi);

            // Check for resize in X
            if(xi === 2 /*right side*/) {
                if(e.clientX > topDiv.offsetLeft) {
                    // CASE right side moving.
                    topDiv.style.width =
                        (e.clientX - topDiv.offsetLeft - topDivPaddingWidth) + 'px';
                    normalWidth = topDiv.offsetWidth - topDivPaddingWidth;
                    main.style.width = normalWidth + 'px';
                }
            } else if(xi === 0 /*left side*/) {
                // harder case because the left side is defined as the
                // anchor (left/top origin) side.
                if(e.clientX < topDiv.offsetLeft + topDiv.offsetWidth) {
                    // CASE left side moving.
                    topDiv.style.width =
                        (- e.clientX + topDiv.offsetLeft +
                            topDiv.offsetWidth - topDivPaddingWidth) + 'px';
                    normalWidth = topDiv.offsetWidth - topDivPaddingWidth;
                    topDiv.style.left = e.clientX + 'px';
                    main.style.width = normalWidth + 'px';
                }
            }
            // else xi === 1 do not resize in X

            // Check for resize in Y
            if(yi === 2 /*bottom side*/) {
                if(e.clientY > topDiv.offsetTop) {
                    // CASE bottom side moving.
                    topDiv.style.height =
                        (e.clientY - topDiv.offsetTop - topDivPaddingHeight) + 'px';
                    normalHeight = topDiv.offsetHeight - topDivPaddingHeight;
                    main.style.height = (normalHeight - header.offsetHeight) + 'px';
                }
            } else if(yi === 0 /*top side*/) {
                // harder case because the top side is defined as the
                // anchor (left/top origin) side.
                if(e.clientY < topDiv.offsetTop + topDiv.offsetHeight) {
                    // CASE top side moving.
                    topDiv.style.height =
                        (- e.clientY + topDiv.offsetTop +
                            topDiv.offsetHeight - topDivPaddingHeight) + 'px';
                    normalHeight = topDiv.offsetHeight - topDivPaddingHeight;
                    topDiv.style.top = e.clientY + 'px';
                    main.style.height = (normalHeight - header.offsetHeight) + 'px';
                }
            }
            // else yi === 1 do not resize in Y
        }


        if(isHidden || isRolledUp ||
            WDApp.activeTransitionState === WDApp.STATE_DRAG
            || displayState !== NORMAL_SIZE) return;

        function mousedown(e) {

            if(!(e.buttons & 01))
                // not left button
                return;
            if(!mouseIsInPadding(e)) return;

            // The button is pressed and we will do a resize after mouseup.
            WDApp.activeTransitionState = WDApp.STATE_RESIZE;
            console.log('[' + (counter++) + '] mousedown for possible resize');
            topDiv.onmousemove = null;

            var x = e.clientX, y = e.clientY;

            document.addEventListener('mousemove', doResize);

            function mouseup(e) {

                document.removeEventListener('mouseup', mouseup);
                document.removeEventListener('mousemove', doResize);

                if(mouseIsInPadding(e)) {
                    // reset to mouseover state,
                    checkChangeCursor(e);
                    topDiv.onmousemove = checkChangeCursor;
                }

                if(x === e.clientX && y === e.clientY) {
                    // There is no displacement in the pointer between
                    // mouse down and mouse up but the mouse is still in
                    // play (in topDiv padding area) for a resize if we
                    // get another mouse and than down.
                    console.log('[' + (counter++) + '] mouseup without resize');
                    setCursors();
                    return;
                }

                console.log('[' + (counter++) +
                    '] mouseup for RESIZE');
                doResize(e);
                // doResize() looks at the cursorIndex so we need to reset
                // the cursors after doResize().
                setCursors();
                // Put back the "default" cursors:
                WDApp.activeTransitionState = WDApp.STATE_NONE;
            }

            setCursors(cursors[cursorIndex]);
            document.addEventListener('mouseup', mouseup);
        }


        topDiv.onmousedown = mousedown;

        //console.log('[' + (counter++) + ']topDiv.onmouseover');
        checkChangeCursor(e);

        // BUG:  We end up adding this handler many times.
        //
        topDiv.onmousemove = checkChangeCursor;

        topDiv.onmouseout = function(e) {

            if(e.buttons&01/*left mouse down BUG lies on firefox*/ ||
                WDApp.activeTransitionState !== WDApp.STATE_NONE) {
                // We are waiting for a mouse up, at which time we will
                // resize.
                return;
            }

            // Put back the "default" cursors:
            setCursors();
            topDiv.onmousemove = null;
            topDiv.onmousedown = null;
            topDiv.onmouseout = null;
        };
    };


    // mouse down callback
    header.onmousedown = function(e) {

        if(WDApp.activeTransitionState !== WDApp.STATE_NONE)
            return;
        if(!(e.buttons & 01))
            // Not the left button.
            return;

        WDApp.activeTransitionState = WDApp.STATE_DRAG;

        setCursors('move');

        //console.log('got onmousedown');

        e = e || window.event;
        e.preventDefault();
        // get the mouse pointer position at startup:
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

        sx0 = scrollX;
        sy0 = scrollY;

        ///////////////////////////////////////
        // For the grab and move case:
        ///////////////////////////////////////

        document.onmouseup = finishDrag;
        // call a function whenever the cursor moves:
        document.onmousemove = drag;
        header.focus();
    }

    function drag(e) {

        e = e || window.event;
        e.preventDefault();

        if(displayState === MAXIMIZED) {
            normalX = x0 - normalWidth*(x0/header.clientWidth);
            normalY = y0 - header.clientHeight;
            setToNormalSize();
        }

        // calculate the new pointer position:
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

    const xshow = 18;

    function finishDrag() {

        WDApp.activeTransitionState = WDApp.STATE_NONE;

        // Reset the cursors to default.
        setCursors();

        // stop moving when the mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        if(topDiv.offsetLeft - startX + topDiv.clientWidth < xshow)
            // fix left
            topDiv.style.left = (xshow + topDivPaddingWidth -
                topDivPaddingLeft - topDiv.clientWidth) + 'px';
        else if(topDiv.offsetLeft - startX > desktopWidth() - xshow)
            // fix right
            topDiv.style.left = (desktopWidth() -
                topDivPaddingLeft - xshow) + 'px';

        if(topDiv.offsetTop - startY < 0)
            // fix upper
            topDiv.style.top = '0px';
        else if(topDiv.offsetTop - startY > desktopHeight() -
                header.offsetHeight)
            // fix lower
            topDiv.style.top = (desktopHeight() - header.offsetTop -
                header.clientHeight) + 'px';

        document.body.style.cursor = WDApp.defaultBodyCursor;

        // reinitialize what is the normal position:
        normalX = topDiv.offsetLeft;
        normalY = topDiv.offsetTop;

        header.style.cursor = startingHeaderCursor;
        xIcon.style.cursor = 'pointer';
        minIcon.style.cursor = 'pointer';
        maxIcon.style.cursor = 'pointer';
    }
}

// Used to keep app window stacking order:
WDApp.zIndexMax = 4;
WDApp.stackingOrder = { };

// These are private constants that we need.  We didn't want to pollute
// the global name space with a const; nor did we want the high resource
// usage of using yet another object.
WDApp.STATE_NONE = 0;
WDApp.STATE_RESIZE = 1; // the pointer is busy resizing a window app
WDApp.STATE_DRAG = 2;   // the pointer is busy dragging a window app

// We define "Active States" where the desktop is in the midst of using
// the mouse pointer to "continuously" change an "app window" parameter
// like app window size (resize), or app window position (drag).
WDApp.activeTransitionState = WDApp.STATE_NONE;

WDApp.isDragging = false;

WDApp.defaultBodyCursor = 'default'; // constant

