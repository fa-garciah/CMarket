import { defineConfig } from "prisma/config";

export default defineConfig({
datasource: {
    // Load environment variables here
    url: process.env.DATABASE_URL, 
}

});