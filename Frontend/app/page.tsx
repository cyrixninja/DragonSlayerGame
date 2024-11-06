'use client'

import { Card } from 'pixel-retroui';
import { useState, useEffect,useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Sword, Shield } from 'lucide-react'
import Image from 'next/image'


export default function Component() {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [dragonHealth, setDragonHealth] = useState(100)
  const [message, setMessage] = useState("Face the dragon's challenge! Answer wisely to strike!. Enter your Challenge Topic and Click 'Start Game' to begin your quest to slay the dragon!")
  const [isGameOver, setIsGameOver] = useState(false)
  interface Question {
    text: string;
    options: string[];
    correctAnswer: number;
  }

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswering, setIsAnswering] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)
  const [isDragonAttacking, setIsDragonAttacking] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [quiz, setQuiz] = useState<Question[]>([])
  const [topic, setTopic] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizInProgress, setIsQuizInProgress] = useState(false);

  const dragonAttackSoundRef = useRef<HTMLAudioElement>(null);
  const knightAttackSoundRef = useRef<HTMLAudioElement>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);

useEffect(() => {
  if (isDragonAttacking) {
    dragonAttackSoundRef.current?.play();
    setTimeout(() => {
      setIsDragonAttacking(true);
    }, 1000); // Delay the attack animation by 1 second
  }
}, [isDragonAttacking]);

useEffect(() => {
  if (isAttacking) {
    knightAttackSoundRef.current?.play();
    setTimeout(() => {
      setIsAttacking(true);
    }, 1000); // Delay the attack animation by 1 second
  }
}, [isAttacking]);

const startGame = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/generate-quiz?topic=${topic}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setQuiz(data);
    setCurrentQuestion(data[0]);
    setIsGameStarted(true);
    backgroundMusicRef.current?.play();
  } catch (error) {
    console.error("Error fetching quiz:", error);
  }
};

useEffect(() => {
  if (isGameOver) {
    setShowModal(true);
  }
}, [isGameOver]);

const triggerDragonAttack = () => {
  setIsDragonAttacking(false); // Reset the state to trigger the effect
  setIsDragonAttacking(true);
};

const triggerKnightAttack = () => {
  setIsAttacking(false); // Reset the state to trigger the effect
  setIsAttacking(true);
};

const submitAnswer = () => {
  setIsAnswering(false)
  
  if (currentQuestion && userAnswer === currentQuestion.options[currentQuestion.correctAnswer]) {
    setIsAttacking(true)
    triggerKnightAttack();
    setTimeout(() => {
      const damage = Math.floor(Math.random() * 20) + 10
      setDragonHealth(prev => Math.max(0, prev - damage))
      setMessage(`Direct hit! Dragon takes ${damage} damage!`)
      setIsAttacking(false)
      if (dragonHealth - damage <= 0) {
        setIsGameOver(true);
        setResultMessage("Victory! The mighty dragon falls, and you emerge as the legendary hero!");
      } else {
        setCurrentQuestion(quiz[quiz.indexOf(currentQuestion) + 1]);
      }
    }, 7000)
  } else {
    setIsDragonAttacking(true)
    triggerDragonAttack();
    setTimeout(() => {
      const damage = Math.floor(Math.random() * 15) + 5
      setPlayerHealth(prev => Math.max(0, prev - damage))
      setMessage(`Wrong! Dragon breathes fire! You take ${damage} damage!`)
      setIsDragonAttacking(false)
      if (playerHealth - damage <= 0) {
        setIsGameOver(true);
        setResultMessage("Game Over! The dragon has bested you. Your quest ends here.");
      } else {
        setCurrentQuestion(quiz[quiz.indexOf(currentQuestion) + 1]);
      }
    }, 5000)
  }
  setUserAnswer("")
}

