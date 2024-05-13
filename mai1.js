const canvas = document.querySelector('canvas');
        const gl = canvas.getContext('webgl');

        // Define game variables
        let playerY = 0.9; // Initial player Y position
        const playerHeight = 0.9; // Height of the player
        let obstacleX = 0.4; // Initial obstacle X position
        const obstacleWidth = 0.5; // Width of the obstacle
        let score = 0;

        // Setup WebGL
        gl.clearColor(0.9, 0.9, 0.9, 0.9);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Define vertices and texture coordinates for player
        //define the co-ordinatees of Dino
        const playerVertices = new Float32Array([  //This is not working currently
            -1, -1,
            -0.8, -1,
            -0.8, -0.6,
            -0.8, -0.6,
            -1, -0.6,
            -1, -1,
        ]);

        // const playerTexCoord = new Float32Array([
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     0.0, 0.0
        // ]);

        // Define vertices and texture coordinates for obstacle
        // const obstacleVertices = new Float32Array([
        //     -1, -1,
        //     -0.8, -1,
        //     -0.8, -0.6,
        //     -0.8, -0.6,
        //     -1, -0.6,
        //     -1, -1,
        // ]);


        let cactusvert = new Float32Array([
            1, -1,
            0.8, -1,
            0.8, -0.6,
            0.8, -0.6,
            1, -0.6,
            1, -1,
        ]);


    let cactusbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cactusbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cactusvert, gl.STATIC_DRAW);



        const obstacleTexCoord = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
        ]);

        // Create buffers for player
        const playerVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, playerVertices, gl.STATIC_DRAW);

        // const playerTexCoordBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, playerTexCoordBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, playerTexCoord, gl.STATIC_DRAW);

        // Create buffers for obstacle
        // const obstacleVerticesBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, obstacleVerticesBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, obstacleVertices, gl.STATIC_DRAW);

        const obstacleTexCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obstacleTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, obstacleTexCoord, gl.STATIC_DRAW);

        // Load shaders and create program
        const vsSource = `
            attribute vec2 pos;
            attribute vec2 texture;
            varying vec2 vTexture;

            void main() {
                gl_Position = vec4(pos, 0.0, 1.0);
                vTexture = texture;
            }
        `;

        const fsSource = `
            precision mediump float;
            varying vec2 vTexture;
            uniform sampler2D sampler;

            void main() {
            gl_FragColor = texture2D(sampler, vTexture);
            }
        `;

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
        console.log(gl.getProgramInfoLog(program));

        // Set up attribute pointers for player
        const playerPosAttribLocation = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(playerPosAttribLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBuffer);
        gl.vertexAttribPointer(playerPosAttribLocation, 2, gl.FLOAT, false, 0, 0);

        // const playerTexCoordAttribLocation = gl.getAttribLocation(program, 'texture');
        // gl.enableVertexAttribArray(playerTexCoordAttribLocation);
        // gl.bindBuffer(gl.ARRAY_BUFFER, playerTexCoordBuffer);
        // gl.vertexAttribPointer(playerTexCoordAttribLocation, 2, gl.FLOAT, false, 0, 0);

        // Set up attribute pointers for obstacle
        // const obstaclePosAttribLocation = gl.getAttribLocation(program, 'pos');
        // gl.enableVertexAttribArray(obstaclePosAttribLocation);
        // gl.bindBuffer(gl.ARRAY_BUFFER, obstacleVerticesBuffer);
        // gl.vertexAttribPointer(obstaclePosAttribLocation, 2, gl.FLOAT, false, 0, 0);

        const obstacleTexCoordAttribLocation = gl.getAttribLocation(program, 'texture');
        gl.enableVertexAttribArray(obstacleTexCoordAttribLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, obstacleTexCoordBuffer);
        gl.vertexAttribPointer(obstacleTexCoordAttribLocation, 2, gl.FLOAT, false, 0, 0);
        // gl.drawArrays(gl.TRIANGLES, 0, 6);

        // // Cactus
        
        // gl.bindBuffer(gl.ARRAY_BUFFER, cactusbuffer);
        // gl.vertexAttribPointer(posAttribLocation, 2, gl.FLOAT, false, 0, 0);
        // gl.drawArrays(gl.TRIANGLES, 0, 6);
        // gl.bindBuffer(gl.ARRAY_BUFFER, cactusbuffer);
        // const cactus = gl.getAttribLocation(program, 'pos');
        // gl.enableVertexAttribArray(cactus);
        // // gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBuffer);
        // gl.vertexAttribPointer(cactus, 2, gl.FLOAT, false, 0, 0);



        // Load texture
        const imageSources = [
            'image/cactus1.png',
            'image/cactus2.png',
            'image/cactus3.png',
            'image/dino.png',
        ];
        
        const textures = [];
        let loadedImages = 0;
        
        // Load textures
        imageSources.forEach((src, index) => {
            const image = new Image();
            image.src = src;
            image.onload = function() {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
                textures[index] = texture;
                loadedImages++;
        
                // Start the game loop when all images are loaded
                if (loadedImages === imageSources.length) {
                    requestAnimationFrame(draw);
                }
            };
        });

        // Handle player jump
        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space') {
                playerY += 0.1; // Adjust as needed for jump height
            }
        });
        // checks if its to power of two
        function isPowerOfTwo(value) {
        return (value & (value - 1)) === 0;
        }

        // Game loop
        function draw() {
            // Update obstacle position
            obstacleX -= 0.01; // Adjust as needed for obstacle speed

            // Check for collision
            if (obstacleX < -1.0) {
                obstacleX = 1.0; // Reset obstacle position
                score++; // Increment score on successful avoidance
            }

            // Clear the canvas
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Draw player
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            // Draw obstacle
            // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

            

            // Continue game loop
            requestAnimationFrame(draw);
        }