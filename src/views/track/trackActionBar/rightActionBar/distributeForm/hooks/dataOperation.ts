import { getDistributeEnum } from '@/service/api';
import { jsonToQuery } from '@/utils/index';

let MamDefaultEnumCodeValue;
let NewEditDefaultEnumCodeValue;
const ignoreKeys = ['taskId', 'groupId', 'recommendation', 'newKeywords'];
export function setTemplateData(formData, template, labelRef?) {
  Object.keys(template).forEach(v => {
    if (!v || ignoreKeys.find(vv => vv === v)) return;
    if (v === 'pid') {
      formData.value.optType = 1;
      formData.value[v] = template[v];
    } else if (v === 'onlineTime' || v === 'largeOnlineTime') {
      formData.value[v] = new Date(template[v]).valueOf();
    } else if (v === 'cpLogoPath' || v === 'secondClassCode') {
      setTimeout(() => {
        formData.value[v] = template[v].split(',');
      }, 100);
    } else {
      formData.value[v] = template[v];
    }
  });
  labelRef.value.setTemplateData(template);
}

export async function getDefaultEnumCodeValue(platform = 'content') {
  const parmStr = jsonToQuery({
    type: 'vod', // vod 点播 直播live 主站先传vod
    platform // 新运编content   媒资mam
  });
  const res: any = await getDistributeEnum({
    parmStr,
    urlCode: 'getDefaultEnumCodeValue'
  });
  if (platform === 'content') {
    NewEditDefaultEnumCodeValue = res;
  } else {
    MamDefaultEnumCodeValue = res;
  }
  Promise.resolve();
}

const needDefaultList = [
  'lang',
  'captionLang',
  'country',
  'assetSource',
  'contentForm',
  'vrImageDepth',
  'vrImageDistortion',
  'vrContentType'
];
export function setDefaultEnumCodeValue(formData: Ref<Record<string, any>>, isEdit = true) {
  const defaultObj: Record<string, any> = isEdit ? NewEditDefaultEnumCodeValue : MamDefaultEnumCodeValue;
  if (!defaultObj) return;
  needDefaultList.forEach(v => {
    defaultObj[v] &&
      (formData.value[v] = v === 'lang' || v === 'captionLang' ? [defaultObj[v].code] : defaultObj[v].code);
  });
  formData.value.cpId = '800033';
  formData.value.copyRightId = '990000000';
  if (!defaultObj.shortBigStrategy) return;
  if (formData.value.outputSubtitles === '1') {
    if (formData.value.platformListValue.includes('-3')) {
      formData.value.strategyId = defaultObj.cmamShortSmallSubtitleStrategy.code;
      formData.value.bigStrategyId = defaultObj.cmamShortBigSubtitleStrategy.code;
    } else if (formData.value.platformListValue.includes('-2')) {
      formData.value.strategyId = defaultObj.vodSmallLongSubtitleStrategy.code;
      formData.value.bigStrategyId = defaultObj.longBigSubtitleStrategy.code;
    } else {
      formData.value.strategyId = defaultObj.vodSmallShortSubtitleStrategy.code;
      formData.value.bigStrategyId = defaultObj.shortBigSubtitleStrategy.code;
    }
  } else if (formData.value.platformListValue.includes('-3')) {
    formData.value.strategyId = defaultObj.cmamShortSmallStrategy.code;
    formData.value.bigStrategyId = defaultObj.cmamShortBigStrategy.code;
  } else if (formData.value.platformListValue.includes('-2')) {
    formData.value.strategyId = defaultObj.defaultSmallStrategy.code;
    formData.value.bigStrategyId = defaultObj.defaultBigStrategy.code;
  } else {
    formData.value.strategyId = defaultObj.shortSmallStrategy.code;
    formData.value.bigStrategyId = defaultObj.shortBigStrategy.code;
  }
}
