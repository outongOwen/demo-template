<template>
  <div class="w-100%">
    <div class="flex w-100% flex-items-center flex-grow-0">
      <n-input
        ref="inputRef"
        v-model:value="value"
        :class="props.showReset ? 'w-90% m-r-10px' : 'w-100%'"
        autosize
        type="text"
        :allow-input="val => iptHandler"
        :maxlength="props.maxLength"
        :on-blur="setValueToForm"
        placeholder="自定义标签"
      ></n-input>
      <n-button v-if="props.showReset" type="primary">重置</n-button>
    </div>
    <p class="w-100% m-t-10px">
      <n-tag
        v-for="(item, index) in valueLabelArr"
        :key="index"
        type="info"
        class="m-x-5px"
        round
        closable
        @close="handleClose(index)"
      >
        {{ item }}
      </n-tag>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { getProvideFormData } from '@/views/track/trackActionBar/rightActionBar/distributeForm/hooks';

defineOptions({ name: 'InputToTag' });

const message = useMessage();

interface Prop {
  formKey: string;
  showReset?: boolean;
  maxLength?: number;
}
const inputRef = ref();
const props = withDefaults(defineProps<Prop>(), {
  showReset: false,
  maxLength: 30
});

const { injectFormData } = getProvideFormData();
const formData = injectFormData();

const value = ref('');
const valueLabelArr = ref<string[]>([]);

const handleClose = index => {
  valueLabelArr.value.splice(index, 1);
  nextTick(() => {
    inputRef.value.focus();
    inputRef.value.blur();
  });
};
const iptHandler = val => {
  const newVal = val.trim().slice(0, props.maxLength);
  return newVal;
};
const setValueToForm = (val: Event) => {
  if (!val) return;
  const element = val.target as HTMLInputElement;
  if (!element?.value) return;
  if (valueLabelArr.value.length >= 20) {
    message.warning('最多可添加20个');
    return;
  }
  if (valueLabelArr.value.includes(element.value)) {
    value.value = '';
    return;
  }
  valueLabelArr.value.push(element?.value);
  value.value = '';
  nextTick(() => {
    inputRef.value.focus();
    inputRef.value.blur();
  });
};

watch(
  valueLabelArr,
  val => {
    formData.value[props.formKey] = val;
  },
  { deep: true }
);
</script>

<style scoped></style>
