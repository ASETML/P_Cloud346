import express from "express";
import jwt from "jsonwebtoken";
import { privateKey } from "../../controllers/auth/private_key.js";
import bcrypt from "bcrypt";
import { sequelize, User } from "../../db/sequelize.js";
const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Authenticate a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username: username },
    });
    if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.utilisateur_id }, "yourSecretKey", {
      expiresIn: "24h",
    });
    res.json({ message: "Login successful", data: token, userId: user.utilisateur_id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

///check for token
router.post("/token", async (req, res) => {
  const userToken = req.body.token;

  if (!userToken) {
    console.log("No token provided");
    return res.status(200).json({ valid: false });
  }

  try {
    const decodedToken = jwt.verify(userToken, "yourSecretKey");

    const existingUser = await User.findOne({
      where: { utilisateur_id: decodedToken.userId },
    });

    if (!existingUser) {
      console.log("Token user not found in DB");
      return res.status(200).json({ valid: false });
    }

    return res.status(200).json({
      valid: true,
      message: "Token is valid",
      user: {
        id: existingUser.utilisateur_id,
        username: existingUser.username,
      },
    });
  } catch (error) {
    console.log("Invalid token:", error.message);
    return res.status(200).json({ valid: false }); // <- do NOT crash the frontend
  }
});
export default router;
