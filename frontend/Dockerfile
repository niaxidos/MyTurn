# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package.json ./package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Make port 5173 available to the world outside this container
EXPOSE 5173

# Define environment variable
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["npm", "run", "dev"]