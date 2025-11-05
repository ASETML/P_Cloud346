import BookCard from "@/components/book-card"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  // Sample book data
  const books = [
    { id: "1", title: "Book Title", author: "Author" },
    { id: "2", title: "Book Title", author: "Author" },
    { id: "3", title: "Book Title", author: "Author" },
    { id: "4", title: "Book Title", author: "Author" },
    { id: "5", title: "Book Title", author: "Author" },
    { id: "6", title: "Book Title", author: "Author" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-medium-blue text-center mb-4">Category</h1>
      <h2 className="text-2xl text-light-blue-gray text-center mb-12">{categoryName}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {books.map((book) => (
          <BookCard key={book.id} id={book.id} title={book.title} author={book.author} />
        ))}
      </div>
    </div>
  )
}
