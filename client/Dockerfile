# Use an official Node.js runtime (version 18) as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

# Set NODE_OPTIONS to include --openssl-legacy-provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install project dependencies using Yarn
RUN yarn install

# Copy the remaining application files to the working directory
COPY . .

# Build the React app
RUN yarn build

# Expose the port on which the app will run (adjust as needed)
EXPOSE 3000

# Define the command to run your application
CMD ["yarn", "start"]
