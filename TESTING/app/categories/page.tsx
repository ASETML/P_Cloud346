import Link from "next/link"

export default function Categories() {
  const categories = ["Novels", "Novels", "Novels", "Policier", "Novels", "Novels", "Novels", "Novels", "Novels"]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-medium-blue text-center mb-12">Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/category/${category.toLowerCase()}`}
            className="bg-white border border-primary-green rounded-lg p-4 text-center text-light-blue-gray text-xl hover:bg-[#f0f9f0] transition-colors"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  )
}
