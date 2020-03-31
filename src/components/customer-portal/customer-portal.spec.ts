import { testLifecycle } from "../../assets/utils/testLifecycle";
import { testStore } from "../../assets/utils/testStore";
import { testI18N } from "../../assets/utils/testI18N";

describe("HTMLFoxyCustomerPortalElement", () => {
  testLifecycle("foxy-customer-portal");
  testStore("foxy-customer-portal");
  testI18N("foxy-customer-portal");
});
