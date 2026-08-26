import { FC, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  iconId: string;
  width: number;
  height: number;
}

export const Icon: FC<IconProps> = ({ iconId, width, height, className, ...props }) => {
  return (
    <svg width={width} height={height} {...props}>
      <use xlinkHref={`/sprite.svg#${iconId}`} />
    </svg>
  );
};

Icon.displayName = "Icon";
