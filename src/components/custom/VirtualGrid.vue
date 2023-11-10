<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-06
 * VirtualGrid.vue
-->
<template>
  <div
    ref="virtualGridRef"
    class="box-border"
    :style="{
      height: `${layoutData.totalHeight}px`,
      paddingTop: `${
        renderData !== null && renderData.firstRenderedRowOffset !== null
          ? renderData.firstRenderedRowOffset + 'px'
          : '0px'
      }`
    }"
  >
    <div
      class="grid items-center"
      :style="{
        'grid-template-columns': `repeat(${configData.columnCount}, 1fr)`,
        gap: `${configData.gridGap}px`
      }"
    >
      <div
        v-for="item in renderData.cellsToRender"
        :key="item.id"
        class="select-none"
        :style="{
          height: `${item.height}px`,
          'grid-column-start': item.columnNumber,
          'grid-column-end': item.columnNumber + item.columnSpan,
          'grid-row-start': getGridRowStart(item, renderData)
        }"
      >
        <slot :item="item">
          <component :is="item.renderComponent" v-if="item.renderComponent" :item="item" />
          <!-- {{ item.renderComponent }} -->
        </slot>
      </div>
    </div>
    <div v-if="updateLock && !bottomReached" :style="{ height: `${updateTriggerMargin}px` }" class="wh-full">
      <div v-if="updateLock && !errorLock" class="wh-full flex-center flex-row">
        <n-spin :size="18" class="mr5px" />
        <n-text>{{ '加载中...' }}</n-text>
      </div>
      <div v-if="updateLock && errorLock" class="flex-center wh-full">
        <n-text class="dark:color-[rgba(255,255,255,0.2)]">加载失败，请</n-text>
        <n-button text type="primary" @click="resetLoad">重试</n-button>
      </div>
    </div>
    <div v-if="bottomReached" :style="{ height: `${updateTriggerMargin}px` }" class="box-border wh-full flex-center">
      <n-text class="dark:color-[rgba(255,255,255,0.2)]">- 已加载全部内容 -</n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VNodeChild } from 'vue';

defineOptions({ name: 'VirtualGrid' });
export interface Item {
  id: string;
  injected?: Record<string, unknown>;
  height: number;
  width?: number;
  columnSpan: number;
  newRow?: boolean;
  renderComponent?: Component | VNodeChild;
}
interface ContainerData {
  windowSize: ElementSize;
  windowScroll: ElementScroll;
  elementWindowOffset: number;
  elementSize: ElementSize;
}
interface ElementSize {
  width: number;
  height: number;
}

interface ElementScroll {
  x: number;
  y: number;
}
interface ConfigData {
  windowMargin: number;
  gridGap: number;
  columnCount: number;
  entries: Item[];
}
interface Cell extends Item {
  columnNumber: number;
  rowNumber: number;
  offset: number;
}
interface LayoutData {
  totalHeight: number;
  cells: Cell[];
}

interface RenderData {
  cellsToRender: Cell[];
  firstRenderedRowNumber: number | null;
  firstRenderedRowOffset: number | null;
}
interface ExposeAPI {
  resetGrid: () => void;
}
interface Props {
  items: Item[];
  scrollElement?: HTMLElement | null;
  updateTriggerMargin?: number;
  updateFunction?: () => Promise<boolean>;
  getGridGap?: (elementWidth: number, windowHeight: number) => number;
  getColumnCount?: (elementWidth: number) => number;
  getItemRatioHeight?: (height: number, width: number, columnWidth: number) => number;
  getWindowMargin?: (windowHeight: number) => number;
}
const props = withDefaults(defineProps<Props>(), {
  scrollElement: null,
  updateTriggerMargin: 50,
  updateFunction: () => Promise.resolve(true),
  getGridGap: () => 10,
  getItemRatioHeight: (height: number, width: number, columnWidth: number) => {
    const ratio = height / width;
    return Math.round(columnWidth * ratio);
  },
  getColumnCount: (elementWidth: number) => {
    return elementWidth / 200;
  },
  getWindowMargin: (windowHeight: number) => {
    return windowHeight / 2;
  }
});
const { items, updateTriggerMargin, scrollElement } = toRefs(props);
const virtualGridRef = ref<HTMLElement | null>();
const updateLock = ref(false);
const errorLock = ref(false);
const bottomReached = ref(false);
const containerData = reactive<ContainerData>({
  windowSize: { height: 0, width: 0 },
  windowScroll: { x: 0, y: 0 },
  elementWindowOffset: 0,
  elementSize: { height: 0, width: 0 }
});
const getColumnWidth = (columnCount: number | null, gridGap: number | null, elementWidth: number | null) => {
  if (columnCount === null || gridGap === null || elementWidth === null) {
    return 0;
  }
  const totalGapSpace = (columnCount - 1) * gridGap;
  const columnWidth = Math.round((elementWidth - totalGapSpace) / columnCount);

  return columnWidth;
};
const getGridRowStart = (cell: Cell, renderData: RenderData | null) => {
  if (renderData === null) {
    return undefined;
  }
  const offset = renderData.firstRenderedRowNumber !== null ? renderData.firstRenderedRowNumber - 1 : 0;
  const gridRowStart = cell.rowNumber - offset;
  return `${gridRowStart}`;
};
// const isSameElementSize = (a: ElementSize, b: ElementSize) => {
//   return a.width === b.width && a.height === b.height;
// };

