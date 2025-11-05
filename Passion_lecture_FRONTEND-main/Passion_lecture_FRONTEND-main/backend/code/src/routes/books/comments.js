import express from "express";
import NotesController from "../../controllers/notesController.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/books/{id}/evaluations:
 *   get:
 *     tags: [Comments]
 *     summary: Get all evaluations for a book
 *     description: Retrieve all evaluations associated with a specific book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: List of evaluations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *                   book_id:
 *                     type: integer
 *                   created:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get("/:id/evaluations", NotesController.getEvaluationsForBook);

/**
 * @swagger
 * /api/books/{id}/evaluations:
 *   post:
 *     tags: [Comments]
 *     summary: Add an evaluation to a book
 *     description: Create a new evaluation for a specific book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - user_id
 *               - note
 *             properties:
 *               content:
 *                 type: string
 *                 description: The evaluation text
 *               user_id:
 *                 type: integer
 *                 description: ID of the user making the evaluation
 *               note:
 *                 type: integer
 *                 description: Rating given by the user
 *     responses:
 *       201:
 *         description: Evaluation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     user_id:
 *                       type: integer
 *                     book_id:
 *                       type: integer
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post("/:id/evaluations", NotesController.createEvaluation);

export default router;
