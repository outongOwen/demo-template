// import { NEllipsis } from 'naive-ui';
import { useIconRender } from '@/hooks';
import type { ExtendMenuOptions } from '#/packages.d';
const { iconRender } = useIconRender();
const createDefaultAreaConfig = (secondMenu = true, searchForm = true, materialBody = true) => {
  return {
    secondMenu,
    searchForm,
    materialBody
  };
};
const defaultSliderMenuOptions: ExtendMenuOptions[] = [
  {
    label: '视频',
    key: 'Video',
    icon: iconRender({ icon: 'material-symbols:video-camera-back-sharp' }),
    areaConfig: createDefaultAreaConfig(),
    searchModel: {
      id: '',
      name: '',
      firstOrgId: '',
      secondOrgId: '',
      userIdFromWeb: '',
      materialType: ''
    }
  },
  {
    label: '图片',
    key: 'Image',
    icon: iconRender({ icon: 'material-symbols:photo-camera-back-sharp' }),
    areaConfig: createDefaultAreaConfig()
    // secondMenuOptions: [
    //   {
    //     label: '上传图片',
    //     key: 'UploadImage',
    //     icon: 'material-symbols:photo-camera-back-sharp'
    //   },
    //   {
    //     label: '图片列表',
    //     key: 'ImageList',
    //     icon: 'material-symbols:photo-camera-back-sharp'
    //   },
    //   {
    //     label: '图片分类',
    //     key: 'ImageCategory',
    //     icon: 'material-symbols:photo-camera-back-sharp'
    //   },
    //   {
    //     label: '图片标签',
    //     key: 'ImageTag',
    //     icon: 'material-symbols:photo-camera-back-sharp'
    //   },
    //   {
    //     label: '图片水印',
    //     key: 'ImageWatermark',

    //   }
    // ],
    // searchModel: {
    //   keyword: '',
    //   onlyMe: '',
    //   firstLevel: '',
    //   secondLevel: '',
    //   thirdLevel: ''
    // }
  },
  {
    label: '配乐',
    key: 'Audio',
    icon: iconRender({ icon: 'mdi:music' }),
    areaConfig: createDefaultAreaConfig(),
    listSchema: {
      width: 100,
      height: 50
    }
  },
  {
    label: '透明',
    key: 'Transparent',
    icon: iconRender({ icon: 'material-symbols:opacity-sharp' }),
    areaConfig: createDefaultAreaConfig()
  },
  {
    label: '装饰',
    key: 'Decoration',
    icon: iconRender({ icon: 'material-symbols:brush-sharp' }),
    areaConfig: createDefaultAreaConfig(false, false, true),
    isLocal: true,
    isKeepAlive: true
  },
  {
    label: '文本',
    key: 'Text',
    icon: iconRender({ icon: 'material-symbols:font-download-sharp' }),
    areaConfig: createDefaultAreaConfig(false),
    isLocal: true,
    isKeepAlive: true,
    listSchema: {
      width: 50,
      height: 50
    }
  },
  {
    label: '字幕',
    key: 'Subtitle',
    icon: iconRender({ icon: 'material-symbols:subtitles-sharp' }),
    areaConfig: createDefaultAreaConfig(false),
    isLocal: true,
    isKeepAlive: true
  }
  // {
  //   componentType: 'List',
  //   label: '特效',
  //   key: 'Effect',
  //   icon: iconRender({ icon: 'material-symbols:filter-vintage-sharp' }),
  //   areaConfig: createDefaultAreaConfig(),
  //   isLocal: true
  // },
  // {
  //   componentType: 'List',
  //   label: '转场',
  //   key: 'Transition',
  //   icon: iconRender({ icon: 'material-symbols:swap-horizontal-circle-sharp' }),
  //   areaConfig: createDefaultAreaConfig(false, false, false),
  //   isLocal: true
  // },
  // {
  //   componentType: 'List',
  //   label: '模板',
  //   key: 'Template',
  //   icon: iconRender({ icon: 'pajamas:template' }),
  //   areaConfig: createDefaultAreaConfig(true, false, true)
  // },
  // {
  //   componentType: 'List',
  //   label: '素材',
  //   key: 'Material',
  //   icon: iconRender({ icon: 'material-symbols:layers-sharp' }),
  //   areaConfig: createDefaultAreaConfig(true, false, true)
  // },
  // {
  //   componentType: 'List',
  //   label: '动画',
  //   key: 'Animation',
  //   icon: iconRender({ icon: 'material-symbols:animation-sharp' }),
  //   areaConfig: createDefaultAreaConfig(false, false, true)
  // },
  // {
  //   componentType: 'List',
  //   label: () => h(NEllipsis, null, { default: () => '动态壁纸壁纸' }),
  //   key: 'DynamicSticker',
  //   icon: iconRender({ icon: 'fluent-mdl2:picture' }),
  //   areaConfig: createDefaultAreaConfig(false, false, true)
  // }
];
export const sliderMenuOptions = defaultSliderMenuOptions;
