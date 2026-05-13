import { useState, useEffect } from 'react'
import { HeroCard } from './components/HeroCard'
import { getHeroes } from './services/heroes'
import type { Hero } from './types/hero'

function App() {
	const [heroes, setHeroes] = useState<Hero[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getHeroes()
			.then(data => {
				// Por ahora agarra 9 random para la grid 3x3
				const shuffled = data.sort(() => 0.5 - Math.random())
				setHeroes(shuffled.slice(0, 9))
				setLoading(false)
			})
			.catch(err => {
				console.error(err)
				setLoading(false)
			})
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
						¿Qué héroe tiene la habilidad "Berserker's Call"?
					</p>
				</div>
			</div>
		</div>
	)
}

export default App