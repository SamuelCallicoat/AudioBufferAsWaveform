const SAMPLE_RATE = 8000;
const HZ_440_NUM_SAMPLES_FLOORED = Math.floor(SAMPLE_RATE / 440);
let volume;
let audioCtx;
let audioCtxBtn = document.getElementById('audioCtxBtn');
let waveshapeBtn = document.getElementById('waveshapeBtn');
let audioBufferNode;
let waveshapeChoice = 1;
let bufferArray;

audioCtxBtn.addEventListener('click', () => {
  if (audioCtx instanceof AudioContext) return;
  audioCtx = new AudioContext({
    sampleRate: SAMPLE_RATE,
  });
  console.log(audioCtx);

  audioBufferNode = CreateWaveLengthBuffer();

  let bufferSourceNode = audioCtx.createBufferSource();
  bufferSourceNode.loop = true;

  let gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.1;

  volume = gainNode.gain;
  bufferSourceNode.buffer = audioBufferNode;
  console.log(bufferSourceNode);

  bufferSourceNode.connect(gainNode).connect(audioCtx.destination);

  bufferSourceNode.start();
});

function CreateWaveLengthBuffer() {
  let buffer = audioCtx.createBuffer(
    1,
    HZ_440_NUM_SAMPLES_FLOORED,
    SAMPLE_RATE
  );
  console.log(buffer);

  // fill buffer
  bufferArray = buffer.getChannelData(0);

  for (let i = 0; i < bufferArray.length; i++) {
    bufferArray[i] = Math.sin((i / HZ_440_NUM_SAMPLES_FLOORED) * Math.PI * 2);
  }
  console.log(bufferArray);
  return buffer;
}

waveshapeBtn.addEventListener('click', () => {
  if (audioCtx instanceof AudioContext) {
    switch (waveshapeChoice) {
      case 1:
        for (let i = 0; i < bufferArray.length; i++) {
          if (i < HZ_440_NUM_SAMPLES_FLOORED * 0.5) bufferArray[i] = 1;
          else bufferArray[i] = -1;
        }
        waveshapeChoice++;
        break;

      case 2:
        for (let i = 0; i < bufferArray.length; i++) {
          bufferArray[i] = i / HZ_440_NUM_SAMPLES_FLOORED;
        }
        console.log(bufferArray);
        waveshapeChoice++;
        break;

      default:
        for (let i = 0; i < bufferArray.length; i++) {
          bufferArray[i] = Math.sin(
            (i / HZ_440_NUM_SAMPLES_FLOORED) * Math.PI * 2
          );
        }
        console.log(bufferArray);
        waveshapeChoice = 1;

        break;
    }
  }
});
