import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { privateKey } from "../../controllers/auth/private_key.js";
import sequelize from "../../db/sequelize.js";
import { QueryTypes } from "sequelize";

const router = express.Router();

// Microsoft Graph endpoint
const GRAPH_URL = "https://graph.microsoft.com/v1.0/me";

router.post("/", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token Microsoft manquant." });
    }

    // Vérifie le token Microsoft et récupère le profil
    const graphResponse = await axios.get(GRAPH_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const profile = graphResponse.data;
    const msId = profile.id;
    const displayName = profile.displayName || "Microsoft User";
    const email = profile.mail || profile.userPrincipalName;

    // Vérifie si l'utilisateur existe déjà
    let users = await sequelize.query(
      "SELECT * FROM t_utilisateur WHERE ms_id = ?",
      {
        replacements: [msId],
        type: QueryTypes.SELECT,
      }
    );

    let user;
    if (users.length === 0) {
      // Crée un nouvel utilisateur Microsoft
      const [result] = await sequelize.query(
        "INSERT INTO t_utilisateur (nom, email, ms_id) VALUES (?, ?, ?)",
        {
          replacements: [displayName, email, msId],
        }
      );

      user = {
        utilisateur_id: result,
        nom: displayName,
        email,
        ms_id: msId,
      };
    } else {
      user = users[0];
    }

    // Génère un JWT avec ta clé RSA
    const jwtToken = jwt.sign({ userId: user.utilisateur_id }, privateKey, {
      algorithm: "RS256",
      expiresIn: "24h",
    });

    return res.json({
      message: "Connexion Microsoft réussie.",
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.error("Erreur MSAL :", error.response?.data || error.message);
    return res.status(500).json({
      message: "Erreur lors de la connexion Microsoft.",
      error: error.message,
    });
  }
});

export default router;
