type Variant = 'small' | 'large'

const configs = {
    small: {
        container: 'w-6 h-6',
        svg: 'w-6 h-6',        
        strokeWidth: 1.5,             
    },
    large: {
        container: 'w-12 h-12',
        svg: 'w-12 h-12',        
        strokeWidth: 1.5,             
    }    
}

type RestartButtonProps = {
    onClick: () => void    
}


const Circle = ({ variant }: { variant: Variant }) => {
    const c = configs[variant]
    return (
        <div className={`relative ${c.container} cursor-pointer group`}>            
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center justify-center">

                    <svg className={c.svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={c.strokeWidth}>
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    
                </span>                
            </div>
        </div>
    )
}

export const RestartButton = ({ onClick }: RestartButtonProps) => {
    return (
        <div onClick={onClick} title="Reiniciar">
            {/* Móvil */}
            <div className="lg:hidden fixed left-11 top-5">
                <Circle variant="small" />                
            </div>
            {/* large */}
            <div className="hidden md:block">
                <Circle variant="large" />
            </div>
        </div>
    )
}