var imgs = [];
var avgImg;
var numOfImages = 30;

var filename = "";

var leftImageIndex = 0;

var mousePos = 1;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    
    //step1: load faces
    for(var i = 0; i < numOfImages; i++) {
        filename = "assets/" + i + ".jpg"
        imgs.push(loadImage(filename));
    }
}
//////////////////////////////////////////////////////////
function setup() {
    //step2: make canvas width twice of first image and height equal to first image
    createCanvas(imgs[0].width*2, imgs[0].height);
    pixelDensity(1);
    
    //step3: initialise avgImg as an empty buffer
    avgImg = createGraphics(imgs[0].width, imgs[0].height);
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgs[leftImageIndex], 0, 0);
    
    //step4: access the pixel data of images in imgs array and avgImg
    for(var i = 0; i < numOfImages; i++) {
        imgs[i].loadPixels();
    }
    
    //step4: call loadPixels() on avgImg 
    avgImg.loadPixels();
    
    mousePos = map(mouseX, 0, width, 0, 1);
    
    //step5: nested for loop over pixels of first image
    for(var x = 0; x < imgs[0].width; x++) {
        for(var y = 0; y < imgs[0].height; y++) {
            //step5: calculations to convert x and y to index value
            var index = ((imgs[0].width * y) + x) * 4;
            
            //step5: set pixel in avgImg to red
            var redChannel = imgs[0].pixels[index + 0];
            var alphaChannel = imgs[0].pixels[index + 3];
            avgImg.pixels[index + 0] = redChannel;
            avgImg.pixels[index + 3] = alphaChannel;
            
            
            //step6: create variables and initialise to 0
            var sumR = 0
            var sumG = 0
            var sumB = 0
            
            //step6: loop through imgs
            for(var i = 0; i < numOfImages; i++) {
                sumR += imgs[i].pixels[index + 0];
                sumG += imgs[i].pixels[index + 1];
                sumB += imgs[i].pixels[index + 2];
            }
            
            //step6: update each channel in avgImg
            avgImg.pixels[index + 0] = sumR/numOfImages;
            avgImg.pixels[index + 1] = sumG/numOfImages;
            avgImg.pixels[index + 2] = sumB/numOfImages;
            avgImg.pixels[index + 3] = 255;
            
            
            
            //extension: use lerp to transition between average face and selected image
            var redLerp = lerp(imgs[leftImageIndex].pixels[index + 0], 
                               avgImg.pixels[index + 0], 
                               mousePos);
            var greenLerp = lerp(imgs[leftImageIndex].pixels[index + 1], 
                               avgImg.pixels[index + 1], 
                               mousePos);
            var blueLerp = lerp(imgs[leftImageIndex].pixels[index + 2], 
                               avgImg.pixels[index + 2], 
                               mousePos);
            //update avgImg
            avgImg.pixels[index + 0] = redLerp;
            avgImg.pixels[index + 1] = greenLerp;
            avgImg.pixels[index + 2] = blueLerp;
            avgImg.pixels[index + 3] = 255;
        }
    }
    //step5: update pixels to let p5js know that the image has had its data changed
    avgImg.updatePixels();
    
    //step5: draw avgImg to the right
    image(avgImg, imgs[0].width, 0);
    noLoop();
    
    //instructions
    textSize(18);
    fill(147, 0, 184);
    text('Navigate the left image with left and right arrow key', 10, 20);
    text('Press the spacebar to generate random image', 10, 40);
    text('Move the mouse for transition', imgs[0].width + 10, 20);
}



function keyPressed() {
    //extension: press left and right arrows to //navigate the picture shown on the left,
    //press spacebar to generate a random picture on the left
    
    if(keyCode === LEFT_ARROW) {
        if(leftImageIndex == 0) {
            leftImageIndex = 29;
        }
        else {
            leftImageIndex--;
        }
    }
    else if(keyCode === RIGHT_ARROW) {
        if(leftImageIndex == 29) {
            leftImageIndex = 0;
        }
        else {
            leftImageIndex++;
        }
    }
    else if (key == ' ') {
        leftImageIndex = int(random(0, 29));
    }
    
    //calls draw again to update the image on the left
    redraw();
}



function mouseMoved() {
    //extension: transition the right image from selected image to average image when mouse moves
    //calls draw again
    redraw();
}