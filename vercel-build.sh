#!/bin/bash

# Print Node.js and npm versions for debugging
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build

# Verify the build output
echo "Checking build output..."
ls -la dist/

# Create a simple verification file in the dist directory
echo "Creating verification file..."
echo "Build completed successfully at $(date)" > dist/build-info.txt

echo "Build process completed successfully!"
