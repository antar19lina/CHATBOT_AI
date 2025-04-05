import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ChatInterface from "@/components/chat-interface"
import BackgroundShapes from "@/components/background-shapes"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 overflow-hidden relative">
      <BackgroundShapes />
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <ChatInterface />
      </div>
    </main>
  )
}

