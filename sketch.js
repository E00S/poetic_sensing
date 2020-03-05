const AIO_USERNAME = "E00S"
const AIO_KEY = "aio_AQvo77QqcZ6gOmsvCUJWdFZxdAP8"

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight/3)
    canvas.position(0, (windowHeight/1.5))
    noLoop()
}

async function draw() { // note "async" keyword

    background(0)

    // fetch our data
    let data = await fetchData("sensor-test")      // note the "await" keyword
    print(data)

    let steps = 0
    for (let datum of data) {
        steps += int(datum.value)
        print(steps)
    }
    textFont('monospace')
    textSize(width/16);
    fill(255);
    textAlign(CENTER,CENTER);
    text(steps, windowWidth/2, windowHeight/12);
    text("1,962,116,129", windowWidth/2, windowHeight/4);
    textSize(width/34);
    textAlign(RIGHT,CENTER);
    text("Steps\nTaken", windowWidth/1.02, windowHeight/12);
    text("Steps To\nThe Moon", windowWidth/1.02, windowHeight/4);
    stroke(255);
    strokeWeight(5);
    line(windowWidth/4.5, windowHeight/6, windowWidth/1.3, windowHeight/6);

}

// this function fetches our data
async function fetchData(feed) {
    return await new Promise((resolve, reject) => {
        let url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feed}/data`
        print(url)
        httpGet(url, 'json', false, function(data) {
            resolve(data)
        })
    })
}

