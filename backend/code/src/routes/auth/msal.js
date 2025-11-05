import express from "express";
import jwt from "jsonwebtoken";
import fetch from "node-fetch"; // для проверки MS Graph API
import { sequelize } from "../../db/sequelize.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: "No MS token provided" });

  try {
    // Получаем профиль через Graph API
    const response = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profile = await response.json();

    if (!profile.id)
      return res.status(400).json({ message: "Invalid MS token" });

    // Проверяем есть ли пользователь в БД
    let [user] = await sequelize.query(
      "SELECT * FROM t_utilisateur WHERE ms_id = ?",
      { replacements: [profile.id], type: sequelize.QueryTypes.SELECT }
    );

    if (!user) {
      // Создаем пользователя
      await sequelize.query(
        "INSERT INTO t_utilisateur (username, ms_id, date_creation, is_admin) VALUES (?, ?, NOW(), false)",
        { replacements: [profile.displayName, profile.id] }
      );

      [user] = await sequelize.query(
        "SELECT * FROM t_utilisateur WHERE ms_id = ?",
        { replacements: [profile.id], type: sequelize.QueryTypes.SELECT }
      );
    }

    // Генерируем JWT как у обычной регистрации
    const jwtToken = jwt.sign(
      { userId: user.utilisateur_id },
      "yourSecretKey",
      {
        expiresIn: "24h",
      }
    );

    res.json({ jwt: jwtToken, userId: user.utilisateur_id });
  } catch (error) {
    console.error("MSAL login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
