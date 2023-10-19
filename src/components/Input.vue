<template>
  <div class="vfield rounded">
    <label
      v-if="label"
      class="vlabel"
    >{{ label }}</label>
    <input
      class="vinput"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [ Number, String, ],
      default: '',
    },
  },
  emits: [ 'update:modelValue', ],
};
</script>

<style scoped>
.vfield {
  display: flex;
  flex-direction: column;
  height: auto;
  flex-grow: 1;
  flex-wrap: wrap;
  min-width: 0;
  width: 100%;
  color: inherit;
  background: rgba(255, 255, 255, 0.08);
  align-items: stretch;
  min-height: 56px;
  margin-bottom: 8px;
  display: flex;
  flex: 1 1 auto;
  position: relative;
}
.vlabel {
  left: 5px;
  right: auto;
  position: absolute;
  transform-origin: top left;
  color: rgba(255, 255, 255, 0.7);
  height: 20px;
  line-height: 20px;
  letter-spacing: normal;
  top: 5;
  max-width: 133%;
  min-height: 8px;
  font-size: 12px;
}
.vinput {
  color: #ffffff;
  margin-top: 22px;
  max-height: 32px;
  flex: 1 1 auto;
  line-height: 20px;
  padding: 8px 5px 8px 5px;
  max-width: 100%;
  min-width: 0px;
  width: 100%;
  background-color: transparent;
  border-style: none;
  font: inherit;
}
</style>