const getWindowSize = (): ElementSize => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

const getElementSize = (element: Element): ElementSize => {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height
  };
};

// const isSameElementScroll = (a: ElementScroll, b: ElementScroll) => {
//   return a.x === b.x && a.y === b.y;
// };

const getWindowScroll = (): ElementScroll => {
  return {
    x: window.scrollX,
    y: window.scrollY
  };
};

const getElementOffset = (element: Element) => {
  return window.scrollY + element.getBoundingClientRect().top;
};

const computeConfigData = (container: ContainerData, itemList: Item[]): ConfigData => {
  if (container === null || itemList === null) {
    return {
      windowMargin: 0,
      gridGap: 0,
      columnCount: 1,
      entries: []
    };
  }

  const elementWidth = container.elementSize ? container.elementSize.width : 0;

  const windowMargin = props.getWindowMargin(container.windowSize.height);

  const gridGap = props.getGridGap(elementWidth, container.windowSize.height);

  const columnCount = props.getColumnCount(elementWidth);

  const columnWidth = getColumnWidth(columnCount, gridGap, elementWidth);

  const entries = itemList.map(item => {
    // if width is not set we leave the height untouched
    if (!item.width) {
      return item;
    }

    // we make sure the width takes the full column space and adjust the height based on ratio
    const imageWidth = columnWidth * item.columnSpan + gridGap * (item.columnSpan - 1);
    return {
      ...item,
      height: props.getItemRatioHeight(item.height, item.width, imageWidth),
      width: imageWidth
    };
  });

  return {
    windowMargin,
    gridGap,
    columnCount,
    entries
  };
};
const computeLayoutData = (config: ConfigData): LayoutData => {
  if (config === null) {
    return { cells: [], totalHeight: 0 };
  }

  let currentRowNumber = 1;
  let prevRowsTotalHeight = 0;
  let currentRowMaxHeight = 0;

  let columnShift = 0;

  const cells: Cell[] = config.entries.map((entry, index) => {
    const { columnCount, gridGap } = config;

    let columnSpanRecompute = entry.columnSpan;
    let heightRecompute = entry.height;

    // if the column span is 0 or negative we assume it is full width
    if (columnSpanRecompute < 1) {
      columnSpanRecompute = columnCount;
    }

    const distanceToRowStart = (index + columnShift) % columnCount;
    if (entry.newRow && distanceToRowStart !== 0) {
      columnShift += columnCount - distanceToRowStart;
    }

    const shiftedIndex = index + columnShift;
    const columnNumber = (shiftedIndex % columnCount) + 1;
    const rowNumber = Math.floor(shiftedIndex / columnCount) + 1;

    // here we check that an image is not going out of the grid, if yes we resize it
    if (columnNumber + columnSpanRecompute > columnCount + 1) {
      const overlapNumber = columnNumber + columnSpanRecompute - columnCount - 1;
      const overlapRatio = overlapNumber / columnSpanRecompute;
      heightRecompute *= 1 - overlapRatio;

      columnSpanRecompute -= overlapNumber;
    }

    // we need to count the shift created by multiple column objects
    if (columnSpanRecompute > 1) {
      columnShift += columnSpanRecompute - 1;
    }

    if (rowNumber !== currentRowNumber) {
      currentRowNumber = rowNumber;
      prevRowsTotalHeight += currentRowMaxHeight + gridGap;
      currentRowMaxHeight = 0;
    }

    const offset = prevRowsTotalHeight;
    const height = Math.round(heightRecompute);

    currentRowMaxHeight = Math.max(currentRowMaxHeight, height);

    return { ...entry, columnNumber, rowNumber, offset, height, columnSpan: columnSpanRecompute };
  });

  const totalHeight = prevRowsTotalHeight + currentRowMaxHeight;

  return { cells, totalHeight };
};
const computeRenderData = (config: ConfigData, container: ContainerData, layout: LayoutData): RenderData => {
  if (layout === null || config === null) {
    return { cellsToRender: [], firstRenderedRowNumber: 0, firstRenderedRowOffset: 0 };
  }
  const cellsToRender: Cell[] = [];
  let firstRenderedRowNumber: null | number = null;
  let firstRenderedRowOffset: null | number = null;

  if (container.elementWindowOffset !== null) {
    const elementWindowOffset = container.elementWindowOffset;

    for (const cell of layout.cells) {
      const cellTop = elementWindowOffset + cell.offset;
      const cellBottom = cellTop + cell.height;

      const windowTop = container.windowScroll.y;
      const windowBottom = windowTop + container.windowSize.height;

      const renderTop = windowTop - config.windowMargin;
      const renderBottom = windowBottom + config.windowMargin;

      // eslint-disable-next-line no-continue
      if (cellTop > renderBottom) continue;
      // eslint-disable-next-line no-continue
      if (cellBottom < renderTop) continue;

      if (firstRenderedRowNumber === null) {
        firstRenderedRowNumber = cell.rowNumber;
      }

      if (cell.rowNumber === firstRenderedRowNumber) {
        firstRenderedRowOffset = firstRenderedRowOffset ? Math.min(firstRenderedRowOffset, cell.offset) : cell.offset;
      }
      cellsToRender.push(cell);
    }
  }

  return { cellsToRender, firstRenderedRowNumber, firstRenderedRowOffset };
};
const computeContainerData = (): void => {
  if (!virtualGridRef.value) {
    return;
  }

  const windowSize = getWindowSize();
  const windowScroll = getWindowScroll();
  const elementWindowOffset = getElementOffset(virtualGridRef.value);
  const elementSize = getElementSize(virtualGridRef.value);
  Object.assign(containerData, { windowSize, windowScroll, elementWindowOffset, elementSize });
};
const configData = computed((): ConfigData => {
  return computeConfigData(containerData, items.value);
});
const layoutData = computed((): LayoutData => {
  return computeLayoutData(configData.value);
});
const renderData = computed((): RenderData => {
  return computeRenderData(configData.value, containerData, layoutData.value);
});
const loadMoreDataAsync = async (): Promise<void> => {
  try {
    computeContainerData();
    const windowTop = containerData.windowScroll.y;
    const windowBottom = windowTop + containerData.windowSize.height;
    const bottomTrigger = Math.max(
      0,
      containerData.elementWindowOffset + containerData.elementSize.height - updateTriggerMargin.value
    );
    if (!bottomReached.value && windowBottom >= bottomTrigger && !updateLock.value) {
      updateLock.value = true;
      errorLock.value = false;
      // debugLog(this.debug, 'Loading next batch');
      const isLastBatch = await props.updateFunction();
      if (isLastBatch) {
        // debugLog(this.debug, 'Bottom reached');
        nextTick(() => {
          bottomReached.value = true;
        });
      }
      nextTick(() => {
        updateLock.value = false;
      });
      await loadMoreDataAsync();
    }
  } catch (error) {
    errorLock.value = true;
  }
};

const resize = (): void => {
  nextTick(async () => {
    loadMoreDataAsync();
  });
};

const scroll = (): void => {
  nextTick(async () => {
    loadMoreDataAsync();
  });
};
const resetLoad = (): void => {
  // bottomReached.value = false;
  errorLock.value = false;
  updateLock.value = false;
  nextTick(async () => {
    loadMoreDataAsync();
  });
};
const initializeGrid = (): void => {
  computeContainerData();
  nextTick(async () => {
    loadMoreDataAsync();
  });
};
onMounted(() => {
  initializeGrid();
  window.addEventListener('resize', resize);
  (scrollElement.value ?? window).addEventListener('scroll', scroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  (scrollElement.value ?? window).removeEventListener('scroll', scroll);
});
defineExpose<ExposeAPI>({
  resetGrid: resetLoad
});
</script>

<style scoped></style>
