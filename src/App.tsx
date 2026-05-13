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
	}, [roundsPlayed])

	const handleAnswer = (id: number) => {
		// Validamos la respuesta comparando con el héroe objetivo guardado en el estado
		if (targetHero && id === targetHero.id) {
			alert('¡Correcto!')
		} else {
			alert(`Incorrecto. El héroe correcto era ${targetHero?.localized_name}`)
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
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
					Dota Quiz
				</h1>

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