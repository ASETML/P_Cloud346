export default function Footer() {
  return (
    <footer className="bg-primary-green py-6 px-4 text-center">
      <h2 className="text-3xl font-bold mb-6">Passion Lecture</h2>

      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
        <div>
          <h3 className="font-semibold mb-2">App Creators:</h3>
          <p>Yosef N.</p>
          <p>Antoine P.</p>
          <p>Charles-Henri M.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Contacts:</h3>
          <p>pn25kdv@eduvaud.ch</p>
          <p>pn01kbc@eduvaud.ch</p>
          <p>pc01zcg@eduvaud.ch</p>
        </div>
      </div>
    </footer>
  )
}
