
    const TARGET_SAMPLE_RATE = 8000;
    const AMPLITUDE_THRESHOLD = 0.0;
const BAND_PASS_FREQUENCY = 1500;// 1800;
const BAND_PASS_Q = 0.8;// 1;
let audioQueue = [];
let isPlaying = false;
const MIN_QUEUE_SIZE = 3;
const MAX_QUEUE_SIZE = 30;





// Function to play audio from the queue
function playAudioFromQueue() {
    if (audioQueue.length === 0) {
        isPlaying = false;
        return; // No audio to play
    }

    const decodedPcm = audioQueue.shift(); // Remove the first chunk from the queue
    let float32Array = new Float32Array(decodedPcm.length);

    for (let i = 0; i < decodedPcm.length; i++) {
        //float32Array[i] = decodedPcm[i] / 32768;
        let sample = decodedPcm[i] / 32768;
        float32Array[i] = Math.max(-1, Math.min(1, sample));
    }

    const audioBuffer = audioContext.createBuffer(1, float32Array.length, TARGET_SAMPLE_RATE);
    audioBuffer.copyToChannel(float32Array, 0);


    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;


    // Create a GainNode to adjust the gain dynamically
    const gainNode = audioContext.createGain();
    gainNode.gain.value = .50;//1; // Set the gain (adjustable as needed)

    // Band-pass filter
    //const bandpass = audioContext.createBiquadFilter();
    //bandpass.type = "bandpass";
    //bandpass.frequency.value = 1500; // center frequency
    //bandpass.Q.value = 0.8;        // controls width

    const highpass = audioContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 300;

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3400;



    // Connect chain: source → bandpass → gain → speakers
    source.connect(highpass).connect(lowpass).connect(gainNode).connect(audioContext.destination);




    //const source = audioContext.createBufferSource();
    //source.buffer = audioBuffer;
    //source.connect(gainNode);
    //gainNode.connect(audioContext.destination);

    source.onended = function () {
        // After the current chunk finishes, play the next one from the queue
        if (audioQueue.length > 0) {
            playAudioFromQueue();
        }
    };

    source.start(0); // Play the current chunk
}





    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let websocket;
    let audioWorkletNode;
    let mediaStreamSource;
    let stream;

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

    // Handle incoming messages (play received audio)
    websocket.onmessage = function(event) {
                const encodedAudio = new Uint8Array(event.data);
        const decodedPcm = alawmulaw.alaw.decode(encodedAudio);
        // Add the decoded audio to the queue
        audioQueue.push(decodedPcm);

        if (audioQueue.length > MAX_QUEUE_SIZE) {
            audioQueue.splice(0, audioQueue.length - MAX_QUEUE_SIZE);
        }

        // Start playing if not already playing
        //if (audioQueue.length === 1) {
        //    playAudioFromQueue();
        //}

        // Start playback only when we have enough buffered
        if (!isPlaying && audioQueue.length >= MIN_QUEUE_SIZE) {
            isPlaying = true;
            playAudioFromQueue();
        }

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
