let canvas = document.getElementById("canvas")

let ctx = canvas.getContext('2d')

let cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }

let cameraZoom = 1

let MAX_ZOOM = 5

let MIN_ZOOM = 0.1

let SCROLL_SENSITIVITY = 0.0005

// Get the item ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('item');

let currentImage = null;
let imageLoaded = false;
let currentItem = null;
let useAltDrawing = false;

// Load image from a given source
function loadImage(imageSrc) {
    imageLoaded = false;
    currentImage = new Image();
    currentImage.onload = function() {
        imageLoaded = true;
    };
    currentImage.onerror = function() {
        console.error('Failed to load image:', imageSrc);
        imageLoaded = false;
    };
    currentImage.src = imageSrc;
}

// Load image based on item ID - wait for DOM and catalogData to be ready
function loadImageFromCatalog() {
    if (typeof catalogData === 'undefined') {
        console.error('catalogData is not defined. Make sure data.js is loaded before viewer_2d.js');
        return;
    }
    
    if (!itemId) {
        console.log('No item parameter in URL');
        return;
    }
    
    if (!catalogData || !Array.isArray(catalogData.items)) {
        console.error('catalogData.items is not available');
        return;
    }
    
    currentItem = catalogData.items.find(entry => entry.title === itemId);
    if (!currentItem) {
        console.log('Item not found:', itemId);
        return;
    }
    
    if (!currentItem.drawing) {
        console.log('Item found but has no drawing property:', itemId);
        return;
    }
    
    document.title = currentItem.title;
    useAltDrawing = false;
    loadImage(currentItem.drawing);
    // Center the image initially
    cameraOffset.x = window.innerWidth / 2;
    cameraOffset.y = window.innerHeight / 2;
}

// Toggle between drawing and drawing_alt on double click
function toggleDrawing() {
    if (!currentItem) return;
    
    // Check if drawing_alt exists
    if (!currentItem.drawing_alt) {
        console.log('No drawing_alt available for this item');
        return;
    }
    
    useAltDrawing = !useAltDrawing;
    const imageSrc = useAltDrawing ? currentItem.drawing_alt : currentItem.drawing;
    loadImage(imageSrc);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadImageFromCatalog);
} else {
    // DOM is already ready, but wait a bit for data.js to load
    setTimeout(loadImageFromCatalog, 0);
}

function draw()

{

    canvas.width = window.innerWidth

    canvas.height = window.innerHeight

    

    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at

    ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )

    ctx.scale(cameraZoom, cameraZoom)

    ctx.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y )

    ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

    // Draw the image if loaded
    if (imageLoaded && currentImage) {
        // Center the image at origin (0, 0)
        const imgWidth = currentImage.width;
        const imgHeight = currentImage.height;
        ctx.drawImage(currentImage, -imgWidth / 2, -imgHeight / 2);
    } else if (!currentImage) {
        // Show message if no item found
        ctx.fillStyle = "#fff"
        ctx.font = "32px courier"
        ctx.textAlign = "center"
        ctx.fillText("Item not found", 0, 0)
    } else {
        // Show loading message
        ctx.fillStyle = "#fff"
        ctx.font = "32px courier"
        ctx.textAlign = "center"
        ctx.fillText("Loading...", 0, 0)
    }

    

    requestAnimationFrame( draw )

}

// Gets the relevant location from a mouse or single touch event

function getEventLocation(e)

{

    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches.length == 1)

    {

        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }

    }

    else if (e.clientX && e.clientY)

    {

        return { x: e.clientX - rect.left, y: e.clientY - rect.top }        

    }

}

function drawRect(x, y, width, height)

{

    ctx.fillRect( x, y, width, height )

}

function drawText(text, x, y, size, font)

{

    ctx.font = `${size}px ${font}`

    ctx.fillText(text, x, y)

}

let isDragging = false

let dragStart = { x: 0, y: 0 }

let holdTimer = null
let initialTouchPosition = { x: 0, y: 0 }
let hasMoved = false

function onPointerDown(e)

{

    isDragging = true
    hasMoved = false

    const location = getEventLocation(e)
    initialTouchPosition.x = location.x
    initialTouchPosition.y = location.y

    dragStart.x = location.x/cameraZoom - cameraOffset.x

    dragStart.y = location.y/cameraZoom - cameraOffset.y

    // Start hold timer for 800ms
    holdTimer = setTimeout(() => {
        if (!hasMoved) {
            toggleDrawing()
        }
        holdTimer = null
    }, 800)

}

function onPointerUp(e)

{

    isDragging = false

    // Cancel hold timer if still active
    if (holdTimer) {
        clearTimeout(holdTimer)
        holdTimer = null
    }

    initialPinchDistance = null

    lastZoom = cameraZoom

}

function onPointerMove(e)

{

    if (isDragging)

    {

        const location = getEventLocation(e)
        
        // Check if user has moved significantly (more than 5 pixels)
        const moveDistance = Math.sqrt(
            Math.pow(location.x - initialTouchPosition.x, 2) + 
            Math.pow(location.y - initialTouchPosition.y, 2)
        )
        
        if (moveDistance > 5) {
            hasMoved = true
            // Cancel hold timer if user moved
            if (holdTimer) {
                clearTimeout(holdTimer)
                holdTimer = null
            }
        }

        cameraOffset.x = location.x/cameraZoom - dragStart.x

        cameraOffset.y = location.y/cameraZoom - dragStart.y

    }

}

function handleTouch(e, singleTouchHandler)

{

    if ( e.touches.length == 1 )

    {

        singleTouchHandler(e)

    }

    else if (e.touches.length == 2)

    {

        // Cancel hold timer when two fingers are detected
        if (holdTimer) {
            clearTimeout(holdTimer)
            holdTimer = null
        }
        
        if (e.type == "touchmove") {
            isDragging = false
            hasMoved = true
            handlePinch(e)
        }

    }

}

let initialPinchDistance = null

let lastZoom = cameraZoom

function handlePinch(e)

{

    e.preventDefault()

    

    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }

    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

    

    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio

    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2

    

    if (initialPinchDistance == null)

    {

        initialPinchDistance = currentDistance

    }

    else

    {

        adjustZoom( null, currentDistance/initialPinchDistance )

    }

}

function adjustZoom(zoomAmount, zoomFactor)

{

    if (!isDragging)

    {

        if (zoomAmount)

        {

            cameraZoom += zoomAmount

        }

        else if (zoomFactor)

        {

            console.log(zoomFactor)

            cameraZoom = zoomFactor*lastZoom

        }

        

        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )

        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )

        

        console.log(zoomAmount)

    }

}

canvas.addEventListener('mousedown', onPointerDown)

canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))

canvas.addEventListener('mouseup', onPointerUp)

canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))

canvas.addEventListener('mousemove', onPointerMove)

canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))

canvas.addEventListener( 'wheel', (e) => adjustZoom(-e.deltaY*SCROLL_SENSITIVITY))

canvas.addEventListener('dblclick', (e) => {
    e.preventDefault();
    toggleDrawing();
})

// Handle window resize
window.addEventListener('resize', () => {
    cameraOffset.x = window.innerWidth / 2;
    cameraOffset.y = window.innerHeight / 2;
})

// Ready, set, go

draw()

