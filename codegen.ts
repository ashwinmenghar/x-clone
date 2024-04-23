import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://x-server-new.onrender.com/graphql",
  // schema: "http://localhost:8000/graphql",
  documents: "**/*.{tsx,ts}",
  generates: {
    "gql/": {
      preset: "client",
      plugins: [],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
