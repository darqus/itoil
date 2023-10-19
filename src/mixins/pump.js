import svgDisabled from '@/components/icons/Disabled.vue';
import svgBlockOperator from '@/components/icons/BlockOperator.vue';
import svgStopOperator from '@/components/icons/StopOperator.vue';
import svgBlockSystem from '@/components/icons/Disabled.vue';
import svgOverflow from '@/components/icons/Overflow.vue';
import svgPistol from '@/components/icons/Pistol.vue';
import svgWarning from '@/components/icons/Warning.vue';
import svgWeb from '@/components/icons/Web.vue';
import svgYandex from '@/components/icons/Yandex.vue';
import svgBenzuber from '@/components/icons/Benzuber.vue';

export default {
  components: {
    svgDisabled,
    svgBlockOperator,
    svgStopOperator,
    svgBlockSystem,
    svgOverflow,
    svgPistol,
    svgWarning,
    svgWeb,
    svgYandex,
    svgBenzuber,
  },
  data() {
    return {
      operatorID: this.$store.getters.operatorID(),
      isSelfService: this.$store.getters.isSelfService(),
      stopedDate: new Date('9999-12-31T23:59:59').getTime(),
      warnOrderHidden: false,
      warnPistolHidden: false,
    };
  },
  watch: {
    'pump.state': function (newVal, oldVal) {
      this.stopedDate = new Date('9999-12-31T23:59:59').getTime();
      if (newVal === 0 && oldVal !== 0) {
        this.$nextTick(() => {
          this.emitter.emit('onPumpStop', oldVal);
        });
        this.stopedDate = Date.now();
      }
    },
  },
  computed: {
    warnOrder: (data) => ({ 'pump-warn': data.pumpStopedNotComplete, blinking: data.pumpStopedNotComplete && data.warnOrderHidden, }),
    warnPistol: (data) => ({ 'pump-warn': data.pumpStopedComplete, blinking: data.pumpStopedComplete && data.warnPistolHidden, }),
    disabled() {
      return (
        this.pump.pistols.length == 0 ||
        this.pump.err == 1 ||
        (this.pump.state == 3 && this.pump.owner !== '0' && this.pump.owner !== this.operatorID) ||
        (this.isSelfService && this.pump.owner !== '0' && this.pump.owner !== this.operatorID)
      );
    },
    tankDisabled() {
      if (this.pump.raise <= 0) {return false}

      const raiseId = this.pump.raise.toString();
      const pistol = this.pump.pistols.find((pistol) => pistol.id === raiseId);

      if (!pistol) {return true}

      const tank = this.$store.getters.getTank(pistol.tank?.toString());

      if (!tank) {return true}

      return tank.State > 0 || tank.Err > 0;
    },
    showInfo() {
      if (this.pump.state == 2) {return true}
      // налив
      else if (this.pump.state === 0) {return this.pump.owner !== '0'}
      //задача 6876 // отображение информации при завершении налива у всех операторов
      else if (this.pump.state !== 3) {return this.pump.owner === this.operatorID}
      // блокировка оператором
      else if (this.isOwner) {return this.block_system} //задача 6002  this.pump.raise > 0; // блокировка оператором с остановкой налива

      //this.pump.order > this.pump.supply;
      return false;
    },
    inTank: (data) => data.pump.raise > 0,
    isRaise: (data) => data.pump.state !== 3 && !data.isOwner && data.pump.raise > 0,
    isOwner: (data) => data.pump.owner === data.operatorID,
    block_operator: (data) => !data.disabled && data.pump.state === 3 && data.pump.initiator === '1',
    block_system: (data) => !data.disabled && data.pump.state === 3 && data.pump.initiator !== '1',
    stop_operator: (data) => !data.disabled && data.pump.owner !== '0' && data.pump.state === 0 && data.pump.initiator === '1', // && data.pump.raise === -1,
    overflow: (data) => (data.pump.costOrder > 0 ? data.pump.costSupply > data.pump.costOrder : data.pump.supply > data.pump.order),
    complete: (data) =>
      data.pump.state === 0
        ? (data.pump.costOrder > 0 && data.pump.costSupply >= data.pump.costOrder) || (data.pump.order > 0 && data.pump.supply >= data.pump.order)
        : false,
    filled_pt: (data) =>
      data.pump.costOrder > 0
        ? Math.round((data.pump.costSupply * 100) / data.pump.costOrder)
        : data.pump.order > 0
        ? Math.round((data.pump.supply * 100) / data.pump.order)
        : data.complete
        ? 100
        : -1,
    pumpStopedNotComplete() {
      return (
        this.pump.initiator !== '1' &&
        this.stopedDate <= Date.now() &&
        (this.pump.costOrder > 0 ? this.pump.costSupply < this.pump.costOrder : this.pump.supply < this.pump.order)
      );
    },
    pumpStopedComplete: (data) => data.stopedDate <= Date.now() && data.complete,
    payment: (data) => (data.pump?.payment ? data.pump.payment : data.isOwner ? 'Наличные' : '\u00A0'),
    //isWeb: (data) => data.pump?.autoOrder === 4,
    isYandex: (data) => data.pump?.autoOrder === 4,
    isBenzuber: (data) => data.pump?.autoOrder === 5,
  },
};
