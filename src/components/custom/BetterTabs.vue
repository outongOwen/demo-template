<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-12
 * BetterTabs.vue
-->
<template>
  <div ref="configurationBodyRef" class="w-full">
    <n-tabs
      ref="tabsInstRef"
      v-model:value="selectedTab"
      type="line"
      animated
      :tabs-padding="10"
      @update:value="handleValueUpdate"
    >
      <n-tab v-for="item in tabsOptions" :key="item.name" :name="item.name">
        {{ item.label }}
      </n-tab>
      <template v-if="!arrivedState.left" #prefix>
        <div
          class="wh-full flex-center cursor-pointer hover:text-primary"
          :native-focus-behavior="true"
          @click="handlePrevious"
        >
          <icon-ooui:previous-ltr />
        </div>
      </template>
      <template v-if="!arrivedState.right" #suffix>
        <div
          :native-focus-behavior="true"
          text
          class="wh-full flex-center cursor-pointer hover:text-primary"
          @click="handleNext"
        >
          <icon-ooui:previous-rtl />
        </div>
      </template>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsInst } from 'naive-ui';
import { useIntersectionObserver, useResizeObserver, useDebounceFn, useVModel } from '@vueuse/core';
export interface TabsOptions {
  name: string | number;
  label: string;
}
interface ArrivedState {
  left: boolean;
  right: boolean;
}
interface Props {
  tabsOptions: TabsOptions[];
  value: string | number;
}
interface Emits {
  (event: 'update:value', value: number | string): void;
  (event: 'change', item: TabsOptions, name: string | number): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const selectedTab = useVModel(props, 'value', emits);
const { tabsOptions } = toRefs(props);
const configurationBodyRef = ref<HTMLElement | null>();
const tabsInstRef = ref<TabsInst | null>(null);
const scrollEl = ref<HTMLElement | null>();
const firstTabEl = ref<HTMLElement | null>();
const lastTabEl = ref<HTMLElement | null>();
const arrivedState = reactive<ArrivedState>({
  left: true,
  right: true
});
const selectedTabIndex = computed((): number => {
  return tabsOptions.value.findIndex(item => item.name === selectedTab.value);
});
const selectedTabEl = computed((): HTMLElement | undefined => {
  const dataNameNodeList = Array.from(
    configurationBodyRef.value!.querySelectorAll('.n-tabs-tab-wrapper > [data-name]')
  ) as HTMLElement[];
  return dataNameNodeList.find(item => {
    return String(item.dataset.name) === String(selectedTab.value);
  });
});
const containerSizeDebouncedFn = useDebounceFn(() => {
  if (selectedTabEl.value) {
    selectedTabEl.value.scrollIntoView({
      behavior: 'smooth'
    });
  }
}, 300);
useResizeObserver(configurationBodyRef, () => {
  containerSizeDebouncedFn();
});
useIntersectionObserver(
  firstTabEl,
  entries => {
    nextTick(() => {
      arrivedState.left = entries[0]?.isIntersecting;
    });
  },
  {
    threshold: 0.9
  }
);
useIntersectionObserver(
  lastTabEl,
  entries => {
    nextTick(() => {
      arrivedState.right = entries[0]?.isIntersecting;
    });
  },
  {
    threshold: 0.9
  }
);
const emitChange = (value: string | number) => {
  const tabItem = tabsOptions.value.find(item => item.name === value);
  tabItem && emits('change', tabItem, value);
};
const handlePrevious = () => {
  if (selectedTabIndex.value > 0) {
    selectedTab.value = tabsOptions.value[selectedTabIndex.value - 1].name;
    nextTick(() => {
      tabsInstRef.value?.syncBarPosition();
      emitChange(selectedTab.value);
    });
  }
};
const handleNext = () => {
  if (selectedTabIndex.value < tabsOptions.value.length - 1) {
    selectedTab.value = tabsOptions.value[selectedTabIndex.value + 1].name;
    nextTick(() => {
      tabsInstRef.value?.syncBarPosition();
      emitChange(selectedTab.value);
    });
  }
};
const handleValueUpdate = (value: string | number) => {
  emitChange(value);
};
watch(
  () => arrivedState.left,
  (leftState, oldLeftState) => {
    if (!leftState && leftState !== oldLeftState) {
      setTimeout(() => {
        selectedTabEl.value!.scrollIntoView({
          behavior: 'smooth'
        });
      }, 200);
    }
  }
);
onMounted(() => {
  nextTick(() => {
    scrollEl.value = configurationBodyRef.value!.querySelector('.v-x-scroll') as HTMLElement;
    firstTabEl.value = configurationBodyRef.value!.querySelector(
      '.n-tabs-tab-wrapper:nth-child(2) >.n-tabs-tab'
    ) as unknown as HTMLElement;
    lastTabEl.value = configurationBodyRef.value!.querySelector(
      `.n-tabs-tab-wrapper:nth-child(${tabsOptions.value.length + 1}) >.n-tabs-tab`
    ) as unknown as HTMLElement;
  });
});
</script>

<style scoped lang="scss"></style>
