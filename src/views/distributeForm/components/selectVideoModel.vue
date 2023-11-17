<template>
  <n-modal
    :z-index="3000"
    preset="dialog"
    :showIcon="false"
    v-model:show="showModal"
    style="width: 1080px"
    :mask-closable="false"
    :block-scroll="false">
    <template #header>
      <div class="text-18px h-30px">长视频选择</div>
    </template>
    <div>
      <div class="flex">
        <n-input autosize class="m-b-15px min-w-300px" v-model:value="searchObj.videoId"></n-input>
        <div>
          <n-button @click="getList" type="primary" class="ml-15px">搜索</n-button>
          <n-button @click="resetSearchForm" class="ml-15px">重置</n-button>
        </div>
      </div>
      <n-data-table
        :bordered="false"
        :rowKey="rowKey"
        v-model:checked-row-keys="checkedRowKeys"
        :columns="createColumns"
        :data="mediaList"
        max-height="70vh"
        min-height="70vh"
        virtual-scroll
        remote
        :pagination="pagination"
        :on-update:page="changePage"
      />
    </div>
    <template #action>
      <n-button
        size="small"
        style="margin-top: 10px; margin-right: 20px"
        @click="closeModal"
      >取消</n-button
      >
      <n-button
        size="small"
        type="primary"
        style="margin-top: 10px; margin-right: 20px"
        @click="sure"
      >确认</n-button
      >
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {jsonToQuery} from "@/utils";
import {esSearchLongVideo, getDistributeEnum} from "@/service/api/index";
import type { DataTableColumns } from 'naive-ui'
import {primaryClassifyPri, totalStrategyPri} from "@/views/distributeForm/hooks/provide";
defineOptions({name: 'selectVideoModel'});

const { injectTotalStrategy } = totalStrategyPri()
const totalStrategyIdList = injectTotalStrategy()
const { injectPrimaryClassify } = primaryClassifyPri()
const primaryClassifyData = injectPrimaryClassify()
const showModal = ref(false)
defineExpose({showModal})
const rowKey = (row: any) => row.videoId
const pagination = ref({
  pageCount: 10,
});
type RowData = {
  videoId: number
  videoTitle?: string
  picturePreviewUrl?: string
  firstClassCode?: string
  secondClassCode?: string
  videoTransStrategyId?: string
}
const closeModal = () => {
  showModal.value = false
}
const checkedRowKeys = ref([])
const createColumns: DataTableColumns<RowData> = [
  {
    type: 'selection',
    multiple: false,
  },
  {
    title: '视频封面图',
    key: 'picturePreviewUrl',
    width: 180,
    render(row: any) {
      return h('img',{
        src: row.picturePreviewUrl || ''
      })
    }
  },
  {
    title: '视频ID',
    key: 'videoId',
    render(row: any) {
      return row.videoId?row.videoId:'————'
    }
  },
  {
    title: '视频名称',
    key: 'videoTitle',
    width: 300,
    ellipsis: {
      tooltip: true
    },
    render(row: any) {
      return row.videoTitle?row.videoTitle:'————'
    }
  },
  {
    title: '一级分类',
    key: 'firstClassCode',
    render(row: any) {
      return firstClassName(row.firstClassCode)
    }
  },
  {
    title: '二级分类',
    key: 'secondClassCode',
    render(row: any) {
      return secondClassName(row.secondClassCode)
    }
  },
  {
    title: '基础转码策略',
    key: 'videoTransStrategyId',
    render(row: any) {
      return strategyIdName(row.videoTransStrategyId)
    }
  }
];
let secondClassCodeData: any[] = []
const firstClassName = (val?: string) => {
  if (!primaryClassifyData.length || !val) {
    return '——'
  }
  return primaryClassifyData.find((v: any) => v.categoryId === val).categoryName
};
const secondClassName = (val?: any[]) => {
  if (!secondClassCodeData.length || !val) {
    return '——'
  }
  const arr: any[] = []
  val.forEach((v: any) => {
    const obj = secondClassCodeData.find((vv?:any) => vv.itemCode === v)
    if (obj) {
      arr.push(obj.itemName)
    }
  })
  return arr.length ? arr.join(',') : '——'
};
const strategyIdName = (val: string) => {
  if (!totalStrategyIdList.length || !val) {
    return '——'
  }
  const obj = totalStrategyIdList.find((v: any) => v.code === val)
  return obj ? obj.name : val
};
const searchObj = ref({
  page: 1,
  rows: 10,
  type: 'video',
  videoId: '',
});
const mediaList = ref([])
const resetSearchForm = () => {
  searchObj.value = {
    page: 1,
    rows: 20,
    type: 'video',
    videoId: '',
  }
  mediaList.value = []
};
const emits = defineEmits<{
  selectVideo: [value: any]
}>()
const sure = () => {
  const selected = mediaList.value.find((v: any)=>v.videoId === checkedRowKeys.value[0])
  emits('selectVideo',toRaw(selected))
  showModal.value = false
  nextTick(()=>{
    checkedRowKeys.value = [];
  })
  // resetSearchForm()
};
const changePage = (page: number) => {
  searchObj.value.page = page
  getList()
};
const getFirstHis: any[] = []
const getList = async () => {
  checkedRowKeys.value = []
  const params: any = toRaw(searchObj).value
  params.videoId = searchObj.value.videoId
    ? searchObj.value.videoId.split(',').map((v) => Number(v))
    : [];
  if (!params.videoId || !params.videoId.length) {
    delete params.videoId
  }
  try {
    const data = await esSearchLongVideo(params);
    pagination.value.pageCount = data.totalPages;
    const axiosList: any[] = []
    data.content.forEach((v: any) => {
      if (!getFirstHis.find((vv: any) => vv === v.firstClassCode)){
        getFirstHis.push(v.firstClassCode)
        const params = {
          parmStr: jsonToQuery({
            enumCode: v.firstClassCode,
            itemType: '1',
          }),
          urlCode: 'list_enum_values',
        }
        axiosList.push(getDistributeEnum(params))
      }
    });
    Promise.allSettled(axiosList).then((values) => {
      values.forEach((v: any) => {
        if (v.value.result && v.value.result.length) {
          secondClassCodeData = secondClassCodeData.concat(
            v.value.result
          )
        }
      });
      mediaList.value = data.content
    })
  }catch (e) {
    console.log(e)
  }
};
onMounted(()=>{
  getList()
})
</script>
