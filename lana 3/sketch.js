//  Variables
let circles = [];
let songs = [];
let numCircles = 20;
let gameStarted = false;
let startButton, goToGameButton, backButton, nextButton;
let sceneId = 0; // Track current scene
let songButtons = [];
let video,
  bodyPose,
  poses = [],
  connections;
let buttonVisible = true;
let score = 0; // Player's score
let targetScore = 1500; // Score needed to win
let gameWon = false; // Track if the user has won
let restartButton;

function preload() {
  // Load songs
  songs.push(loadSound("adore you.mp3"));
  songs.push(loadSound("PUSH 2 START.mp3"));
  songs.push(loadSound("Tate McRae.mp3"));
  songs.push(loadSound("moth_to_a_flame.mp3"));
  songs.push(loadSound("rock anthem.mp3"));
  songs.push(loadSound("Dua Lipa - Levitating.mp3"));

  // Load bodyPose model
  bodyPose = ml5.bodyPose("BlazePose", { flipped: true });
}

function setup() {
  createCanvas(640, 480);

  // Create random circles for background
  for (let i = 0; i < numCircles; i++) {
    circles.push(createRandomCircle());
  }

  // Setup webcam capture and pose detection
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();

  // Setup buttons
  setupButtons();

  // Setup song selection buttons
  setupSongButtons();
}

function draw() {
  background(0);

  // Draw animated circles
  drawCircles();

  // Show the current scene
  showScene();
}

function createRandomCircle() {
  return {
    x: random(width),
    y: random(height),
    size: random(50, 150),
    color: color(random(100, 200), random(0, 100), random(150, 255)),
    speedX: random(-1, 2),
    speedY: random(-1, 2),
  };
}

function drawCircles() {
  fill(0, 150);

  // Animate the circles
  circles.forEach((circle) => {
    circle.x += circle.speedX;
    circle.y += circle.speedY;

    if (circle.x > width || circle.x < 0) circle.speedX *= -1;
    if (circle.y > height || circle.y < 0) circle.speedY *= -1;

    fill(circle.color);
    noStroke();
    ellipse(circle.x, circle.y, circle.size);
  });
}

function setupButtons() {
  startButton = createButton("Start Game");
  startButton.position(width / 2 - 60, height - 150);
  startButton.mousePressed(startGame);

  // Styling for the startButton
  startButton.style("background-color", "#9C27B0");
  startButton.style("color", "#FFFFFF");
  startButton.style("font-size", "24px");
  startButton.style("font-family", "Arial, sans-serif");
  startButton.style("padding", "12px 25px");
  startButton.style("border-radius", "12px");
  startButton.style("border", "none");

  startButton.style("transition", "all 0.3s ease-in-out");

  // Hover effect
  startButton.mouseOver(() => {
    startButton.style("background-color", "#41024C");
  });

  startButton.mouseOut(() => {
    startButton.style("background-color", "#9C27B0");
  });

  // Create the Back Button
  backButton = createButton("Back");
  backButton.position(20, height - 50);
  backButton.mousePressed(goBack);

  // style the back Button
  backButton.style("background-color", "#9C27B0");
  backButton.style("color", "#FFFFFF");
  backButton.style("font-size", "20px");
  backButton.style("font-family", "Arial, sans-serif");
  backButton.style("padding", "10px 20px");
  backButton.style("border-radius", "8px");
  backButton.style("border", "none");
  backButton.style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.3)");
  backButton.style("transition", "all 0.3s ease-in-out");

  // Hover effect for Back Button
  backButton.mouseOver(() => {
    backButton.style("background-color", "#5C1169");
  });
  backButton.mouseOut(() => {
    backButton.style("background-color", "#9C27B0");
  });

  // Initially hide the backButton
  backButton.hide();

  // Create the next Button
  nextButton = createButton("Next");
  nextButton.position(width - 100, height - 50);
  nextButton.mousePressed(goToSongSelection);

  //style the next button
  nextButton.style("background-color", "#9C27B0");
  nextButton.style("color", "#FFFFFF");
  nextButton.style("font-size", "20px");
  nextButton.style("font-family", "Arial, sans-serif");
  nextButton.style("padding", "10px 20px");
  nextButton.style("border-radius", "8px");
  nextButton.style("border", "none");
  nextButton.style("transition", "all 0.5s ease-in-out");

  // Hover effect for Next Button
  nextButton.mouseOver(() => {
    nextButton.style("background-color", "#5C1169");
  });
  nextButton.mouseOut(() => {
    nextButton.style("background-color", "#9C27B0");
  });

  // Initially hide the nextButton
  nextButton.hide();

  // Create the restart button
  restartButton = createButton("Restart Game");
  restartButton.position(width / 2 - 55, height / 2 + 100);
  restartButton.mousePressed(restartGame);

  // Style the restart button
  restartButton.style("background-color", "#9C27B0");
  restartButton.style("color", "#FFFFFF");
  restartButton.style("font-size", "24px");
  restartButton.style("font-family", "Arial, sans-serif");
  restartButton.style("padding", "12px 25px");
  restartButton.style("border-radius", "12px");
  restartButton.style("border", "none");

  restartButton.style("transition", "all 0.5s ease-in-out");

  // Hover effect for restartButton
  restartButton.mouseOver(() => {
    restartButton.style("background-color", "5C1169");
  });

  restartButton.mouseOut(() => {
    restartButton.style("background-color", "9C27B0");
  });
}

