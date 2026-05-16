export type RankingType = {
    id:string
    name: string
    points: number
}

export const Ranking = ({ ranking }: { ranking: RankingType[]}) => {
    const sorted = [...ranking].sort((a, b) => b.points - a.points)

    return (
        <div className="flex flex-col gap-4 lg:mt-8">
            <h2 className="text-white text-2xl font-bold text-center">Ranking</h2>

            <div className="flex flex-col gap-2">
                {sorted.length === 0 && (
                    <p className="text-gray-400 text-center">No hay entradas aún</p>
                )}
                {sorted.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold w-6 text-center">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                            </span>
                            <span className="text-white font-medium">{entry.name}</span>
                        </div>
                        <span className="text-cyan-400 font-bold">{entry.points} pts</span>
                    </div>
                ))}
            </div>
        </div>
    )
}