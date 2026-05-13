type Hero = {
    id: number
    name: string
    img: string
}

type Props = {
    hero: Hero
    onClick: (id: number) => void
}

export function HeroCard({ hero, onClick }: Props) {
    return (
        <button
            onClick={() => onClick(hero.id)}
            className="relative rounded-lg overflow-hidden hover:scale-105 transition-all duration-200 border-2 border-gray-700 hover:border-cyan-400 group"
        >
            <img
                src={hero.img}
                alt={hero.name}
                className="w-full h-full object-cover aspect-square"
            />
            <div className="absolute bottom-0 w-full bg-black/80 text-white text-sm py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {hero.name}
            </div>
        </button>
    )
}