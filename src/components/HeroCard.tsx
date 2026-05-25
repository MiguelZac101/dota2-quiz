import type { Hero } from '../types/hero'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

type Props = {
    hero: Hero
    onClick: (hero: Hero) => void
    selectedId: number | null
    correctId: number | null
    showResult: boolean
    isLocked: boolean
}

export function HeroCard({ hero, onClick, selectedId, correctId, showResult, isLocked }: Props) {
    
    const controls = useAnimation()
    
    const isCorrect = hero.id === correctId
    const isSelected = hero.id === selectedId
    const isSelectedWrong = showResult && isSelected && !isCorrect
    
    useEffect(() => {
        if (isSelectedWrong) {            
            controls.start({
                x: [0, -12, 12, -12, 12, -6, 6, 0],
                transition: { duration: 0.5 }
            })
        } else if (showResult && isSelected && isCorrect) {
            controls.start({
                scale: [1, 1.1, 1],
                transition: { duration: 0.3 }
            })
        }
    }, [isSelectedWrong, isSelected, isCorrect, showResult, controls, hero.localized_name])
    
    const forceHover = showResult && (isCorrect || isSelected)
    
    let borderClass = "border-gray-700 hover:border-cyan-400"
    if (showResult && isCorrect) borderClass = "border-green-500 shadow-lg shadow-green-500/60"
    if (isSelectedWrong) borderClass = "border-red-500 shadow-lg shadow-red-500/60"

    return (
        <motion.button
            onClick={() => !showResult && !isLocked && onClick(hero)}
            disabled={isLocked}
            animate={controls}
            whileHover={{ scale: isLocked ? 1 : 1.05 }}
            whileTap={{ scale: isLocked ? 1 : 0.95 }}
            className={`
                relative rounded-lg overflow-hidden border-2 group
                leading-none p-0 block
                ${borderClass}
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
        </motion.button>
    )
}