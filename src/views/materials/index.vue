<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * index.vue
-->
<template>
  <Transition>
    <global-material
      :key="firstMenuOption?.key"
      :show-header="firstMenuOption?.areaConfig?.secondMenu && firstMenuOption?.areaConfig?.searchForm"
    >
      <template v-if="firstMenuOption?.areaConfig?.secondMenu" #second-menu>
        <second-menu :first-menu-option="firstMenuOption" />
      </template>
      <template v-if="firstMenuOption?.areaConfig?.searchForm" #search-form>
        <search-form />
      </template>
      <template v-if="firstMenuOption?.areaConfig?.materialBody" #material-body="{ materialBodySize }">
        <material-body :material-body-size="materialBodySize" />
      </template>
    </global-material>
  </Transition>
</template>

<script setup lang="ts">
import GlobalMaterial from '~/src/layouts/common/globalMaterial.vue';
import SearchForm from './components/searchForm.vue';
import SecondMenu from './components/secondMenu.vue';
import MaterialBody from './components/materialBody.vue';
import type { ExtendMenuOptions } from '#/packages.d';

defineOptions({ name: 'Materials' });
interface Props {
  firstMenuOption: ExtendMenuOptions | null;
}
const props = defineProps<Props>();
const { firstMenuOption } = toRefs(props);
</script>
