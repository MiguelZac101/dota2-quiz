import { useState, useEffect } from 'react'
import { HeroCard } from './components/HeroCard'
import { getHeroes } from './services/heroes'
import type { Hero } from './types/hero'
import type { Question } from './types/question'
import { QUESTIONS } from './data/questions'

function App() {
	const [heroes, setHeroes] = useState<Hero[]>(() => {
		// Intentamos cargar los héroes desde localStorage para evitar llamadas a la API
		const storedHeroes = localStorage.getItem('heroes')
		return storedHeroes ? JSON.parse(storedHeroes) : []
	})
	const [loading, setLoading] = useState(true)
	const [questionSelect, setQuestionSelect] = useState<Question | null>(null)

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
			//seleccionar la pregunta
			const selectedQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
			setQuestionSelect(selectedQuestion);

			setHeroes(heroes.slice(0, 9))
		}
	}, [])

	const handleAnswer = (id: number) => {
		alert(`Elegiste el héroe con id: ${id}`)
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
					{heroes.map(hero => (
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