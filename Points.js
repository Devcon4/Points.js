/*
Purpose: A tool to create backgrounds on websites that have a mix of moving points/lines/planes.

Special Notes:
Paste this code into your <head><head/>:
 <script>
 var canvasName = "MainCanvas";
 var backgroundColor = "#3A3A3A";
 var lineColor = "#FFFFFF";
 var planeColor = "#000000";
 var pointColor = "#000000";
 var planesActive = false;
 var linesActive = true;
 var pointsActive = true;
 var lineDistance = 100; // keep less than 250-ish for framerate.
 var ObjectCount = 75; // keep less than 150-ish for framerate.
 </script>

 this code can be anywhere in the body, and can be duplicated, NOTE: the variables are global, I.E. the same variables change every canvas.

 <body id="body" onresize="resizeCanvas()">
 <canvas id="MainCanvas"></canvas>
 <style>
 #body {
 overflow: hidden;
 }
 #MainCanvas {
 border: 1px solid #000000;
 position: absolute;
 margin: 0;
 top: 0;
 left: 0;
 }</style>
 <script src="Points.js"></script>

Author: Devyn Cyphers; Devcon.
 */
var canvasName = "MainCanvas";
var backgroundColor = "#3A3A3A";
var lineColor = "#000000";
var planeColor = "#000000";
var pointColor = "#000000";
var planesActive = false;
var linesActive = true;
var pointsActive = true;
var lineDistance = 150; // keep less than 250-ish for framerate.
var ObjectCount = 100; // keep less than 150-ish for framerate.

var c = document.getElementById(canvasName);
var ctx = c.getContext("2d");

var width = c.width, height = c.height;
var cWidth = width/2, cHeight = height/2;

var FPS = 60;
var frames = 0;

var gameObjects = [];

init();

function init(){
    resizeCanvas();
    makePoints(ObjectCount);
}

function update(){
}

function physics(){
    for(var i = 0; i < gameObjects.length; i++){
        var pos = gameObjects[i].position;
        var vel = gameObjects[i].velocity;
        if(pos.x < -cWidth || pos.x > cWidth){vel.x = -vel.x}
        if(pos.y < -cHeight || pos.y > cHeight){vel.y = -vel.y}

        gameObjects[i].position = new Vector3(pos.x + vel.x, pos.y + vel.y, pos.z + vel.z);
    }
}

function draw(){
    ctx.clearRect(-cWidth,-cHeight, width, height);
    ctx.globalAlpha = .5;
    ctx.fillStyle = backgroundColor;
    //ctx.fillRect(-cWidth, -cHeight, width, height);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = lineColor;
    makeLines();
    if(pointsActive) {
        for (var i = 0; i < gameObjects.length; i++) {
            gameObjects[i].render();
        }
    }
}

function makePoints(Count){
    for(var i = 0; i < Count; i++) {
        gameObjects[gameObjects.length] = new Square(new Vector3(Math.random() * width - cWidth, Math.random() * height - cHeight, 0), 2.5);
    }
    for(var j = 0; j < gameObjects.length; j++){
        gameObjects[j].velocity = new Vector3(Math.random() -.5, Math.random() - .5, 0);
    }
}

function makeLines(){
    for(var i = 0; i < gameObjects.length; i++){
        var ObjectsNear = [];
        for(var j = 0; j < gameObjects.length; j++){
            var dist = Vectors.distance(gameObjects[i].position, gameObjects[j].position);
            if(dist <= lineDistance) {
                ObjectsNear[ObjectsNear.length] = gameObjects[j].position;
                if(linesActive) {
                    ctx.lineWidth = .1;
                    ctx.strokeStyle = lineColor;
                    ctx.globalAlpha = Math.acos(dist / lineDistance);

                    ctx.beginPath();
                    ctx.moveTo(gameObjects[i].position.x, gameObjects[i].position.y);
                    ctx.lineTo(gameObjects[j].position.x, gameObjects[j].position.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 1;
                }
            }
        }

        if(planesActive) {
            ctx.fillStyle = planeColor;
            ctx.globalAlpha = .1;
                ctx.beginPath();
                ctx.moveTo(ObjectsNear[0].x, ObjectsNear[0].y);
                for (var k = 0; k < ObjectsNear.length; k++) {
                    ctx.lineTo(ObjectsNear[k].x, ObjectsNear[k].y);
                }
                ctx.closePath();
                ctx.fill();

            ctx.globalAlpha = 1;
        }
    }
}

setInterval(function() {
}, 1000/20);

setInterval(function() {
    update();
    physics();
    draw();
    frames++;
}, 1000/FPS);

function resizeCanvas(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    width = c.width;
    height = c.height;

    cWidth = width/2;
    cHeight = height/2;

    ctx.translate(cWidth,cHeight);
}

function Square (Position, Size){
    this.position = Position;
    this.size = Size;
    this.velocity = new Vector3(0,0,0);

    this.render = function(){
        return makeSquare(this.position, this.size);
    };
}

function makeSquare(Position, Size){
    var corners = [new Vector3(0,0,0), new Vector3(1,0,0), new Vector3(1,1,0), new Vector3(0,1,0)];

    var xx = {x:(corners[0].x * Size) + (Position.x - (Size / 2)), y:(corners[0].y * Size) + (Position.y - (Size / 2))};
    var xy = {x:(corners[1].x * Size) + (Position.x - (Size / 2)), y:(corners[1].y * Size) + (Position.y - (Size / 2))};
    var yy = {x:(corners[2].x * Size) + (Position.x - (Size / 2)), y:(corners[2].y * Size) + (Position.y - (Size / 2))};
    var yx = {x:(corners[3].x * Size) + (Position.x - (Size / 2)), y:(corners[3].y * Size) + (Position.y - (Size / 2))};


    ctx.beginPath();
    ctx.fillStyle = pointColor;
    ctx.moveTo(xx.x, xx.y);
    ctx.lineTo(xy.x, xy.y);
    ctx.lineTo(yy.x, yy.y);
    ctx.lineTo(yx.x, yx.y);
    ctx.lineTo(xx.x, xx.y);
    ctx.fill();

    ctx.moveTo(0,0);
}

function Vector3 (X,Y,Z) {
    this.x = X;
    this.y = Y;
    this.z = Z;
    this.magnitude = function(){

        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    };
}

var Vectors = Vectors || {};
Vectors.distance = function(VecA, VecB) {
    return new Vector3(VecA.x - VecB.x, VecA.y - VecB.y, VecA.z - VecB.z).magnitude();
};