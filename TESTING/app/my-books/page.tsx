"use client"

import { useState } from "react"
import ModifyBookModal from "@/components/modify-book-modal"
import DeleteBookModal from "@/components/delete-book-modal"

export default function MyBooks() {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<any>(null)

  // Sample book data
  const books = [
    { id: "1", title: "Book Title", author: "Author" },
    { id: "2", title: "Book Title", author: "Author" },
    { id: "3", title: "Book Title", author: "Author" },
    { id: "4", title: "Book Title", author: "Author" },
    { id: "5", title: "Book Title", author: "Author" },
    { id: "6", title: "Book Title", author: "Author" },
  ]

  const handleModify = (book: any) => {
    setSelectedBook(book)
    setIsModifyModalOpen(true)
  }

  const handleDelete = (book: any) => {
    setSelectedBook(book)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    // Delete logic would go here
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-medium-blue text-center mb-12">Your Books</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {books.map((book) => (
          <div key={book.id} className="bg-card-bg p-4 rounded-lg">
            <div className="aspect-square relative mb-2">
              <img
                src="/placeholder.svg?height=240&width=240"
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-light-blue-gray text-center">
              {book.title} - {book.author}
            </p>

            <div className="flex justify-between mt-2">
              <button
                className="bg-delete-btn text-black px-4 py-1 rounded hover:bg-[#f37777] transition-colors"
                onClick={() => handleDelete(book)}
              >
                Delete
              </button>
              <button
                className="bg-modify-btn text-white px-4 py-1 rounded hover:bg-[#6789b5] transition-colors"
                onClick={() => handleModify(book)}
              >
                Modify
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModifyModalOpen && selectedBook && (
        <ModifyBookModal book={selectedBook} isOpen={isModifyModalOpen} onClose={() => setIsModifyModalOpen(false)} />
      )}

      {isDeleteModalOpen && selectedBook && (
        <DeleteBookModal
          book={selectedBook}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
