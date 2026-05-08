# Use a lightweight Node.js environment
FROM node:20-alpine

# Set the working directory inside the container directly to the server folder
WORKDIR /app/server

# Copy ONLY the server's package files first (better for caching)
COPY server/package*.json ./

# Install the backend dependencies
RUN npm install

# Copy the rest of the server code into the container
COPY server/ ./

# Expose the port your Express server runs on (adjust if your server.js uses a different port, e.g., 5000 or 8080)
EXPOSE 3000

# Start the application using the server's package.json script
CMD ["npm", "start"]
