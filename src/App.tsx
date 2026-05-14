import { useState, useEffect } from 'react'
import { HeroCard } from './components/HeroCard'
import { getHeroes } from './services/heroes'
import type { Hero } from './types/hero'
import type { Question } from './types/question'
import { QUESTIONS } from './data/questions'
import { getRandomElements } from './utils/random'
import { useSound } from './hook/useSound'
import { motion, type Variants } from 'framer-motion'
import { Timer } from './components/Timer'

function App() {
	const [heroes, setHeroes] = useState<Hero[]>(() => {
		// Intentamos cargar los héroes desde localStorage para evitar llamadas a la API
		const storedHeroes = localStorage.getItem('heroes')
		return storedHeroes ? JSON.parse(storedHeroes) : []
	})
	const [loading, setLoading] = useState(true)
	const [questionSelect, setQuestionSelect] = useState<Question | null>(null)
	const [gameHeroes, setGameHeroes] = useState<Hero[]>([])

	// Contador de rondas para disparar el useEffect de selección de héroes y pregunta cada vez que el jugador responde (o inicia el juego por primera vez)
	const [roundsPlayed, setRoundsPlayed] = useState(0)
	// Estado para guardar el héroe objetivo de la pregunta actual
	const [targetHero, setTargetHero] = useState<Hero | null>(null)
	// Estado para llevar el puntaje del jugador
	const [score, setScore] = useState(0)
	// Estado para llevar la racha de respuestas correctas del jugador
	const [streak, setStreak] = useState(0)

	// Estado para mostrar el resultado después de responder (correcto/incorrecto)
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [showResult, setShowResult] = useState(false)

	// Sonidos
	const { play: playCorrect, stop: stopCorrect } = useSound('/sounds/correct.mp3')
	const { play: playWrong, stop: stopWrong } = useSound('/sounds/wrong.mp3')	

	// Sound Streaks
	const  { play: playKillingSpree, stop: stopKillingSpree } = useSound('/sounds/streak/killing-spree.mp3')
	const  { play: playDominating, stop: stopDominating } = useSound('/sounds/streak/dominating.mp3')
	const  { play: playMegaKill, stop: stopMegaKill } = useSound('/sounds/streak/mega-kill.mp3')
	const  { play: playUnstoppable, stop: stopUnstoppable } = useSound('/sounds/streak/unstoppable.mp3')
	
	const [timeLeft, setTimeLeft] = useState(10)

	// Cargamos los héroes al montar el componente
	useEffect(() => {
		// Si ya tenemos héroes en el estado (cargados desde localStorage), no hacemos la llamada a la API
		if (heroes.length > 0) {
			setLoading(false)
			return
		}
		getHeroes()
			.then(data => {				
				setHeroes(data)
				//guardar en localStorage para evitar futuras llamadas a la API
				localStorage.setItem('heroes', JSON.stringify(data))
				setLoading(false)
			})
			.catch(err => {
				console.error(err)
				setLoading(false)
			})
	}, [])

	//seleccionar a los heroes que se mostraran en el grid
	useEffect(() => {
		if (heroes.length > 0) {
			// 1. Elegir pregunta
			const [selectedQuestion] = getRandomElements(QUESTIONS)
			setQuestionSelect(selectedQuestion)

			// 2. Separar correctos e incorrectos usando el mismo filter
			const correctHeroes = heroes.filter(selectedQuestion.filter)
			const wrongHeroes = heroes.filter(h => !selectedQuestion.filter(h))
			if (wrongHeroes.length < 8) return // Validamos que haya suficientes héroes incorrectos para llenar el grid, si no, no hacemos nada y esperamos a la próxima ronda para intentar con otra pregunta diferente (podría pasar con preguntas muy específicas)

			// 3. Validar que haya al menos 1 correcto
			if (correctHeroes.length === 0) return

			// 4. Agarrar 1 correcto random
			const [oneCorrect] = getRandomElements(correctHeroes)			 

			// 5. Agarrar 8 incorrectos random sin mutar el array original
			const eightWrong = getRandomElements(wrongHeroes, 8)

			// 6. Juntar y desordenar
			const newGameHeroes = [oneCorrect, ...eightWrong].sort(() => 0.5 - Math.random())

			// 7. Guardamos el héroe objetivo para poder validar la respuesta del jugador después
			setTargetHero(oneCorrect);

			// 8. Actualizamos los nuevos héroes en el grid
			setGameHeroes(newGameHeroes)
		}
	}, [heroes, roundsPlayed])

	const getStreakSound = (streak: number) => {
		if (streak === 2) return playKillingSpree()
		if (streak === 3) return playDominating()
		if (streak === 4) return playMegaKill()
		if (streak >= 5) return playUnstoppable()
		
		return playCorrect(2000) // sonido normal
	}

	const handleAnswer = async (id: number) => {
		setSelectedId(id) 
		setShowResult(true) 		

		let soundPromise: Promise<void>

		if (targetHero && id === targetHero.id) {
			soundPromise = getStreakSound(streak+1) // Reproducir sonido de racha
			const puntosGanados = 10 * (streak + 1) // Base 10 * multiplicador
			setScore(prev => prev + puntosGanados)
			setStreak(prev => prev + 1)
		} else {
			soundPromise = playWrong(2000) // Sonido error
			setStreak(0) // Reiniciar la racha si se responde incorrectamente
		}

		// Espera a que termine el sonido
  		await soundPromise

		// Preparamos la siguiente ronda reseteando estados relacionados a la respuesta y aumentando el contador de rondas para disparar el useEffect de selección de pregunta y héroes		
		setShowResult(false)
		setSelectedId(null)
		setRoundsPlayed(prev => prev + 1)
	
	}

	// Animaciones con Framer Motion
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05 // 50ms entre cada carta
			}
		}
	}

	const item : Variants = {
		hidden: { opacity: 0, scale: 0.6, y: 20 },
		show: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: "spring", damping: 15, stiffness: 300 }
		}
	}


	// useEffect del timer
	useEffect(() => {
		if (showResult) return

		setTimeLeft(10)
		const interval = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(interval)
					// Lógica de timeout directo aquí
					setShowResult(true)
					//playWrong(2000)
					//setStreak(0)
					setTimeout(() => {
						setShowResult(false)
						setSelectedId(null)
						setRoundsPlayed(p => p + 1)
					}, 2000)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [roundsPlayed, showResult]) // ← Solo estas 2


	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<p className="text-white text-xl">Cargando héroes...</p>
			</div>
		)
	}

	return (
		<div className="w-full p-2 sm:p-0 bg-gray-900 text-white min-h-screen">
			
			{/* TIMER MÓVIL: Solo se ve < lg */}
			<div className="lg:hidden">				
				<Timer timeLeft={timeLeft} variant="bar"/>
			</div>

			{/* LAYOUT DESKTOP: 3 columnas */}
			<div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">

				{/* COLUMNA IZQ: solo desktop */}
				<div className="hidden lg:grid place-items-center h-screen">
					
					<Timer timeLeft={timeLeft} variant="medium"/>

				</div>

				{/* COLUMNA CENTRO: Grid */}
				<div className="pt-4 lg:pt-8">
					<h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
						Dota 2 Quiz
					</h1>

					<div className="flex justify-between mb-4">
						<p className="text-2xl">Puntaje: {score}</p>
						<p className="text-2xl">
							{streak > 0 && `Racha: x${streak} 🔥`}
						</p>
					</div>

					<motion.div
						key={roundsPlayed} // ← Re-dispara animación cada ronda
						variants={container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-3 gap-2 sm:gap-4 mb-8"
					>
						{gameHeroes.map((hero) => (
							<motion.div
								key={hero.id}
								variants={item}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<HeroCard
									hero={hero}
									onClick={handleAnswer}
									selectedId={selectedId}
									correctId={showResult ? (targetHero?.id ?? null) : null}
									showResult={showResult}
								/>
							</motion.div>
						))}
					</motion.div>

					<div className="bg-gray-800 rounded-lg p-6 text-center">
						<p className="text-xl">
							{questionSelect?.text}
						</p>
					</div>
				</div>

				{/* COLUMNA DER: solo desktop */}
				<div className="hidden lg:block lg:sticky lg:top-8 space-y-4">
					
				</div>

			</div>
		</div>

	)
}

export default App