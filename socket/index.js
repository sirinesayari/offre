const io = require("socket.io")(8800, {
  // Configuration CORS pour autoriser les connexions depuis certains domaines
  cors: {
    origin: ["http://localhost:3000", "http://localhost:4000"],
  },
});

// Tableau pour stocker les utilisateurs actifs
let activeUsers = [];

// Gestionnaire d'événements pour les nouvelles connexions
io.on("connection", (socket) => {
  // Événement déclenché lorsqu'un nouveau utilisateur est ajouté
  socket.on("new-user-add", (newUserId) => {
    // Vérifier si l'utilisateur est déjà ajouté
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      // Ajouter le nouvel utilisateur à la liste des utilisateurs actifs
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // Diffuser la liste des utilisateurs actifs à tous les clients
    io.emit("get-users", activeUsers);
  });

  // Événement déclenché lorsqu'une connexion est interrompue
  socket.on("disconnect", () => {
    // Supprimer l'utilisateur déconnecté de la liste des utilisateurs actifs
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // Diffuser la liste des utilisateurs actifs à tous les clients
    io.emit("get-users", activeUsers);
  });

  // Événement déclenché lorsqu'un client envoie un message à un autre utilisateur
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    // Rechercher l'utilisateur destinataire dans la liste des utilisateurs actifs
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      // Envoyer le message au socket du destinataire spécifique
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});
