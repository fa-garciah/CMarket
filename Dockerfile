FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# ARG SENTRY_AUTH_TOKEN
# ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# ARG SENTRY_ENVIRONMENT
# ENV SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

RUN curl -sSfL https://raw.githubusercontent.com/cosmic-chimps/bella-baxter-cli/main/scripts/install-bella.sh | bash

RUN --mount=type=secret,id=BELLA_BAXTER_API_KEY \
  export BELLA_BAXTER_API_KEY=$(cat /run/secrets/BELLA_BAXTER_API_KEY) && \
  bella whoami

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN npx prisma generate

RUN --mount=type=secret,id=BELLA_BAXTER_API_KEY \
  export BELLA_BAXTER_API_KEY=$(cat /run/secrets/BELLA_BAXTER_API_KEY) && \
  bella run -- npm run build

EXPOSE 3000

CMD ["bella", "run", "--", "sh", "-c", "npx prisma db push && npx prisma db seed && npm start"]
