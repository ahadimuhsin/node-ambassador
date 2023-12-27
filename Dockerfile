FROM node:20

# set working directory
WORKDIR /app
# copy all prefix package.json
COPY package.json .
COPY package-lock.json .
# run npm install
RUN npm install
# copy all directory to root
COPY . .
# run nodemon
CMD npm start

