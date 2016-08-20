import API from './api'

let localStream

export function runCamera () {
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  const video = document.getElementById('video')
  const vendorUrl = window.URL || window.webkitURL

  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.msGetUserMedia || navigator.mosGetUserMedia

  navigator.getMedia({
    video: true,
    audio: false
  }, stream => {
    video.src = vendorUrl.createObjectURL(stream)
    video.play()
    localStream = stream
  }, error => {
    console.log(error)
  })

  // video.addEventListener('play', function () {
  //   draw(this, context, 400, 300)
  // }, false)

  function draw (video, context, width, height) {
    context.drawImage(video, 0, 0, width, height)
    const blob = dataURItoBlob(canvas.toDataURL('image/jpeg'))
    const file = new FormData()
    file.append('captured', blob)
    API.image.post(file)

    // Ewentualny image processing
    // const imageData = context.getImageData(0, 0, width, height)
    // processImage(imageData)
    // context.putImageData(imageData, 0, 0)
  }

  return {
    captureImage: () => {
      draw(video, context, 400, 300)
    }
  }
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  const bb = new Blob([ab], { type: mimeString });
  return bb
}

export function stopCamera () {
  let track = localStream.getTracks()[0]
  track.stop()
  video.pause()
}

// Mutable function!
function processImage (imageData) {
  for (let i = 0; i < imageData.data.length; i += 4) {
    const data = {
      r: imageData.data[i + 0],
      g: imageData.data[i + 1],
      b: imageData.data[i + 2],
      a: imageData.data[i + 3]
    }

    imageData.data[i + 0] = data.r
    imageData.data[i + 1] = data.g
    imageData.data[i + 2] = data.b
    imageData.data[i + 3] = data.a
  }
}
