import { ButtonLink } from '../components/Button'
import { Mascot } from '../components/Mascot'

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <Mascot mood="confused" size={150} float />
      <h1 className="text-4xl font-bold">404: page not found</h1>
      <p className="max-w-md text-espresso-600">
        Byte looked everywhere but this page threw a <code className="font-mono font-bold text-brew-600">PageNotFoundException</code>.
      </p>
      <ButtonLink to="/" size="lg">
        Take me home
      </ButtonLink>
    </div>
  )
}
