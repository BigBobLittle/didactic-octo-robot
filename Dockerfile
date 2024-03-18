# Use the official Node.js 18 image as a base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on (default: 3000)
EXPOSE 3000

# Run the Next.js application
CMD ["npm", "run", "start"]
