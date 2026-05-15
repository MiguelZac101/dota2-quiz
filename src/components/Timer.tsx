type TimerProps = {
    timeLeft: number
    isPaused: boolean
    onClick: () => void
}

export const Timer = ({ timeLeft, isPaused, onClick }: TimerProps) => {
    const progress = (timeLeft / 10) * 100
    const isLow = timeLeft <= 3

    return (
        <>
            {/* Barra: solo móvil */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50 lg:hidden">
                <div
                    className={`h-full transition-all duration-1000 linear ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Círculo: solo desktop */}
            <div className="hidden lg:flex flex-col items-center">
                <div className="relative w-32 h-32 cursor-pointer group" onClick={onClick}>
                    <svg className="transform -rotate-90 w-32 h-32">
                        <circle cx={64} cy={64} r={56} stroke="#374151" strokeWidth={8} fill="transparent" />
                        <circle
                            cx={64} cy={64} r={56}
                            stroke={isLow ? "#ef4444" : "#22c55e"}
                            strokeWidth={8}
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 56}
                            strokeDashoffset={(1 - timeLeft / 10) * 2 * Math.PI * 56}
                            className="transition-all duration-1000 linear"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-4xl font-bold group-hover:hidden ${isLow ? 'text-red-500' : 'text-green-400'}`}>
                            {isPaused ? <svg viewBox="0 0 24 24" fill="white" width={28} height={28}><polygon points="5,3 19,12 5,21" /></svg> : timeLeft}
                        </span>
                        <span className="hidden group-hover:flex items-center justify-center bg-gray-900 rounded-full w-16 h-16">
                            {isPaused
                                ? <svg viewBox="0 0 24 24" fill="white" width={28} height={28}><polygon points="5,3 19,12 5,21" /></svg>
                                : <svg viewBox="0 0 24 24" fill="white" width={28} height={28}><rect x="5" y="3" width="4" height="18" /><rect x="15" y="3" width="4" height="18" /></svg>
                            }
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}