let capture
let tracker

// --- 
let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 10.0; // Height of wave
let period = 150.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave
let old_x = 0;
let old_y = 0;
let X = 0;
let Y = 0;
let start_x;
let start_y;
let a = 0;
//---  

function setup() {

    createCanvas(800, 800)
    print('VErsion: 6');

    // start capturing video
    capture = createCapture(VIDEO)
    capture.size(800, 600)
    capture.hide()

    // create the tracker
    tracker = new clm.tracker()
    tracker.init()
    tracker.start(capture.elt)    

    // -- 
    w = width + 16;
    dx = (TWO_PI / period) * xspacing;
    yvalues = new Array(floor(w / xspacing));
    start_x = height / 2;
    start_y = 200;

}

function calcWave() {
    // Increment theta (try different values for
    // 'angular velocity' here)
    theta -= 0.08;

    // For every x value, calculate a y value with sine function
    let x = theta;
    for (let i = 0; i < yvalues.length; i++) {
        yvalues[i] = sin(x) * amplitude;
        x += dx;
    }
}

function renderWave(a, color, b) {
    push();
    stroke(color);
    strokeWeight(b);
    old_x = start_y + 0 * xspacing;
    old_y = start_x + a + yvalues[0];
    // A simple way to draw the wave with an ellipse at each location
    for (let x = 0; x < yvalues.length; x++) {
        // ellipse(x * xspacing, height / 2 + yvalues[x], 16, 16);
        Y = start_x + a + yvalues[x];
        X = start_y + x * xspacing;
        line(old_y, old_x, Y, X);
        old_x = X;
        old_y = Y;
    }
    pop();
}


function draw() {    

    background(0)
    
    // show the video feed
    image(capture, 0, 0, capture.width, capture.height)

    // get data from tracker
    let positions = tracker.getCurrentPosition()

    // make sure we have data to work with
    if (positions.length > 0) {

        stroke(255)
        fill(255)

        let noseX = positions[62][0]
        let l_lip_x = positions[44][0]
        let l_lip_y = positions[44][1]

        let r_lip_x = positions[50][0] - 5
        let r_lip_y = positions[50][1]

        let u_lip_x = positions[60][0]
        let u_lip_y = positions[60][1]

        let d_lip_x = positions[57][0]
        let d_lip_y = positions[57][1]
        //l m 44
        // r m 50 - 5
        // u t 60
        // d 57 
        // print(dist(u_lip_x, u_lip_y, d_lip_x, d_lip_y));
        if(dist(u_lip_x, u_lip_y, d_lip_x, d_lip_y) > 50) {
            let size = dist(l_lip_x, l_lip_y, r_lip_x, r_lip_y)/7;
            start_y = positions[50][1];
            start_x = l_lip_x + 5;
            calcWave();
            renderWave(0, 'red', size); //red
            renderWave(size, 'orange', size); //orange
            renderWave(size * 2, 'yellow', size); //yellow
            renderWave(size * 3, 'green', size); //green
            renderWave(size * 4, 'lightblue', size); //light_blue
            renderWave(size * 5, 'blue', size); //blue
            renderWave(size * 6, 'purple', size); //purple
        }  
    }
}

