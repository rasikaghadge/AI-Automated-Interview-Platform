# Use Node.js 18 base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Set environment variable to use legacy OpenSSL provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install project dependencies
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Expose the port where the application will run (if needed)
EXPOSE 3000

# Command to start the application (change this according to your setup)
CMD ["npm", "start"]
