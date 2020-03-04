const AIO_USERNAME = "E00S"
const AIO_KEY = "aio_AQvo77QqcZ6gOmsvCUJWdFZxdAP8"

function setup() {
    let canvas = createCanvas(windowWidth/2, windowHeight/3)
    canvas.position(windowWidth/4, (windowHeight/1.5))
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
    textSize(width/6);
    fill(255);
    textAlign(CENTER,CENTER);
    text(steps,windowWidth/4,windowHeight/12);
    stroke(255);
    line(0, windowHeight/6, windowWidth/4, windowHeight/6);

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

