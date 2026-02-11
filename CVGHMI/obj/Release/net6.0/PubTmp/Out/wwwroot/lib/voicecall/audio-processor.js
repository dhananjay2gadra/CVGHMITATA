class AudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this.sampleRate = options.processorOptions.sampleRate;
        this.amplitudeThreshold = options.processorOptions.amplitudeThreshold;
        this.targetSampleRate = options.processorOptions.targetSampleRate;

        // Initialize a buffer and index to collect audio samples
        this.buffer = new Float32Array(1850);
        this.bufferIndex = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0][0];
        if (input) {
            // Fill the buffer with incoming samples
            for (let i = 0; i < input.length; i++) {
                this.buffer[this.bufferIndex++] = input[i];

                // If the buffer is full, process it
                if (this.bufferIndex >= 1850) {
                    const downsampledBuffer = this.downsampleBuffer(this.buffer, this.sampleRate, this.targetSampleRate);
                    const amplitude = Math.max(...downsampledBuffer.map(Math.abs));

                    if (amplitude > this.amplitudeThreshold) {
                        // Send the downsampled buffer back to the main thread
                        this.port.postMessage(downsampledBuffer);
                    }
                    // Reset buffer index for the next batch
                    this.bufferIndex = 0;
                }
            }
        }
        return true; // Keep the processor alive
    }

    downsampleBuffer(buffer, sampleRate, targetSampleRate) {
        if (targetSampleRate >= sampleRate) {
            throw new Error('Target sample rate should be lower than original sample rate');
        }

        const sampleRateRatio = sampleRate / targetSampleRate;
        const newLength = Math.round(buffer.length / sampleRateRatio);
        const result = new Float32Array(newLength);
        let offsetResult = 0;
        let offsetBuffer = 0;

        while (offsetResult < result.length) {
            const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            let accum = 0, count = 0;
            for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                accum += buffer[i];
                count++;
            }
            result[offsetResult] = accum / count;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    }
}

registerProcessor('audio-processor', AudioProcessor);
