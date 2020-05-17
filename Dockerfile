FROM node:latest
WORKDIR /c/Users/TanziAI/nodejs_web/redis-tutorial
COPY package*.json
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]