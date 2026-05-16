
export type RankingType = {
    id:string
    name: string
    points: number
}

type RankingProps = {
    ranking: RankingType[]
    isOpen: boolean
    setIsOpen: (value:boolean) => void
    tickRow: boolean
    setTickRow: (value:boolean) => void
}

export const Ranking = ({ ranking, isOpen, setIsOpen , tickRow, setTickRow }: RankingProps) => {   
    
    const lastPlayer = ranking.at(-1)// último agregado
    
    const sorted = [...ranking].sort((a, b) => b.points - a.points)

    const list = (
        <div className="flex flex-col gap-2">
            <h2 className="text-white text-2xl font-bold text-center mb-4">Ranking</h2>
            {sorted.length === 0 && (
                <p className="text-gray-400 text-center">No hay entradas aún</p>
            )}
            
            {sorted.map((entry, index) => (                
                <div key={entry.id} className={`flex items-center justify-between ${(entry.id === lastPlayer?.id && tickRow )? 'bg-green-700' : 'bg-gray-700'} rounded-lg px-4 py-3`}>                    
                    <div className="flex items-center gap-3">
                        <span className="text-lg w-6 text-center">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                        </span>
                        <span className="text-white font-medium">{entry.name}</span>
                    </div>
                    <span className="text-cyan-400 font-bold">{entry.points} pts</span>
                </div>
            ))}
        </div>
    )

    return (
        <>
            {/* Botón medalla: solo móvil */}
            <div className="fixed top-4 right-4 z-40 lg:hidden">
                <div className="relative w-10 h-10 cursor-pointer group" onClick={() => setIsOpen(true)}>
                    <svg className="transform -rotate-90 w-10 h-10">
                        <circle cx={20} cy={20} r={17} stroke="#374151" strokeWidth={3} fill="transparent" />
                        <circle cx={20} cy={20} r={17} stroke="#f59e0b" strokeWidth={3} fill="transparent" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg">🏅</span>
                    </div>
                </div>
            </div>

            {/* Panel: solo móvil */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 lg:hidden flex items-start justify-center pt-4 px-4">
                    <div className="bg-gray-800 rounded-xl p-6 w-full relative">
                        <button
                            onClick={() => {
                                    setIsOpen(false)
                                    setTickRow(false)
                                }
                            }
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}>
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                        {list}
                    </div>
                </div>
            )}

            {/* Listado directo: solo desktop */}
            <div className="hidden lg:block lg:mt-8">
                {list}
            </div>
        </>
    )
}