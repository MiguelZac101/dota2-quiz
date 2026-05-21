import type { Hero } from '../types/hero'

type Props = {
    hero: Hero
    onClick: (hero: Hero) => void
    selectedId: number | null
    correctId: number | null
    showResult: boolean
    isLocked: boolean
}

export function HeroCard({ hero, onClick, selectedId, correctId, showResult, isLocked }: Props) {
    
    const isCorrect = showResult && hero.id === correctId
    const isSelectedWrong = showResult && hero.id === selectedId && hero.id !== correctId
    
    // Si es correcto o el que elegiste mal, finge el hover
    const forceHover = isCorrect || isSelectedWrong
    
    let borderClass = "border-gray-700 hover:border-cyan-400"
    if (isCorrect) borderClass = "border-green-500"
    if (isSelectedWrong) borderClass = "border-red-500"

    return (
        <button
            onClick={() => !showResult && !isLocked && onClick(hero)}
            disabled={isLocked}
            className={`
                relative rounded-lg overflow-hidden transition-all duration-200 border-2 group
                leading-none p-0 block
                ${borderClass}
                ${forceHover ? 'scale-105' : 'hover:scale-105'}
                ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <img
                src={hero.img}
                alt={hero.localized_name}
                className="w-full h-full object-cover aspect-square block"
            />
            <div className={`
                absolute bottom-0 w-full bg-black/80 text-white text-sm py-2 transition-opacity
                ${forceHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}>
                {hero.localized_name}
            </div>
        </button>
    )
}