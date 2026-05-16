import { useState, useEffect, useRef } from 'react'
import { HeroCard } from './components/HeroCard'
import { getHeroes } from './services/heroes'
import type { Hero } from './types/hero'
import type { Question } from './types/question'
import { QUESTIONS } from './data/questions'
import { getRandomElements } from './utils/random'
import { useSound } from './hook/useSound'
import { motion, type Variants } from 'framer-motion'
import { Timer } from './components/Timer'
import { RoundTracker, type RoundStatus } from './components/RoundTracker'
import { RestartButton } from './components/RestartButton'
import { Modal } from './components/Modal'
import { Ranking, type RankingType } from './components/Ranking'

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
	const { play: playCorrect } = useSound('/sounds/correct.mp3')
	const { play: playWrong } = useSound('/sounds/wrong.mp3')	

	// Sound Streaks
	const  { play: playKillingSpree } = useSound('/sounds/streak/killing-spree.mp3')
	const  { play: playDominating } = useSound('/sounds/streak/dominating.mp3')
	const  { play: playMegaKill } = useSound('/sounds/streak/mega-kill.mp3')
	const  { play: playUnstoppable } = useSound('/sounds/streak/unstoppable.mp3')
	
	// tiempo del timer
	const TIME_ROUND = 3 // DEFAULT 10
	const [timeLeft, setTimeLeft] = useState(TIME_ROUND)

	// Estados para el RoundTracker	
	const [roundResults, setRoundResults] = useState<RoundStatus[]>([])
	const [roundHeroes, setRoundHeroes] = useState<(Hero | null)[]>([]) // URLs de héroes por ronda
	const TOTAL_ROUNDS = 2	//DEFAULT 7

	// validar round, para que los useEffect solo carguen una vez
	const roundIdRef = useRef(0)	

	// Indicador para pusar el Timer
	const [isPaused,setIsPaused] = useState(false);

	// referencia para setInterval
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	// control modal
	const [showModal, setShowModal] = useState(false)
	const [playerName, setPlayerName] = useState('')
	const [saveTriggered, setSaveTriggered] = useState(0)

	// ranking	
	const [ranking,setRanking] = useState<RankingType[]>(() => {
		// Intentamos cargar el ranking desde localStorage
		const ranking = localStorage.getItem('ranking')
		return ranking ? JSON.parse(ranking) : []
	})

	//control termino de juego
	const [gameOver,setGameOver] = useState(false)

	//controlar apertura del ranking en movil
	const [isRankingMovilOpen,setIsRankingMovilOpen] = useState(false)
	//pintar fila jugador en ranking si acaba de guardar
	const [isTickRowPlayerRanking,setIsTickRowPlayerRanking] = useState(false)

	//mostrar tooltip al lado del btn reiniciar en movil
	const [showRestartHint, setShowRestartHint] = useState(false)

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

	// función que maneje TODOS los cambios de ronda
	const goToNextRound = () => {		

		//solo pasa de ronda hasta que llegue al TOTAL_ROUNDS
		if( roundsPlayed + 1 < TOTAL_ROUNDS){
			setShowResult(false)
			setSelectedId(null)
			setRoundsPlayed(p => p + 1) 
		}else{
			//juego terminado
			setGameOver(true)
		}
		
	}

	const handleAnswer = async (hero: Hero) => {
		const thisRoundId = roundIdRef.current // ← captura ID

		// Cancela el timer apenas responde
		clearInterval(intervalRef.current!)
		intervalRef.current = null

		setSelectedId(hero.id) 
		setShowResult(true) 
		setTimeLeft(0)		

		let soundPromise: Promise<void>

		if (targetHero && hero.id === targetHero.id) {
			soundPromise = getStreakSound(streak+1) // Reproducir sonido de racha
			const puntosGanados = 10 * (streak + 1) // Base 10 * multiplicador
			setScore(prev => prev + puntosGanados)
			setStreak(prev => prev + 1)

		} else {
			soundPromise = playWrong(2000) // Sonido error
			setStreak(0) // Reiniciar la racha si se responde incorrectamente
		}

		setRoundResults(prev => [...prev, targetHero?.id === hero.id? 'correct' : 'wrong'])
    	setRoundHeroes(prev => [...prev, hero])

		//para mostrar modal antes de que termine el sonido
		if(roundsPlayed+1 == TOTAL_ROUNDS){
			setGameOver(true)			
		} 

		// Espera a que termine el sonido
  		await soundPromise
		
		// Solo pasa de ronda si no cambió
		if (thisRoundId === roundIdRef.current) {
			goToNextRound()
		}		
	
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

		roundIdRef.current += 1
		const currentRoundId = roundIdRef.current

		setTimeLeft(10)
		setShowResult(false)
		setSelectedId(null)

		let expired = false

		intervalRef.current = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(intervalRef.current!)
					intervalRef.current = null

					if (!expired && currentRoundId === roundIdRef.current) {
						expired = true
						setShowResult(true)
						setRoundResults(p => [...p, 'empty'])
						setRoundHeroes(p => [...p, null])
						goToNextRound()
					}
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			clearInterval(intervalRef.current!)
			intervalRef.current = null
			expired = true
		}

	}, [roundsPlayed])

	//para pausar
	useEffect(() => {
		if (isPaused) {
			// Pausar: matar el interval
			clearInterval(intervalRef.current!)
			intervalRef.current = null
		} else {
			// Reanudar: pero solo si no hay uno corriendo ya
			if (intervalRef.current) return			

			intervalRef.current = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						clearInterval(intervalRef.current!)
						intervalRef.current = null
						setShowResult(true)
						setRoundResults(p => [...p, 'empty'])
						setRoundHeroes(p => [...p, null])
						goToNextRound()
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}
	}, [isPaused])

	//reiniciar juego
	const onRestart = () => {
		setShowRestartHint(false)// ocultar tooltip movil
		setRoundsPlayed(0); // ronda a cero
		setRoundResults([]); // lista de estados ( correct, wrong , empty) de heroes marcados
		setRoundHeroes([]); // lista de heroes marcados se vacia
		setScore(0)      // puntaje
		setStreak(0)     // racha
		setIsPaused(false) // si estaba pausado al reiniciar
		setGameOver(false)
		setIsTickRowPlayerRanking(false) //despintar fila
	}

	//abrir modal
	useEffect(()=>{
		if(gameOver){
			setShowModal(true);
		}
	},[gameOver])

	//agregar jugador al listado de ranking
	useEffect(()=>{
		if (!playerName) return  // evita agregar si está vacío
		const newRank:RankingType = {
			id: crypto.randomUUID(),
			name: playerName,
			points: score
		}

		const updatedRanking = [...ranking, newRank]  
		setRanking(updatedRanking)
		localStorage.setItem('ranking', JSON.stringify(updatedRanking)) 

		// marcar fila del jugador agregado
		setIsTickRowPlayerRanking(true)

	},[saveTriggered])

	//mostrar tooltil al lado del btn reiniciar en movil
	useEffect(() => {
		if (!gameOver) return
		const timeout = setTimeout(() => {
			setShowRestartHint(true)
		}, 5000)
		return () => clearTimeout(timeout)
	}, [gameOver])

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<p className="text-white text-xl">Cargando héroes...</p>
			</div>
		)
	}

	return (
		<div className="w-full p-2 sm:p-0 bg-gray-900 text-white min-h-screen">
			
			{/* LAYOUT DESKTOP: 3 columnas */}
			<div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">

				{/* COLUMNA IZQ: solo desktop */}
				<div className="lg:flex lg:flex-col lg:h-screen">

					<div className="flex items-center justify-center h-1/2">
						<Timer timeLeft={timeLeft} isPaused={isPaused} onClick={() => setIsPaused(prev => !prev)} />
					</div>
					<div className="flex items-center justify-center h-1/2">
						<RestartButton onClick={onRestart} showHint={showRestartHint}/>
					</div>
				</div>

				{/* COLUMNA CENTRO: Grid */}
				<div className="pt-4 lg:pt-8">
					<h1 className="text-4xl font-bold text-cyan-400 text-center mb-4 lg:mb-8">
						Dota 2 Quiz
					</h1>

					{/* Puntaje y racha */}					
					<div className="grid grid-cols-3 items-stretch gap-4 lg:mb-8">

						{/* Puntaje texto */}
						<div className="flex items-center justify-center border-r border-gray-700 pr-4">
							<p className="text-gray-400 text-sm uppercase tracking-widest">Puntaje</p>
						</div>

						{/* Puntaje número */}
						<div className="flex items-center justify-center">
							<p className="text-white font-bold text-6xl tabular-nums">
								{String(score).padStart(2, '0')}
							</p>
						</div>

						{/* Racha */}
						<div className="flex items-center justify-center border-l border-gray-700 pl-4">
							{streak > 0
								? <p className="text-orange-400 text-xl font-bold">x{streak} 🔥</p>
								: <p className="text-gray-600 text-xl">—</p>
							}
						</div>

					</div>

					<div className="lg:hidden mb-2 lg:mb-0">
						<RoundTracker
							currentRound={roundsPlayed + 1}
							totalRounds={TOTAL_ROUNDS}
							roundResults={roundResults}
							roundHeroes={roundHeroes}
							variant="mobile"
						/>
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

					<motion.div
						className="bg-gray-800 rounded-lg p-6 text-center"
						animate={{
							boxShadow: [
								'0 0 0px #22d3ee',
								'0 0 20px #22d3ee',
								'0 0 0px #22d3ee'
							]
						}}
						transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
					>

						<p className="text-xl">
							{questionSelect?.text}
						</p>

					</motion.div>

					
					
				</div>

				{/* COLUMNA DER: solo desktop */}				
				<div className="lg:block lg:mt-8 lg:mr-8">

					<div className='hidden lg:block'>						
						<RoundTracker
							currentRound={roundsPlayed + 1 }
							totalRounds={TOTAL_ROUNDS}
							roundResults={roundResults}
							roundHeroes={roundHeroes}
							variant="desktop"
						/>
					</div>			
					
					<Ranking 
						ranking={ranking} 
						isOpen={isRankingMovilOpen} 
						setIsOpen={setIsRankingMovilOpen} 
						tickRow={isTickRowPlayerRanking}
						setTickRow={setIsTickRowPlayerRanking}
					/>					
					
				</div>

			</div>
			
			<Modal
				openModal={showModal}
				onSave={(name) => {
					setPlayerName(name)
					setShowModal(false)
					setSaveTriggered( prev => prev + 1 )
					setIsRankingMovilOpen(true) //abrir ranking
				}}
				onCancel={() => setShowModal(false)}
			/>
			



		</div>		

	)
}

export default App