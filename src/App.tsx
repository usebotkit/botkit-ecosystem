import { Board } from './components/Board'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Lid } from './components/Lid'

export default function App() {
  return (
    <>
      <a className="skip" href="#kit">
        Skip to the kit
      </a>
      <div id="top" />
      <Lid />
      <main>
        <Hero />
        <Board />
      </main>
      <Footer />
    </>
  )
}
