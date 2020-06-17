// Bingung yang salah dari sini apaan
// Placeholder function for next step. Paste this in the next step
function enableCam(event){
    //  Only continue if the COCO-SSD has finished loading
    if(!model) {
        return;
    }

    //  Hide the button once clicked.
    event.target.classList.add('removed');

    //  getUserMedia parameters to force video but not audio.
    const constraints = {
        video = true
    };

    //  Activate the webcam stream
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
    });
}

function predictWebcam() {
    // Now let's start classifying a frame in the stream.
    model.detect(video).then(function (predictions) {
      //Remove any highlighting we did previous frame
      for (let i = 0; i < children.length; i++) {
        liveView.removeChild(children[i]);
      }
      children.splice(0);
  
      // Now lets loop through predictions and draw them to the live view if they have a high confidence score.
      for (let n = 0; n < predictions.length; n++) {
        // if we are over 66% sure we are sure classified it right. Draw it!
        if (predictions[n].score > 0.66) {
          const p = document.createElement('p');
          p.innerText = predictions[n].class + ' - with ' 
                + Math.round(parseFloat(predictions[n].score) * 100) 
                + '% confidence';
          p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: ' 
                + predictions[n].bbox[1] + 'px; width: ' 
                + predictions[n].bbox[2] + 'px; height: ' 
                + predictions[n].bbox[3] +'px;';
  
          liveView.appendChild(highlighter);
          liveView.appendChild(p);
          children.push(highlighter);
          children.push(p);
        }
      }
      // Call this function again to keep predicting when the browser is ready.
      window.requestAnimationFrame(predictWebcam);
    });
  }