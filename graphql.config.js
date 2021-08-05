// graphql.config.js
export const projects = {
  app: {
    schema: ['src/app/graphql/*.graphql'],
    documents: ['**/*.{graphql,js,ts,jsx,tsx}'],
    extensions: {
      endpoints: {
        default: {
          url: 'http://localhost:3000/graphql',
          // headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
        },
      },
    },
  },
};
