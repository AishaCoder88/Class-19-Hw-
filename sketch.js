var PLAY = 1;
var END = 0;
var gameState = PLAY;

var fish,fishImg,bg,fish1,fish2,fish3,bgImg;
var fish1img,fish2img,fish3img;
var score=0;
var jumpSound, collidedSound;

var gameOver, restart, gameOverImg, restartImg;

function preload(){
    jumpSound = loadSound("jump.wav");
    collidedSound = loadSound("collided.wav");

    fishImg = loadImage("fish.png");
    fish1img = loadImage ("fish1.png");
    fish2img = loadImage ("fish2.png");
    fish3img = loadImage ("fish3.png");

    bgImg = loadImage ("bg.jpg");
    gameOverImg = loadImage ("game over.png");
    restartImg = loadImage ("restart.png");
}

function setup() {
 createCanvas (windowWidth, windowHeight)
 fish = createSprite(50,height-70,20,50);
  
 gameState = PLAY 

  fish.addImage("swimming", fish);
  fish.setCollider('circle',0,0,350)
  fish.scale = 0.08;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = true;
  restart.visible = true;

  obstaclesGroup = new Group();
  
  score = 0;
  
}



function draw() {
  background(bg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    invisibleGround.velocityX = -(6 + 3*score/100);
}

if((touches.length > 0 || keyDown("SPACE")) && fish.y  >= height-120) {
    jumpSound.play( )
    fish.velocityY = -10;
     touches = [];
  }
  fish.velocityY = fish.velocityY + 0.8
  
    if (invisibleGround.x < 0){
      invisibleGround.x = invisibleGround.width/2;
    }
  
    fish.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(fish)){
        collidedSound.play()
        gameState = END;
    }
    else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;
        
        //set velcity of each game object to 0
        invisibleGround.velocityX = 0;
        fish.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        

        obstaclesGroup.setLifetimeEach(-1)

        if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
          reset();
          touches = []
        }
 drawSprites();

}}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
     obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(fish1);
              break;
      case 2: obstacle.addImage(fish2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = fish.depth;
    fish.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
  
}
