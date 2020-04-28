import { FunctionalComponent, h } from "@stencil/core";

interface Props {
  title?: string;
  href?: string;
  text?: string;
}

export const Link: FunctionalComponent<Props> = props => (
  <a
    {...(Boolean(props.href) ? { href: props.href } : {})}
    title={props.title}
    target="_blank"
    rel="nofollow noreferrer noopener"
    class={{
      "px-xs -mx-xs inline-block text-body rounded-m leading-s font-medium text-m hover:no-underline focus:outline-none": true,
      "transition duration-150 hover:text-primary focus:shadow-outline": Boolean(
        props?.href
      )
    }}
  >
    {props?.text ?? ""}

    {Boolean(props?.href) && (
      <iron-icon class="iron-icon-14px ml-xs" icon="open-in-new" />
    )}
  </a>
);
