## Chitchat Site

### Site Description
 This is simple website built on Node.js, Express and MongoDB. It mostly serves as a sample site to learn how Express framework works on backend. It includes SignUp/Login with the authentication using passportJS. All user credentials, chat and sessions will be stored on local mongoDB database.
 Most of the frontend design(css and jquery) for chat room has been used or modified from https://github.com/ezesundayeze/anonymouse-realtime-chat-app

### Hightlights
1. Login/SignUp and authentication using passportJS local strategy.

2. Store users, sessions and past room chats on  MongoDB database.

3. Realtime chat room using SOCKET.IO where authenticated users can chat with each other in real time. Also, loading of past chats as saved on database.

4. Use of EJS as frontend template 

### Installation
1. Clone this repository and run npm install
2. Then run 'npm run dev' 
3. visit localhost:4000 on website and explore.
### Docker Guideline
 If you have docker installed in your computer, you can also run this app in docker containers. You just need to run 'docker-compose up --build' in your terminal. Visit localhost:4000 on website and explore.

### Note:
You should have mongoDB, nodeJS and Docker(optional) installed and started for this application to work correctly.