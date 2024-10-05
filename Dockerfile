# Build  node js image from typescript image

FROM node:latest as builder

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

# Development stage
FROM builder as development
# Set NODE_ENV to development
ENV NODE_ENV=development

# Expose the port the app runs on
EXPOSE 8800

# Command to run the application(in development)
CMD ["npm", "run", "dev"]

# Production stage
FROM builder as production
# Set NODE_ENV to production
ENV NODE_ENV=production

# Run any production-specific build steps if needed here

# Run the production command
CMD ["npm", "start"]





