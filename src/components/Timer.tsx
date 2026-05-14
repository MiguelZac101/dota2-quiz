type TimerVariant = 'xs' | 'small' | 'medium' | 'large' | 'bar'

type TimerProps = {
    timeLeft: number
    variant?: TimerVariant // default 'large'
}

export const Timer = ({ timeLeft, variant = 'large' }: TimerProps) => {

    const progress = (timeLeft / 10) * 100

    // Si es barra, return temprano
    if (variant === 'bar') {
        return (
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
                <div
                    className={`h-full transition-all duration-1000 linear ${timeLeft > 3 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        )
    }

    const config = {
        xs: {
            size: 'w-8 h-8', // 32px
            center: 16,
            radius: 14,
            strokeWidth: 3,
            text: 'text-xs',
            showNumber: true // si quieres ocultarlo pon false
        },
        small: {
            size: 'w-16 h-16', // 64px
            center: 32,
            radius: 28,
            strokeWidth: 4,
            text: 'text-xl',
            showNumber: true
        },
        medium: {
            size: 'w-32 h-32', // 128px
            center: 64,
            radius: 56,
            strokeWidth: 8,
            text: 'text-4xl',
            showNumber: true
        },
        large: {
            size: 'w-64 h-64', // 256px
            center: 128,
            radius: 120,
            strokeWidth: 12,
            text: 'text-7xl',
            showNumber: true
        }
    }[variant]

    const { size, center, radius, strokeWidth, text, showNumber } = config

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${size} mx-auto`}>
                <svg className={`transform -rotate-90 ${size}`}>
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#374151"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={timeLeft > 3 ? "#22c55e" : "#ef4444"}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * radius}
                        strokeDashoffset={(1 - timeLeft / 10) * 2 * Math.PI * radius}
                        className="transition-all duration-1000 linear"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Número: se oculta si showNumber = false */}
                {showNumber && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`${text} font-bold ${timeLeft > 3 ? 'text-green-400' : 'text-red-500'
                            }`}>
                            {timeLeft}
                        </span>
                    </div>
                )}
            </div>

            {variant === 'large' && (
                <p className="text-gray-400 text-lg mt-2">segundos</p>
            )}
        </div>
    )
}