/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
import { jsonToQuery } from '@/utils';
import { getDistributeEnum } from '@/service/api';

interface EnumConfig {
  isMixedEdit?: boolean;
  isSportsIntermodal?: boolean;
  formData: {
    [key: string]: any;
  };
  listObject: {
    [key: string]: any[];
  };
  enumOptionsList: {
    [key: string]: any[];
  };
}
interface EnumParam {
  type: string;
  params?: {
    enumCode: string;
    itemType: string;
  };
  enumValues?: string;
  handler?: (val: any) => void;
}
let vue: EnumConfig;
export let communityEnum: any = reactive({});
export function getAllEnum(that: any, isCmam = false) {
  vue = that;
  communityEnum = that.enumOptionsList
  let enumCode = 'yunjian';
  if (vue.isMixedEdit) {
    enumCode = 'hunbian';
  } else if (vue.isSportsIntermodal) {
    enumCode = 'lianyun';
  }
  const arr: EnumParam[] = [
    // 一级分类
    {
      params: {
        enumCode: 'first_class_code',
        itemType: '2'
      },
      type: 'categoryOpt'
    },
    // 来源
    {
      params: {
        enumCode,
        itemType: '2'
      },
      type: 'assetSource',
      handler(arr: any) {
        // 如果匹配不到，就匹配默认值；
        const defaultItem = arr.find((item: any) => {
          return item.label == '全网精编';
        });
        vue.formData.assetSource = defaultItem.code;
      }
    },
    // 视频语言
    {
      params: {
        enumCode: 'language',
        itemType: '2'
      },
      type: 'lang'
    },
    // 字幕语言
    {
      params: {
        enumCode: 'subtitle_language',
        itemType: '2'
      },
      type: 'captionLang'
    },
    // 视频内容类型
    {
      params: {
        enumCode: 'sports_video_type',
        itemType: '2'
      },
      type: 'contentTypeList'
    },
    // // 运营标识
    // {
    //   type: 'operationFlagList',
    //   enumValues: 'operation_flag',
    // },
    // // 内容形态
    // {
    //   type: 'contentForm',
    //   enumValues: 'content_form_list',
    // },
  ];
  arr.forEach(v => {
    getContentEnumList(v.params, v.type, isCmam, v.handler, v.enumValues);
  });
  getCpIdList(isCmam);
  getOperationFlagList(isCmam);
  getContentFormList(isCmam);
}
/**
 * enumCode = first_class_code 视频一级分类和辅助分类 itemType=2       ???????
 * enumCode= 一级分类对应code      视频对应一级分类获取的二级分类 itemType=2   ???????
 * enumCode=  content_form   内容形态 itemType=2
 * enumCode=   subtitle_language 字幕语言 itemType=2
 * enumCode= language  视频语言 itemType=2
 * enumCode=image_text_source  来源字段 itemType=3
 * enumCode= db_recommendation  推荐标签全量 itemType=3
 * 新运编（短）接口同意处理
 */
// 新运编（短）编目枚举获取混合接口
async function getContentEnumList(
  params: any,
  type: string,
  isCmam: boolean,
  callBack: any,
  code: string = 'list_enum_values'
) {
  const urlCode = isCmam ? `cmam_${code}` : code;
  const p: any = { urlCode };
  if (params) {
    p.parmStr = jsonToQuery(params);
  }
  const data = await getDistributeEnum(p);
  let arr;
  if (data.content || data.cmamForm) {
    arr = data.content || data.cmamForm;
  } else if (typeof data[0] === 'string') {
    arr = data;
  } else {
    arr = data.map((item: any) => {
      return {
        value: item.itemCode || item.watermarkPath,
        label: item.itemName || item.watermarkName
      };
    });
  }
  callBack && callBack(arr);
  try {
    setListToVue(type, arr, isCmam);
  } catch (e) {
    console.log(e);
    console.log(type);
  }
}
function setListToVue(code: string, arr: any[], isCmam: boolean) {
  const key = (isCmam ? 'Cmam' : 'Normal') + code;
  vue.listObject[key] = arr;
  vue.enumOptionsList[code] = arr;
}

// 获取cpid
async function getCpIdList(isCmam: boolean) {
  const urlCode = isCmam ? 'cmam_cpid_info' : 'cpid_info';
  const data: any = await getDistributeEnum({ urlCode });
  const arr =
    data.map((item: any) => {
      return {
        label: `${item.value}（${item.name}）`,
        value: item.value,
        copyright: item.copyright
      };
    }) || [];
  setListToVue('cpId', arr, isCmam);
}

// 运营标识
async function getOperationFlagList(isCmam: boolean) {
  const urlCode = isCmam ? 'cmam_operation_flag' : 'operation_flag';
  const data: any = await getDistributeEnum({ urlCode });
  setListToVue('operationFlagList', data.map((v: any) => ({ label: v, value: v })) || [], isCmam);
}

async function getContentFormList(isCmam: boolean) {
  const urlCode = isCmam ? 'cmam_content_form_asset_source' : 'content_form_list';
  const data: any = await getDistributeEnum({ urlCode });
  const list = data.content || data.cmamForm || [];
  Object.keys(list).map((v: string) => ({ value: v, label: list[v] }));
  setListToVue(
    'contentForm',
    Object.keys(list).map((v: string) => ({ value: v, label: list[v] })),
    isCmam
  );
}
