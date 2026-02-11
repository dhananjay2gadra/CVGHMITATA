
    const TARGET_SAMPLE_RATE = 8000;
    const AMPLITUDE_THRESHOLD = 0.0;
const BAND_PASS_FREQUENCY = 1500;// 1800;
const BAND_PASS_Q = 0.8;// 1;
let audioQueue = [];
let isPlaying = false;
const MIN_QUEUE_SIZE = 3;
const MAX_QUEUE_SIZE = 30;







    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let websocket;
    let audioWorkletNode;
    let mediaStreamSource;
    let stream;
    let playbackNode;

    // Function to start WebSocket and audio streaming
    function startWebSocket() {
        websocket = new WebSocket('ws');
    websocket.binaryType = 'arraybuffer';

    websocket.onopen = function() {
        console.log('WebSocket is connected');
            };

    websocket.onclose = function() {
        console.log('WebSocket is closed');
            };

    websocket.onerror = function(error) {
        console.error('WebSocket error:', error);
            };

            // Register the audio worklet
        audioContext.audioWorklet.addModule('/lib/vid/audio-processor.js').then(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (mediaStream) {
                stream = mediaStream; // Save the stream for stopping later
                mediaStreamSource = audioContext.createMediaStreamSource(stream);
                audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor', {
                    processorOptions: {
                        sampleRate: audioContext.sampleRate,
                        amplitudeThreshold: AMPLITUDE_THRESHOLD,
                        targetSampleRate: TARGET_SAMPLE_RATE
                    }
                });

                // Listen for messages from the AudioProcessor
                audioWorkletNode.port.onmessage = function (event) {
                    const downsampledBuffer = event.data;

                    let pcm16Array = new Int16Array(downsampledBuffer.length);
                    for (let i = 0; i < downsampledBuffer.length; i++) {
                        const adjustedSample = Math.max(-1, Math.min(1, downsampledBuffer[i] * 0.5)); // Increase amplitude
                        pcm16Array[i] = adjustedSample * 32767; // Convert to Int16 format
                    }

                    let encoded = alawmulaw.alaw.encode(pcm16Array);

                    if (websocket && websocket.readyState === WebSocket.OPEN) {
                        websocket.send(encoded); // Send encoded data as binary over WebSocket
                    }
                };

                // Create a band-pass filter
                const bandPassFilter = audioContext.createBiquadFilter();
                bandPassFilter.type = 'bandpass';
                bandPassFilter.frequency.value = BAND_PASS_FREQUENCY;
                bandPassFilter.Q.value = BAND_PASS_Q;

                mediaStreamSource.connect(bandPassFilter);
                bandPassFilter.connect(audioWorkletNode);
                audioWorkletNode.connect(audioContext.destination);
            })
            .catch(function (err) {
                console.error('Error accessing microphone', err);
            });
            }).catch(err => {
        console.error('Error loading AudioWorklet module:', err);
            });




        audioContext.audioWorklet.addModule("/lib/vid/playback-processor.js")
            .then(() => {
                // Safe to create the node only after module is loaded
                playbackNode = new AudioWorkletNode(audioContext, "playback-processor");

                // Apply band-pass filter to playback
                //const bandPassFilterPlayback = audioContext.createBiquadFilter();
                //bandPassFilterPlayback.type = "bandpass";
               // bandPassFilterPlayback.frequency.value = BAND_PASS_FREQUENCY;
                //bandPassFilterPlayback.Q.value = .6;// BAND_PASS_Q;

               // playbackNode.connect(bandPassFilterPlayback).connect(audioContext.destination);
                playbackNode.connect(audioContext.destination);
            })
            .catch(err => console.error("Error loading playback AudioWorklet module:", err));



    // Handle incoming messages (play received audio)
    websocket.onmessage = function(event) {
                const encodedAudio = new Uint8Array(event.data);
        const decodedPcm = alawmulaw.alaw.decode(encodedAudio);

        const float32Array8k = new Float32Array(decodedPcm.length);
        for (let i = 0; i < decodedPcm.length; i++) {
            float32Array8k[i] = Math.max(-1, Math.min(1, decodedPcm[i] / 32768));
        }


        //const resampled = resampleToAudioContext(float32Array8k, 8000);


        playbackNode.port.postMessage(float32Array8k);


        // Add the decoded audio to the queue
        //audioQueue.push(decodedPcm);

       // if (audioQueue.length > MAX_QUEUE_SIZE) {
       //     audioQueue.splice(0, audioQueue.length - MAX_QUEUE_SIZE);
       // }

        // Start playing if not already playing
        //if (audioQueue.length === 1) {
        //    playAudioFromQueue();
        //}

        // Start playback only when we have enough buffered
        //if (!isPlaying && audioQueue.length >= MIN_QUEUE_SIZE) {
         //   isPlaying = true;
         //   playAudioFromQueue();
       // }

    //let float32Array = new Float32Array(decodedPcm.length);
    //for (let i = 0; i < decodedPcm.length; i++) {
    //    float32Array[i] = decodedPcm[i] / 32768;
    //            }

    //const audioBuffer = audioContext.createBuffer(1, float32Array.length, TARGET_SAMPLE_RATE);
    //audioBuffer.copyToChannel(float32Array, 0);

    //const source = audioContext.createBufferSource();
    //source.buffer = audioBuffer;
    //source.connect(audioContext.destination);
    //source.start(0);
            };
        }

    // Function to stop WebSocket and audio streaming
    function stopWebSocket() {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close(); // Close the WebSocket connection
            }

    if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop()); // Stop the microphone stream
            }

    if (audioWorkletNode) {
        audioWorkletNode.disconnect();
        }

        if (playbackNode) playbackNode.disconnect();

    if (mediaStreamSource) {
        mediaStreamSource.disconnect();
            }

    console.log('Audio stream and WebSocket closed');
        }

    // Event listeners for the buttons
   // document.getElementById('startButton').addEventListener('click', startWebSocket);
    //document.getElementById('stopButton').addEventListener('click', stopWebSocket);

    // Close the WebSocket on page unload
    window.addEventListener('beforeunload', function() {
        stopWebSocket();
        });


function resampleToAudioContext(float32Array8k, targetSampleRate) {
    const audioCtxRate = audioContext.sampleRate;
    if (audioCtxRate === targetSampleRate) return float32Array8k;

    const ratio = audioCtxRate / targetSampleRate;
    const newLength = Math.round(float32Array8k.length * ratio);
    const resampled = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
        const idx = i / ratio;
        const idx0 = Math.floor(idx);
        const idx1 = Math.min(idx0 + 1, float32Array8k.length - 1);
        const t = idx - idx0;
        resampled[i] = float32Array8k[idx0] * (1 - t) + float32Array8k[idx1] * t; // linear interpolation
    }
    return resampled;
}