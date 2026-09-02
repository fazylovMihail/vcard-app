import { FC, ReactElement } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { IconProps } from "../Icon";
import { ClassNameParams, createClassNames } from "@/utils";

import "./Link.scss";

interface LinkProps extends RouterLinkProps {
  icon?: ReactElement<IconProps>;
  classNameParams: ClassNameParams;
}

export const Link: FC<LinkProps> = ({
  classNameParams,
  to,
  icon,
  children,
  ...props
}) => {
  const classNames = createClassNames("link", classNameParams);

  return (
    <RouterLink to={to} className={classNames} {...props}>
      {icon && <span className="link__icon">{icon}</span>}
      {children}
    </RouterLink>
  );
};

Link.displayName = "Link";
