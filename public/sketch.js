

var socket;

let wave;
let playing = true;


let paths = [];

let painting = false;
// How long until the next circle
let next = 0;
// Where are we now and where were we?
let current;
let previous;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  socket.on('mouse', newDrawing);

  current = createVector(0,0);
  previous = createVector(0,0);
  

  wave = new p5.Oscillator();
  
  wave.setType('triangle');
  
  wave.amp(0.5);


}

function newDrawing(data){

  noStroke();
  fill(255, 255 , 255 );
  ellipse(data.x , data.y , 20, 20);
  wave.start();
  wave.freq(map(data.x, 0, width, 80, 500));
  playing = true;
  wave.stop(1.2);


  wave.freq(map(data.x, 0, width, 80, 500));
    
}
  
 
  

function draw() {
  background(33,33,33);
  
  
  
  // If it's time for a new point
  if (millis() > next && painting) {

    // Grab mouse position      
    current.x = mouseX;
    current.y = mouseY;

    // New particle's force is based on mouse movement
    let force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add new particle
    paths[paths.length - 1].add(current, force);
    
    // Schedule next circle
    next = millis() + random(100);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for( let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

// Start it up
function mousePressed() {
  console.log('Sending mousepress data: ' + mouseX + ',' + mouseY);

  /*var data1 = {
    v: mouseX,
    w: mouseY
  }

  socket.emit('mouse1', data1);
*/
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
  wave.start();
  wave.freq(map(mouseX, 0, width, 80, 500));
  playing = true;


  
}

// Stop
function mouseReleased() {
  painting = false;
  wave.stop(1.2);
  playing = false;
}

// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
    this.hue = random(100);
  }

  add(position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue));
  }
  
  // Display plath
  update() {  
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }  
  
  // Display plath
  display() {    
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If we shold remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      // Otherwise, display it
      } else {
        this.particles[i].display(this.particles[i+1]);
      }
    }
  
  }  
}

// Particles along the path
class Particle {
  constructor(position, force, hue) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.95;
    this.lifespan = 255;
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan--;
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display(other) {
    stroke(0, this.lifespan);
    fill(16,150,224, this.lifespan/2);    
    ellipse(this.position.x,this.position.y, 12, 12);    
    // If we need to draw a line
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
  
}

function mouseDragged(){

  console.log('Sending mousedrag data:' + mouseX + ',' + mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  }

  socket.emit('mouse', data);

  wave.freq(map(mouseX, 0, width, 80, 500));
  let panning = map(mouseX, 0, width, -1.0, 1.0);
    
  
  
}



