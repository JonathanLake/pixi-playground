const app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

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
    let thiefToken = new PIXI.Sprite(loader.resources['/assets/images/thief_token.png'].texture);
    app.stage.addChild(thiefToken);
    console.log("Loading resources complete!");
});

loader.load();