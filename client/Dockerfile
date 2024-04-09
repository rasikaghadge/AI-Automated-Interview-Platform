# Use Node.js 18 base image
FROM node:19.5.0-alpine

# Set the working directory inside the container
WORKDIR /app

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
