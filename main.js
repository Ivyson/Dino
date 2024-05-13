const canvas = document.querySelector(`canvas`);
const gl = canvas.getContext(`webgl`);
let image = document.getElementById(`image`); 

const actusImage = new Image();
actusImage.src = "image/actus.jpg";

gl.clearColor(0.5,0.5,0,0.5);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertices = new Float32Array([
    -1,-1, 
    -0.2,-0.2, 
    -0.2,-0.2, 
    -1,-1,
]);

const texCoord = new Float32Array([
    1,1,
    1,0,
    0,0,
    0,1,
]);

const verticesbuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, verticesbuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const textbuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textbuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoord, gl.STATIC_DRAW);

const textureCreation = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, textureCreation);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, actusImage);

const vsSource=` 
attribute vec3 pos;
attribute vec2 texture;
varying vec2 vTexture;

void main(){
    

gl_Position = vec4(pos,1);
gl_PointSize=60.0;
vTexture = texture;
}`;

const fsSource =`
precision mediump float;
varying vec2 vTexture;
uniform sampler2D vSampler;
void main(){
    gl_FragColor = texture2D(vSampler, vTexture);
}`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

const program =gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionLocation = gl.getAttribLocation(program, `pos`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, verticesbuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0,0);

const textureLocation = gl.getAttribLocation(program, 'texture');
gl.enableVertexAttribArray(textureLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, textbuffer);
gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);



let velocityX = -8; 
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

tree1Image = new Image();
tree1Image.src = "./image/tree1.jpg";

tree2Image = new Image();
tree2Image.src = "./image/tree2.jpg";

tree4Image = new Image();
tree4Image.src = "./image/tree4.jpg";

let jumping = false;
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !jumping) {
        jump();
    }
});
draw();
function draw(){

    gl.drawArrays(gl.TRIANGLES, 0, 6);


gl.enable(gl.DEPTH_TEST);

gl.viewport(0,0, canvas.width, canvas.height);

//gl.active(image)
window.requestAnimationFrame(draw);
  
}



/*css file

.game {

    width: 1200px;
    height: 600px;
    border: 2px solid black;
    margin: auto;
    background-image: url(big-cactus3.png);
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 1000px 550px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    

}

.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    color: red;
    display: none;
  }

  .prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: blue;
    display: none;
  }

h2 {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    margin-top: 0;
}

#dino{
    width: 100px;
    height: 100px;
    background-image: url(dino-dead.png);
    position: absolute;
    bottom: 0;
    left: 100px;
    background-repeat: no-repeat;
}
.jump {
    animation:jump 0.8s ease-in-out;
}

@keyframes jump {
    0%{
        bottom: 0;
    }
    10%{
        bottom: 60px;
    }
    20%{
        bottom: 120px;
    }
    30%{
        bottom: 180px;
    }
    40%{
        bottom: 240px;
    }
    50%{
        bottom: 300px;
    }
    60%{
        bottom: 240px;
    }
    70%{
        bottom: 180px;
    }
    80%{
        bottom: 120px;
    }
    90%{
        bottom: 60px;
    }
    100%{
        bottom: 0;
    }
}

#cactus{
    width: 50px;
    height: 100px;
    background-image: url(big-cactus1.png);
    position: absolute;
    bottom: 0;
    right: 0;
    background-repeat: no-repeat;
    animation:block 3s infinite linear;
}

@keyframes block {
    0%{
        left: 1200px;
    }
    100%{
        left: -20px;
    }
}

html file

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline Chrome Dino Game</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <canvas id="mycanv"></canvas>
    
    <div class="game">
        <div id="dino"></div>
        <div id="cactus"></div>
        <h2>CHROME OFFLINE DINO GAME</h2>
        <div class="game-over">Game Over</div>
        <div class="prompt">Press 'Enter' to continue</div>
    </div>
    <script src="Shapes.js"></script>
</body>
</html>

js file

const dino = document.getElementById(`dino`);
const gameOver = document.querySelector('.game-over');
const prompt = document.querySelector('.prompt');

function jump(){
  if(dino.classList != `jump`){
    dino.classList.add(`jump`);

    setTimeout(function (){
      dino.classList.remove(`jump`);
    }, 800);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
  if (e.code === 'Enter') {
    if (gameOver.style.display === 'block') {
      gameOver.style.display = 'none';
      prompt.style.display = 'none';
      startGame();
    }
  }
});

function checkCollision() {
  const dinoRect = dino.getBoundingClientRect();
  const cactusRect = cactus.getBoundingClientRect();

  if (dinoRect.x < cactusRect.x + cactusRect.width &&
      dinoRect.x + dinoRect.width > cactusRect.x &&
      dinoRect.y < cactusRect.y + cactusRect.height &&
      dinoRect.y + dinoRect.height > cactusRect.y) {
    gameOver.style.display = 'block';
    prompt.style.display = 'block';
    stopGame();
  }
}

function startGame() {
  // code to start the game
}

function stopGame() {
  // code to stop the game
}

setInterval(checkCollision, 10); */