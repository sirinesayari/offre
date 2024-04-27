const express = require("express");
const cors = require("cors");

const session = require("express-session");
const logger = require("morgan");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const passport = require("passport");
const app = express();
const router = express.Router();
app.use(express.static('images'));
dotenv.config();
const { Connect } = require("./config/connect.js");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const chatRoomRouter = require("./routes/chat");
const messageRouter = require("./routes/messages");
const googleAuth = require("./routes/index");
const path = require("path");
const interviewRouter = require("./routes/interview")
const feedbackRouter = require("./routes/feedback")

//socket 
const http = require('http');
const server = http.createServer(app);
const Server = require('socket.io');

const io =  Server(server);

io.on('connection', (socket) => {
    //console.log('New client connected',socket.id);
    socket.on('comment',(msg)=>{
      console.log('new-comment',msg);
    })
  })

exports.io =io


// Connect to MongoDB
Connect()
  .then(() => {
    console.log("Database connected");
    mongoose.connect(process.env.MONGO_URI);
  })
  .catch((err) => console.error("Database connection error:", err));

// Middleware


// Configuration CORS pour autoriser les connexions depuis certains domaines
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'] // Autoriser les deux front-ends
}));






const questionRouter = require("./routes/question");
const candRouter = require("./routes/candidature")
const quizRoutes = require('./routes/quiz');
const offerRouter =require("./routes/offer");
const postRoute =require("./routes/post");


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000']  }));

// Middleware pour analyser les corps de requête JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Définition d'une route pour servir des images statiques
app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  // Construct the path to the image file
  const imagePath = path.join(__dirname, 'images', imageName);
  // Send the image file as the response
  res.sendFile(imagePath);
});
// Spécifiez le répertoire contenant vos fichiers statiques
app.use('/', express.static('uploads'));
// Routes
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRoomRouter);
app.use('/messages', messageRouter);
app.use("/password-reset", passwordResetRoutes);
app.use('/interviews', interviewRouter) 
app.use('/feedbacks', feedbackRouter )

// Middleware de session pour Express
app.use(
  session({
    secret: "secret",// Chaîne aléatoire utilisée pour signer le cookie de session
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",//"none" pour les connexions cross-origin
      secure: true //doit être envoyé uniquement sur HTTPS
    }
  })
);

// Activation du middleware CORS pour le routeur Express
router.use(cors());

// Middleware de journalisation : enregistrer des informations sur les requêtes entrantes sur le serveur.
app.use(logger("dev"));

// Middleware pour initialiser Passport
app.use(passport.initialize()); //utilisée pour l'authentification des utilisateurs
require("./auth/google-auth.js")(passport);

// Routes
app.use("/", googleAuth);






// Routes
app.use('/question', questionRouter);
app.use('/candidature', candRouter);

app.use('/quiz', quizRoutes);
app.use('/offer',offerRouter);
app.use('/post',postRoute);






router.use(cors());



// Configuration du serveur

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));









module.exports = app;

