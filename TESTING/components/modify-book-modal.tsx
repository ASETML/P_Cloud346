"use client"

import type React from "react"

interface ModifyBookModalProps {
  book: {
    id: string
    title: string
    author: string
    year?: string
    pages?: string
    category?: string
  }
  isOpen: boolean
  onClose: () => void
  onConfirm?: (data: any) => void
}

export default function ModifyBookModal({ book, isOpen, onClose, onConfirm }: ModifyBookModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onConfirm) {
      // Collect form data and pass to onConfirm
      onConfirm({
        // Form data here
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-medium-blue p-8 rounded-lg w-full max-w-md text-white" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-2 text-center">Modify +{book.title}?</h2>
        <p className="text-center mb-6">it'l modify the book permanently</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              defaultValue={book.title}
              placeholder="Book's title"
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block mb-1">Year of editing</label>
            <input
              type="text"
              defaultValue={book.year}
              placeholder="Book's year of editing"
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block mb-1">number of pages</label>
            <input
              type="text"
              defaultValue={book.pages}
              placeholder="Book's number of pages"
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block mb-1">Category</label>
            <input
              type="text"
              defaultValue={book.category}
              placeholder="Book's category"
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              className="bg-delete-btn text-black px-8 py-3 rounded-md hover:bg-[#f37777] transition-colors"
              onClick={onClose}
            >
              cancel
            </button>
            <button
              type="submit"
              className="bg-primary-green text-black px-8 py-3 rounded-md hover:bg-[#9ed3ac] transition-colors"
            >
              confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
