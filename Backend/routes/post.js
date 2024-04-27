const express = require("express");
const router = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Spécifiez le répertoire de destination où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()) + path.extname(file.originalname); // Générez un nom de fichier unique
    },
  });
// Initialiser l'upload avec multer
const upload = multer({ storage: storage });    

// Afficher tous les posts
router.get("/", async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// Afficher un post spécifique
router.get("/:id", getPost, (req, res) => {
    res.json(res.post);
  });
  
  // Créer un nouveau post
  router.post("/", async (req, res) => {
    const post = new Post({
      content: req.body.content,
      userId: req.body.userId,
      image: req.body.image,
      likes: 0,
      comments: []
    });
    try {
      const newPost = await post.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Mettre à jour un post (ajouter like, dislike)
  router.patch("/:id", getPost, async (req, res) => {
    if (req.body.likes != null) {
      res.post.likes = req.body.likes;
    }
    try {
      const updatedPost = await res.post.save();
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Supprimer un post
  router.delete("/:id", getPost, async (req, res) => {
    try {
      await res.post.remove();
      res.json({ message: "Post supprimé" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Middleware pour récupérer un post par ID
  async function getPost(req, res, next) {
    let post;
    try {
      post = await Post.findById(req.params.id);
      if (post == null) {
        return res.status(404).json({ message: "Post introuvable" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.post = post;
    next();
  }

module.exports = router;
