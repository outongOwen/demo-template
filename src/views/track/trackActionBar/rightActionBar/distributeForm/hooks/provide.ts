import type { Ref } from 'vue';
import { useContext } from '@/hooks';
const { useInject: useFormDataInject, useProvide: useFormDataProvide } = useContext<any>('formData', {
  native: true,
  readonly: false
});

const { useInject: useTotalStrategyInject, useProvide: useTotalStrategyProvide } = useContext<any>('totalStrategy', {
  native: true,
  readonly: false
});
const { useInject: usePrimaryClassifyInject, useProvide: usePrimaryClassifyProvide } = useContext<any>(
  'primaryClassify',
  {
    native: true,
    readonly: false
  }
);
export function totalStrategyPri() {
  const provideTotalStrategy = (context: Ref<any>) => {
    useTotalStrategyProvide(context);
  };
  return {
    provideTotalStrategy,
    injectTotalStrategy: useTotalStrategyInject
  };
}
export function primaryClassifyPri() {
  const providePrimaryClassify = (context: Ref<any>) => {
    usePrimaryClassifyProvide(context);
  };
  return {
    providePrimaryClassify,
    injectPrimaryClassify: usePrimaryClassifyInject
  };
}
export function getProvideFormData() {
  const provideFormData = (context: Ref<object>) => {
    useFormDataProvide(context);
  };
  return {
    provideFormData,
    injectFormData: useFormDataInject
  };
}
