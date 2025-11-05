import { sequelize, Book, Evaluate } from "../db/sequelize.js";
import { Op } from "sequelize";
import { success } from "../helper.js";
import { CategoryModel } from "../model/CategoryModel.js";
import { WriterModel } from "../model/WriterModel.js";

const bookController = {
  async getBookByUserId(req, res) {
    try {
      const books = await sequelize.models.t_livre.findAll({
        where: { user_id: req.params.id },
      });
      return res.json(
        success(`Books by user${req.params.id} retrieved successfully`, books)
      );
    } catch (error) {
      res.status(500).json({
        message: "Error happend while we tried to retrieve your books",
        data: error,
      });
    }
  },

  // Create a new book
  async createBook(req, res) {
    try {
      const {
        titre,
        annee_edition,
        resume,
        editeur,
        nombre_de_page,
        category_nom,
        writer_nom,
      } = req.body;

      // Validate user exists first
      const user = await sequelize.models.t_user.findByPk(req.body.userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found. Cannot create book for non-existent user.",
        });
      }

      const lien_image = req.file ? "/uploads/" + req.file.filename : null;

      const t_category = sequelize.models.t_category;
      const t_ecrivain = sequelize.models.t_ecrivain;

      // Find or create a category
      let category = await t_category.findOne({ where: { nom: category_nom } });
      if (!category) {
        category = await t_category.create({ nom: category_nom });
      }

      // Find or create a writer
      const [prenom, ...nomParts] = writer_nom.trim().split(" ");
      const nom_de_famille = nomParts.join(" ") || "";

      let writer = await t_ecrivain.findOne({
        where: { prenom, nom_de_famille },
      });
      if (!writer) {
        writer = await t_ecrivain.create({ prenom, nom_de_famille });
      }
      // Create a book
      const book = await Book.create({
        titre,
        annee_edition,
        resume,
        editeur,
        nombre_de_page,
        lien_image,
        category_id: category.categorie_id,
        writer_id: writer.ecrivain_id,
        user_id: req.body.userId,
      });

      res
        .status(201)
        .json(
          success(`The book ${book.titre} has been created successfully!`, book)
        );
    } catch (error) {
      console.error("Error while creating the book:", error);
      res.status(500).json({
        message: "Error while creating the book.",
        data: error.message,
      });
    }
  },

  // Get all books or search by title
  async getAllBooks(req, res) {
    try {
      const { name, limit = 3 } = req.query;
      let books;

      if (name && name.length >= 2) {
        books = await Book.findAndCountAll({
          where: { titre: { [Op.like]: `%${name}%` } },
          order: [["titre", "ASC"]],
          limit: parseInt(limit),
        });
        return res.json(
          success(
            `Il y a ${books.count} livres correspondant à la recherche.`,
            books
          )
        );
      }

      books = await Book.findAll({ order: [["livre_id", "ASC"]] });
      res.json(success("Liste des livres récupérée avec succès.", books));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Impossible de récupérer les livres.", data: error });
    }
  },

  // Get a book by ID
  async getBookById(req, res) {
    try {
      const book = await Book.findByPk(req.params.id, {
        include: [
          { model: sequelize.models.t_category, as: "category" },
          { model: sequelize.models.t_ecrivain, as: "writer" },
        ],
      });

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      //to display writer's name and secondname, and category name
      const response = {
        ...book.toJSON(),
        category_nom: book.category.nom,
        writer_nom: `${book.writer.prenom} ${book.writer.nom_de_famille}`,
      };

      return res.json(success("Book found", response));
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal server error", data: err });
    }
  },
  // Update a book
  async updateBook(req, res) {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Livre introuvable." });
      }

      const {
        titre,
        annee_edition,
        resume,
        editeur,
        nombre_de_page,
        category_nom,
        writer_nom,
      } = req.body;

      // Handle image upload
      if (req.file) {
        req.body.lien_image = "/uploads/" + req.file.filename;
      }

      // Handle category
      if (category_nom) {
        const t_category = sequelize.models.t_category;
        let category = await t_category.findOne({
          where: { nom: category_nom },
        });
        if (!category) {
          category = await t_category.create({ nom: category_nom });
        }
        req.body.category_id = category.categorie_id;
      }

      // Handle writer
      if (writer_nom) {
        const t_ecrivain = sequelize.models.t_ecrivain;
        const [prenom, ...nomParts] = writer_nom.trim().split(" ");
        const nom_de_famille = nomParts.join(" ") || "";

        let writer = await t_ecrivain.findOne({
          where: { prenom, nom_de_famille },
        });
        if (!writer) {
          writer = await t_ecrivain.create({ prenom, nom_de_famille });
        }
        req.body.writer_id = writer.ecrivain_id;
      }

      await book.update(req.body);
      res.json(success("Livre mis à jour avec succès.", book));
    } catch (error) {
      console.error("Error while updating the book:", error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour.",
        data: error.message,
      });
    }
  },

  // Delete a book
  async deleteBook(req, res) {
    const t = await sequelize.transaction();

    try {
      const bookId = req.params.id;

      // Check if user exists
      const book = await Book.findByPk(bookId);
      if (!book) {
        await t.rollback();
        return res.status(404).json({ message: "User not found" });
      }

      // Delete all evaluations by this user
      await Evaluate.destroy({
        where: { book_id: bookId },
        transaction: t,
      });
      // Delete the user
      await Book.destroy({
        where: { livre_id: bookId },
        transaction: t,
      });

      await t.commit();
      res.json({
        message: "Book and associated evaluations deleted successfully",
      });
    } catch (error) {
      await t.rollback();
      console.error("Error deleting book:", error);
      res.status(500).json({
        message: "Error deleting book",
        error: error.message,
      });
    }
  },
};

export default bookController;
