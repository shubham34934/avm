#!/bin/bash

# Print Node.js and npm versions
node -v
npm -v

# Install dependencies
npm install

# Build the application
npm run build

# List the contents of the dist directory to verify output
echo "Contents of dist directory:"
ls -la dist/

# Output success message
echo "Build completed successfully!"
