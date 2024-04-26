const Offer = require("../models/offer");


const  User = require('../models/user');



async function getAllOffers(req, res) {
  try {
    const { searchTerm, offerType, contractType } = req.query; // Récupérer les termes de recherche depuis les paramètres de requête

    let query = { archived: false }; // Filtre pour récupérer uniquement les offres non archivées par défaut

    // Si un terme de recherche est fourni, mettez à jour la requête pour inclure le filtre de recherche sur le titre de l'offre
    if (searchTerm) {
      query = {
        ...query,
        title: { $regex: searchTerm, $options: 'i' } // Recherche insensible à la casse dans le titre de l'offre
      };
    }

    // Si un type d'offre est fourni, ajoutez le filtre correspondant
    if (offerType) {
      query = {
        ...query,
        offerType: offerType // Filtre sur le type d'offre
      };
    }

    // Si un type de contrat est fourni, ajoutez le filtre correspondant
    if (contractType) {
      query = {
        ...query,
        contractType: contractType // Filtre sur le type de contrat
      };
    }

    const data = await Offer.find(query);



    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getOfferById(req, res) {
  try {
    const data = await Offer.findById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addOffer(req, res) {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json({ message: "Offer added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateOffer(req, res) {
  try {
    await Offer.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Offer updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteOffer(req, res) {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



async function archiveOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Always set the offer as archived
    offer.archived = true;

    // Save the changes
    await offer.save();

    return res.status(200).json({ message: "Offer archived successfully" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}




async function archiveExpiredOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Récupérer la date actuelle au format ISO 8601 (UTC)
    const currentDate = new Date().toISOString().split('T')[0];

    // Vérifier si la date d'expiration est dépassée
    const expirationDate = new Date(offer.expirationDate);

    console.log('Current Date:', currentDate);
    console.log('Expiration Date:', expirationDate.toISOString().split('T')[0]);

    if (currentDate >= expirationDate.toISOString().split('T')[0]) {
      // Marquer l'offre comme archivée
      offer.archived = true;

      // Sauvegarder les modifications
      await offer.save();

      return res.status(200).json({ message: "Offer archived successfully" });
    } else {
      return res.status(400).json({ error: "Offer is not expired yet" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
async function unarchiveOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    if (!offer.archived) {
      return res.status(400).json({ error: "Offer is not archived" });
    }

    // Set the offer as unarchived
    offer.archived = false;

    // Save the changes
    await offer.save();

    return res.status(200).json({ message: "Offer unarchived successfully" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}



async function getArchivedOffers(req, res) {
  try {
    const archivedOffers = await Offer.find({ archived: true });
    res.status(200).json(archivedOffers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

//crud commentaire 
async function addComment(req, res) {

  try {
    const { text } = req.body;
    const offer = await Offer.findById(req.params.offerId);
    const user = await User.findById(req.params.userId);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //io.emit('newComment', {
     // message: `${user.firstname} ${user.lastname} a fait un commentaire sur l'offre '${offer.title}'`
    //});
    offer.comments.push({ text: text, user: user._id }); // Ajout de l'ID de l'utilisateur au commentaire
    await offer.save();
    io.emit('commentUpdate', req.params.offerId);
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
async function updateComment(req, res) {
  try {
    const { text } = req.body;
    const offer = await Offer.findById(req.params.offerId);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const comment = offer.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Mettre à jour le texte du commentaire
    comment.text = text;

    // Enregistrer les modifications dans la base de données
    await offer.save();

    // Répondre avec un message de succès
    return res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    // Gérer les erreurs
    return res.status(400).json({ error: err.message });
  }
}



async function deleteComment(req, res) {
  try {
    // Récupérer l'utilisateur courant
    const user = await User.findById(req.params.userId);

    // Vérifier si l'utilisateur courant est défini
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const offer = await Offer.findById(req.params.offerId);
    
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const commentIndex = offer.comments.findIndex(comment => comment._id.toString() === req.params.commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = offer.comments[commentIndex];
    console.log('Comment user ID:', comment.user.toString());
    console.log('Current user ID:', user._id.toString());
    
    // Vérifier si l'ID de l'utilisateur courant correspond à l'ID de l'utilisateur qui a créé le commentaire
    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer ce commentaire" });
    }

    await offer.comments.pull({ _id: req.params.commentId });  // Utilisez pull pour supprimer le commentaire par son ID
    await offer.save();
    io.emit('commentUpdate', req.params.offerId);

    res.status(200).json({ message: "Commentaire supprimé avec succès" });
  } catch (err) {
    console.log("Error deleting comment:", err.message);
    res.status(500).json({ error: err.message });
  }
}







async function getCommentsByOfferId(req, res) {
  try {
    const offer = await Offer.findById(req.params.offerId).populate('comments.user', 'firstname lastname');
    
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Récupérer les commentaires de l'offre avec les noms complets des utilisateurs pour chaque commentaire
    const comments = await Promise.all(offer.comments.map(async (comment) => {
      const user = await User.findById(comment.user);
      if (user) {
        return {
          ...comment._doc,
          user: `${user.firstname} ${user.lastname}`
        };
      }
      return comment;
    }));

    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// CRUD pour les likes
async function addLike(req, res) {
  try {
    const offer = await Offer.findById(req.params.offerId);
    const user = await User.findById(req.params.userId);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has already liked the offer
    if (!offer.likes.includes(req.params.userId)) {
      offer.likes.push(req.params.userId);
      await offer.save();
      io.emit('likeUpdate', req.params.offerId);
      return res.status(201).json({ message: "Like added successfully" });
    } else {
      return res.status(400).json({ error: "You have already liked this offer" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}






async function removeLike(req, res) {
  try {
    const userId = req.params.userId; // Récupérez l'ID de l'utilisateur depuis les paramètres de la requête
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Vérifier si offer.likes est défini
    if (!offer.likes || !Array.isArray(offer.likes)) {
      return res.status(400).json({ error: "You have not liked this offer" });
    }

    // Vérifier si l'utilisateur a aimé l'offre
    if (offer.likes.includes(userId)) {
      offer.likes = offer.likes.filter(like => like.toString() !== userId.toString());
      await offer.save();
      io.emit('likeUpdate', req.params.offerId);
      return res.status(200).json({ message: "Like removed successfully" });
    } else {
      return res.status(400).json({ error: "You have not liked this offer" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}




// Ajoutez une nouvelle route pour obtenir le nombre de likes d'une offre spécifique
async function getLike(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.status(200).json({ likes: offer.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}








module.exports = {
  getAllOffers,
  getOfferById,
  addOffer,
  updateOffer,
  deleteOffer,

  addComment,
  updateComment,
  deleteComment,
  archiveOffer,
  archiveExpiredOffer, 
  unarchiveOffer,
  getArchivedOffers ,
  addLike,
  removeLike,
  getCommentsByOfferId,
  getLike,


};
