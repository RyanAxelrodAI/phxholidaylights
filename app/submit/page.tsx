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

        {/* Notice at the point of collection. This form takes a name, an email and a
            residential address, so submitters are told where it goes, and homeowners are
            given a removal path — the address published may not be their own choice. */}
        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-white/50 leading-relaxed">
            Your name and email are optional and are only used to follow up about this
            submission. We never add them to a mailing list. Submissions are reviewed by a
            person before anything appears on the map. See our{' '}
            <a href="/privacy" className="text-white/70 underline underline-offset-2 hover:text-white">Privacy Policy</a>.
          </p>
          <p className="text-xs text-white/50 leading-relaxed mt-2">
            <span className="text-holiday-gold font-semibold">Is this your home?</span> If your
            house is on the map and you would rather it were not, contact us and we will remove
            it. No explanation needed.
          </p>
        </div>
      </div>
    </main>
  )
}
