import { defineConfig } from "orval";

export default defineConfig({
  rustruct: {
    input: {
      target: "http://localhost:3001/api/openapi.json",
    },
    output: {
      target: "./src/api/generated/hooks.ts",
      schemas: "./src/api/generated/models",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
