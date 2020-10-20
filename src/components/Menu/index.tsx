import React, { useState, createContext } from "react";
import "./index.scss";
import classnames from "classnames";
import MenuItem from "./MenuItem";
import { MenuItemProps } from "./MenuItem";

type MenuMode = "horizontal" | "vertical";
type SelectCallback = (selectIndex: string) => void;
// Menu组件的参数
export interface MenuProps {
    defaultIndex?: string;
    className?: string;
    mode?: MenuMode;
    style?: React.CSSProperties;
    onSelect?: SelectCallback;
    children?: React.ReactNode;
    defaultOpenKeys?: string[];  // 默认打开哪些SubMenu菜单
}

// 定义传入子组件参数context
interface IMenuContext {
    index: string;
    onSelect?: SelectCallback;
    mode?: string;
    defaultOpenKeys?: string[];  // 默认打开哪些SubMenu菜单
}
// 导出父组件的createContext
export const MenuContext = createContext<IMenuContext>({ index: "0" })

type AllMenuProps = MenuProps & React.HTMLAttributes<HTMLElement>;


// 渲染子组件
const renderChildren = (children: any) => {
    return React.Children.map(children, (child, index) => {
        const childEl = child as React.FunctionComponentElement<MenuItemProps>;
        const { displayName } = childEl.type;
        if (displayName === "MenuItem" || displayName === "SubMenu") {
            // 克隆一个childEl元素，添加参数index
            return React.cloneElement(childEl, { index: index.toString() });
        } else {
            console.error("Warning: Menu has a child which is not a MenuItem component");
        }
    })
}

// Menu组件
const Menu: React.FC<AllMenuProps> = props => {
    const { className, mode, style, defaultIndex, children, onSelect, defaultOpenKeys, ...restProps } = props;
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const classes = classnames("pa-menu", className, {
        [`menu-${mode}`]: true
    })
    // 点击事件回调
    const handleClick = (index: string) => {
        setActiveIndex(index);
        if (onSelect) {
            onSelect(index);
        }
    }
    // 传入context的值
    const passedContext: IMenuContext = {
        index: activeIndex ? activeIndex : "0",
        onSelect: handleClick,
        mode,
        defaultOpenKeys
    }
    return (
        <ul className={classes} style={style} {...restProps} data-testid="test-menu">
            <MenuContext.Provider value={passedContext}>
                {renderChildren(children)}
            </MenuContext.Provider>
        </ul>
    )
}

MenuItem.displayName = "MenuItem";

// Menu组件的默认参数 
Menu.defaultProps = {
    defaultIndex: "0",
    defaultOpenKeys: [],
    mode: "horizontal"
}
export default Menu;