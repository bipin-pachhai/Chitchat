require("dotenv").config();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");
var session = require("express-session");
var setUpPassport = require("./config/settinguppassport");
var Chat = require("./models/chats");
var routes = require("./routes/routes");
let cors = require('cors');
var app = express();

app.use(cors());
// defining the error handler middleware
function errorHandler(err, req, res, next){
	if(err){
		res.send('<h1> Error occured!! Please try again.</h1>');
		//we can also handle the error on the frontend. For eg: res.json({err: err})
	}
 }  
//to store session on local mongoDB database
const MongoStore = require('connect-mongo')(session);

//mongodb container is called mymongo in docker-compose.yml file so it's my mongo instead of localhost
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true

})
.then(()=>{
  console.log("DB connected successfully!!");
})
.catch((err)=>{
  console.log(err);
});

// as settinguppassport is exported as function, we call it as a SINGLE function that does setting up Password stuff.
setUpPassport();

app.set("port", process.env.PORT || 4000 );

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//setting static folder to serve static file like .css , .js
app.use(express.static(path.join(__dirname, "/public")));
// now bodyparser in included in express itself. For collecting form data, we can simply say
//app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
  	url: process.env.DATABASE,
  	collection: 'sessions',
  	cookie:{},

  }),
  }));

app.use(flash());

//integrating socketio
var server = require("http").createServer(app);
var socketio = require("socket.io");
var io = socketio(server);
      //Run when client connects
io.on("connection", socket =>{ 
  
  //console.log('New socket connection...');
  socket.emit('welcome','Welcome to the professional Business Chat Room' );
  socket.on('chat message', (data) => {
  //console.log('message: ' + data.message);
   // Storing the chats in mongoDB database
  mongoose.createConnection(process.env.DATABASE, function(err, db) {
    if (err) {
        console.log('Could not save the chats', err);
    } else {
              var newChat = new Chat({
                message: data.message,
                sender: data.sender
              });  
              newChat.save();
              //console.log('new chat saved');
 
     }
  });
     

    socket.broadcast.emit('chat message', data);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(errorHandler);

server.listen(app.get("port"), function() { 
  console.log("Server started on port " + app.get("port"));
  
});
