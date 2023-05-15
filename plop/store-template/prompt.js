module.exports = {
  description: 'create a store',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Please enter store name，such as "newStoreName" :',
      validate(value) {
        if (!value || value.trim === '') {
          return 'name is required';
        }
        return true;
      }
    }
  ],
  actions: data => {
    const dataName = data.name;

    // 首字母大写
    const upperDataName = dataName.slice(0, 1).toUpperCase() + dataName.slice(1);

    const actions = [
      {
        type: 'add',
        path: `${process.cwd()}/src/store/modules/${dataName}Store/index.ts`, // 这里的name就是上面定义的键
        templateFile: './store-template/index.hbs',
        data: {
          name: data.name,
          upperDataName
        }
      },
      {
        type: 'add',
        path: `${process.cwd()}/src/store/modules/${dataName}Store/types.ts`, // 这里的name就是上面定义的键
        templateFile: './store-template/types.hbs',
        data: {
          name: data.name,
          upperDataName
        }
      }
    ];

    return actions;
  }
};
