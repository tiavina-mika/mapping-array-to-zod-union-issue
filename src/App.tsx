import "./styles.css";
import { Primitive, z, ZodLiteral } from "zod";

type MappedZodLiterals<T extends readonly Primitive[]> = {
  -readonly [K in keyof T]: ZodLiteral<T[K]>;
};

function createManyUnion<
  A extends Readonly<[Primitive, Primitive, ...Primitive[]]>
>(literals: A) {
  return z.union(
    literals.map((value) => z.literal(value)) as MappedZodLiterals<A>
  );
}

const options = [
  {
    label: "page",
    value: "page"
  },
  {
    label: "Blog",
    value: "blog"
  }
];

// ----------------------------------------- //
// ---------- this is not working ---------- //
// ----------------------------------------- //
const array = options.map((option): string => option.value) as [
  string,
  string,
  ...string[]
];
export const optionsNotWorkingSchema = createManyUnion(array);

type OptionNotWorking = z.infer<typeof optionsNotWorkingSchema>;
// the next value should be blog or page; but it's not trigger an error
const value0: OptionNotWorking = "xxxx"; // should trigger an error
console.log("not working value", value0);

// ----------------------------------------- //
// -------------- this works --------------- //
// ----------------------------------------- //
export const optionsSchema = createManyUnion(["page", "blog"] as const);
type Option = z.infer<typeof optionsSchema>;
// the next value should be blog or page; so it trigger an error
const value: Option = "xxxx"; // trigger an error, so it working

console.log("working value", value);

const options2 = [
  {
    label: "page",
    value: "page"
  },
  {
    label: "Blog",
    value: "blog"
  }
] as const;

// ----------------------------------------- //
// ---------------- solution --------------- //
// ----------------------------------------- //
const array2 = options2.map((option) => option.value);
export const optionsWorkingSchema = createManyUnion(
  array2 as typeof array2 & [string, string, ...string[]]
);

type OptionWorking = z.infer<typeof optionsWorkingSchema>;

const value2: OptionWorking = "xxx"; // should trigger an error
console.log("not working value", value2);

const App = () => {
  return (
    <div className="App">
      <h1>Issue with mapping readonly array to Zod union</h1>
      <code>(Fixed)</code>
    </div>
  );
};

export default App;
