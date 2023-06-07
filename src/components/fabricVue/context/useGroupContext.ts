import type { Group } from 'fabric';
import { useContext } from '../hooks';
export interface GroupContextProps {
  instance: Group;
}
const { useInject, useProvide } = useContext<GroupContextProps>('GroupContext', {
  native: true
});
export default function useGroupContext() {
  const provideGroupContext = (context: GroupContextProps) => {
    useProvide(context);
  };
  const injectGroupContext = () => {
    return useInject();
  };
  return {
    provideGroupContext,
    injectGroupContext
  };
}
