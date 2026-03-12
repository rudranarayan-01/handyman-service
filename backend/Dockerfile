# Use Node 20 as the base image
FROM node:20

# Create the working directory
WORKDIR /app

# Copy package files from the current folder (backend/)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Build TypeScript code (if you have a build script in package.json)
RUN npm run build

# Port 5000 for your express app
EXPOSE 5000

# Start the server
CMD ["npm", "start"]