import { defineConfig } from "prisma/config";

export default defineConfig({
datasource: {
    // Load environment variables here
    url: process.env.DATABASE_URL, 
},
// Generator settings can also be moved here if necessary
generator: {
    name: 'client',
    provider: 'prisma-client-js',
},
});