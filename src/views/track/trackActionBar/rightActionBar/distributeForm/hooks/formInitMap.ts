import type { FormItemRule } from 'naive-ui';
import pidComponent from '../components/spacialFormItem/pidComponent.vue';
import copyRightIdComponent from '../components/spacialFormItem/copyRightIdComponent.vue';
import inputToTag from '../components/spacialFormItem/inputToTag.vue';

// G客&MCN需要的编目信息
export const MCNShow: Array<string> = [
  'title',
  'keyword',
  'pid',
  'initialAssetId',
  'fanCircleId',
  'operationFlag',
  'descriptionValue',
  'category',
  'secondClassCode',
  'contentForm'
];
export const EditHidden: Array<string> = ['keyword', 'fanCircleId'];
// 不能共存的分发平台值
export const radioPlatForm: Array<string> = ['-3', '-2', '-1', '0', '1', '2'];
// 新运编长分发的值
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
  'miguDefaultLogo'
];
export const queryArrayLeft: any[] = [
  {
    type: 'textarea',
    label: '标题：',
    key: 'title',
    length: (isEditingOrMedia: boolean) => (isEditingOrMedia ? 60 : 50),
    holder: '请输入标题',
    show: true,
    rules: [
      {
        required: true,
        message: '请输入标题',
        trigger: ['blur']
      }
    ]
  },
  {
    type: 'component',
    label: '关键字：',
    key: 'keyword',
    holder: '请输入关键字',
    show: true,
    component: inputToTag,
    rules: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string[] | undefined) {
          if (!value || !value.length) {
            return new Error('请输入关键字');
          }
          return true;
        },
        trigger: ['blur']
      }
    ]
  },
  {
    type: 'select',
    label: '圈子：',
    key: 'fanCircleId',
    holder: '请输入标题',
    show: true
  },
  {
    type: 'component',
    label: 'PID：',
    key: 'pid',
    optName: 'pidQueryOpt',
    show: true,
    component: pidComponent
  },
  {
    type: 'input',
    label: '来源媒资ID：',
    key: 'initialAssetId',
    holder: '请输入来源媒资ID',
    show: true
  },
  {
    type: 'textarea',
    label: '副标题：',
    key: 'subheading',
    length: 60,
    holder: '请输入副标题',
    show: true
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
        trigger: ['change']
      }
    ]
  },
  {
    type: 'select',
    label: '语言：',
    key: 'lang',
    optName: 'lang',
    holder: '请选择语言',
    show: true,
    multiple: true,
    rules: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string[] | undefined) {
          if (!value || !value.length) {
            return new Error('请选择语言');
          }
          return true;
        },
        trigger: ['change']
      }
    ]
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
        trigger: ['change']
      }
    ]
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
        trigger: ['change']
      }
    ]
  },
  {
    type: 'select',
    label: '运营标识：',
    key: 'operationFlag',
    optName: 'operationFlagList',
    holder: '请输入运营标识',
    show: true
  }
];
// 优先发布选项
export const isUrgencyList = [
  { value: '0', label: '普通（速度一般）' },
  { value: '2', label: '紧急（速度快）' },
  { value: '6', label: '快转（速度很快）' },
  { value: '9', label: '闲时（速度慢）' }
];
export const queryArrayRight: any[] = [
  {
    type: 'textarea',
    label: '简介：',
    key: 'descriptionValue',
    length: (isEditingOrMedia: boolean) => (isEditingOrMedia ? 500 : 200),
    holder: '请输入简介',
    show: true,
    rules: [
      {
        required: true,
        message: '请输入视频简介',
        trigger: ['change']
      }
    ]
  },
  {
    type: 'select',
    label: '一级分类：',
    key: 'category',
    optName: 'categoryOpt',
    holder: '请选择一级分类',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择一级分类',
        trigger: ['change']
      }
    ]
  },
  {
    type: 'select',
    label: '二级分类：',
    key: 'secondClassCode',
    optName: 'lablesByCatIdOpt',
    holder: '请选择二级分类',
    multiple: true,
    show: true,
    rules: [
      {
        required: true,
        validator(_rule: FormItemRule, value: string[] | undefined) {
          if (!value || !value.length) {
            return new Error('请选择二级分类');
          }
          return true;
        },
        trigger: ['change']
      }
    ]
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
        trigger: ['change']
      }
    ]
  },
  {
    type: 'select',
    label: '内容形态：',
    key: 'contentForm',
    optName: 'contentForm',
    holder: '请选择内容形态',
    show: true,
    rules: [
      {
        required: true,
        message: '请选择内容形态',
        trigger: ['change']
      }
    ]
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
        trigger: ['change']
      }
    ]
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
        validator(_rule: FormItemRule, value: string[] | undefined) {
          if (!value || !value.length) {
            return new Error('请选择字幕语言');
          }
          return true;
        },
        trigger: ['change']
      }
    ]
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
        trigger: ['change']
      }
    ]
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
        required: false,
        message: '请输入描述地区',
        // validator: this.occurredValue,
        trigger: ['blur', 'change']
      }
    ]
  },
  {
    type: 'datetime',
    label: '小屏上线时间：',
    key: 'onlineTime',
    holder: '请选择上线时间',
    show: true,
    valueFormat: 'yyyy-MM-dd hh:mm:ss',
    eventFn: (data: any, obj: any) => {
      if (!obj.largeOnlineTime) {
        obj.largeOnlineTime = data;
      }
    }
  },
  {
    type: 'datetime',
    label: '大屏上线时间：',
    key: 'largeOnlineTime',
    holder: '请选择上线时间',
    show: true,
    valueFormat: 'yyyy-MM-dd hh:mm:ss',
    eventFn: (data: any, obj: any) => {
      if (!obj.onlineTime) {
        obj.onlineTime = data;
      }
    }
  }
];
const allSelect = queryArrayLeft.concat(queryArrayRight).filter((v: any) => v.type === 'select');
export const ListCode: Array<string> = allSelect.map((v: any) => v.optName);
