/**
 * Gets parent customer portal element if it exists,
 * otherwise returns `undefined`.
 *
 * @param start Element to start looking for portal from.
 */
export function getParentPortal(
  start: Node | ShadowRoot
): HTMLFoxyCustomerPortalElement | null {
  if (start.nodeName === "FOXY-CUSTOMER-PORTAL") {
    return (start as unknown) as HTMLFoxyCustomerPortalElement;
  }

  if ("host" in start && start.host !== null) {
    return getParentPortal(start.host);
  }

  if (start.parentNode !== null) {
    return getParentPortal(start.parentNode);
  }

  return null;
}