function setupSongButtons() {
  let buttonWidth = 180,
    buttonHeight = 90,
    spacing = 20;
  let totalWidth = buttonWidth * 3 + spacing * 2;
  let totalHeight = buttonHeight * 2 + spacing;
  let startX = (width - totalWidth) / 2;
  let startY = (height - totalHeight) / 2;

  //create song buttons
  songButtons = [
    createSongButton("I Adore You - Hugel", 0),
    createSongButton("Push to Start - Tyla", 1),
    createSongButton("It's OK, I'm OK - Tate McRae", 2),
    createSongButton("Moth to a Flame - The Weeknd", 3),
    createSongButton("rock anthem - LMFAO", 4),
    createSongButton("Levitating - Dua Lipa", 5),
  ];

  //position song buttons

  songButtons.forEach((button, i) => {
    let row = Math.floor(i / 3);
    let col = i % 3;
    button.position(
      startX + col * (buttonWidth + spacing),
      startY + row * (buttonHeight + spacing)
    );
    button.size(buttonWidth, buttonHeight);
    button.mousePressed(() => songSelected(i));
    button.hide();

    // Set initial button styles
    button.style("transition", "all 0.5s ease-in-out");
    button.style("font-size", "23px");
    button.style("padding", "5px");
    button.style("border-radius", "15px");
    button.style("border", "2px solid #000000");
    button.style("background-color", "#44054E");
    button.style("color", "#FFFFFF");

    button.mouseOver(() => {
      button.style("background-color", "#501BC5");
      button.style("color", "#FFFFFF");
    });

    // Reset to original style when mouse out
    button.mouseOut(() => {
      button.style("background-color", "#44054E");
      button.style("color", "#FFFFFF");
    });
  });
}

function createSongButton(label, index) {
  return createButton(label).mousePressed(() => songSelected(index));
}

function songSelected(index) {
  playSong(index);
  songButtons.forEach((button) => button.hide());

  sceneId = 3;
}

function playSong(index) {
  songs.forEach((song) => song.stop());
  songs[index].play();
}

function startGame() {
  sceneId = 1;
  startButton.hide();
}

function goBack() {
  if (sceneId === 1) {
    sceneId = 0;
    startButton.show();
  } else if (sceneId === 2) {
    sceneId = 1;
    songButtons.forEach((button) => button.hide());
    nextButton.show();
  } else if (sceneId === 3) {
    sceneId = 2;
    songButtons.forEach((button) => button.show());
  }
}

function goToSongSelection() {
  sceneId = 2;
  nextButton.hide();
}

function goToGame() {
  sceneId = 3;
  goToGameButton.hide();
}

function showScene() {
  switch (sceneId) {
    case 0:
      showTitleScreen();
      break;
    case 1:
      showInstructionsScreen();
      break;
    case 2:
      showSongSelectionScreen();
      break;
    case 3:
      gameScreen();
      break;
    case 4:
      winScreen();
      break;
  }
}

