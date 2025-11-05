"use client"

interface DeleteBookModalProps {
  book: {
    id: string
    title: string
  }
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteBookModal({ book, isOpen, onClose, onConfirm }: DeleteBookModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-medium-blue p-8 rounded-lg w-full max-w-md text-white" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-2 text-center">Are you sure you want to delete +{book.title}?</h2>
        <p className="text-center mb-6">You won't be able to get it back</p>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="bg-light-gray text-black px-8 py-3 rounded-md hover:bg-[#d0d1cd] transition-colors"
            onClick={onClose}
          >
            let me think about it
          </button>
          <button
            type="button"
            className="bg-delete-btn text-black px-8 py-3 rounded-md hover:bg-[#f37777] transition-colors"
            onClick={onConfirm}
          >
            yes, delete bookname
          </button>
        </div>
      </div>
    </div>
  )
}
