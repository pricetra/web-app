import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/graphql',
  documents: ['graphql/documents/**/*.ts'],
  generates: {
    'graphql/types/': {
      preset: 'client',
      // plugins: ['typescript', 'typescript-operations'],
      config: {
        // avoidOptionals: true,
        scalars: {
          ID: 'number',
        },
      },
    },
  },
};
export default config;
