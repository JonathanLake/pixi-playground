const app = new PIXI.Application(1800, 2250, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

// Aliases
const renderer = app.renderer,
stage = app.stage,
Sprite = PIXI.Sprite,
loader = PIXI.loader;

const sprites = [];

loader
    .add([
        '/assets/images/thief_token.png',
        '/assets/images/paladin_token.png',
        '/assets/images/BFDungeon.jpg'
    ]);

loader.on('progress', function(loader, resources) {
    console.log("Loading resource: " + "'" + resources.url + "' " + loader.progress + "%" + " complete.");
});

loader.on('complete', function(loader, resources) {
    sprites.push(new Sprite(loader.resources['/assets/images/thief_token.png'].texture));
    sprites.push(new Sprite(loader.resources['/assets/images/paladin_token.png'].texture));
    const map = new Sprite(loader.resources['/assets/images/BFDungeon.jpg'].texture);

    stage.addChild(map);
    
    _.forEach(sprites, function(sprite) {
        // Add each sprite to the stage.
        stage.addChild(sprite)

        // Enable each sprite to be 'interactive'. This will allow each sprite to respond to mouse and touch events.
        sprite.interactive = true;
        // 'buttonMode' switches the mouse cursor into the hand when rolling over each sprite.
        sprite.buttonMode = true;
        // Set the anchor point of each sprite in the center.
        sprite.anchor.set(0.5);

        // Events for mouse and touch.
        sprite
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
    });
   
    console.log("Loading resources complete!");

  
    // Set the position of each player token.
    sprites[0].x = 180;
    sprites[0].y = 600;

    sprites[1].x = 360;
    sprites[1].y = 600;
});


loader.load();


// Dragging player-token events.
function onDragStart(event) {
    // Store a reference to the data. Due to multitouch we want to track the movement of this particular touch.
    this.data = event.data;
    this.dragging = true;
}

function onDragEnd() {
    this.dragging = false;
    // Set the interaction data to null.
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

// Zooming and panning the canvas.

stage.interactive = true;

function correct() {
    // Keep in frame.
    stage.x = Math.min(0, stage.x);
    stage.y = Math.min(0, stage.y);

    // Keep width in bounds.
    const visibleWidth = (renderer.width * stage.scale.x) + stage.x;
    if (visibleWidth < renderer.view.width) {
        stage.x = Math.min(0, renderer.view.width - (renderer.width * stage.scale.x));
        if (stage.x == 0) {
            stage.scale.x = renderer.view.width / renderer.width;
        }
    }

    // Keep height in bounds.
    const visibleHeight = (renderer.height * stage.scale.y) + stage.y;
    if (visibleHeight < renderer.view.height) {
        stage.y = Math.min(0, renderer.view.height - (renderer.height * stage.scale.y));
        if (stage.y == 0) {
            stage.scale.y = renderer.view.height / renderer.height;
        }
    }
    
    // Keep aspect ratio.
    if (stage.scale.y != stage.scale.x) {
        stage.scale.x = Math.max(stage.scale.x, stage.scale.y);
        stage.scale.y = Math.max(stage.scale.x, stage.scale.y);
    }
}

function zoom(factor) {
    stage.scale.x *= factor;
    stage.scale.y *= factor;

    // Center on the mouse cursor.
    const mouseLocation = renderer.plugins.interaction.eventData.data.global;
    stage.x -= (mouseLocation.x - stage.x) * (factor - 1);
    stage.y -= (mouseLocation.y - stage.y) * (factor - 1);

    correct();

    renderer.render(stage);
}

let remainingFactor = 1;
let zooming = false;
let lastUpdate;
const EPSILON = 0.001;

function smoothZoom() {
    const time = Date.now();
    const deltaT = time - lastUpdate;
    lastUpdate = time;

    const step = Math.pow(remainingFactor, deltaT/100)
    remainingFactor /= step;
    zoom(step)

    if (Math.abs(remainingFactor - 1) < EPSILON) {
        zoom(remainingFactor)
        remainingFactor = 1;
        zooming = false;
    } else {
        requestAnimationFrame(smoothZoom);
    }
}

renderer.view.addEventListener("wheel", function(e) {
    const zoomIn = e.deltaY < 0 ? true : false;
    let zoomFactor;
    if (zoomIn) {
        zoomFactor = 1.1;
    } else {
        zoomFactor = (1/1.1);
    }
    remainingFactor *= zoomFactor;
    if (!zooming) {
        lastUpdate = Date.now();
        zooming = true;
        requestAnimationFrame(smoothZoom);
    }
    e.preventDefault();
});

renderer.view.addEventListener("mousedown", function(e) {
    let mouseLocation = renderer.plugins.interaction.eventData.data.global;
    lastPanLocation = [mouseLocation.x, mouseLocation.y];

    let panning = false;
    function pan() {
        panning = false;
        let mouseLocation = renderer.plugins.interaction.eventData.data.global;
        let diffX = mouseLocation.x - lastPanLocation[0];
        let diffY = mouseLocation.y - lastPanLocation[1];
        lastPanLocation = [mouseLocation.x, mouseLocation.y];
        stage.x += diffX;
        stage.y += diffY;
        correct();
        renderer.render(stage);
    }

    function schedulePan() {
        if (!panning) {
            panning = true;
            requestAnimationFrame(pan);
        }
    }

    stage.mousemove = schedulePan
    stage.mousemoveoutside = schedulePan

    function stopPan(e) {
        panning = false;
        let mouseLocation = renderer.plugins.interaction.eventData.data.global;
        lastPanLocation = [mouseLocation.x, mouseLocation.y];
        delete stage.mousemove;
        delete stage.mousemoveoutside;
    }

    stage.mouseup = stopPan
    stage.mouseupoutside = stopPan

    e.preventDefault();
});

