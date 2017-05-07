const app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);


const sprites = [];

const loader = PIXI.loader;

loader
    .add([
        '/assets/images/thief_token.png',
        '/assets/images/paladin_token.png'
    ]);

loader.on('progress', function(loader, resources) {
    console.log("Loading resource: " + "'" + resources.url + "' " + loader.progress + "%" + " complete.");
});

loader.on('complete', function(loader, resources) {
    sprites.push(new PIXI.Sprite(loader.resources['/assets/images/thief_token.png'].texture));
    sprites.push(new PIXI.Sprite(loader.resources['/assets/images/paladin_token.png'].texture));
    
    _.forEach(sprites, function(sprite) {
        app.stage.addChild(sprite)
    });
   
    console.log("Loading resources complete!");
});

loader.load();