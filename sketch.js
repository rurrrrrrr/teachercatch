// 必要な変数を定義する (02)
let mode;
let score;
let startTime;
let gameTime;
let basetime;

let basketImage;
let basketX;
let basketY;

let appleImage;
let appleX;
let appleY;
let appleVelocityY;

let catchSound;
let bgmAudio;

let gravity = 0.1; // 重力加速度

function preload() {
    // 画像を読み込む (02)
    basketImage = loadImage("image/basket.png");
    appleImage = loadImage("image/apple.png");
}

function setup() {
    // 変数を初期化する (02)
    createCanvas(500, 500);
    imageMode(CENTER);
    mode = 0;
    basketX=width/2;
    basketY=height - 30;
    appleX = [200];
    appleY = [0];
    appleVelocityY = [0];
    appleIsCatched = [false];
    basetime = 0;
    score = 0;
    gameTime = 0;
    
    // 音声を読み込む
    catchSound = createAudio("audio/クイズ不正解1.mp3");
    bgmAudio = createAudio("audio/迫る熱きバトル的なBGM.mp3");
    bgmAudio.volume(0.2);
    bgmAudio.loop();
}

function draw() {
    background("lightblue");

    if (mode == 0) {
        // スタート画面の表示 (03)
        startTime = millis();
        textAlign(CENTER);
        text("クリックしてスタート",width/2,height/2);
        if(mouseIsPressed){
            mode=1;
            bgmAudio.play();
        }
    }

    if (mode == 1) {
        // かごを動かす (04)
        if (keyIsDown(LEFT_ARROW)){
            basketX -= 7;
        }
        if (keyIsDown(RIGHT_ARROW)){
            basketX += 7;
        }
        if (keyIsDown(UP_ARROW)){
            basketY -= 7;
        }
        if (keyIsDown(DOWN_ARROW)){
            basketY += 7;
        }
        
        // 一定時間おきにりんごを増やす (06)
        if (millis() - basetime > 500){
            basetime = millis();
            appleX.push(random(0,width));
            appleY.push(0);
            appleVelocityY.push(0);
            appleIsCatched.push(false);
        }
        
        // りんごを落とす (05)
        for(let i=0; i < appleY.length; i++){
            appleVelocityY[i] += gravity; // 重力を速度に加える
            appleY[i] += appleVelocityY[i]; // 速度をポジションに加える
        }
        
        // かごとりんごが重なったら (07)
        for (let i =0; i < appleX.length; i++){
            if(
                basketX - 30 < appleX[i] &&
                appleX[i] < basketX + 30 &&
                basketY - 20 < appleY[i] &&
                appleY[i] < basketY + 30 &&
                appleIsCatched[i] == false
            ){
                score++;
                appleIsCatched[i] = true;
                catchSound.stop();
                catchSound.play();
            }
        }
        
        // りんごを表示する (05)
        for(let i =0; i < appleX.length; i++){
            if (appleIsCatched[i] == false){
                image(appleImage,appleX[i],appleY[i],50,50);
            }
        }
        
        
        // かごを表示する (04)
        image(basketImage,basketX,basketY,60,60);
        
        
        // スコアを表示する (08)
        textAlign(LEFT);
        text("SCORE:" + score,10,20);
        
        // 時間を表示する (08)
        gameTime = floor((millis()- startTime) / 1000);
        text("TIME:" + gameTime,width - 80,20);
        
        // 時間切れでゲームを終了する (09)
        if(gameTime >=20){
            mode = 2;
            bgmAudio.stop();
        }

    }

    if (mode == 2) {
        // 終了画面の表示 (09)
        textAlign(LEFT);
        text("SCORE:"+ score,10,20);
        text("TIME:" + gameTime,width-80,20);

        textAlign(CENTER);
        text("おつかれさまんざ",width/2,height/2);
        text("クリックしてスカート",width/2,height/2+30);

        if(mouseIsPressed){
            setup();
            startTime = millis();
            mode = 1;
        }
    }
}
