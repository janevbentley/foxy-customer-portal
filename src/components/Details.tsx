import { FunctionalComponent, h } from "@stencil/core";
import { Skeleton } from "./Skeleton";

interface Props {
  summary: () => string;
  loaded?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => any;
}

export const Details: FunctionalComponent<Props> = (props, children) => (
  <details
    open={props.open}
    class="bg-base sm:rounded-m sm:shadow-xs"
    {...{
      onToggle: (e: Event) => {
        const details = e.target as HTMLDetailsElement;
        props.onToggle && props.onToggle(details.open);
      }
    }}
  >
    <summary
      class={{
        "transition duration-150 ease-in-out hover:bg-contrast-10 focus:outline-none focus:shadow-outline": true,
        "sm:rounded-t-m": props.open,
        "sm:rounded-m": !props.open
      }}
    >
      <div class="text-body text-xl select-none flex justify-between items-center px-m h-xl">
        <div class="flex-1 truncate mr-m">
          <Skeleton loaded={props.loaded} text={props.summary} />
        </div>
        <iron-icon
          icon="icons:expand-more"
          class={{
            "transform transition duration-150 ease-in-out": true,
            "rotate-180": props.open
          }}
        />
      </div>
    </summary>

    {...children}
  </details>
);
