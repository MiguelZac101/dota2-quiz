
export type RankingType = {
    id?:string
    name: string
    points: number
    country: string
}

type RankingProps = {
    ranking: RankingType[]
    isOpen: boolean
    setIsOpen: (value:boolean) => void
    idMarkRow: string | false
    setIdMarkRow: (value:string|false) => void
}

export const Ranking = ({ ranking, isOpen, setIsOpen , idMarkRow, setIdMarkRow }: RankingProps) => {   
    
    const list = (
        <>
            <h2 className="text-white text-2xl font-bold text-center mb-4">Ranking</h2>

            <div className="flex flex-col gap-2 mb-10">

                {ranking.length === 0 && (
                    <p className="text-gray-400 text-center">No hay entradas aún</p>
                )}

                {ranking.map((entry, index) => (
                    <div key={entry.id} className={`grid grid-cols-[1fr_40px_70px] items-center ${(entry.id == idMarkRow ) ? 'bg-gray-900' : 'bg-gray-700'} rounded-lg px-4 py-3`}>
                        <div className="flex items-center gap-3">
                            <span className="text-lg w-6 text-center">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                            </span>
                            <span className="text-white font-medium">{entry.name}</span>
                        </div>
                        <span>
                            {entry.country && (
                                <img
                                    src={`https://flagcdn.com/24x18/${entry.country.toLowerCase()}.png`}
                                    alt={entry.country}
                                />
                            )}
                        </span>
                        <span className="text-cyan-400 font-bold">{entry.points} pts</span>
                    </div>
                ))}
            </div>
        </>
    )

    return (
        <>
            {/* Botón medalla */}
            <div className="fixed md:relative top-4 md:top-0 right-4 md:right-0 z-40">
                <div className="relative w-6 h-6 md:w-12 md:h-12 cursor-pointer group" onClick={() => setIsOpen(true)} title="Mostrar Ranking">
                    <svg className="w-6 h-6 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10v6a5 5 0 01-10 0V4z" />
                        <path strokeLinecap="round" d="M4 4h3M17 4h3M4 4c0 3 1.5 5 3 6M20 4c0 3-1.5 5-3 6" />
                        <path strokeLinecap="round" d="M12 15v4M9 19h6" />
                    </svg>
                </div>
            </div>

            {/* Modal con lista */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4" 
                    onClick={() => {
                                    setIsOpen(false)
                                    setIdMarkRow(false)
                                }
                            }
                    >
                    <div className="relative bg-gray-800 rounded-xl p-4 lg:p-6 w-full md:w-[700px] overflow-y-auto">
                        <button
                            onClick={() => {
                                    setIsOpen(false)
                                    setIdMarkRow(false)
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

        </>
    )
}