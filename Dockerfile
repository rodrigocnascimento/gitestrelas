FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_PUBLIC_POSTHOG_KEY
ENV VITE_PUBLIC_POSTHOG_KEY=$VITE_PUBLIC_POSTHOG_KEY
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist /app/dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
