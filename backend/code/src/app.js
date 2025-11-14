import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import eoc from "express-openid-connect";
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

const { auth: oidcAuth } = eoc;
const app = express();
const port = 9999;

app.use(cors());
app.use(express.json());

app.use(
  oidcAuth({
    authRequired: false, // not all routes require authentication
    issuerBaseURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`,
    baseURL: process.env.BASE_URL || "http://localhost:9999",
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    secret: process.env.AZURE_CLIENT_SECRET, // only needed for OIDC, no session
    authorizationParams: {
      scope: "openid profile email",
      response_type: "code",
    },
    routes: {
      login: "/ms-login", // GET redirect to Microsoft login
      logout: "/ms-logout",
      callback: "/callback", // OIDC callback endpoint
    },
  })
);

// --- POST endpoint for frontend login flow ---
// Frontend sends authorization code here to exchange it for tokens
app.post("/ms-login", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.AZURE_CLIENT_ID,
          client_secret: process.env.AZURE_CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: process.env.BASE_URL + "/callback", // must match Azure registration
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    res.json(tokenData); // send tokens to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// --- Bind OIDC user info to request object ---
app.use((req, _res, next) => {
  if (req.oidc?.isAuthenticated() && req.oidc.user) {
    req.user = {
      username: req.oidc.user.name || "User",
      email: req.oidc.user.email,
      oidc_sub: req.oidc.user.sub,
    };
  }
  next();
});

// --- Simple test endpoint ---
app.get("/", (req, res) => {
  res.send("Hello World! Logged in? " + (req.user ? "Yes" : "No"));
});

app.use("/ms-login", msalRouter);

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
