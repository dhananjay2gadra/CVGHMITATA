class PlaybackProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferQueue = [];   // queue of small resampled chunks
        this.currentBuffer = null;
        this.readIndex = 0;

        this.inputRate = 8000;          // incoming audio sample rate
        this.outputRate = sampleRate;   // AudioContext rate (usually 44100 or 48000)
        this.blockSize = 1024;          // chunk size for queue
        this.maxQueue = 100;            // max number of blocks to buffer

        // Band-pass filter state (telephone ~300–3400 Hz)
        this.prevIn1 = 0;
        this.prevIn2 = 0;
        this.prevOut1 = 0;
        this.prevOut2 = 0;
        this.updateFilterCoefficients(1010, 0.7); // center ~1800 Hz, Q ~1
        console.log("1010,0.7");

        this.port.onmessage = (event) => {
            if (event.data instanceof Float32Array) {
                // Resample incoming chunk and split into smaller blocks
                const resampled = this.resampleBuffer(event.data);

                for (let i = 0; i < resampled.length; i += this.blockSize) {
                    const block = resampled.subarray(i, i + this.blockSize);
                    this.bufferQueue.push(block);

                    // Prevent unbounded growth
                    if (this.bufferQueue.length > this.maxQueue) {
                        this.bufferQueue.shift();
                    }
                }
            }
        };
    }

    updateFilterCoefficients(f0, Q) {
        const w0 = 2 * Math.PI * f0 / this.outputRate;
        const alpha = Math.sin(w0) / (2 * Q);

        this.b0 = Q * alpha;
        this.b1 = 0;
        this.b2 = -Q * alpha;
        this.a0 = 1 + alpha;
        this.a1 = -2 * Math.cos(w0);
        this.a2 = 1 - alpha;

        // Normalize
        this.b0 /= this.a0;
        this.b1 /= this.a0;
        this.b2 /= this.a0;
        this.a1 /= this.a0;
        this.a2 /= this.a0;
    }

    filterSample(x) {
        const y = this.b0 * x + this.b1 * this.prevIn1 + this.b2 * this.prevIn2
            - this.a1 * this.prevOut1 - this.a2 * this.prevOut2;

        this.prevIn2 = this.prevIn1;
        this.prevIn1 = x;
        this.prevOut2 = this.prevOut1;
        this.prevOut1 = y;

        return y;
    }

    resampleBuffer(input) {
        const ratio = this.outputRate / this.inputRate;
        const newLength = Math.floor(input.length * ratio);
        const output = new Float32Array(newLength);

        for (let i = 0; i < newLength; i++) {
            const srcPos = i / ratio;
            const srcIndex = Math.floor(srcPos);
            const nextIndex = Math.min(srcIndex + 1, input.length - 1);

            const frac = srcPos - srcIndex;
            const sample = input[srcIndex] * (1 - frac) + input[nextIndex] * frac;

            output[i] = this.filterSample(sample);
        }
        return output;
    }

    process(inputs, outputs) {
        const output = outputs[0][0];
        let outIndex = 0;

        while (outIndex < output.length) {
            if (!this.currentBuffer) {
                if (this.bufferQueue.length > 0) {
                    this.currentBuffer = this.bufferQueue.shift();
                    this.readIndex = 0;
                } else {
                    // No data → silence
                    for (; outIndex < output.length; outIndex++) output[outIndex] = 0;
                    break;
                }
            }

            const remainingOutput = output.length - outIndex;
            const remainingBuffer = this.currentBuffer.length - this.readIndex;
            const copyCount = Math.min(remainingOutput, remainingBuffer);

            for (let i = 0; i < copyCount; i++) {
                output[outIndex++] = this.currentBuffer[this.readIndex++];
            }

            if (this.readIndex >= this.currentBuffer.length) {
                this.currentBuffer = null; // finished this block
            }
        }

        return true;
    }
}

registerProcessor("playback-processor", PlaybackProcessor);
