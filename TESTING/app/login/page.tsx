import Link from "next/link"

export default function Login() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-medium-blue text-center mb-12">Login to Passion Lecture</h1>

      <form className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block mb-2 text-medium-blue">Name</label>
          <input type="text" placeholder="Your name" className="w-full p-2 border border-primary-green rounded" />
        </div>

        <div>
          <label className="block mb-2 text-medium-blue">Password</label>
          <input
            type="password"
            placeholder="Your password"
            className="w-full p-2 border border-primary-green rounded"
          />
        </div>

        <div className="flex justify-between pt-8">
          <Link
            href="/register"
            className="bg-delete-btn text-black px-12 py-4 rounded-md hover:bg-[#f37777] transition-colors"
          >
            Register
          </Link>
          <button
            type="submit"
            className="bg-primary-green text-black px-12 py-4 rounded-md hover:bg-[#9ed3ac] transition-colors"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