const askQuestion = () => {
  if (currentQuestionIndex < quiz.length) {
    const nextQuestion = quiz[currentQuestionIndex];
    setCurrentQuestion(nextQuestion);
    setIsAnswering(true);
    setMessage(`Dragon roars: ${nextQuestion.text}`);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setIsQuizInProgress(true);
  } else {
    setMessage("No more questions available.");
  }
};

  useEffect(() => {
    if (playerHealth === 0) {
      setMessage("Game Over! The dragon has bested you. Your quest ends here.")
      setIsGameOver(true)
      setResultMessage("Game Over! The dragon has bested you. Your quest ends here.");
    } else if (dragonHealth === 0) {
      setMessage("Victory! The mighty dragon falls, and you emerge as the legendary hero!")
      setResultMessage("Victory! The mighty dragon falls, and you emerge as the legendary hero!");
      setIsGameOver(true)
    }
  }, [playerHealth, dragonHealth])

  const resetGame = () => {
    setPlayerHealth(100);
    setDragonHealth(100);
    setMessage("A new challenger approaches! Can you outsmart the dragon and claim victory?");
    setIsGameOver(false);
    setIsAnswering(false);
    setIsAttacking(false);
    setUserAnswer("");
    setCurrentQuestion(quiz[0]);
    setCurrentQuestionIndex(0);
    setShowModal(false);
    setIsQuizInProgress(false);
  };
  
  return (
    
    <Card 
    bg="#3d0d06"
    textColor="#fff700"
    borderColor="#3d0d06"
    shadowColor="#3d0d06"
    className="p-4 text-center"
  >
<div className="min-h-screen bg-cover bg-center p-4 md:p-8 flex items-center justify-center" style={{ backgroundImage: 'url(https://awshackathoncyrixninja.s3.us-east-1.amazonaws.com/background.png)' }}>
  <div className="w-full max-w-6xl flex flex-col">
    
    {/* Game Area */}
    <div className="relative aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://awshackathoncyrixninja.s3.us-east-1.amazonaws.com/background.png"
          alt="Cave Background"
          fill
          sizes="100vw"
          style={{ objectFit: 'contain' }}
          quality={100}
          priority
        />
      </div>



      <div className="absolute inset-0 flex flex-col">
        {/* Health Bars */}
        <div className="p-2 md:p-4 flex justify-between items-center bg-black/30">
          <div className="w-2/5">
            <div className="flex justify-between mb-2">
              <span className="text-sm md:text-base font-semibold text-blue-400">Hero</span>
              <span className="text-sm md:text-base text-white">{playerHealth}/100</span>
            </div>
            <Progress value={playerHealth} className="h-2 md:h-4 bg-gray-700">
              <div 
                className="h-full bg-green-500 transition-all duration-500" 
                style={{ width: `${playerHealth}%` }} 
              />
            </Progress>
          </div>
          
          <h1 className="text-xl md:text-4xl font-bold text-center text-yellow-400 shadow-sm">
          <Card   
          bg="#70251a"
          textColor="#fff700"
          borderColor="#d6ff0a"
          shadowColor="#70251a"
          className="p-4 text-center">
      <h2>Dragon Slayer</h2>
    </Card>
          </h1>
          
          <div className="w-2/5">
            <div className="flex justify-between mb-2">
              <span className="text-sm md:text-base font-semibold text-red-400">Dragon</span>
              <span className="text-sm md:text-base text-white">{dragonHealth}/100</span>
            </div>
            <Progress value={dragonHealth} className="h-2 md:h-4 bg-gray-700">
              <div 
                className="h-full bg-red-500 transition-all duration-500" 
                style={{ width: `${dragonHealth}%` }} 
              />
            </Progress>
          </div>
        </div>
{/* Characters Container */}
<div className="flex-1 flex justify-between items-end px-4 md:px-16 pb-4 md:pb-8">
  {/* Hero */}
  <div className={`w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 relative mb-24 ${isAttacking ? 'opacity-0' : ''}`}>
    <Image
      src="https://awshackathoncyrixninja.s3.us-east-1.amazonaws.com/knight-idle.gif"
      alt="Hero"
      width={320}
      height={320}
      className="w-full h-full object-contain"
      style={{ imageRendering: 'pixelated' }}
      priority
    />
  </div>

  {/* Attack Animation */}
  {isAttacking && (
    <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 z-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
      <Image
        src="https://awshackathoncyrixninja.s3.us-east-1.amazonaws.com/knight-attack.gif"
        alt="Attack"
        width={320}
        height={320}
        className="w-full h-full object-contain animate-pulse pointer-events-none transition-all duration-500"
      />
    </div>
  )}

  {/* Dragon */}
  <div className={`w-64 h-64 sm:w-96 sm:h-96 md:w-[512px] md:h-[512px] lg:w-[640px] lg:h-[640px] relative ${isDragonAttacking ? 'opacity-0' : ''}`}>
    <Image
      src="https://awshackathoncyrixninja.s3.us-east-1.amazonaws.com/dragon-idle.gif"
      alt="Dragon"
      width={768}
      height={768}
      className="w-full h-full object-contain"
      priority
    />
  </div>

  {isDragonAttacking && (
    <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 z-20 w-64 h-64 sm:w-96 sm:h-96 md:w-[512px] md:h-[512px] lg:w-[640px] lg:h-[640px]">
      <Image
        src="https://awshackathoncyrixninja.s3.us-east-1.amazonaws.com/dragon-attack.gif"
        alt="Dragon Attack"
        width={768}
        height={768}
        className="w-full h-full object-contain animate-pulse pointer-events-none transition-all duration-500"
      />
    </div>
  )}
</div>
    </div>
  </div>

  {/* Controls Section */}
  <Card 
      bg="#70251a"
      textColor="#fff700"
      borderColor="#D6FF0A"
      shadowColor="#D6FF0A"
      className="p-4 text-center"
    >
  <div className="h-[25vh] bg-[#1A0A0C] relative z-30">
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-4">
        <p className="text-lg font-medium text-white">{message}</p>
      </div>

      
      <div className="mb-4 max-w-md mx-auto">
  {isAnswering ? (
    <>
      {currentQuestion && currentQuestion.options && (
        <>
          <p className="text-lg font-medium text-white mb-4">{currentQuestion.text}</p>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((choice, index) => (
              <Button
                key={index}
                onClick={() => setUserAnswer(choice)}
                className={`w-full ${userAnswer === choice ? 'bg-blue-600' : 'bg-gray-800'} hover:bg-blue-700 text-white p-2 rounded-lg`}
              >
                {choice}
              </Button>
            ))}
          </div>
          <Button onClick={submitAnswer} className="w-full bg-green-600 hover:bg-green-700 mt-4">
            Submit Answer
          </Button>
        </>
      )}
    </>
  ) : (
    <div className="h-[76px]" />
  )}
