import { testLifecycle } from "../../assets/utils/testLifecycle";
import { testStore } from "../../assets/utils/testStore";
import { testI18N } from "../../assets/utils/testI18N";

describe("HTMLFoxyProfileElement", () => {
  testLifecycle("foxy-profile");
  testStore("foxy-profile");
  testI18N("foxy-profile");
});
