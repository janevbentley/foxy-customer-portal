export interface Mixin {
  root: HTMLElement;
  componentDidRender: () => any;
}

export function componentDidRender(this: Mixin) {
  /**
   * Sometimes (not on every component, but on some) `theme` is not
   * a property, but only an attribute. When Stencil renderer sets a property,
   * it doesn't reflect to the attribute and Vaadin theming breaks. This short functions fixes it
   * by setting the attribute explicitly.
   */
  Array.from(this.root.shadowRoot.querySelectorAll("[data-theme]"))
    .filter(v => v.tagName.startsWith("VAADIN-"))
    .forEach(v => v.setAttribute("theme", v.getAttribute("data-theme")));
}
