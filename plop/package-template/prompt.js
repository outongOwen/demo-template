module.exports = {
  description: '新增画布的素材',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入素材名称（英文且首字母大写） :',
      validate(value) {
        if (!value || value.trim === '') {
          return '文件名称不能为空';
        }
        // 检测是否是首字母大写的英文
        if (!/^[A-Z][a-zA-Z]*$/.test(value)) {
          return '请输入首字母大写的英文';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'zhName',
      message: '请输入中文素材名称 :',
      validate(value) {
        if (!value || value.trim === '') {
          return '名称不能为空';
        }
        // 检测是否为中文
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
          return '请输入中文';
        }
        return true;
      }
    }
  ],
  actions: data => {
    const dataName = data.name;
    // 首字母大写
    const upperDataName = dataName.slice(0, 1).toUpperCase() + dataName.slice(1);
    // 首字母小写
    const lowerDataName = dataName.slice(0, 1).toLowerCase() + dataName.slice(1);
    const actions = [
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/config/index.ts`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          upperDataName,
          lowerDataName,
          zhName: data.zhName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/config/index.vue`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/config/index.type.ts`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/config/components/baseConfig/index.vue`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/config/components/baseConfig/index.ts`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/config/components/baseConfig/index.type.ts`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/view/index.vue`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/view/index.ts`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/packages/views/${upperDataName}/view/index.type.ts`, // 这里的name就是上面定义的键
        templateFile: './package-template/index.hbs',
        data: {
          name: data.name,
          lowerDataName,
          upperDataName
        }
      }
    ];
    return actions;
  }
};
