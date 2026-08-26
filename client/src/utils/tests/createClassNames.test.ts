import createClassNames from "../createClassNames";

describe("createClassNames function", () => {
  it.each([
    {
      scenario: "success with full filled params",
      baseClassName: "class-name",
      params: {
        modificators: ["class-name--center", "class-name--black"],
        dubleClassNames: ["double__class-name"],
      },
      result: "class-name class-name--center class-name--black double__class-name",
    },
    {
      scenario: "success with one param filled",
      baseClassName: "class-name",
      params: {
        modificators: ["class-name--center", "class-name--black"],
      },
      result: "class-name class-name--center class-name--black",
    },
    {
      scenario: "success if params not filled",
      baseClassName: "class-name",
      params: {},
      result: "class-name",
    },
  ])(
    "classNames must equal the result based on the scenario: $scenario",
    ({ baseClassName, params, result }) => {
      const classNames = createClassNames(baseClassName, params);
      expect(classNames).toBe(result);
    }
  );
});
