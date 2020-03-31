import { testLifecycle } from "../../assets/utils/testLifecycle";
import { testStore } from "../../assets/utils/testStore";
import { testI18N } from "../../assets/utils/testI18N";

describe("HTMLFoxySubscriptionsElement", () => {
  testLifecycle("foxy-subscriptions");
  testStore("foxy-subscriptions");
  testI18N("foxy-subscriptions");
});
