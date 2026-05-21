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
            {/* Counter: solo desktop */}
            <div className={`hidden lg:block fixed top-4 right-4 ${isLow ? 'bg-red-900' : 'bg-gray-800'}  rounded-lg px-3 py-1 z-50`}>
                <p className="text-9xl font-bold">{timeLeft}</p>
            </div>
        </>
    )
}