import { NEllipsis } from 'naive-ui';
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
    keepAlive: true,
    areaConfig: createDefaultAreaConfig(),
    isNetworkSecondMenu: false,
    secondMenuOptions: [
      {
        label: '上传视频',
        key: 'UploadVideo'
      },
      {
        label: '视频列表',
        key: 'VideoList'
      },
      {
        label: '视频分类视频分类',
        key: 'VideoCategory'
      },
      {
        label: '视频标签',
        key: 'VideoTag'
      },
      {
        label: '视频水印',
        key: 'VideoWatermark'
      },
      {
        label: '视频转码',
        key: 'VideoTranscode'
      },
      {
        label: '视频截图',
        key: 'VideoScreenshot'
      },
      {
        label: '视频合并',
        key: 'VideoMerge'
      }
    ],

    searchModel: {
      keyword: '',
      onlyMe: '',
      firstLevel: '',
      secondLevel: '',
      thirdLevel: ''
    }
  },
  {
    label: '图片',
    key: 'Image',
    icon: iconRender({ icon: 'material-symbols:photo-camera-back-sharp' }),
    areaConfig: createDefaultAreaConfig(),
    keepAlive: false,
    secondMenuOptions: [
      {
        label: '上传图片',
        key: 'UploadImage',
        icon: 'material-symbols:photo-camera-back-sharp'
      },
      {
        label: '图片列表',
        key: 'ImageList',
        icon: 'material-symbols:photo-camera-back-sharp'
      },
      {
        label: '图片分类',
        key: 'ImageCategory',
        icon: 'material-symbols:photo-camera-back-sharp'
      },
      {
        label: '图片标签',
        key: 'ImageTag',
        icon: 'material-symbols:photo-camera-back-sharp'
      },
      {
        label: '图片水印',
        key: 'ImageWatermark',
        icon: 'material-symbols:photo-camera-back-sharp'
      }
    ],
    searchModel: {
      keyword: '',
      onlyMe: '',
      firstLevel: '',
      secondLevel: '',
      thirdLevel: ''
    }
  },
  {
    label: '音频',
    key: 'Audio',
    icon: iconRender({ icon: 'material-symbols:mic-sharp' }),
    areaConfig: createDefaultAreaConfig(),
    listSchema: {
      width: 100,
      height: 50,
      gutter: 10,
      pageSize: 100
    }
  },
  {
    label: '字幕',
    key: 'Subtitle',
    icon: iconRender({ icon: 'material-symbols:subtitles-sharp' }),
    areaConfig: createDefaultAreaConfig()
  },
  {
    label: '字体',
    key: 'Font',
    icon: iconRender({ icon: 'material-symbols:font-download-sharp' }),
    areaConfig: createDefaultAreaConfig()
  },
  {
    label: '特效',
    key: 'Effect',
    icon: iconRender({ icon: 'material-symbols:filter-vintage-sharp' }),
    areaConfig: createDefaultAreaConfig()
  },
  {
    label: '转场',
    key: 'Transition',
    icon: iconRender({ icon: 'material-symbols:swap-horizontal-circle-sharp' }),
    areaConfig: createDefaultAreaConfig(false, false, true)
  },
  {
    label: '模板',
    key: 'Template',
    icon: iconRender({ icon: 'pajamas:template' }),
    areaConfig: createDefaultAreaConfig(true, false, true)
  },
  {
    label: '素材',
    key: 'Material',
    icon: iconRender({ icon: 'material-symbols:layers-sharp' }),
    areaConfig: createDefaultAreaConfig(true, false, true)
  },
  {
    label: '动画',
    key: 'Animation',
    icon: iconRender({ icon: 'material-symbols:animation-sharp' }),
    areaConfig: createDefaultAreaConfig(false, false, true)
  },
  {
    label: () => h(NEllipsis, null, { default: () => '动态壁纸壁纸' }),
    key: 'DynamicSticker',
    icon: iconRender({ icon: 'fluent-mdl2:picture' }),
    areaConfig: createDefaultAreaConfig(false, false, true)
  },
  {
    label: '模板',
    key: 'Template',
    icon: iconRender({ icon: 'pajamas:template' }),
    areaConfig: createDefaultAreaConfig(true, false, true)
  },
  {
    label: '素材',
    key: 'Material',
    icon: iconRender({ icon: 'material-symbols:layers-sharp' }),
    areaConfig: createDefaultAreaConfig(true, false, true)
  },
  {
    label: '动画',
    key: 'Animation',
    icon: iconRender({ icon: 'material-symbols:animation-sharp' }),
    areaConfig: createDefaultAreaConfig(false, false, true)
  },
  {
    label: () => h(NEllipsis, null, { default: () => '动态壁纸壁纸' }),
    key: 'DynamicSticker',
    icon: iconRender({ icon: 'fluent-mdl2:picture' }),
    areaConfig: createDefaultAreaConfig(false, false, true)
  }
];
export const sliderMenuOptions = defaultSliderMenuOptions;
