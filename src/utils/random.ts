
// Utilidad para obtener elementos aleatorios de un array
export function getRandomElements<T>(arr: T[], count: number = 1): T[] {
    if (arr.length === 0) return []
    if (count >= arr.length) return [...arr]

    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled.slice(0, count)
}