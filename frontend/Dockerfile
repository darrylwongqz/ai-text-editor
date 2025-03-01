# Stage 1: Build the React app using Node.js.
FROM node:18 as builder
WORKDIR /app

# Copy package files and install dependencies.
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app and build.
COPY . .
RUN npm run build

# Stage 2: Serve the static files with Nginx.
FROM nginx:alpine
# Remove the default Nginx static assets.
RUN rm -rf /usr/share/nginx/html/*
# Copy our build output to Nginx's html directory.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80.
EXPOSE 80

# Run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]