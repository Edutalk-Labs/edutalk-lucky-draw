const play = ({ path }) => {
  const audio = new Audio(path);
  audio.currentTime  = 0;
  return audio.play();
};
const playAudioStart = () => play({ path: "./audio/sm-spin.mp3" });
const playAudioFinish = () => play({ path: "./audio/game-tada.mp3" });
const playAudioSpin = () => play({ path: "./audio/loop.mp3" }); 
const playAudioStartSpin = () => play({ path: "./audio/tack.mp3" });
const playAudioConfirm = () => play({ path: "./audio/sm-spin.mp3" });
module.exports = { playAudioStart, playAudioFinish, playAudioSpin, playAudioConfirm, playAudioStartSpin };
