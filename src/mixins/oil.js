export default {
  computed: {
    oilName() {
      return this.oil?.name ?? '';
    },
    oilColor() {
      if (!this.oil) {
        return '#000';
      }

      return this.oil['color'];
    },
  },
};
