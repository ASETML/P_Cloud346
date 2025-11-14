import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { privateKey } from "../../controllers/auth/private_key.js";
import bcrypt from "bcrypt";
import { sequelize, User } from "../../db/sequelize.js";
import { QueryTypes } from "sequelize";

const router = express.Router();

// redirect on OIDC login
router.get("/", (req, res) => {
  res.redirect("/ms-login");
});

router.post("/", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Code not provided");

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.AZURE_CLIENT_ID);
    params.append("scope", "openid profile email");
    params.append("code", code);
    params.append("redirect_uri", process.env.BASE_URL + "/callback");
    params.append("grant_type", "authorization_code");
    params.append("client_secret", process.env.AZURE_CLIENT_SECRET);

    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Вернуть токен фронтенду
    res.json(tokenResponse.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Token exchange failed");
  }
});

/*
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
        "INSERT INTO t_utilisateur (username, email, ms_id, date_creation, is_admin) VALUES (?, ?, ?, NOW(), false)",
        {
          replacements: [displayName, email, msId],
        }
      );

      if (users.length === 0) {
        // create user from model
        user = await User.create({
          username: displayName,
          email,
          ms_id: msId,
          isAdmin: false,
        });
      }
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
});*/

export default router;
