import clsx from "clsx";
import type { PropsWithChildren } from "react";

export const Card = ({
  children,
  className
}: PropsWithChildren<{ className?: string }>) => {
  return <section className={clsx("card", className)}>{children}</section>;
};