</div>

      <div className="flex justify-center space-x-2">
      {!isGameStarted ? (
  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-96">
    <Input
      type="text"
      placeholder="Enter topic"
      value={topic}
      onChange={(e) => setTopic(e.target.value)}
      className="w-full mb-4 bg-gray-800 text-white border-gray-700"
    />
    <Button onClick={startGame} className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg">
      Start Game
    </Button>
  </div>
        ) : (
          <>
  {!isAnswering && (
    <>
      {isQuizInProgress ? (
        <Button onClick={askQuestion} disabled={isGameOver || isAnswering || isAttacking} className="flex items-center bg-blue-600 hover:bg-blue-700">
          Continue Your Attack
        </Button>
      ) : (
        <>
          <Button onClick={askQuestion} disabled={isGameOver || isAnswering || isAttacking} className="flex items-center bg-blue-600 hover:bg-blue-700">
            <Sword className="mr-2 h-4 w-4" />
            Challenge Dragon
          </Button>
          <Button onClick={resetGame} variant="outline" className="flex items-center border-gray-400 text-black bg-yellow-300 hover:bg-yellow-300">
            <Shield className="mr-2 h-4 w-4" />
            New Quest
          </Button>
        </>
      )}
    </>
  )}
          </>
        )}
      </div>

    </div>
  </div>
  </Card>
</div>
<audio ref={dragonAttackSoundRef} src="/sounds/dragon-attack.mp3" />
<audio ref={knightAttackSoundRef} src="/sounds/knight-attack.mp3" />
<audio ref={backgroundMusicRef} src="/sounds/background-music.mp3" loop />

{/* Modal for Game Result */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-[#1A0A0C] p-8 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Game Over</h2>
      <p className="mb-4">{resultMessage}</p>
      <Button onClick={() => { resetGame(); setShowModal(false); }} className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg">
        Play Again
      </Button>
    </div>
  </div>
)}
</div>
</Card>
  )
}