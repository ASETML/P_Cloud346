import Image from "next/image"
import Link from "next/link"

interface BookCardProps {
  id: string
  title: string
  author: string
  showActions?: boolean
}

export default function BookCard({ id, title, author, showActions = false }: BookCardProps) {
  return (
    <div className="bg-card-bg p-4 rounded-lg">
      <Link href={`/book/${id}`} className="block">
        <div className="aspect-square relative mb-2">
          <Image
            src="/placeholder.svg?height=240&width=240"
            alt={title}
            width={240}
            height={240}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-light-blue-gray text-center">
          {title} - {author}
        </p>
      </Link>

      {showActions && (
        <div className="flex justify-between mt-2">
          <button className="bg-delete-btn text-black px-4 py-1 rounded hover:bg-[#f37777] transition-colors">
            Delete
          </button>
          <button className="bg-modify-btn text-white px-4 py-1 rounded hover:bg-[#6789b5] transition-colors">
            Modify
          </button>
        </div>
      )}
    </div>
  )
}
