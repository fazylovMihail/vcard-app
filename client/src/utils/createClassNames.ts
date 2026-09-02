export interface ClassNameParams {
  modificators?: string[];
  dubleClassNames?: string[];
}

export default function createClassNames(
  baseClassNames: string,
  params?: ClassNameParams
): string {
  if (!params || typeof params !== "object") return baseClassNames;

  const validParams = Object.values(params)
    .flat()
    .filter((param): param is string => typeof param === "string" && param.trim() !== "")
    .join(" ");

  return `${baseClassNames} ${validParams}`.trim();
}
