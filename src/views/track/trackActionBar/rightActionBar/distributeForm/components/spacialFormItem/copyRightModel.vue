<template>
  <n-modal
    v-model:show="showModal"
    title="选择版权"
    preset="dialog"
    :show-icon="false"
    :z-index="3000"
    :on-close="closeFn"
    style="width: 1280px"
  >
    <div class="h-40vh">
      <n-form ref="searchForm" :model="form" label-placement="left" label-width="80">
        <n-grid x-gap="12" :cols="3">
          <n-form-item-gi v-if="props.isCmam" label="CPID">
            <n-input v-model:value="form.cpId" disabled></n-input>
          </n-form-item-gi>
          <n-form-item-gi
            v-if="props.isCmam"
            label="授权方式"
            :rule="{ required: props.isCmam, message: '请选择授权方式', trigger: ['change'] }"
          >
            <n-select
              v-model:value="form.authorizationWay"
              clearable
              :options="authorizationWayList"
              label-field="name"
              value-field="code"
              style="width: 100%"
              placeholder="请选择授权方式"
            ></n-select>
          </n-form-item-gi>
          <n-form-item-gi v-if="props.isCmam" label="版权名称">
            <n-input v-model:value="form.copyrightName" placeholder="请输入版权名称"></n-input>
          </n-form-item-gi>
          <n-form-item-gi
            label="版权ID"
            :rule="{ required: props.isCmam, message: '请输入正确的版权ID', trigger: ['change'] }"
          >
            <n-input
              v-model:value="form.copyrightId"
              :allow-input="formCopyrightIdNum"
              placeholder="请输入版权ID"
            ></n-input>
          </n-form-item-gi>
          <n-gi>
            <n-button class="m-r-15px" @click="resetForm">重置</n-button>
            <n-button type="primary" @click="getCopyRightList">搜索</n-button>
          </n-gi>
        </n-grid>
      </n-form>
      <n-data-table
        v-model:checked-row-keys="multipleSelection"
        :columns="columns"
        :data="queryCopyRightList"
        :pagination="pagination"
        :on-update:page="changePage"
      ></n-data-table>
    </div>
    <template #action>
      <div>
        <n-button class="m-r-15px" @click="closeFn">取消</n-button>
        <n-button type="primary" @click="saveCopyId">确认</n-button>
      </div>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
import type { Ref } from 'vue';
import { useMessage } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { jsonToQuery } from '@/utils';
import { getDistributeEnum } from '@/service/api';
const showModal = true;
interface RowData {
  copyrightId: string;
  copyrightName: string;
  cpId: string;
  beginDate: string;
  endDate: string;
  authorizationWay: string;
  miguUseStatus: string;
  copyrightStatus: string;
  useStatus: string;
}
const columnsAll: DataTableColumns<RowData> = [
  {
    type: 'selection',
    multiple: false
  },
  {
    title: '版权ID',
    key: 'copyrightId'
  },
  {
    title: '版权名称',
    key: 'copyrightName'
  },
  {
    title: 'CPID',
    key: 'cpId'
  },
  {
    title: '版权开始时间',
    key: 'beginDate'
  },
  {
    title: '版权结束时间',
    key: 'endDate'
  },
  {
    title: '授权方式',
    key: 'authorizationWay',
    render: (row: RowData) => {
      const obj: { [key: string]: string } = { '1': '单片授权', '2': '集体授权', '3': '频道授权' };
      return obj[row.authorizationWay];
    }
  },
  {
    title: '咪咕可使用版权终端',
    key: 'miguUseStatus'
  },
  {
    title: '审核状态',
    key: 'copyrightStatus',
    render: (row: RowData) => {
      const obj: { [key: string]: string } = {
        '0': '待提交',
        '1': '一级审核',
        '2': '审核通过',
        '3': '审核驳回',
        '4': '二级审核'
      };
      return obj[row.copyrightStatus];
    }
  },
  {
    title: '版权可用状态',
    key: 'useStatus'
  }
];
const pagination = ref({
  pageCount: 10
});
const changePage = (page: number) => {
  form.page = page;
  getCopyRightList();
};
const authorizationWayList = [
  { name: '单片授权', code: '1' },
  { name: '集体授权', code: '2' },
  { name: '频道授权', code: '3' }
];
interface Props {
  isCmam: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isCmam: false
});
const columns: Ref<DataTableColumns<RowData>> = ref([]);
const queryCopyRightList = ref([]) as Ref<RowData[]>;
const form = reactive<{ [key: string]: any }>({
  page: 1,
  rows: 10
});
const message = useMessage();
const multipleSelection = ref();
const getCopyRightList = async () => {
  const flag = await searchForm.value.validate();
  if (!flag) return;
  const parmStr = jsonToQuery({
    ...form
  });
  const data = await getDistributeEnum({
    parmStr,
    urlCode: props.isCmam ? 'cmam_copyRight' : 'copyRight'
  });
  if (data.success) {
    queryCopyRightList.value = data.result.content || [];
  }
};
const searchForm = ref();
const resetForm = () => {
  form.page = 1;
  form.pageSize = 1;
  form.cpId = '';
  form.authorizationWay = '';
  form.copyrightName = '';
  form.copyRightId = '';
};
// 版权ID只能输入数字
const formCopyrightIdNum = (val: string) => {
  return !val || /[^\d]/g.test(val);
};
const emit = defineEmits<{
  (e: 'closeModal'): void;
  (e: 'setCopyRightId', selected: any): void;
}>();
const saveCopyId = () => {
  if (!multipleSelection.value) {
    return message.warning('请选择版权');
  }
  const selected = queryCopyRightList.value.find((v: any) => v.copyrightId === multipleSelection);
  emit('setCopyRightId', selected);
};
const closeFn = () => {
  emit('closeModal');
};
onMounted(() => {
  if (props.isCmam) {
    columns.value = columnsAll.filter((v: any) => v.type !== 'miguUseStatus' && v.type !== 'useStatus') || [];
  } else {
    columns.value = columnsAll || [];
  }
});
</script>
