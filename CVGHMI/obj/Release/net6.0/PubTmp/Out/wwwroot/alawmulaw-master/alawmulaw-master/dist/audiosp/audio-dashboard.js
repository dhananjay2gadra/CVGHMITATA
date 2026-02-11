let audioContext, source, processor, gainNode, compressor, socket;
let fft, bufferSize = 2048;
const canvas = document.getElementById("spectrumCanvas");
const canvasCtx = canvas.getContext("2d");
const noiseThresholdInput = document.getElementById('noiseThreshold');
const compressionThresholdInput = document.getElementById('compressionThreshold');
let isProcessing = false;

const TARGET_SAMPLE_RATE = 8000;

function startAudio() {
    if (isProcessing) return; // Prevent multiple starts

    // Initialize Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Get microphone input
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            source = audioContext.createMediaStreamSource(stream);

            // Create nodes for processing
            gainNode = audioContext.createGain();
            compressor = audioContext.createDynamicsCompressor();

            // Set compressor settings for dynamic range compression
            compressor.threshold.value = parseFloat(compressionThresholdInput.value);
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;

            // Create ScriptProcessorNode for custom audio processing
            processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
            processor.onaudioprocess = processAndSendAudio;

            // Initialize FFT using DSP.js
            fft = new FFT(bufferSize, audioContext.sampleRate);

            // Connect audio nodes
            source.connect(compressor);
            compressor.connect(processor);
            processor.connect(audioContext.destination);

            // Start the visualizer
            visualize();

            // WebSocket communication setup
            setupWebSocket();

            isProcessing = true;
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
        });
}

function stopAudio() {
    if (!isProcessing) return;

    audioContext.close();
    socket.close();
    isProcessing = false;
    clearCanvas();
}

function processAndSendAudio(event) {
    const inputBuffer = event.inputBuffer.getChannelData(0);  // Get the audio input buffer
    const noiseThreshold = parseFloat(noiseThresholdInput.value);

    // Perform FFT on inputBuffer using DSP.js
    fft.forward(inputBuffer);

    // Apply noise reduction: Set frequencies below threshold to zero
    const spectrum = fft.spectrum;
    for (let i = 0; i < spectrum.length; i++) {
        if (spectrum[i] < noiseThreshold) {
            spectrum[i] = 0;  // Mute noise
        }
    }

    // Convert Float32Array to Int16Array (16-bit PCM)
    const pcm16Array = new Int16Array(inputBuffer.length);
    for (let i = 0; i < inputBuffer.length; i++) {
        pcm16Array[i] = inputBuffer[i] * 32767;
    }

    // Encode PCM to G.711 A-law
    const encodedAudio = alawmulaw.alaw.encode(pcm16Array);

    // Send the encoded audio data over WebSocket
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(encodedAudio.buffer);
    }

    // Visualization
    visualizeSpectrum(spectrum);
}

function visualize() {
    if (!isProcessing) return;

    requestAnimationFrame(visualize);

    const spectrum = fft.spectrum;

    // Clear the canvas
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / spectrum.length) * 2.5;
    let barHeight;
    let x = 0;

    // Draw the frequency bars
    for (let i = 0; i < spectrum.length; i++) {
        barHeight = spectrum[i] * canvas.height * 50;

        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
    }
}

function visualizeSpectrum(frequencyData) {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / frequencyData.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < frequencyData.length; i++) {
        barHeight = frequencyData[i] * canvas.height * 50;

        canvasCtx.fillStyle = `rgb(${Math.max(0, 255 - barHeight * 2)}, ${Math.min(255, barHeight * 2)}, 50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

function clearCanvas() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
}

function setupWebSocket() {
    socket = new WebSocket('ws://yourserver/audio');

    socket.onopen = function () {
        console.log("WebSocket is connected");
    };

    socket.onmessage = function (event) {
        const encodedAudio = new Uint8Array(event.data);
        const decodedPcm = alawmulaw.alaw.decode(encodedAudio); // Decode G.711 A-law to PCM

        const float32Array = new Float32Array(decodedPcm.length);
        for (let i = 0; i < decodedPcm.length; i++) {
            float32Array[i] = decodedPcm[i] / 32768; // Normalize to [-1.0, 1.0]
        }

        // Create an audio buffer and play it
        const audioBuffer = audioContext.createBuffer(1, float32Array.length, TARGET_SAMPLE_RATE);
        audioBuffer.copyToChannel(float32Array, 0);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    };

    socket.onclose = function () {
        console.log("WebSocket is closed");
    };

    socket.onerror = function (error) {
        console.error('WebSocket Error:', error);
    };
}

// Event listeners for starting/stopping audio processing
document.getElementById('startBtn').addEventListener('click', startAudio);
document.getElementById('stopBtn').addEventListener('click', stopAudio);

// Live updates for threshold sliders
noiseThresholdInput.oninput = function () {
    document.getElementById('noiseThresholdValue').innerText = noiseThresholdInput.value + ' dB';
};

compressionThresholdInput.oninput = function () {
    document.getElementById('compressionThresholdValue').innerText = compressionThresholdInput.value + ' dB';
};
