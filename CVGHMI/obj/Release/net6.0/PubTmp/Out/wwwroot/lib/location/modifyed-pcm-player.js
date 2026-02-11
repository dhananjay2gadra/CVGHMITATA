/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */


function PCMPlayer(option) {
    this.init(option);
}

PCMPlayer.prototype.init = function (option) {
    this.option = Object.assign({}, {
        encoding: "16bitInt",
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000,
        highPassFrequency: 100, // High-pass filter frequency in Hz
        lowPassFrequency: 3000  // Low-pass filter frequency in Hz
    }, option);
    this.samples = new Float32Array();
    this.flush = this.flush.bind(this);
    this.interval = setInterval(this.flush, this.option.flushingTime);
    this.maxValue = this.getMaxValue();
    this.typedArray = this.getTypedArray();
    this.createContext();
    this.createFilters();
};

PCMPlayer.prototype.getMaxValue = function () {
    var maxValues = {
        "8bitInt": 128,
        "16bitInt": 32768,
        "32bitInt": 2147483648,
        "32bitFloat": 1
    };
    return maxValues[this.option.encoding] ? maxValues[this.option.encoding] : maxValues["16bitInt"];
};

PCMPlayer.prototype.getTypedArray = function () {
    var typedArrays = {
        "8bitInt": Int8Array,
        "16bitInt": Int16Array,
        "32bitInt": Int32Array,
        "32bitFloat": Float32Array
    };
    return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays["16bitInt"];
};

PCMPlayer.prototype.createContext = function () {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext);
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 1;
    this.gainNode.connect(this.audioCtx.destination);
    this.startTime = this.audioCtx.currentTime;
};

PCMPlayer.prototype.createFilters = function () {
    // Create high-pass filter
    this.highPassFilter = this.audioCtx.createBiquadFilter();
    this.highPassFilter.type = 'highpass';
    this.highPassFilter.frequency.value = this.option.highPassFrequency;

    // Create low-pass filter
    this.lowPassFilter = this.audioCtx.createBiquadFilter();
    this.lowPassFilter.type = 'lowpass';
    this.lowPassFilter.frequency.value = this.option.lowPassFrequency;

    // Connect filters
    this.highPassFilter.connect(this.lowPassFilter);
    this.lowPassFilter.connect(this.gainNode);
};

PCMPlayer.prototype.isTypedArray = function (data) {
    return data.byteLength && data.buffer && data.buffer.constructor === ArrayBuffer;
};

PCMPlayer.prototype.feed = function (data) {
    if (this.isTypedArray(data)) {
        data = this.getFormatedValue(data);
        var newSamples = new Float32Array(this.samples.length + data.length);
        newSamples.set(this.samples, 0);
        newSamples.set(data, this.samples.length);
        this.samples = newSamples;
    }
};

PCMPlayer.prototype.getFormatedValue = function (data) {
    data = new this.typedArray(data.buffer);
    var float32Data = new Float32Array(data.length);
    var maxAmplitude = 0;

    // Find the maximum amplitude in the PCM data
    for (var i = 0; i < data.length; i++) {
        if (Math.abs(data[i]) > maxAmplitude) {
            maxAmplitude = Math.abs(data[i]);
        }
    }

    // Normalize the PCM data
    for (var i = 0; i < data.length; i++) {
        float32Data[i] = data[i] / maxAmplitude;
    }

    return float32Data;
};

PCMPlayer.prototype.volume = function (value) {
    this.gainNode.gain.value = value;
};

PCMPlayer.prototype.destroy = function () {
    if (this.interval) {
        clearInterval(this.interval);
    }
    this.samples = null;
    this.audioCtx.close();
    this.audioCtx = null;
};

PCMPlayer.prototype.flush = function () {
    if (this.samples.length) {
        var bufferSource = this.audioCtx.createBufferSource();
        var bufferLength = this.samples.length / this.option.channels;
        var audioBuffer = this.audioCtx.createBuffer(this.option.channels, bufferLength, this.option.sampleRate);

        for (var channel = 0; channel < this.option.channels; channel++) {
            var channelData = audioBuffer.getChannelData(channel);
            var sampleIndex = channel;
            var fadeInOutDuration = 50;

            for (var i = 0; i < bufferLength; i++) {
                channelData[i] = this.samples[sampleIndex];

                if (i < fadeInOutDuration) {
                    channelData[i] *= i / fadeInOutDuration;
                } else if (bufferLength - fadeInOutDuration <= i) {
                    channelData[i] *= (bufferLength - i) / fadeInOutDuration;
                }

                sampleIndex += this.option.channels;
            }
        }

        if (this.startTime < this.audioCtx.currentTime) {
            this.startTime = this.audioCtx.currentTime;
        }

        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.highPassFilter); // Connect to high-pass filter
        bufferSource.start(this.startTime);
        this.startTime += audioBuffer.duration;
        this.samples = new Float32Array();
    }
};
