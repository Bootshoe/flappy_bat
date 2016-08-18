// Create our 'main' state that will contain the game

var mainState = {
  preload: function() {
    // This function will be executed at the beginning
    // That's where we load the images and sounds
    game.load.image('bird', 'assets/batman.png');
    // Load the bird sprite
    game.load.image('pipe', 'assets/joker.png');
    game.load.image('background', 'assets/gotham2.jpg')
    game.load.image('robin', 'assets/robin.png')
  },

  create: function() {
    // This function is called after the preload function
    // Here we set up the game, display sprites, etc.
    // game.stage.backgroundColor = '#71c5cf';
    this.background = this.game.add.sprite(0, 0, 'background')
    // Change the background color of the game to blue

    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Set the physics system

    this.bird = game.add.sprite(100, 245, 'bird');
    // Display the bird at the position x=100 and y=245
    this.robin = game.add.sprite(50, 245, 'robin');

    game.physics.arcade.enable(this.bird);
    // Add physics to the bird
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.robin);

    this.bird.body.gravity.y = 1000;
    // Add gravity to the bird to make it fall
    this.robin.body.gravity.y = 1000;

    var aKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.A);
    aKey.onDown.add(this.jump, this);
    // Call the 'jump' function when the spacekey is hit
        var lKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.L);
    lKey.onDown.add(this.jump2, this);

    this.pipes = game.add.group();

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0",
          { font: "30px Arial", fill: "#ffffff" });

    this.bird.anchor.setTo(-0.2, 0.5);
    this.robin.anchor.setTo(-0.2, 0.5);

  },

   update: function() {
    // This function is called 60 times per second
    // It contains the game's logic

    if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();
    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
     if (this.robin.y < 0 || this.robin.y > 490)
        this.restartGame();

      game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);
      game.physics.arcade.overlap(
        this.robin, this.pipes, this.hitPipe, null, this);

    if(this.bird.angle < 20)
      this.bird.angle += 1;
    if(this.robin.angle < 20)
      this.robin.angle += 1;



  },

  // Make the bird jump
  jump: function() {
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;
    // this.robin.body.velocity.y = -350;

  // Create an animation on the bird
    var animation = game.add.tween(this.bird);

    //change the angle of the bird to -20 in 100 milliseconds
    animation.to({angle: -20}, 100);

    //add start the animation
    animation.start();

    if (this.bird.alive == false)
    return;
   // if (this.robin.alive == false)
   //  return;


  },

  jump2: function() {
    // Add a vertical velocity to the bird
    // this.bird.body.velocity.y = -350;
    this.robin.body.velocity.y = -350;

  // Create an animation on the bird
    var animation = game.add.tween(this.robin);

    //change the angle of the bird to -20 in 100 milliseconds
    animation.to({angle: -20}, 100);

    //add start the animation
    animation.start();

    // if (this.bird.alive == false)
    // return;
   if (this.robin.alive == false)
    return;


  },

  // Restart the game
  restartGame: function(){
    //Start the 'main' state, which restarts the game
    game.state.start('main')


  },

  addOnePipe: function(x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200;

    // Automatically kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},

  addRowOfPipes: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1)
            this.addOnePipe(400, i * 60 + 10);
    this.score += 1;
    this.labelScore.text = this.score;
  },

  hitPipe: function() {
    // If the bird has already hit a pipe, do nothing
    // It means the bird is already falling off the screen
    if (this.bird.alive == false)
        return;
      if (this.robin.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;
    this.robin.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
},

};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
// All we have to do to make a game with Phaser is to fill the


