export const FC = {
  json: {
    config: {
      locations_billing: {},
      locations: {
        US: {
          cn: "United States",
          cc2: "US",
          cc3: "USA",
          ccnum: "840",
          alt: ["USA", "United States of America", "America"],
          boost: 4.5,
          r: {
            options: {
              TX: { n: "Texas", c: "TX", alt: [], boost: 1, active: true }
            },
            req: true,
            lang: "state"
          },
          pc: {
            req: true,
            lang: "zipcode",
            search: true,
            int: false,
            regex: "^\\\\d{5}$|^\\\\d{5}-?\\\\d{4}$"
          },
          active: true
        }
      }
    }
  }
};
