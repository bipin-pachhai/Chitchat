FROM node:alpine


WORKDIR /usr/nodeapp

#Bringing package.json of the App
COPY ./package.json ./

RUN npm install
#Bringing all files and folders to working directory
COPY . . 

CMD ["npm", "run", "dev"]


