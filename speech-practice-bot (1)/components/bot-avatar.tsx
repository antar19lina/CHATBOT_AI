export default function BotAvatar() {
  return (
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-orange-500">
        <img src="/images/lpu-logo.png" alt="Lovely Professional University Logo" className="h-8 w-8 object-contain" />
      </div>
      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-blue-800 rounded-full"></span>
    </div>
  )
}

