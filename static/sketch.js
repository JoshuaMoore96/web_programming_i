let x, y, score, cookie_renew;
let WORM_SIZE = 10;
var bubbles = [];
var worm = [];

let sound_coin, sound_death, sound_split, sound_powerup,
    sound_bigcoin, sound_shield, sound_slow;

function preload(){
    soundFormats('wav');

    sound_coin = loadSound('/static/Point.wav');
    sound_death = loadSound('/static/Death.wav');
    sound_split = loadSound('/static/split.wav');
    sound_bigcoin = loadSound('/static/BigCoin.wav');
    sound_shield = loadSound('/static/Shield.wav');
    sound_slow = loadSound('/static/Slow.wav');
    sound_powerup = loadSound('/static/Powerup.wav');

    sound_coin.setVolume(.05);
    sound_death.setVolume(.05);
    sound_split.setVolume(.05);

    cookiedHiscore = getCookie("hiscore");
    if (cookiedHiscore){
        console.log("cookied hiscore restored:", cookiedHiscore);
        cookie_renew = new Date();
        cookie_renew.setMonth(cookie_renew.getMonth() + 1);
        hiscore = cookiedHiscore;
    }
    else{
        console.log("No hiscore cookie found.");
        hiscore = 5;
    }

}

class Bubble{
  constructor(x, y, dx, dy, r, g, b, size, scale){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255;
    this.size = size;
    this.scale = scale;
  }
}
class Coin{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class PowerUp{
    constructor(x, y, active, mod, spawnTime){
        this.x = x;
        this.y = y;
        this.active = active;
        this.mod = mod;
        this.spawnTime = spawnTime;
        this.d = 25;
    }
}

class Worm{
    constructor(x, y, a){
        this.x = x;
        this.y = y;
        this.a = a;
        this.d = 10;
    }
}

cursorMode = false;

function setup() {

  canv = createCanvas(window.innerWidth, window.innerHeight);
//   canv.mouseOut(gameOver);

  pageLoadTime = millis();
  debug = false;

  x = width / 2;
  y = height / 2;

  r = 50;
  g = 50;
  b = 50;

  modPotential = 50;

  tr = random(0, 255);
  tg = random(0, 255);
  tb = random(0, 255);

  //0 = none
  //1 = invincible
  //2 = big coin
  //3 = slow
  modifierList = ['none', 'shield', 'huge coins', 'slo-mo'];
  modColors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];

  inventory = 0;
  modifier = 0;
  modifierTimer = 0;

  coinSize = 25;
  speedMod = 1;

  coin = new Coin(x, y);
  power = new PowerUp(x, y, false, 0, 0);

