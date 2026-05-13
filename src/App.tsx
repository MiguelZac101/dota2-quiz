import { useState } from 'react'
import { HeroCard } from './components/HeroCard'

// Data temporal de prueba
const MOCK_HEROES = [
	{ id: 1, name: 'Axe', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe.png' },
	{ id: 2, name: 'Pudge', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png' },
	{ id: 3, name: 'Invoker', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png' },
	{ id: 4, name: 'Phantom Assassin', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_assassin.png' },
	{ id: 5, name: 'Crystal Maiden', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/crystal_maiden.png' },
	{ id: 6, name: 'Juggernaut', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png' },
	{ id: 7, name: 'Lina', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lina.png' },
	{ id: 8, name: 'Shadow Fiend', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/nevermore.png' },
	{ id: 9, name: 'Windranger', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/windrunner.png' },
]

function App() {
	const [selectedHero, setSelectedHero] = useState<number | null>(null)

	const handleAnswer = (id: number) => {
		setSelectedHero(id)
		alert(`Elegiste el héroe con id: ${id}`)
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white p-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
					Dota 2 Quiz
				</h1>

				{/* Grid 3x3 */}
				<div className="grid grid-cols-3 gap-4 mb-8">
					{MOCK_HEROES.map(hero => (
						<HeroCard key={hero.id} hero={hero} onClick={handleAnswer} />
					))}
				</div>

				{/* Pregunta debajo */}
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