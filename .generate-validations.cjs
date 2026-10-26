const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const sourcePath = path.join("types", "supabase.ts");
const source = ts.createSourceFile(
  sourcePath,
  fs.readFileSync(sourcePath, "utf16le"),
  ts.ScriptTarget.Latest,
  true,
);
const outputDirectory = path.join("lib", "validations");
fs.mkdirSync(outputDirectory, { recursive: true });

function getProperty(type, name) {
  return type.members.find(
    (member) =>
      ts.isPropertySignature(member) &&
      member.name.getText(source).replace(/"/g, "") === name,
  );
}

function getProperties(type) {
  return type.members.filter(ts.isPropertySignature);
}

function toPascalCase(value) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

const database = source.statements.find(
  (statement) =>
    ts.isTypeAliasDeclaration(statement) && statement.name.text === "Database",
).type;
const publicSchema = getProperty(database, "public").type;
const tables = getProperty(publicSchema, "Tables").type;
const enums = getProperty(publicSchema, "Enums").type;
const enumNames = new Set(
  getProperties(enums).map((member) =>
    member.name.getText(source).replace(/"/g, ""),
  ),
);

const enumFile = ['import { z } from "zod";', ""];
for (const member of getProperties(enums)) {
  const name = member.name.getText(source).replace(/"/g, "");
  const values = [...member.type.getText(source).matchAll(/"([^"]+)"/g)].map(
    (match) => match[1],
  );
  enumFile.push(
    `export const ${toPascalCase(name)}Schema = z.enum([${values.map((value) => JSON.stringify(value)).join(", ")}]);`,
  );
}
fs.writeFileSync(
  path.join(outputDirectory, "enums.ts"),
  `${enumFile.join("\n")}\n`,
  "utf8",
);

fs.writeFileSync(
  path.join(outputDirectory, "shared.ts"),
  `import { z } from "zod";
import type { Json } from "@/types/supabase";

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), z.union([jsonSchema, z.undefined()])),
  ]),
);
`,
  "utf8",
);

function makeSchema(typeText) {
  const parts = typeText.split(/\s+\|\s+/).map((part) => part.trim());
  const nullable = parts.includes("null");
  const baseType = parts.filter((part) => part !== "null").join(" | ");
  let schema;

  if (baseType === "string") schema = "z.string()";
  else if (baseType === "number") schema = "z.number()";
  else if (baseType === "boolean") schema = "z.boolean()";
  else if (baseType === "unknown") schema = "z.unknown()";
  else if (baseType === "never") schema = "z.never()";
  else if (baseType === "Json") schema = "jsonSchema";
  else {
    const enumMatch = baseType.match(
      /^Database\["public"\]\["Enums"\]\["([^"]+)"\]$/,
    );
    if (!enumMatch || !enumNames.has(enumMatch[1])) {
      throw new Error(`Type de colonne non pris en charge : ${typeText}`);
    }
    schema = `${toPascalCase(enumMatch[1])}Schema`;
  }

  return `${schema}${nullable ? ".nullable()" : ""}`;
}

const tableNames = [];
for (const table of getProperties(tables)) {
  const tableName = table.name.getText(source).replace(/"/g, "");
  tableNames.push(tableName);
  const insertType = getProperty(table.type, "Insert").type;
  const updateType = getProperty(table.type, "Update").type;
  const imports = new Set();
  let importsJson = false;

  for (const operationType of [insertType, updateType]) {
    for (const field of getProperties(operationType)) {
      const fieldType = field.type?.getText(source) ?? "unknown";
      const enumMatch = fieldType.match(
        /Database\["public"\]\["Enums"\]\["([^"]+)"\]/,
      );
      if (enumMatch) imports.add(toPascalCase(enumMatch[1]) + "Schema");
      if (fieldType.includes("Json")) importsJson = true;
    }
  }

  const output = ['import { z } from "zod";'];
  if (imports.size) {
    output.push(
      `import { ${[...imports].join(", ")} } from "./enums";`,
    );
  }
  if (importsJson) output.push('import { jsonSchema } from "./shared";');
  output.push("");

  for (const [operationName, operationType] of [
    ["Insert", insertType],
    ["Update", updateType],
  ]) {
    output.push(
      `export const ${toPascalCase(tableName)}${operationName}Schema = z.object({`,
    );
    for (const field of getProperties(operationType)) {
      const fieldName = field.name.getText(source).replace(/^"|"$/g, "");
      const required = !field.questionToken;
      let fieldSchema = makeSchema(field.type?.getText(source) ?? "unknown");
      if (!required) fieldSchema += ".optional()";
      output.push(`  ${JSON.stringify(fieldName)}: ${fieldSchema},`);
    }
    output.push("}).strict();", "");
  }

  fs.writeFileSync(
    path.join(outputDirectory, `${tableName}.ts`),
    `${output.join("\n")}\n`,
    "utf8",
  );
}

const barrel = tableNames.map(
  (name) =>
    `export { ${toPascalCase(name)}InsertSchema, ${toPascalCase(name)}UpdateSchema } from "./${name}";`,
);
barrel.push('export * from "./enums";', 'export { jsonSchema } from "./shared";');
fs.writeFileSync(
  path.join(outputDirectory, "index.ts"),
  `${barrel.join("\n")}\n`,
  "utf8",
);

console.log(`Generated insert/update Zod schemas for ${tableNames.length} tables.`);
