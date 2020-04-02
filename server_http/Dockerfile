FROM node:10

WORKDIR /server_http/

COPY package.json ./

RUN npm install
# RUN npm ci --only=production
RUN npm install supervisor -g

COPY ./src/ ./src/

EXPOSE 5000

CMD [ "supervisor", "./src/server.js" ]
# CMD [ "tail", "-f", "/dev/null" ]