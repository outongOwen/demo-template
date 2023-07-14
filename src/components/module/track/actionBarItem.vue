<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-21
 * actionBarButton.vue
-->
<template>
  <template v-if="!options.isHide">
    <n-popselect
      v-if="options.btnType === 'Popselect'"
      :value="selectValue as (string|number)"
      :options="options.options"
      placement="bottom-start"
      size="small"
      :to="false"
      @update:value="handleValueChange"
      @update:show="handleShowChange"
    >
      <n-popover trigger="hover" placement="top" :to="false" class="px4px! py2px!">
        <template #trigger>
          <n-button
            quaternary
            size="small"
            :focusable="false"
            tag="div"
            :class="{
              'bg-[var(--n-color-focus)]!': (isFocusShow || selectValue) && !options.locked,
              'bg-[rgb(25,25,25)]!': options.locked
            }"
          >
            <Icon
              v-if="(typeof options.icon === 'string' || typeof currentOptions?.icon === 'string') && currentIcon"
              :icon="(currentIcon as string)"
              :class="{ 'color-#fff': options.locked }"
              :style="{ fontSize: `${iconSize}px` }"
            />
            <component
              :is="currentIcon"
              v-if="(typeof options?.icon === 'function' || typeof currentOptions?.icon === 'function') && currentIcon"
              :class="{ 'color-#fff': options.locked }"
              :style="{ fontSize: `${iconSize}px` }"
            />
          </n-button>
        </template>
        <n-text class="text-12px!">{{ currentLabel }}</n-text>
      </n-popover>
    </n-popselect>
    <n-dropdown
      v-if="options.btnType === 'Dropdown'"
      :options="options.options"
      placement="bottom-start"
      size="small"
      @update:show="handleShowChange"
      @select="handleSelect"
    >
      <n-popover trigger="hover" placement="top" :to="false" class="px4px! py2px!">
        <template #trigger>
          <n-button
            quaternary
            size="small"
            tag="div"
            :focusable="false"
            :class="{ 'bg-[var(--n-color-focus)]!': isFocusShow }"
          >
            <n-element tag="div" class="wh-full">
              <Icon
                v-if="typeof options.icon === 'string'"
                :icon="(options.icon as string)"
                :style="{ fontSize: `${iconSize}px` }"
              />
              <component :is="options.icon" v-else :style="{ fontSize: `${iconSize}px` }" />
            </n-element>
          </n-button>
        </template>
        <n-text class="text-12px!">{{ options.label }}</n-text>
      </n-popover>
    </n-dropdown>
    <n-popover v-if="options.btnType === 'Button'" trigger="hover" placement="top" :to="false" class="px4px! py2px!">
      <template #trigger>
        <n-button
          quaternary
          size="small"
          :focusable="false"
          :disabled="options.disabled"
          tag="div"
          :class="{ 'color-primary!': selectValue === options.key }"
          @click="handleChecked"
        >
          <Icon
            v-if="typeof options.icon === 'string'"
            :icon="(options.icon as string)"
            :style="{ fontSize: `${iconSize}px` }"
          />
          <component :is="options.icon" v-else :style="{ fontSize: `${iconSize}px` }" />
        </n-button>
      </template>
      <n-text class="text-12px!">
        {{
          options.checked
            ? selectValue === options.key
              ? `关闭${options.label}`
              : `打开${options.label}`
            : options.label
        }}
      </n-text>
    </n-popover>
    <n-popover
      v-if="options.btnType === 'CPopselect'"
      trigger="hover"
      placement="bottom-start"
      class="p3px!"
      :to="false"
      :show-arrow="false"
      :show="isFocusShow"
      @update:show="handleShowChange"
    >
      <template #trigger>
        <n-popover trigger="hover" placement="top" :to="false" class="px4px! py2px!">
          <template #trigger>
            <div>
              <n-button
                quaternary
                size="small"
                :focusable="false"
                tag="div"
                class="relative of-hidden triangle-sign"
                :class="{
                  'bg-[var(--n-color-focus)]!': (isFocusShow || selectValue) && !options.locked,
                  'bg-[rgb(25,25,25)]!': options.locked
                }"
                @mouseenter="isFocusShow = true"
              >
                <Icon
                  v-if="(typeof options.icon === 'string' || typeof currentOptions?.icon === 'string') && currentIcon"
                  :icon="(currentIcon as string)"
                  :style="{ fontSize: `${iconSize}px` }"
                  :class="{ 'color-#fff': options.locked }"
                />
                <component
                  :is="currentIcon"
                  v-if="
                    (typeof options?.icon === 'function' || typeof currentOptions?.icon === 'function') && currentIcon
                  "
                  :class="{ 'color-#fff': options.locked }"
                  :style="{ fontSize: `${iconSize}px` }"
                />
              </n-button>
            </div>
          </template>
          <n-text class="text-12px!">{{ options.label }}</n-text>
        </n-popover>
      </template>
      <n-space v-for="(item, index) in (options.options as SelectOption[])" :key="index">
        <n-button
          quaternary
          size="small"
          :focusable="false"
          tag="div"
          :class="{
            'text-primary': selectValue === item.value
          }"
          @click="e => handleValueChange(item.value)"
        >
          <Icon
            v-if="typeof item.icon === 'string'"
            :icon="(item.icon as string)"
            :style="{ fontSize: `${iconSize}px` }"
            class="mr5px"
          />
          <component :is="item.icon" v-else :style="{ fontSize: `${iconSize}px` }" class="mr5px" />
          <n-space>
            <n-text
              :class="{
                'text-primary': selectValue === item.value
              }"
            >
              {{ splitLabel(item.label) }}
            </n-text>
            <n-text
              :class="{
                'text-primary': selectValue === item.value
              }"
            >
              {{ splitLabel(item.label, 'post') }}
            </n-text>
          </n-space>
        </n-button>
      </n-space>
    </n-popover>
    <n-space v-if="options.btnType === 'Slider'" :wrap-item="false" :size="0" class="!flex-nowrap">
      <n-popover :to="false" class="px4px! py2px!">
        <template #trigger>
          <n-button
            quaternary
            size="small"
            :focusable="false"
            tag="div"
            :disabled="options.disabled"
            @click="handleMinusClick"
          >
            <icon-ic:baseline-minus class="text-20px" />
          </n-button>
        </template>
        <n-text class="text-12px!">轨道缩小</n-text>
      </n-popover>
      <n-element tag="div" class="h100% w130px flex-center scale-70">
        <n-slider
          :value="sliderValue"
          :max="sliderMaxValue"
          :tooltip="false"
          :min="0"
          :step="0.1"
          :to="false"
          :disabled="options.disabled"
          @update:value="handleSliderChange"
        />
      </n-element>
      <n-popover :to="false" class="px4px! py2px!">
        <template #trigger>
          <n-button
            quaternary
            size="small"
            :focusable="false"
            tag="div"
            :disabled="options.disabled"
            @click="handleAddClick"
          >
            <icon-ic:baseline-add class="text-20px" />
          </n-button>
        </template>
        <n-text class="text-12px!">轨道放大</n-text>
      </n-popover>
    </n-space>
  </template>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { Icon } from '@iconify/vue';
