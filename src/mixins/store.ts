import deepmerge from "deepmerge";
import { EventEmitter } from "@stencil/core";
import { check as isSignedIn } from "../api/authenticate";
import { FullGetResponse } from "../api";
import { getParentPortal } from "../assets/utils/getParentPortal";
import { customer } from "../assets/defaults";

export interface Mixin {
  root: HTMLElement;
  state: FullGetResponse;
  update: EventEmitter<FullGetResponse>;
  getRemoteState: () => Promise<Partial<FullGetResponse> | null>;
  getState: (forceReload: boolean) => Promise<FullGetResponse>;
  setState: (value: Partial<FullGetResponse>) => Promise<void>;
  componentDidLoad: () => any;
}

export const defaults = {
  state(this: Mixin) {
    return customer();
  }
};

export async function getState(this: Mixin, forceReload = false) {
  if (forceReload && isSignedIn()) {
    const state = await this.getRemoteState();

    if (state !== null) {
      await this.setState(state);
      this.update.emit(this.state);
    }
  }

  return this.state;
}

export async function setState(this: Mixin, value: Partial<FullGetResponse>) {
  this.state = deepmerge(this.state, value, {
    arrayMerge: (_, source) => source
  });
}

export async function componentDidLoad(this: Mixin) {
  const portal = getParentPortal(this.root);

  if (portal === null || portal === this.root) {
    await this.getState(true);
  } else {
    await portal.setState(await portal.getState());
  }
}
