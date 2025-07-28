let db;
let words = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  noStroke();

  setupFirebase();

  // Add handlers
  select('#clearBtn').mousePressed(clearCollage);
  select('#saveBtn').mousePressed(() => saveCanvas("word_collage", "png"));
}

function setupFirebase() {
const firebaseConfig = {

  apiKey: "AIzaSyAzb3eTiSTDVzD9OlNioE6K98zUa6axdDM",

  authDomain: "digitalmediaexamples-a7632.firebaseapp.com",

  projectId: "digitalmediaexamples-a7632",

  storageBucket: "digitalmediaexamples-a7632.firebasestorage.app",

  messagingSenderId: "1047528883123",

  appId: "1:1047528883123:web:14f89b19fe1579797a41c6",

  measurementId: "G-N9FK189N92"

};
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();

  db.ref("words").on("child_added", (data) => {
    const w = data.val();
    words.push(w);
    drawWord(w);
  });

  db.ref("words").on("value", (snapshot) => {
    if (!snapshot.exists()) {
      words = [];
      clear();
      background(255);
    }
  });
}

function draw() {
  // No continuous draw needed
}

function mousePressed() {
  let input = document.getElementById("textInput").value.trim();
  if (!input) return;

  let wordObj = {
    text: input,
    x: mouseX,
    y: mouseY,
    size: random(20, 60),
    angle: random(-45, 45),
    color: [random(0, 255), random(0, 255), random(0, 255)]
  };

  db.ref("words").push(wordObj);
  document.getElementById("textInput").value = "";
}

function drawWord(w) {
  push();
  translate(w.x, w.y);
  rotate(w.angle);
  fill(w.color[0], w.color[1], w.color[2]);
  textSize(w.size);
  text(w.text, 0, 0);
  pop();
}

function clearCollage() {
  const confirmClear = confirm("Clear all words from the collage?");
  if (confirmClear) {
    db.ref("words").remove();
  }
}
