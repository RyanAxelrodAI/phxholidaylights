import NavBar from '@/components/NavBar'
import SubmitForm from '@/components/SubmitForm'

export const metadata = {
  title: 'Submit a Location — PHX Holiday Lights',
  description: 'Know a great holiday light display in Phoenix? Share it with the community!',
}

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-holiday-dark">
      <NavBar />

      <div className="max-w-lg mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏠</div>
          <h1 className="text-2xl font-bold text-white mb-2">Submit a Location</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Know a house with amazing holiday lights? Add it to the map for everyone to enjoy!
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <SubmitForm />
        </div>

        <div className="mt-6 bg-holiday-green/20 border border-holiday-green/30 rounded-xl p-4">
          <p className="text-xs text-white/60 leading-relaxed">
            <span className="text-holiday-gold font-semibold">Please be respectful:</span> Only submit addresses
            of homes that have public-facing displays clearly visible from the street. Do not submit private
            property that is not intended for public viewing.
          </p>
        </div>
      </div>
    </main>
  )
}
