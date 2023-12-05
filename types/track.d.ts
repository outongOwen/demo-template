declare namespace Track {
  interface ActionBarItem {
    /** 显示/隐藏 */
    isHide?: boolean;
    /** 图标 */
    icon?: string | VNode | Component;
    /** 按钮label */
    label: string;
    /** 按钮类型 */
    btnType: 'Button' | 'Popselect' | 'Dropdown' | 'CPopselect' | 'Slider';
    /** 按钮key */
    key?: string;
    /** 替换图标 */
    replaced?: boolean;
    /**  选中状态 */
    checked?: boolean;
    /**  锁定状态 */
    locked?: boolean;
    /**  取消选中状态 */
    cancelChecked?: boolean;
    /**  默认选中值 */
    defaultValue?: string | number | boolean | undefined;
    /**  禁用状态 */
    disabled?: boolean;
    /**  下拉选项 */
    options?: import('naive-ui').SelectOption[] | import('naive-ui').DropdownOption[];
    /** 最大值 */
    max?: number;
    /** 最小值 */
    min?: number;
    /** 步长 */
    step?: number;
    /** 标记点 */
    marks?: Array<number>;
    /** 改变之前 */
    beforeChange?: (state?: boolean) => Promise<boolean>;
    /**  选中回调 */
    change?: (value: string | number | boolean | undefined, state?: boolean) => void;
  }
}