  showHelp = true;

}
function draw() {
    background(0);

    if (showHelp && !cursorMode && !debug){
        strokeWeight(0);
        textAlign(LEFT);
        fill(255);
        textSize(15);
        text('BUBBLE GAME' +
            '\nClick anywhere on the screen to start.' +
            '\n\nUse the mouse to control the worm.' +
            '\nAvoid contact with any bubbles.' +
            '\nThe chaser bubble will constantly pursue the worm,' +
            '\nand launch bubble-spawns across the screen randomly.' +
            '\n\nPOWERUPS:' +
            '\nPowerups will spawn periodically, and your chance' +
            '\nof being offered a powerup increases as you score.' +
            '\nRED\t- SHIELD ' +
            '\nBLUE\t- SLO-MO' +
            '\nGREEN\t- HUGE COINS' +
            '\n\n(h) Hide help screen' +
            '\n(d) Show debug info',
        20, 20);
    }

    r = shift(r, tr);
    g = shift(g, tg);
    b = shift(b, tb);

    modifiers();

    //DRAW DEBUG
    if (debug){
        strokeWeight(0);
        textAlign(LEFT);
        fill(255);
        textSize(15);
        loadTime = int((millis() - pageLoadTime)/1000);
        playTimeString = str(int(loadTime / 60)) + 'm' + str(loadTime % 60) + 's';
        text('DEBUG:\nPlaytime: ' + playTimeString + '\nPotential: 1/' + modPotential +
        '\nBubbles rendered: ' + str(bubbles.length) +
        '\n\nCOMMANDS: \np: 100% powerup potential\nr: reset hiscore',
        20, 20);
    }
    strokeWeight(1);
    if (cursorMode) {

        noCursor();

        //DRAW THE WORM

        if(modifier == 1){
            stroke(r, g, b);
            strokeWeight(5);
        }

        worm.push(new Worm(mouseX, mouseY, 255));
        for (i = 0; i < worm.length; i++){
            worm[i].a = worm[i].a - 25;
            fill(255, 255, 255, worm[i].a);
            if (score == hiscore)
                fill(r, g, b, worm[i].a);
            ellipse(worm[i].x, worm[i].y, WORM_SIZE);
            if (worm[i].a < 1)
                worm.splice(i, 1);
        }

        //DRAW THE SCORE
        strokeWeight(0);
        fill(255);
        textSize(15);
        textAlign(CENTER);
        if (score == hiscore){
            fill(r, g, b, 128);
            textSize(50);
            scorestring = 'HISCORE:\n' + str(hiscore);
            scorepos = height/2;
        }
        else{
            scorestring = 'SCORE: ' + str(score) + ' HISCORE: ' + str(hiscore);
            scorepos = 20;
        }
        text(scorestring, width / 2, scorepos);

        //DRAW MODIFIER MESSAGE
        if (modifier != 0 || inventory != 0){
            if (inventory != 0)
                modMessage = 'Click to activate ' + modifierList[inventory];
            if (modifier != 0)
                modMessage = modifierList[modifier] + ' active - ' + str(int((modifierTimer - millis()) / 1000));
            text(modMessage, width/2, height - 20);
        }




        fill(r, g, b);
        if (score < 1){
            textSize(25);
            textAlign(CENTER);
            text('COLLECT THE RINGS - AVOID THE BUBBLES', width / 2, height / 2);

        }

        //MOVE THE CIRCLE
        x = x + ((mouseX - x)/ 15) * speedMod;
        y = y + ((mouseY - y)/ 15) * speedMod;

        //DIE
        if (dist(x, y, mouseX, mouseY) < (50 / 2)){
            gameOver(r, g, b);
        }

        //GET COIN
        if (dist(coin.x, coin.y, mouseX, mouseY) < ((coin.d / 2) + (WORM_SIZE / 2))){
            score = score + 1;
            modPotential = modPotential - 1;
            if (score > hiscore)
                hiscore = score;
            sound_coin.play();
            coin.x = random(coin.d, width - coin.d);
            coin.y = random(coin.d, height - coin.d);
            if(random(0,modPotential) <= 1 && modifier == 0){ //Try to award a powerup
                modPotential = modPotential + 20;
                power.x = random(power.d, width - power.d);
                power.y = random(power.d, height - power.d);
                power.active = true;
                power.mod = int(random(1, 4));
                power.spawnTime = millis();
                console.log('spawned a powerup');
            }
        }

        //GET POWER
        if (power.active){
            if (dist(power.x, power.y, mouseX, mouseY) < (power.d / 2) + (WORM_SIZE / 2)){
                modPotential = 50;
                inventory = power.mod;
                power.active = false;
                power.x = random(power.d, width - power.d);
                power.y = random(power.d, height - power.d);
                sound_powerup.play();
            }
            if (millis() > power.spawnTime + 5000)
                power.active = false;
        }

        //DRAW POWER
        if (power.active){
            stroke(modColors[power.mod - 1]);
            strokeWeight(5 - int((millis() - power.spawnTime)/1000));
            noFill();
            ellipse(power.x, power.y, power.d);
        }

        //DRAW THE COIN
        stroke(255)
        strokeWeight(2);
        noFill();
        ellipse(coin.x, coin.y, coin.d);


    }

    //NOT PLAYING
    else {
        x = x + ((width/2 - x)/ (.01 * width));
        y = y + ((height/2 - y)/ (.01 * height));
        cursor();
    }

    //COLOR SHIFT THE BUBBLE
    if (random(0, 100) <= 1)
      tr = random(0, 255);
    if (random(0, 100) <= 1)
     tg = random(0, 255);
    if (random(0, 100) <= 1)
      tb = random(0, 255);

    if (random(0, 25) <= 1){
        bubbles.push(new Bubble(x, y, random(0, width),
                            random(0, height), r, g, b, 50, random(.99, 1.01), .985));
    if(cursorMode)
        sound_split.play();
    }

    stroke(0);
    for (i = 0; i < bubbles.length; i++){
        bubble = bubbles[i];
        fill(bubble.r, bubble.g, bubble.b, bubble.a);
        // ellipse(bubble.x, bubble.y, bubble.size);
        bubble.x = bubble.x +((bubble.dx-bubble.x) /50) * speedMod;
        bubble.y = bubble.y +((bubble.dy-bubble.y) /50) * speedMod;
        // bubble.r = bubble.r +((0-bubble.r) /100); // Original fade
        // bubble.g = bubble.g +((0-bubble.g) /100);
        // bubble.b = bubble.b +((0-bubble.b) /100);
        bubble.a = bubble.a * .985;
        bubble.size = bubble.size * bubble.scale;
        ellipse(bubble.x, bubble.y, bubble.size); //moved
        if(cursorMode){
            if (bubble.a > 25){
                if (dist(bubble.x, bubble.y, mouseX, mouseY) < (bubble.size / 2)){
                    gameOver(bubble.r, bubble.g, bubble.b);
                }
            }
        }

        if (bubble.a < 1)
            bubbles.splice(i, 1);
    }

    //DRAW THE ROOT BUBBLE
    stroke(0);
    strokeWeight(1);
    fill(r, g, b);
    ellipse(x, y, 50);

    //RESIZE THE WINDOW
    if (height != window.innerHeight || width != window.innerWidth){
        resize();
    }
}

