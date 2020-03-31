import { testLifecycle } from "../../assets/utils/testLifecycle";
import { testI18N } from "../../assets/utils/testI18N";

describe("HTMLFoxySignInElement", () => {
  testLifecycle("foxy-sign-in");
  testI18N("foxy-sign-in");
});
