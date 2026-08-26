import { ClassNameParams, createClassNames } from "@/utils";
import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactElement } from "react";
import { IconProps } from "../Icon";

import "./Button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  classNameParams: ClassNameParams;
  icon?: ReactElement<IconProps>;
  onClick: MouseEventHandler;
}

export const Button: FC<ButtonProps> = ({
  type = "button",
  classNameParams,
  onClick,
  icon,
  children,
  ...props
}) => {
  const classNames = createClassNames("btn", classNameParams);

  return (
    <button type={type} className={classNames} onClick={onClick} {...props}>
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
};

Button.displayName = "Button";
