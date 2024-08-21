<template>
  <div class="section-body">
    <div class="section-body-inner section-body-inner-primary">
      <ul class="slots">
        <li class="slot" v-for="(e, index) in machineSlots" :key="`${index}-${e}`" :class="'slot-1of6'">
          <div v-if="isRuning" class="slotMachineContainer" :ref="'slotContainer' + index">
            <div class="slot-item" v-for="(e3, i) in characters[index]" :key="`${index}-${i}`"
              :ref="'slotItem-' + index + '-' + i">
              <div class="slot-number">
                <span>{{ e3 }}</span>
              </div>
            </div>
          </div>
          <div v-else class="flip-container">
            <div class="flipper" :class="{ flipped: isFlipping }">
              <div class="front">
                <span>-</span>
              </div>
              <div class="back"> <span>{{ finalResult[index] }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button @click="spin" v-if="!isRuning">Start Draw</button> <button v-if="isCompleted" @click="confirmDraw">Xac
      nhan</button>
  </div>
</template>

<script>
import { playAudioStart, playAudioFinish, playAudioConfirm, playAudioStartSpin } from '../services/audioService'
export default {
  name: 'HelloWorld',
  props: {
    result: Number,
    maxSpins: {
      default: 5
    }
  },
  mounted() {
  },
  data() {
    return {
      isFlipping: false,
      isRuning: false,
      isCompleted: false,
      machineSlots: [1, 2, 3, 4, 5, 6],
      spinCounts: [0, 0, 0, 0, 0, 0],
      spinTimes: [1, 1, 1, 1, 1, 1]
    };
  },
  computed: {
    finalResult() {
      if (!this.result) {
        return [];
      }
      return this.result.toString().split('').map(d => parseInt(d));
    },
    characters() {
      return this.machineSlots.map((e, i) => this.generateRandomCharacters(this.finalResult[i]));
    }
  },
  methods: {
    confirmDraw() {
      playAudioConfirm();
      this.isRuning = false;
      this.isCompleted = false;
      this.isFlipping = true;
      setTimeout(() => {
        this.isFlipping = false;
      });
    },
    getRandomInRange(min, max) {
      return Math.random() * (max - min) + min;
    },
    generateRandomCharacters(finalResult) {
      const possibleChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const characters = this.shuffleArray(possibleChars);
      const resultIndex = characters.indexOf(finalResult);
      // Đưa số mong muốn lên vị trí cuối cùng
      if (resultIndex !== -1) {
        characters.splice(resultIndex, 1);
        characters.push(finalResult);
      }
      console.log(finalResult);
      characters.push(characters[0]); // Lặp lại số đầu để tạo cảm giác liên tục
      return characters;
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí của hai phần tử
      }
      return array;
    },
    spin() {
      playAudioStart();
      this.isRuning = true;
      this.isFlipping = false;
      setTimeout(() => this.startLoop(), 10)
    },
    playSpinAudio(time) {  
      for (let i = 0; i < 10; i++) {
        setTimeout(() => playAudioStartSpin(), i * time / 10.0);
      }
    },
    startLoop() {
      this.spinCounts = [0, 0, 0, 0, 0, 0];
      this.machineSlots.forEach((slot, index) => {
        const element = this.$refs['slotContainer' + index][0];
        const rect = element.getBoundingClientRect();
        const rotate = () => {

          element.style.transition = "none";
          element.style.transform = `translateY(0)`;
          let position = rect.height * 10.0 / 11.0;
          let blur = 0;
          setTimeout(() => {
            if (this.spinCounts[index] == 0) {
              this.spinTimes[index] = this.getRandomInRange(0.8, 1.0);
            }
            else {
              if (this.spinCounts[index] < this.maxSpins - 1) {
                this.spinTimes[index] = 1.8 - Math.abs(this.spinTimes[index]);
                blur = 3 * this.spinTimes[index];
              } else {
                this.spinTimes[index] = this.getRandomInRange(1.5, 1.8);
                blur = 0;
              }
            }

            if (this.spinCounts[index] == this.maxSpins) {
              position = rect.height * 9.0 / 11.0;
            }
            setTimeout(() => element.style.filter = `blur(${blur}px)`, 100);
            element.style.transition = `all ${this.spinTimes[index]}s linear`;
            element.style.transform = `translateY(${-position}px)`;

            if (index == 0) {
              this.playSpinAudio(this.spinTimes[index] * 1000);
            }
          });
        };

        element.addEventListener('transitionend', () => {
          this.spinCounts[index]++;
          if (this.spinCounts[index] > this.maxSpins) {
            this.isCompleted = true;
            if (index == 0) {
              playAudioFinish();
            }
            return;
          }
          rotate();
        });
        rotate();
      });
    }
  }
}
</script>

<style>
.slots {
  list-style: none outside none;
}

.slots {
  background: #003c6a;
  padding: 11px 0;
  border-radius: 10px;
  text-align: center;
  font-size: 0;
  line-height: 0;
}

.slot {
  width: 60px;
  display: inline-block;
  margin: 0 11px 0 10px;
  background: #01518e;
  border-radius: 5px;
  text-align: center;
  overflow: hidden;
}

.slot,
.slot .slot-item {
  height: 90px;
  position: relative;
}

.slot .slot-item {
  display: block;
  width: 100%;
}

.slot-number {
  font-size: 40px;
  font-weight: 700;
  color: #ffd602;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.slot-number img {
  width: 35%;
  opacity: 0.25;
}


@media (max-width: 768px) {
  .slots {
    background: none;
    border-radius: 0;
    overflow: hidden;
    text-align: center;
  }

  .slot {
    background: #003c6a;
    border: 3px solid #f5db79;
    border-radius: 7px;
    margin: 0 10px;
    display: none;
  }

  .slot:last-child,
  .slot:nth-last-child(2),
  .slot:nth-last-child(3) {
    display: inline-block;
  }

  .slot a {
    height: 208px;
    width: 150px;
  }
}

.section-body-inner {
  overflow: hidden;
  border-radius: 10px;
  background: #003c6a;
  padding: 0 7px;
  border: 1px solid #003c6a;
}

.section-body-inner-primary {
  padding: 0 4px;
}

.slotMachineContainer {}


.slotMachineBlurSlow {
  filter: blur(1px) !important;
}

.flip-container {
  perspective: 1000px;
  width: 100%;
  height: 100%;
}

.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: 0.6s;
  transform-style: preserve-3d;
}

.flipper.flipped {
  transform: rotateY(180deg);
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 40px;
  font-weight: 700;
  color: #ffd602;
}

.back {
  transform: rotateY(180deg);
}

.front {}
</style>
