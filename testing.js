        const canvas = document.querySelector('canvas');
        const gl = canvas.getContext('webgl');
        gl.clearColor(0.9, 0.9, 0.9, 0.9);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // minidraw();
        let tx, ty,dy;
        tx = ty = dy = 0;
        let anim;
        let revolution = 0;

        let image = document.querySelector('img');

        let dinoVert = new Float32Array([
            -1, -1,
            -0.8, -1,
            -0.8, -0.6,
            -0.8, -0.6,
            -1, -0.6,
            -1, -1,
        ]);

        let cactusvert = new Float32Array([
            1, -1,
            0.8, -1,
            0.8, -0.6,
            0.8, -0.6,
            1, -0.6,
            1, -1,
        ]);

        let texturecord = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
        ]);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        let playerVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, dinoVert, gl.STATIC_DRAW);

        let cactusbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cactusbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cactusvert, gl.STATIC_DRAW);

        let textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texturecord, gl.STATIC_DRAW);

        const vsSource = `
            attribute vec2 pos;
            attribute vec2 texCoord;
            varying vec2 vTexCoord;
            uniform float xtrans;
            uniform float ytrans;

            void main() {
                gl_Position = vec4(pos.x + xtrans, pos.y + ytrans, 0.0, 1.0);
                vTexCoord = texCoord;
            }
        `;

        const fsSource = `
        precision mediump float;
        varying vec2 vTexCoord;
        uniform sampler2D uSampler;
        
        void main() {
            vec4 mtexture = texture2D(uSampler, vTexCoord);
            gl_FragColor = vec4(mtexture.xyzw); // Keep RGB components unchanged and set alpha to 1.0
        }`
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsSource);
        gl.compileShader(fragmentShader);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const posAttribLocation = gl.getAttribLocation(program, 'pos');
        let xshift = gl.getUniformLocation(program, 'xtrans');
            let yshift = gl.getUniformLocation(program, 'ytrans');
        function Dinodraw()
        {
            // gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBuffer);
            const posAttribLocation = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(posAttribLocation);
        const texCoordAttribLocation = gl.getAttribLocation(program, 'texCoord');
        gl.enableVertexAttribArray(texCoordAttribLocation);

        // Dinosaur
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBuffer);
        gl.vertexAttribPointer(posAttribLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        }

        function cactusdraw(number){
            // // Cactus
        // gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBuffer);
        const posAttribLocation1 = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(posAttribLocation1);
        let image2 = document.querySelectorAll('img');    
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2[number+1]);
        gl.bindBuffer(gl.ARRAY_BUFFER, cactusbuffer);
        gl.vertexAttribPointer(posAttribLocation1, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        
        let rendering = true;
        function draw()
        {
            // while(rendering == true){
                if( rendering == true)
                    {
                        gl.clear(gl.COLOR_BUFFER_BIT);
                // updatePositions()
                if ( dy < 0.3 && tx < -1.65) {
                    // Handle collision 
                    console.log(anim, 'collison');
                    rendering = false;
                    console.log('Collision detected!');
                }
                console.log(anim, 'collison');
                console.log(tx, "tx - vale");
                gl.uniform1f(yshift, ty);
                gl.uniform1f(xshift, tx);
                if(revolution > 2)
                    {
                        revolution = 0;
                    }
                cactusdraw(revolution);
                gl.uniform1f(yshift, dy);
                gl.uniform1f(xshift, 0);
                Dinodraw()
                tx = tx - 0.01;
                // console.log(tx);
                if(tx < -1.99)
                    {
                        tx = 0;
                        revolution++;
                    }
                if(dy > 0)
                    {
                        dy -= 0.01;
                        // document.removeEventListener('keypress', )
                    }
                    anim = window.requestAnimationFrame(draw)
                    }
                    else if( rendering == false){
                        let gameOver = document.createElement('p');
                        gameOver.innerText = "Game Over ";
                        gameOver.style.color = 'red';
                        gameOver.style.fontSize = '10vw';
                        gameOver.style.position = 'absolute';
                        gameOver.style.top = '50%';
                        gameOver.style.left = '50%';
                        gameOver.style.transform = 'translate(-50%, -50%)';
                        // canvas.style.height = '20vw'
                        let myb = document.querySelector('body');
                        myb.appendChild(gameOver);
                        
                    }
                
                    
                
                 
            }
           
        // }
        draw();

        document.addEventListener('keypress', (event) => {
            if (event.key === "k") {
                console.log("k pressed");
                for (let i = 0; i < 10; i++) {
                    console.log("what");
                    if (dy < 1) {
                        dy+=0.2;
                        console.log(dy); // Print value for testing
                    } else {
                        break; // Exit the loop if value exceeds 1
                    }
                }
            }
        });
    // Define the positions and sizes of the dinosaur and cactus


// Function to check for collision between two objects
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
function updatePositions() {

    console.log(dinoPosition.x,"Dino");
    console.log(cactusPosition.x,"Cactus");
    dinoPosition.x = 0; // Set dinosaur x position
    dinoPosition.y = dy; // Set dinosaur y position
    cactusPosition.x = tx; // Set cactus x position
    cactusPosition.y = -1; // Set cactus y position
}


// function collide()
// {
//     if(ydino ==  0.2 && tx < -0.8)
// }