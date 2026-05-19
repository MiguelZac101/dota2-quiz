import type { Hero } from "../types/hero"

export type RoundStatus = 'correct' | 'wrong' | 'empty'

type RoundTrackerProps = {
    currentRound: number
    totalRounds: number
    roundResults: RoundStatus[]
    roundHeroes: (Hero | null)[]
    variant?: 'desktop' | 'mobile'
}

export const RoundTracker = ({
    currentRound,
    totalRounds,
    roundResults,
    roundHeroes,
    variant = 'desktop'
}: RoundTrackerProps) => {

    let indiceMedio = Math.ceil(totalRounds / 2)
    let addClassMR = ""
    let addStyleBordeLateral

    if (variant === 'mobile') {
        return (
            <div className="flex items-center justify-center gap-2 py-2">
                {Array.from({ length: totalRounds }).map((_, i) => {
                    const status = roundResults[i]
                    const isCurrent = i + 1 === currentRound

                    return (
                        <div
                            key={i}
                            className={`
                                w-4 h-4 rounded-full transition-all duration-300
                                ${!status && !isCurrent ? 'bg-gray-600' : ''}
                                ${!status && isCurrent ? 'bg-yellow-400' : ''}
                                ${status === 'correct' ? 'bg-green-500' : ''}
                                ${status === 'wrong' ? 'bg-red-500' : ''}
                                ${status === 'empty' ? 'bg-gray-600' : ''}
                            `}
                        />
                    )
                })}
            </div>
        )
    }

    return (
        <>
            <div className="fixed flex items-center justify-center top-0 w-full z-50">

                <div className="inline-flex gap-1">
                    {
                        Array.from({ length: totalRounds }).map((_, i) => {
                            const status = roundResults[i] || 'empty'
                            const heroImg = roundHeroes[i]?.img || null
                            const isCurrent = i + 1 === currentRound
                            const hasResult = roundResults[i] !== undefined  // ← nuevo

                            //mitad agregar margin-bottom
                            addClassMR = ""
                            if (i + 1 == indiceMedio) {
                                addClassMR = "mr-80"
                            }

                            //laterales diagonal
                            addStyleBordeLateral = "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)" //der
                            if (i + 1 > indiceMedio) addStyleBordeLateral = "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)" //izq

                            return (
                                <div
                                    key={i}
                                    className={
                                        `aspect-square relative flex items-center justify-center                                                                
                                            w-14 h-12
                                            ${addClassMR}
                                        `}
                                >

                                    {/* Capa de borde */}
                                    <div
                                        className={`absolute inset-0
                                            ${status === 'correct' ? 'bg-green-500' : ''}
                                            ${status === 'wrong' ? 'bg-red-500' : ''}
                                            ${status === 'empty' ? 'bg-gray-600' : ''}
                                            ${isCurrent && !hasResult ? 'bg-yellow-400' : ''}
                                        `}
                                        style={{ clipPath: addStyleBordeLateral }}
                                    />

                                    <div
                                        className={`absolute inset-[1px]
                                            ${status === 'correct' ? 'bg-green-500/20' : ''}
                                            ${status === 'wrong' ? 'bg-red-500/20' : ''}
                                            ${status === 'empty' ? 'bg-gray-900' : ''}
                                        `}
                                        style={{ clipPath: addStyleBordeLateral }}
                                    >


                                        {heroImg && status !== 'empty' ? (
                                            <img
                                                src={heroImg}
                                                alt={`Ronda ${i + 1}`}
                                                className={`w-full h-full object-cover
                                        ${status === 'wrong' && 'grayscale opacity-60'}
                                    `}
                                                style={{ clipPath: `${addStyleBordeLateral}` }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" style={{ clipPath: `${addStyleBordeLateral}` }}>
                                                <svg className="w-1/2 h-1/2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}

                                        {status === 'correct' && (
                                            <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center" style={{ clipPath: `${addStyleBordeLateral}` }}>
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        {status === 'wrong' && (
                                            <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center" style={{ clipPath: `${addStyleBordeLateral}` }}>
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </>
    )
}