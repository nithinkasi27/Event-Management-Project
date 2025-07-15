FROM node:latest 
WORKDIR /devops 
COPY package*.json /devops
RUN npm install 
COPY . /devops
ENTRYPOINT ["node","server.js"]