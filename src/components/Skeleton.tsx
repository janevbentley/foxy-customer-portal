import { FunctionalComponent, h } from "@stencil/core";

interface Props {
  loaded: boolean;
  text: () => string;
}

export const Skeleton: FunctionalComponent<Props> = props =>
  props.loaded ? (
    props.text()
  ) : (
    <div class="relative" data-e2e="skeleton">
      <div class="bg-contrast-5 rounded my-xs absolute inset-0" />
      &nbsp;
    </div>
  );
