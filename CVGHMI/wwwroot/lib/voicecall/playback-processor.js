class PlaybackProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.bufferQueue = [];
        this.currentBuffer = null;
        this.readIndex = 0;

        this.inputRate = 8000;          // incoming audio sample rate
        this.outputRate = sampleRate;   // AudioContext rate
        this.blockSize = 1024;
        this.maxQueue = 100;

        // Gain control (default 1.5x louder)
        this.gain = 1.5;

        // Filter states (two-stage HPF and LPF)
        this.hp1State = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.hp2State = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.lp1State = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.lp2State = { x1: 0, x2: 0, y1: 0, y2: 0 };

        // Cutoff frequencies
        this.hpCutoff = 300;
        this.lpCutoff = 3400;

        // Compute coefficients
        this.hp1Coeff = this.makeCoeffs("highpass", this.hpCutoff, 0.2);
        //this.hp2Coeff = this.makeCoeffs("highpass", this.hpCutoff, 0.2);
        //this.lp1Coeff = this.makeCoeffs("lowpass", this.lpCutoff, 0.2);
        this.lp2Coeff = this.makeCoeffs("lowpass", this.lpCutoff, 0.2);

        console.log(` this.hp1Coeff = this.makeCoeffs("highpass", this.hpCutoff, 0.4);
        this.hp2Coeff = this.makeCoeffs("highpass", this.hpCutoff, 0.4);
        this.lp1Coeff = this.makeCoeffs("lowpass", this.lpCutoff, 0.4);
        this.lp2Coeff = this.makeCoeffs("lowpass", this.lpCutoff, 0.4); done1`);

        this.port.onmessage = (event) => {
            if (event.data instanceof Float32Array) {
                const resampled = this.resampleBuffer(event.data);
                for (let i = 0; i < resampled.length; i += this.blockSize) {
                    const block = resampled.subarray(i, i + this.blockSize);
                    this.bufferQueue.push(block);
                    if (this.bufferQueue.length > this.maxQueue) this.bufferQueue.shift();
                }
            } else if (event.data.gain !== undefined) {
                this.gain = event.data.gain;
            }
        };
    }

    makeCoeffs(type, f0, Q) {
        const w0 = 2 * Math.PI * f0 / this.outputRate;
        const alpha = Math.sin(w0) / (2 * Q);
        const cosw0 = Math.cos(w0);

        let b0, b1, b2, a0, a1, a2;
        if (type === "lowpass") {
            b0 = (1 - cosw0) / 2;
            b1 = 1 - cosw0;
            b2 = (1 - cosw0) / 2;
            a0 = 1 + alpha;
            a1 = -2 * cosw0;
            a2 = 1 - alpha;
        } else if (type === "highpass") {
            b0 = (1 + cosw0) / 2;
            b1 = -(1 + cosw0);
            b2 = (1 + cosw0) / 2;
            a0 = 1 + alpha;
            a1 = -2 * cosw0;
            a2 = 1 - alpha;
        } else throw new Error("Unsupported filter type");

        return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
    }

    biquadProcess(x, state, coeff) {
        const y = coeff.b0 * x + coeff.b1 * state.x1 + coeff.b2 * state.x2
            - coeff.a1 * state.y1 - coeff.a2 * state.y2;

        state.x2 = state.x1;
        state.x1 = x;
        state.y2 = state.y1;
        state.y1 = y;

        return y;
    }

    filterSample(x) {
        // Two-stage HPF
        const h1 = this.biquadProcess(x, this.hp1State, this.hp1Coeff);
        //const h2 = this.biquadProcess(h1, this.hp2State, this.hp2Coeff);
        // Two-stage LPF
        //const l1 = this.biquadProcess(h2, this.lp1State, this.lp1Coeff);
        const l2 = this.biquadProcess(h1, this.lp2State, this.lp2Coeff);
        return l2;
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
                    for (; outIndex < output.length; outIndex++) output[outIndex] = 0;
                    break;
                }
            }

            const remainingOutput = output.length - outIndex;
            const remainingBuffer = this.currentBuffer.length - this.readIndex;
            const copyCount = Math.min(remainingOutput, remainingBuffer);

            for (let i = 0; i < copyCount; i++) {
                output[outIndex++] = this.currentBuffer[this.readIndex++] * this.gain;
            }

            if (this.readIndex >= this.currentBuffer.length) this.currentBuffer = null;
        }

        return true;
    }
}

registerProcessor("playback-processor", PlaybackProcessor);
