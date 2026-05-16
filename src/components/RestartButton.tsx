type Variant = 'small' | 'medium' | 'large'

const configs = {
    small: {
        container: 'w-10 h-10',
        svg: 'w-10 h-10',
        cx: 20, cy: 20, r: 17,
        strokeWidth: 3,
        iconSize: 14,
        hoverContainer: 'w-7 h-7',
    },
    medium: {
        container: 'w-16 h-16',
        svg: 'w-16 h-16',
        cx: 32, cy: 32, r: 28,
        strokeWidth: 4,
        iconSize: 22,
        hoverContainer: 'w-10 h-10',
    },
    large: {
        container: 'w-24 h-24',
        svg: 'w-24 h-24',
        cx: 48, cy: 48, r: 42,
        strokeWidth: 6,
        iconSize: 30,
        hoverContainer: 'w-14 h-14',
    },
}

type RestartButtonProps = {
    onClick: () => void
}

const RestartIcon = ({ size, color = 'white' }: { size: number, color?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} width={size} height={size}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
)

const Circle = ({ variant }: { variant: Variant }) => {
    const c = configs[variant]
    return (
        <div className={`relative ${c.container} cursor-pointer group`}>
            <svg className={`transform -rotate-90 ${c.svg}`}>
                <circle cx={c.cx} cy={c.cy} r={c.r} stroke="#374151" strokeWidth={c.strokeWidth} fill="transparent" />
                <circle cx={c.cx} cy={c.cy} r={c.r} stroke="#6366f1" strokeWidth={c.strokeWidth} fill="transparent" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="group-hover:hidden flex items-center justify-center">
                    <RestartIcon size={c.iconSize} />
                </span>
                <span className={`hidden group-hover:flex items-center justify-center bg-gray-900 rounded-full ${c.hoverContainer}`}>
                    <RestartIcon size={c.iconSize} color="#6366f1" />
                </span>
            </div>
        </div>
    )
}

export const RestartButton = ({ onClick }: RestartButtonProps) => {
    return (
        <div onClick={onClick}>
            {/* Móvil */}
            <div className="lg:hidden fixed left-1">
                <Circle variant="small" />
            </div>
            {/* Desktop */}
            <div className="hidden lg:block">
                <Circle variant="large" />
            </div>
        </div>
    )
}