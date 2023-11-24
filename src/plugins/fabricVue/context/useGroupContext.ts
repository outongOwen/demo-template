import type { Group } from 'fabric';
import { useContext } from '../hooks';
export interface GroupContextProps {
  instance: Group;
}
export interface GroupContext {
  provideGroupContext: (context: GroupContextProps) => void;
  injectGroupContext: () => GroupContextProps | undefined;
}
const { useInject, useProvide } = useContext<GroupContextProps>('GroupContext', {
  native: true
});
export default function useGroupContext(): GroupContext {
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
