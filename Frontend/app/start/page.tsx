'use client'

import { useRouter } from 'next/navigation'
import { Card } from 'pixel-retroui'
import { Button } from "@/components/ui/button"

export default function StartPage() {
  const router = useRouter()

  const handleStartGame = () => {
    router.push('/') // 
  }

  const handleSeeCode = () => {
    window.location.href = 'https://github.com/cyrixninja/DragonSlayerGame' 
  }
  const handleHowToPlay = () => {
    window.location.href = 'https://github.com/cyrixninja/DragonSlayerGame/HowToPlay.md'
  }

  return (
    <Card 
    bg="#0F0303"
    textColor="#fff700"
    borderColor="#0F0303"
    shadowColor="#0F0303"
    className="p-4 text-center"
  >
    <div className="min-h-screen bg-cover bg-center p-4 md:p-8 flex items-center justify-center" 
         style={{ backgroundImage: 'url(/images/start-screen.gif)' }}>
      <div className="w-full max-w-md flex flex-col items-center">
      <Button 
  onClick={handleStartGame} 
  className="w-full bg-[#3e39e3] hover:bg-[#d10003] text-white p-8 text-2xl rounded-lg mb-6"
>
  Play
</Button>
<Button 
  onClick={handleSeeCode} 
  className="w-full bg-[#3e39e3] hover:bg-[#d10003] text-white p-8 text-2xl rounded-lg mb-6"
>
  Code
</Button>
<Button 
  onClick={handleHowToPlay} 
  className="w-full bg-[#3e39e3] hover:bg-[#d10003] text-white p-8 text-2xl rounded-lg"
>
  How to Play
</Button>
      </div>
    </div>

    </Card>
  )
}