//title screen(0)
function showTitleScreen() {
  startButton.show();
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255);
  textStyle(BOLD);
  text("RHYTHM GO", width / 2, height / 2 - 40);
  backButton.hide();
  nextButton.hide();
  restartButton.hide();
}

//innstructions screen(1)
function showInstructionsScreen() {
  textSize(40);
  textAlign(CENTER, CENTER);
  fill(255);
  text("Get Ready to Dance!", width / 2, height / 4);

  textSize(20);
  text(
    "1. Dance to the music to score points.\n2. Stop dancing and the score decreases.\n3. Keep moving to earn points going!\n\nGet 1500 points to win.",
    width / 2,
    height / 2
  );

  backButton.show();
  nextButton.show();
}

//song selection screen (2)
function showSongSelectionScreen() {
  startButton.hide();
  songButtons.forEach((button) => button.show());
}

//game screen (3)
function gameScreen() {
  background(0);

  // Draw skeleton and update the score based on movement
  drawSkeleton();

  // Display the score
  textSize(32);
  textAlign(LEFT, TOP);
  fill(255);
  noStroke();
  text("Score: " + score, 10, 10);

  // Check for win condition
  if (score >= targetScore && !gameWon) {
    gameWon = true;
    sceneId = 4; // Move to win screen
  }
}

//win screen (4)
function winScreen() {
  background(0);
  backButton.hide();
  startButton.hide();
  drawCircles();
  textSize(100);
  textAlign(CENTER, CENTER);
  fill(255);
  text("YOU WON!", width / 2, height / 2);
  restartButton.show();
}

function restartGame() {
  score = 0;
  gameWon = false;
  movementTimeout = 0;
  sceneId = 0;
  songs.forEach((song) => song.stop());
  restartButton.hide();
}

let lastKeypointPositions = []; // Store previous keypoint positions for movement detection
let movementTimeout = 0; // To track how long the user has been still

function drawSkeleton() {
  let moving = false; // Track if movement is detected

  poses.forEach((pose) => {
    connections.forEach((connection) => {
      let pointA = pose.keypoints[connection[0]];
      let pointB = pose.keypoints[connection[1]];

      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(128, 0, 128);
        strokeWeight(8);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    });

    pose.keypoints.forEach((keypoint, index) => {
      if (keypoint.confidence > 0.1) {
        fill(255);
        strokeWeight(4);
        circle(keypoint.x, keypoint.y, 10);

        // Movement detection: check if the keypoint has moved since the last frame
        if (lastKeypointPositions[index]) {
          let lastPos = lastKeypointPositions[index];
          let distance = dist(lastPos.x, lastPos.y, keypoint.x, keypoint.y);

          if (distance > 5) {
            // If the keypoint moved more than 5 pixels, consider it as movement
            moving = true; // Movement detected
          }
        }

        // Update the last position for the next frame
        lastKeypointPositions[index] = { x: keypoint.x, y: keypoint.y };
      }
    });
  });

  // Update the score based on movement
  if (moving) {
    score += 1; // Increment score for movement
    movementTimeout = 0; // Reset inactivity timer when moving
  } else {
    movementTimeout++; // Increase inactivity timer when not moving

    // Decrease the score by 5 points per second if the user is not moving
    if (movementTimeout > 30) {
      // After 30 frames (about 1 second)
      if (movementTimeout % 30 === 0) {
        // Check every 30 frames (every second)
        score -= 5; // Decrease score by 5 points per second
        score = max(0, score); // Prevent the score from going negative
      }
    }
  }

  // Display the score in scene 3 (game screen)
  if (sceneId === 3) {
    textSize(32);
    textAlign(LEFT, TOP);
    fill(255);
    text("Score: " + Math.floor(score), 10, 10); // Displaying rounded score
  }

  // Check for win condition (score >= targetScore)
  if (score >= targetScore && !gameWon) {
    gameWon = true;
    sceneId = 4; // Move to the win screen
  }
}

function gotPoses(results) {
  poses = results;
}
