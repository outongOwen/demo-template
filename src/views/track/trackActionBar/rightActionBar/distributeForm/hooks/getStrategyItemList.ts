import { jsonToQuery } from '@/utils';
import { getDistributeEnum } from '@/service/api/distribute';
const paramsArr: Record<string, any> = {
  // 大屏
  bigStrategy: {
    parmStr: jsonToQuery({
      type: 3
    }),
    urlCode: 'get_strategy'
  },
  // 新运编短小屏
  smallShortStrategy: {
    parmStr: jsonToQuery({
      mamPlatform: '1',
      type: 2
    }),
    urlCode: 'get_strategy'
  },
  // 新运编长小屏
  smallLongStrategy: {
    parmStr: jsonToQuery({
      mamPlatform: '0',
      type: 2
    }),
    urlCode: 'get_strategy'
  }
};
const cmamParamList: Record<string, any> = {
  // 中央媒资大屏
  cmamBigStrategy: {
    parmStr: jsonToQuery({
      type: 3
    }),
    urlCode: 'cmam_get_strategy'
  },
  // 中央媒资小屏
  cmamSmallStrategy: {
    parmStr: jsonToQuery({
      mamPlatform: '1',
      type: 2
    }),
    urlCode: 'cmam_get_strategy'
  }
};

async function getStrategyIdList(enumObj, isCmam) {
  const arr: any[] = [];
  const nameList: string[] = [];
  const params = isCmam ? cmamParamList : paramsArr;
  Object.keys(params).forEach((key: string) => {
    arr.push(getDistributeEnum(params[key]));
    nameList.push(key);
  });
  await Promise.allSettled(arr).then((res: any[]) => {
    res.forEach((v: any, i: number) => {
      if (v.status === 'fulfilled') {
        const list = v.value.map(item => {
          return {
            value: String(item.id),
            label: item.name,
            codeRate: item.mediaUsagecodes
          };
        });
        enumObj.value[nameList[i]] = list;
        enumObj.value.totalStrategyIdList.concat(list);
      }
    });
  });
  Promise.resolve();
}
async function getWaterPathList(enumObj, isCmam) {
  const data = await getDistributeEnum({ urlCode: isCmam ? 'cmam_watermarkPath' : 'watermarkPath' });
  enumObj.value[isCmam ? 'cmamWatermarkPathList' : 'watermarkPathList'] = data.map(v => ({
    value: v.watermarkPath,
    label: v.watermarkName
  }));
}

export async function getStratgyEnum(enumObj: Ref<object>, isCmam = false) {
  await getStrategyIdList(enumObj, isCmam);
  await getWaterPathList(enumObj, isCmam);
  Promise.resolve();
}
