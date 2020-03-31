import { testLifecycle } from "../../assets/utils/testLifecycle";
import { testStore } from "../../assets/utils/testStore";
import { testI18N } from "../../assets/utils/testI18N";

describe("HTMLFoxyTransactionsElement", () => {
  testLifecycle("foxy-transactions");
  testStore("foxy-transactions");
  testI18N("foxy-transactions");
});
