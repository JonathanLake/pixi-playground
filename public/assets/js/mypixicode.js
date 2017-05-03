// Alliases.
const Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

// Create a Pixi stage and renderer, and add the renderer.view to the DOM.
const stage = new Container(),
    renderer = autoDetectRenderer(600, 400);
document.body.appendChild(renderer.view);

// Load an image and run the `setup` function when it's done.
loader
  .add("/assets/images/thief_token.png")
  .load(setup);

function setup() {

  // Create the `token` sprite, add it to the stage, and render it.
  const player_token = new Sprite(resources["/assets/images/thief_token.png"].texture);  
  stage.addChild(player_token);
  renderer.render(stage);
}