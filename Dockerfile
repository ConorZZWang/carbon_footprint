# Build Stage
FROM node:18-alpine AS build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Apache2 Stage
FROM httpd:alpine
COPY --from=build /app/client/build/ /usr/local/apache2/htdocs/
EXPOSE 80
CMD ["httpd-foreground"]
