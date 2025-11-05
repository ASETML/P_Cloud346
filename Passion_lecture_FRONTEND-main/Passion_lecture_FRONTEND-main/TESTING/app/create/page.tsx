export default function CreateBook() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-medium-blue text-center mb-12">Add your book here</h1>

      <form className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block mb-2 text-medium-blue">Title</label>
          <input type="text" placeholder="Book's title" className="w-full p-2 border border-primary-green rounded" />
        </div>

        <div>
          <label className="block mb-2 text-medium-blue">Year of editing</label>
          <input
            type="text"
            placeholder="Book's year of editing"
            className="w-full p-2 border border-primary-green rounded"
          />
        </div>

        <div>
          <label className="block mb-2 text-medium-blue">number of pages</label>
          <input
            type="text"
            placeholder="Book's number of pages"
            className="w-full p-2 border border-primary-green rounded"
          />
        </div>

        <div>
          <label className="block mb-2 text-medium-blue">Category</label>
          <input type="text" placeholder="Book's category" className="w-full p-2 border border-primary-green rounded" />
        </div>

        <div>
          <label className="block mb-2 text-medium-blue">Writer</label>
          <input type="text" placeholder="Book's writer" className="w-full p-2 border border-primary-green rounded" />
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-primary-green text-black px-12 py-3 rounded-md hover:bg-[#9ed3ac] transition-colors"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}
