type TimerProps = {
    timeLeft: number
}

export const Timer = ({ timeLeft }: TimerProps) => {
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
                <div className="relative w-32 h-32">
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
                        <span className={`text-4xl font-bold ${isLow ? 'text-red-500' : 'text-green-400'}`}>
                            {timeLeft}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}