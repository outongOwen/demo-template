import pidComponent from '../components/spacialFormItem/pidComponent.vue'
import copyRightIdComponent from '../components/spacialFormItem/copyRightIdComponent.vue'

export const editLongParams: Array<string> = [
  'cpLogoPath',
  'hasLogo',
  'watermarkPath',
  'videoId',
  'isUrgency',
  'operationFlag',
  'category',
  'secondClassCode',
  'labelsValue',
  'title',
  'strategyId',
  'bigStrategyId',
  'commitCheck',
  'coverSwitch',
  'mediaType',
  'miguDefaultLogo',
];
export const queryArrayLeft: any[] = [
  {
    type: 'textarea',
    label: '标题：',
    key: 'title',
    length: (isEditingOrMedia: boolean) => isEditingOrMedia ? 60 : 50,
    holder: '请输入标题',
    show: true,
    rules: [
      {
        required: true,
        message: '请输入标题',
        trigger: ['blur'],
      },
    ],
  },
  {
    type: 'component',
    label: 'PID：',
    key: 'pid',
    optName: 'pidQueryOpt',
    show: true,
    component: pidComponent,
    rules: [
      {
        required: true,
        message: '请选择来源',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'input',
    label: '来源媒资ID：',
    key: 'initialAssetId',
    holder: '请输入来源媒资ID',
    show: true,
    rules: [
      {
        required: false,
        message: '请输入来源媒资ID',
        trigger: ['blur', 'change'],
      },
    ],
  },
  {
    type: 'textarea',
    label: '副标题：',
    key: 'subheading',
    length: 60,
    holder: '请输入副标题',
    show: true,
  },
  {
    type: 'select',
    label: '来源：',
    key: 'assetSource',
    optName: 'assetSource',
    length: 40,
    holder: '请选择来源',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择来源',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '语言：',
    key: 'lang',
    optName: 'lang',
    length: 40,
    holder: '请选择语言',
    show: true,
    multiple: true,
    rules: [
      {
        required: true,
        message: '请选择语言',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: 'CPID：',
    key: 'cpId',
    optName: 'cpId',
    holder: '请选择CPID',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择CPID',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'component',
    label: '版权ID：',
    key: 'copyRightId',
    component: copyRightIdComponent,
    show: true,
    rules: [
      {
        required: true,
        message: '请输入正确的版权ID',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '运营标识：',
    key: 'operationFlag',
    optName: 'operationFlagList',
    holder: '请输入运营标识',
    show: true,
    rules: [
      {
        required: true,
        message: '请输入运营标识',
        trigger: ['change'],
      },
    ],
  },
]
// 优先发布选项
const isUrgencyList = [
    { code: '0', name: '普通（速度一般）' },
    { code: '2', name: '紧急（速度快）' },
    { code: '6', name: '快转（速度很快）' },
    { code: '9', name: '闲时（速度慢）' },
  ]
export const queryArrayRight: any[] = [
  {
    type: 'textarea',
    label: '简介：',
    key: 'descriptionValue',
    length: (isEditingOrMedia: boolean) => isEditingOrMedia ? 500 : 200,
    holder: '请输入简介',
    show: true,
    rules: [
      {
        required: true,
        message: '请输入视频简介',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '一级分类：',
    key: 'categoryValue',
    optName: 'categoryOpt',
    holder: '请选择一级分类',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择一级分类',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '二级分类：',
    key: 'labelsValue',
    optName: 'lablesByCatIdOpt',
    holder: '请选择二级分类',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择二级分类',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '辅助分类：',
    key: 'subsidiaryClassCode',
    optName: 'categoryOpt',
    holder: '请选择辅助分类',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择辅助分类',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '内容形态：',
    key: 'subsidiaryClassCode',
    optName: 'contentForm',
    holder: '请选择内容形态',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择内容形态',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '国家及地区：',
    key: 'country',
    optName: 'country',
    holder: '请选择国家及地区',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择国家及地区',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '字幕语言：',
    key: 'captionLang',
    optName: 'captionLang',
    holder: '请选择字幕语言',
    show: true,
    multiple: true,
    rules: [
      {
        required: true,
        message: '请选择字幕语言',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'select',
    label: '优先发布：',
    key: 'isUrgency',
    holder: '请选择优先发布',
    show: true,
    optData: isUrgencyList,
    rules: [
      {
        required: true,
        message: '请选择优先发布',
        trigger: ['change'],
      },
    ],
  },
  {
    type: 'input',
    label: '描述地区：',
    key: 'occurred',
    holder: '请输入描述地区按Enter保存',
    length: 20,
    show: true,
    rules: [
      {
        required: true,
        message: '请输入描述地区',
        // validator: this.occurredValue,
        trigger: ['blur', 'change'],
      },
    ],
  },
  {
    type: 'datetime',
    label: '小屏上线时间：',
    key: 'onlineTime',
    holder: '请选择上线时间',
    show: true,
    valueFormat: 'yyyy-MM-DD hh:mm:ss',
    eventFn: (data: any, obj: any) => {
      if (!obj.largeOnlineTime) {
        obj.largeOnlineTime = data
      }
    },
  },
  {
    type: 'datetime',
    label: '大屏上线时间：',
    key: 'largeOnlineTime',
    holder: '请选择上线时间',
    show: true,
    valueFormat: 'yyyy-MM-DD hh:mm:ss',
    eventFn: (data: any, obj: any) => {
      if (!obj.onlineTime) {
        obj.onlineTime = data
      }
    },
  },
]
const allSelect = queryArrayLeft.concat(queryArrayRight).filter((v: any) => v.type === 'select')
export const ListCode: Array<string> = allSelect.map((v:any)=> v.optName);
