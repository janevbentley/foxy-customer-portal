import { FunctionalComponent, h } from "@stencil/core";
import { Skeleton } from "./Skeleton";

interface Props {
  disabled?: boolean;
  loaded?: boolean;
  target?: "_blank";
  theme?: "primary" | "error";
  href?: string;
  icon?: string;
  text?: () => string;
  e2e?: string;
}

export const LinkButton: FunctionalComponent<Props> = ({
  theme = "primary",
  disabled = false,
  loaded = false,
  target,
  href,
  icon,
  text,
  e2e
}) => (
  <a
    rel={target === "_blank" ? "nofollow noopener noreferrer" : undefined}
    href={!disabled && Boolean(href) ? href : undefined}
    target={target}
    data-e2e={e2e}
    class={{
      "transition duration-150 p-m cursor-pointer text-s font-lumo flex items-center h-s px-s rounded": true,
      "hover:no-underline focus:outline-none focus:shadow-outline": true,
      "text-primary hover:text-primary-50": !disabled && theme === "primary",
      "text-error hover:text-error-50": !disabled && theme === "error",
      "text-contrast-50 pointer-events-none": disabled
    }}
  >
    {icon && <iron-icon icon={`icons:${icon}`} />}
    <div class="ml-xs">
      <Skeleton loaded={loaded} text={text} />
    </div>
  </a>
);
