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
