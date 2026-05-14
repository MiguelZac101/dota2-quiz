import type { Hero } from "../types/hero"

export type RoundStatus = 'correct' | 'wrong' | 'empty'

type RoundTrackerProps = {
    currentRound: number
    totalRounds: number
    roundResults: RoundStatus[] // ['correct', 'wrong', 'empty',...]
    roundHeroes: (Hero | null)[] // URLs de las caras de los héroes por ronda
}

export const RoundTracker = ({
    currentRound,
    totalRounds,
    roundResults,
    roundHeroes
}: RoundTrackerProps) => {

    return (
        <div className="bg-gray-800 rounded-lg p-4 w-full">
            {/* Número de ronda */}
            <div className="text-center mb-4">
                <p className="text-gray-400 text-sm">Ronda</p>
                <p className="text-3xl font-bold text-white">
                    {currentRound} <span className="text-gray-500">/ {totalRounds}</span>
                </p>
            </div>

            {/* Barra de héroes */}
            <div className="flex divide-x divide-gray-700 rounded-lg overflow-hidden border border-gray-700">
                {Array.from({ length: totalRounds }).map((_, i) => {
                    const status = roundResults[i] || 'empty'
                    const heroImg = roundHeroes[i]?.img || null

                    return (
                        <div
                            key={i}
                            className={`flex-1 aspect-square relative flex items-center justify-center
                ${status === 'correct' && 'bg-green-500/20'}
                ${status === 'wrong' && 'bg-red-500/20'}
                ${status === 'empty' && 'bg-gray-900'}
                ${i + 1 === currentRound && 'ring-2 ring-yellow-400 ring-inset'}
              `}
                        >
                            {/* Imagen del héroe o placeholder */}
                            {heroImg && status !== 'empty' ? (
                                <img
                                    src={heroImg}
                                    alt={`Ronda ${i + 1}`}
                                    className={`w-full h-full object-cover
                    ${status === 'wrong' && 'grayscale opacity-60'}
                  `}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-1/2 h-1/2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            {/* Icono de check o X encima */}
                            {status === 'correct' && (
                                <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                            {status === 'wrong' && (
                                <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            )}

                            {/* Número de ronda chiquito */}
                            <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-1 rounded-tl">
                                {i + 1}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}