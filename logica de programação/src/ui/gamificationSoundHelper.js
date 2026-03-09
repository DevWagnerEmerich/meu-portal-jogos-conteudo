export function playAchievementSound() {
    const ctx = window.AudioContext || window.webkitAudioContext;
    if (!ctx) return;
    const audioCtx = new ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const playFreq = (freq, type, time, dur, vol) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + time);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + time + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + time);
        osc.stop(audioCtx.currentTime + time + dur);
    };

    // Happy little major arpeggio
    playFreq(440, 'sine', 0, 0.3, 0.1);    // A4
    playFreq(554.37, 'sine', 0.1, 0.3, 0.1); // C#5
    playFreq(659.25, 'sine', 0.2, 0.5, 0.1); // E5
    playFreq(880, 'sine', 0.3, 0.8, 0.12);   // A5
}