function shift(c, t){
  c = c +((t-c) /50);
  return c;
}

function resize(){
    resizeCanvas(window.innerWidth, window.innerHeight);
    console.log("window size has changed");
    x = width / 2;
    y = height / 2;
    coin.x = x;
    coin.y = y;
    if (cursorMode)
        gameOver(255, 255, 255);
}

function mouseClicked(){
    if (cursorMode == false){
	cursorMode = true;
// 	bubbles = [];
	console.log("Game started");
	score = 0;
    }
    else {
        if(inventory != 0){
            switch(inventory){
                case 1:
                    sound_shield.play();
                    break;
                case 2:
                    sound_bigcoin.play();
                    break
                case 3:
                    sound_slow.play();
                    break;
            }
            modifier = inventory;
            modifierTimer = millis() + 10000;
            inventory = 0;
        }
    }
}

function keyPressed(){
    //commands:
    if (keyCode === 68){
        debug = !debug;
        console.log('debug mode: ' + debug);
    }
    if (keyCode === 72){
        console.log("toggled help")
        showHelp = !showHelp;
    }
    //debug commands
    if(debug){
        console.log("key pressed: ", keyCode);
        if (keyCode === 80 && cursorMode){
            modPotential = 1;
            score = -100000;
        }
        if (keyCode === 82){
            hiscore = 5;
            cookie_renew = new Date();
            gameOver(r, g, b);
        }
    }
}

function gameOver(er, eg, eb){
    if (modifier == 1)
        return;
    modifier = 0;
    inventory = 0;
    modPotential = 50;

    power.active = false;
    power.x = random(power.d, width - power.d);
    power.y = random(power.d, height - power.d);

    if (cursorMode){
        cursorMode = false;
        if (score > hiscore)
            hiscore = score;
        explosion = random(10, 50);
        for(i = 0; i < explosion; i++)
            bubbles.push(new Bubble(mouseX, mouseY, random(0, width),
                    random(0, height), er, eg, eb, 50, random(.99, 1.001)));
        sound_death.play();
        worm = [];
        document.cookie = "hiscore=" + str(hiscore) + ";expires=" + str(cookie_renew) + ";";
    }
}

function modifiers(){
    if (millis() > modifierTimer){
        modifier = 0;
    }
    if (modifier == 2){
        coin.d = 75;
    }
    else{
        coin.d = 25;
    }
    if (modifier == 3){
        speedMod = .25;
    }
    else{
        speedMod = 1;
    }
}

function getCookie(cname) { // Borrowed from W3Schools
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
