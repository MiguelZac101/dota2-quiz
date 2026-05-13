import { useState, useEffect } from 'react'
import { HeroCard } from './components/HeroCard'
import { getHeroes } from './services/heroes'
import type { Hero } from './types/hero'
import type { Question } from './types/question'
import { QUESTIONS } from './data/questions'
import { getRandomElements } from './utils/random'

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
			const newGameHeroes = getRandomElements([oneCorrect, ...eightWrong], 9)

			// 7. Guardamos el héroe objetivo para poder validar la respuesta del jugador después
			setTargetHero(oneCorrect);

			// 8. Actualizamos los nuevos héroes en el grid
			setGameHeroes(newGameHeroes)
		}
	}, [heroes, roundsPlayed])

	const handleAnswer = (id: number) => {
		if ( targetHero && id === targetHero.id) {
			const puntosGanados = 10 * (streak + 1) // Base 10 * multiplicador
			setScore(prev => prev + puntosGanados)
			setStreak(prev => prev + 1)
		} else {
			setStreak(0) // Pierdes el multiplicador
		}
		setRoundsPlayed(prev => prev + 1)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<p className="text-white text-xl">Cargando héroes...</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white p-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
					Dota Quiz
				</h1>

				<div className="flex justify-between mb-4">
					<p className="text-2xl">Puntaje: {score}</p>
					<p className="text-2xl">
						{streak > 0 && `Racha: x${streak} 🔥`}
					</p>
				</div>

				<div className="grid grid-cols-3 gap-4 mb-8">
					{gameHeroes.map(hero => (
						<HeroCard
							key={hero.id}
							hero={hero}
							onClick={handleAnswer}
						/>
					))}
				</div>

				<div className="bg-gray-800 rounded-lg p-6 text-center">
					<p className="text-xl">
						{questionSelect?.text}
					</p>
				</div>
			</div>
		</div>
	)
}

export default App