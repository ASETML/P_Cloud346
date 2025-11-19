import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { sequelize, initDb, Book } from "./db/sequelize.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import bookRouter from "./routes/books/books.js";
import commentsRouter from "./routes/books/comments.js";
import notesRouter from "./routes/books/notes.js";
import categoryRouter from "./routes/categories/categories.js";
import categoryBooksRouter from "./routes/categories/books.js";
import authorBooksRouter from "./routes/authors/books.js";
import userRouter from "./routes/users/users.js";
import loginRouter from "./routes/auth/login.js";
import msalRouter from "./routes/auth/msal.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const port = 9999;

app.use(cors());
app.use(express.json());

//msal routes
app.use("/msal", msalRouter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Book routes
app.use("/api/books", bookRouter);
app.use("/api/books", commentsRouter);
app.use("/api/books", notesRouter);

// Category routes
app.use("/api/categories", categoryRouter);
app.use("/api/categories", categoryBooksRouter);

// Author routes
app.use("/api/authors", authorBooksRouter);

// User routes
app.use("/api/users", userRouter);

// Auth routes
app.use("/api/auth/login", loginRouter);
app.use("/api/auth/msal", msalRouter);

// Makes the uploads folder accessible at /uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Initialize database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("La connexion à la base de données a bien été établie");

    await initDb();
    console.log("Base de données initialisée avec succès");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/api/", (req, res) => {
      res.redirect(`http://localhost:${port}/`);
    });

    app.use(({ res }) => {
      const message =
        "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
      res.status(404).json(message);
    });

    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
