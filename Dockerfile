
# Setup Node
FROM node:18-alpine as build

# Dependency and Build
WORKDIR /app
COPY *.json ./
RUN npm install

RUN npm run build

COPY . .

# Create JS Build
# RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]