interface Props {
  options: Track.ActionBarItem;
}
const props = defineProps<Props>();
const iconSize = 20;
const sliderMaxValue = 10;
const selectValue = ref(props.options.defaultValue);
const sliderValue = ref<number>(props.options.defaultValue as number);
const isFocusShow = ref(false);
const currentOptions = computed(() => {
  if ((props.options.btnType === 'Popselect' || props.options.btnType === 'CPopselect') && selectValue.value) {
    return (props.options.options as SelectOption[]).find(item => item.value === selectValue.value);
  }
  return undefined;
});
// 选中图标
const currentIcon = computed(() => {
  if (props.options.replaced) {
    return currentOptions.value?.icon ? currentOptions.value.icon : props.options.icon;
  }
  return props.options.icon;
});
// 选中label
const currentLabel = computed(() => {
  if (props.options.replaced) {
    return currentOptions.value?.label ? currentOptions.value.label : props.options.label;
  }
  return props.options.label;
});

const handleShowChange = (value: boolean) => {
  isFocusShow.value = value;
};
const splitLabel = (label: any, place: 'pre' | 'post' = 'pre') => {
  // 匹配所有除了特殊字符和空格的正则表达式
  const regex = /[^ \s!@#$%^&*()-=+[\]{};:'",<.>/?0-9_]+/g;
  const matchValue = label.match(regex);
  if (matchValue) {
    return place === 'pre' ? matchValue[0] : matchValue[1];
  }
  return label;
};
/**
 * Dropdown
 */
const handleSelect = (value: string | number | undefined) => {
  props.options.change && props.options.change(value);
};
/**
 * Popselect
 */
const handleValueChange = (value: string | number | undefined) => {
  if (!props.options.cancelChecked && value === selectValue.value) {
    props.options.btnType === 'CPopselect' && (isFocusShow.value = false);
    return;
  }
  if (props.options.cancelChecked) {
    selectValue.value = value === selectValue.value ? '' : value;
  } else {
    selectValue.value = value;
  }
  props.options.change && props.options.change(selectValue.value);
  props.options.btnType === 'CPopselect' && (isFocusShow.value = false);
};
/**
 * Button
 */
const handleChecked = async () => {
  if (props.options.checked) {
    if (props.options.beforeChange) {
      const next = await props.options.beforeChange(selectValue.value === props.options.key);
      if (next) {
        selectValue.value = selectValue.value ? '' : props.options.key;
        props.options.change && props.options.change(selectValue.value, selectValue.value === props.options.key);
      }
    } else {
      selectValue.value = selectValue.value ? '' : props.options.key;
      props.options.change && props.options.change(props.options.key, selectValue.value === props.options.key);
    }
  } else {
    props.options.change && props.options.change(props.options.key, selectValue.value === props.options.key);
  }
};

/**
 * Slider
 */
const handleSliderChange = (value: number) => {
  sliderValue.value = value;
  props.options.change && props.options.change(sliderValue.value);
};
const handleMinusClick = () => {
  if (sliderValue.value === 0) return;
  (sliderValue.value as number) -= 1;
  props.options.change && props.options.change(sliderValue.value);
};
const handleAddClick = () => {
  if (sliderValue.value === sliderMaxValue) return;
  (sliderValue.value as number) += 1;
  props.options.change && props.options.change(sliderValue.value);
};
</script>
<style lang="scss" scoped>
.n-button {
  @apply important-px-5px;
}
.triangle-sign::after {
  @apply content-[''] absolute bottom-1px right-1px w0 h0 border-b-6px border-b-color-#fff border-l-6px border-l-color-transparent;
}
</style>
