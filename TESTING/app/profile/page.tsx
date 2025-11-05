export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-medium-blue text-center mb-12">Your Profile</h1>

      <div className="max-w-md mx-auto bg-card-bg p-6 rounded-lg">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-light-blue-gray rounded-full flex items-center justify-center">
            <span className="text-white text-3xl">A</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-medium-blue font-semibold">Name</h2>
            <p className="text-light-blue-gray">Albert</p>
          </div>

          <div>
            <h2 className="text-medium-blue font-semibold">Books Added</h2>
            <p className="text-light-blue-gray">12</p>
          </div>

          <div>
            <h2 className="text-medium-blue font-semibold">Comments</h2>
            <p className="text-light-blue-gray">24</p>
          </div>

          <div>
            <h2 className="text-medium-blue font-semibold">Member Since</h2>
            <p className="text-light-blue-gray">January 2023</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="bg-modify-btn text-white px-6 py-2 rounded-md hover:bg-[#6789b5] transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}
