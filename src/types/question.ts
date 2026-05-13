import type { Hero } from "./hero"

export type Question = {
    id: number
    text: string
    filter: (hero: Hero) => boolean
}