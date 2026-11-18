import { ButtonHTMLAttributes, FC } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "cursor-pointer transition duration-300 ease-in-out",
  variants: {
    header: {
      theme: "w-[60px] h-[30px] relative rounded-full flex justify-end",
      language: "bg-transparent",
    },
    isLight: {
      true: "text-transport-blue",
      false: "text-crayola",
    },
  },
  compoundVariants: [
    {
      header: "theme",
      isLight: true,
      class: "bg-transport-blue",
    },
    {
      header: "theme",
      isLight: false,
      class: "bg-crayola",
    },
  ],
});

type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
}

export const Button: FC<ButtonProps> = ({ variant, children, ...props }) => {
  const className = button(variant);

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

Button.displayName = "Button";
