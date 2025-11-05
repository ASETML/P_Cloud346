import BookCard from "@/components/book-card"

export default function Home() {
  // Sample book data
  const books = [
    { id: "1", title: "Book Title", author: "Author" },
    { id: "2", title: "Book Title", author: "Author" },
    { id: "3", title: "Book Title", author: "Author" },
    { id: "4", title: "Book Title", author: "Author" },
    { id: "5", title: "Book Title", author: "Author" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-medium-blue text-center mb-4">Home</h1>

      <p className="text-center text-light-blue-gray mb-12 max-w-3xl mx-auto">
        Passion lecture est un site destiné aux passionnés de lecture qui aiment la lecture qui savent lire des livres
        pleins de pages elles-mêmes composées de phrases elles-mêmes composées de farandoles de mots divers et variés
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {books.map((book) => (
          <BookCard key={book.id} id={book.id} title={book.title} author={book.author} />
        ))}
      </div>
    </div>
  )
}
