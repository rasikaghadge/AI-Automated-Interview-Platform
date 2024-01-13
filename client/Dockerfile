# Use an official Node.js runtime (version 18) as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

# Set NODE_OPTIONS to include --openssl-legacy-provider
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV REACT_APP_API=https://ai-interviewer-backend.onrender.com
ENV API_BASE_URL=https://api.videosdk.live
ENV SKIP_PREFLIGHT_CHECK=true
ENV NODE_ENV=production
ENV VIDEOSDK_API_KEY=$VIDEOSDK_API_KEY
ENV VIDEOSDK_SECRET_KEY=$VIDEOSDK_SECRET_KEY
ENV VIDEOSDK_API_ENDPOINT=https://api.videosdk.live
ENV CI=true
ENV REACT_APP_VIDEOSDK_TOKEN=$REACT_APP_VIDEOSDK_TOKEN

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
