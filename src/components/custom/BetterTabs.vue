<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-12
 * BetterTabs.vue
-->
<template>
  <div ref="tabContainerRef" class="wh-full pb10px">
    <n-tabs
      ref="tabsInstRef"
      v-model:value="selectedTab"
      :type="type"
      :animated="animated"
      :tabs-padding="10"
      @update:value="handleValueUpdate"
    >
      <n-tab-pane v-for="item in tabsOptions" :key="item.name" :name="item.name" :tab="item.label">
        <div :style="{ height: `${tabPaneHeight}px` }">
          <component :is="item.renderComponent" v-if="item?.renderComponent" :item="item" />
        </div>
      </n-tab-pane>
      <template #prefix>
        <div
          v-show="!arrivedState.left"
          class="wh-full flex-center cursor-pointer hover:text-primary px-5px select-unset"
          :native-focus-behavior="true"
          @click="handlePrevious"
        >
          <icon-ooui:previous-ltr />
        </div>
      </template>
      <template #suffix>
        <div
          v-show="!arrivedState.right"
          :native-focus-behavior="true"
          text
          class="wh-full flex-center cursor-pointer hover:text-primary px-5px select-unset"
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
import { useElementSize, useIntersectionObserver, useResizeObserver, useDebounceFn, useVModel } from '@vueuse/core';
defineOptions({ name: 'BetterTabs' });
export interface BetterTabsOptions {
  name: string | number;
  label: string;
  renderComponent: Component | null;
}
interface ArrivedState {
  left: boolean;
  right: boolean;
}
interface Props {
  tabsOptions: BetterTabsOptions[];
  value: string | number;
  type?: 'line' | 'card';
  animated?: boolean;
}
interface Emits {
  (event: 'update:value', value: number | string): void;
  (event: 'change', item: BetterTabsOptions, name: string | number): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line'
});
const emits = defineEmits<Emits>();
const selectedTab = useVModel(props, 'value', emits);
const { tabsOptions, type, animated } = toRefs(props);
const tabContainerRef = ref<HTMLElement | null>();
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
    tabContainerRef.value!.querySelectorAll('.n-tabs-tab-wrapper > [data-name]')
  ) as HTMLElement[];
  return dataNameNodeList.find(item => {
    return String(item.dataset.name) === String(selectedTab.value);
  });
});
const tabsNavTopEl = computed((): HTMLElement | null => {
  return tabContainerRef.value?.querySelector('.n-tabs-nav--top') || null;
});
const { height: tabsNavTopViewHeight } = useElementSize(tabsNavTopEl);
const { height: tabContainerViewHeight } = useElementSize(tabContainerRef);
const tabPaneHeight = computed(() => {
  return tabContainerViewHeight.value! - tabsNavTopViewHeight.value! - 10;
});

const containerSizeDebouncedFn = useDebounceFn(() => {
  if (selectedTabEl.value) {
    selectedTabEl.value.scrollIntoView({
      behavior: 'smooth'
    });
  }
}, 200);

useResizeObserver(tabContainerRef, () => {
  containerSizeDebouncedFn();
});

useIntersectionObserver(
  firstTabEl,
  entries => {
    console.log(entries[0]);
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
    scrollEl.value = tabContainerRef.value!.querySelector('.v-x-scroll') as HTMLElement;
    firstTabEl.value = tabContainerRef.value!.querySelector(
      '.n-tabs-tab-wrapper:nth-child(2) >.n-tabs-tab'
    ) as unknown as HTMLElement;
    lastTabEl.value = tabContainerRef.value!.querySelector(
      `.n-tabs-tab-wrapper:nth-child(${tabsOptions.value.length + 1}) >.n-tabs-tab`
    ) as unknown as HTMLElement;
  });
});
</script>

<style scoped lang="scss">
:deep(.n-tabs--card-type) {
  .n-tabs-scroll-padding {
    @apply important:w0;
  }
  .n-tabs-tab-pad {
    @apply important:border-0;
  }
  .n-tabs-tab {
    @apply important:border-0 important:rounded-none important:bg-transparent hover:text-primary dark:hover:important-bg-dark hover:important-bg-#fff;
  }
  .n-tabs-tab--active {
    @apply dark:important:bg-dark important-bg-#fff;
  }
  .v-x-scroll {
    @apply dark:important-bg-[rgb(25,25,25)] important-bg-[rgb(90,90,90)];
  }
  .n-tabs-nav__prefix,
  .n-tabs-nav__suffix {
    @apply important:border-0;
  }
  .n-tabs-pad {
    @apply important:border-0;
  }
  // .n-tabs-tab-pad {
  //   display: none;
  // }
}
:deep(.n-tabs) {
  @apply wh-full;
  .n-tabs-nav__prefix {
    @apply important:pr-0;
  }
  .n-tabs-nav__suffix {
    @apply important:pl-0;
  }
  .n-tab-pane {
    @apply important:wh-full;
  }
}
</style>
