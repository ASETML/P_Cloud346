import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { privateKey } from "../../controllers/auth/private_key.js";
import bcrypt from "bcrypt";
import { sequelize, User } from "../../db/sequelize.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ---------------------------
// 1) REDIRECT USER TO MICROSOFT LOGIN PAGE
// ---------------------------
router.get("/login", (req, res) => {
  // Build the Microsoft OAuth2 authorization URL
  const authUrl =
    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize` +
    `?client_id=${process.env.AZURE_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    `&response_mode=query` +
    `&scope=openid profile email offline_access`;

  // Redirect the user's browser to Microsoft login
  res.redirect(authUrl);
});

// ---------------------------
// 2) CALLBACK: EXCHANGE CODE FOR TOKENS
// ---------------------------
/*CODE - the authorization code is a temporary string that Microsoft sends to your app after the user logs in and consents. */
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "No code" });

  // Prepare the POST data for token exchange
  const params = new URLSearchParams({
    client_id: process.env.AZURE_CLIENT_ID,
    client_secret: process.env.AZURE_CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
  });

  try {
    // Request tokens from Microsoft
    const tokenRes = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      params
    );

    const accessToken = tokenRes.data.access_token;

    // Fetch the user's Microsoft profile using Microsoft Graph
    const graphRes = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profile = graphRes.data;
    const msId = profile.id;
    const displayName = profile.displayName || "MS User";
    const email = profile.mail || profile.userPrincipalName;

    // Check if the user already exists in our database
    let user = await User.findOne({ where: { ms_id: msId } });

    if (!user) {
      // Generate a random temporary password for the MS user
      const randomPassword = Math.random().toString(36).slice(-12); // random string
      const hashed = await bcrypt.hash(randomPassword, 10); // hash it

      // Create a new user record in the database
      user = await User.create({
        username: displayName,
        email: email,
        ms_id: msId,
        hashed_password: hashed, // hashed password instead of null
        isAdmin: false,
      });
    }

    // Generate JWT for application authentication
    const jwtToken = jwt.sign(
      { userId: user.utilisateur_id },
      process.env.OIDC_SECRET,
      { algorithm: "HS256", expiresIn: "24h" }
    );

    // Respond with all tokens and user info
    return res.json({
      message: "Connexion Microsoft réussie",
      access_token: accessToken,
      id_token: tokenRes.data.id_token,
      jwt: jwtToken,
      user,
    });
  } catch (error) {
    console.error("TOKEN ERROR:", error.response?.data || error.message);
    return res.status(500).json({ error: "Token exchange failed" });
  }
});

export default router;
