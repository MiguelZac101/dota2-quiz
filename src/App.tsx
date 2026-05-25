import { HeroCard } from './components/HeroCard'
import { motion } from 'framer-motion'
import { Timer } from './components/Timer'
import { RoundTracker } from './components/RoundTracker'
import { RestartButton } from './components/RestartButton'
import { Modal } from './components/Modal'
import { Ranking } from './components/Ranking'
import { useGame } from './hook/useGame'
import { PlayStopButton } from './components/PlayStopButton'

function App() {
	
	const {
		game, 
		timer, 
		round,
		ranking,
		modal,
		actions,
		animation
	} = useGame()

	if (game.loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<p className="text-white text-xl">Cargando héroes...</p>
			</div>
		)
	}

	return (
		<div className="w-full p-2 sm:p-0 bg-gray-900 text-white min-h-screen overflow-x-hidden flex flex-col">
			<div className='hidden lg:block'>
				<RoundTracker
					currentRound={game.roundsPlayed + 1}
					totalRounds={game.total_rounds}
					roundResults={round.roundResults}
					roundHeroes={round.roundHeroes}
					variant="desktop"
				/>
			</div>	
			
			{/* LAYOUT DESKTOP: 3 columnas */}
			<div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">

				{/* COLUMNA IZQ: solo desktop */}				
				
				<div className="lg:mt-[164px]">
					{/* Contenido Timer / Restart */}
					<div className="flex flex-col items-end gap-0 lg:gap-4">						

						<Timer timeLeft={timer.timeLeft} />
						<PlayStopButton isPaused={timer.isPaused} onClick={() => timer.setIsPaused(prev => !prev)} />
						<RestartButton onClick={actions.onRestart} />
						
					</div>
				</div>

				{/* COLUMNA CENTRO: Grid */}
				<div className="pt-0 lg:pt-6">
					<h1 className="text-4xl font-bold text-cyan-400 text-center mb-2 lg:mb-6">
						Dota 2 Quiz
					</h1>

					{/* Animación de racha */}					
					<div className={`${game.streak >= 2 ? 'h-8' : 'h-0'} overflow-hidden lg:flex items-center justify-center transition-all duration-200`}>
						{game.streak >= 2 && (
							<motion.div
								key={game.streak} // Se re-anima cada vez que sube
								initial={{ scale: 0, opacity: 0 }} 
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0 }}
								className="text-center mb-2"
							>
								<span className="text-yellow-400 font-black text-xl tracking-wider drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
									{game.streak === 2 && 'KILLING SPREE x2'}
									{game.streak === 3 && 'DOMINATING x3'}
									{game.streak === 4 && 'MEGA KILL x4'}
									{game.streak === 5 && 'UNSTOPPABLE x5'}
									{game.streak >= 6 && `GODLIKE x${game.streak}`}
								</span>
							</motion.div>
						)}
					</div>

					{/* Puntaje y racha */}					
					<div className="grid grid-cols-3 items-stretch gap-4 mb-2 lg:mb-4">

						{/* Puntaje texto */}
						<div className="flex items-center justify-center border-r border-gray-700 pr-4">
							<p className="text-gray-400 text-sm uppercase tracking-widest">Puntaje</p>
						</div>

						{/* Puntaje número */}
						<div className="flex items-center justify-center">														
							<p className="text-white font-bold text-4xl lg:text-6xl tabular-nums">
								{String(game.score).padStart(2, '0')}
							</p>
						</div>

						{/* Racha */}
						<div className="flex items-center justify-center border-l border-gray-700 pl-4">
							{game.streak > 0
								? <p className="text-orange-400 text-xl font-bold">x{game.streak} 🔥</p>
								: <p className="text-gray-600 text-xl">—</p>
							}
						</div>

					</div>

					<div className="lg:hidden mb-2 lg:mb-0">
						<RoundTracker
							currentRound={game.roundsPlayed + 1}
							totalRounds={game.total_rounds}
							roundResults={round.roundResults}
							roundHeroes={round.roundHeroes}
							variant="mobile"
						/>
					</div>

					<motion.div
						key={game.roundsPlayed} // ← Re-dispara animación cada ronda
						variants={animation.container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 lg:mb-4"
					>
						{round.gameHeroes.map((hero) => (
							<motion.div
								key={hero.id}
								variants={animation.item}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
									<HeroCard
										hero={hero}
										onClick={actions.handleAnswer}
										selectedId={round.selectedId}
										correctId={round.showResult ? (round.targetHero?.id ?? null) : null}
										showResult={round.showResult}
										isLocked={game.isHeroBlockClicked}
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
							{round.questionSelect?.text}
						</p>

					</motion.div>

					
					
				</div>

				{/* COLUMNA DER: solo desktop */}				
				<div className="lg:mt-[164px]">
					
					{/* Ranking */}
					<Ranking 
						ranking={ranking.ranking} 
						isOpen={ranking.isModalOpen} 
						setIsOpen={ranking.setIsModalOpen} 
						idMarkRow={ranking.idLastRowRankingSave}
						setIdMarkRow={ranking.setIdLastRowRankingSave}
					/>					
					
				</div>

			</div>
			

			<Modal
				openModal={modal.showModal}
				onSave={(name) => {
					modal.setPlayerName(name)
					modal.setShowModal(false)
					modal.setSaveTriggered( prev => prev + 1 )
					ranking.setIsModalOpen(true) //abrir ranking
				}}
				onCancel={() => modal.setShowModal(false)}
			/>

			{/* Modal: How to Play */}
			{modal.showHowToPlay && (
				<div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-gray-800 rounded-lg p-6 max-w-lg border border-cyan-500"
					>
						<h2 className="text-2xl font-bold text-cyan-400 mb-4">How to Play</h2>
						<div className="space-y-3 text-gray-300 text-sm mb-6">
							<p>🎯 <b>Objective:</b> Guess which hero matches the question.</p>
							<p>⚡ <b>Streak Bonus:</b> Answer correctly in a row for x2, x3, x4... points.</p>
							<p>⏱️ <b>Time Bonus:</b> Answer fast for +5 extra points.</p>
							<p>🎮 <b>Rounds:</b> 10 rounds total. Beat your high score!</p>
							<p>🔊 <b>Pro tip:</b> Turn on sound for Dota announcer voice lines.</p>
						</div>
						<button
							onClick={modal.closeHowToPlay}
							className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition"
						>
							Let's Go!
						</button>
					</motion.div>
				</div>
			)}
			

			<footer className="w-full py-6 mt-12">
				<div className="max-w-2xl mx-auto px-4 text-center space-y-2">
					<p className="text-gray-500 text-xs">
						This is a fan-made game. Not affiliated with, endorsed, or sponsored by Valve Corporation.
					</p>
					<p className="text-gray-600 text-xs">
						Dota 2 and all related assets are trademarks of Valve Corporation.
					</p>
					<p className="text-gray-600 text-xs">
						Made with React + Vite by @MiguelZack
					</p>
					<button
						onClick={() => modal.setShowHowToPlay(true)}
						className="text-cyan-400 text-xs hover:underline mt-2"
					>
						How to play?
					</button>
				</div>
			</footer>
			
		</div>	
			

	)
}

export default App