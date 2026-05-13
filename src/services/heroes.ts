import type { Hero } from '../types/hero'

const API_URL = 'https://api.opendota.com'

export async function getHeroes(): Promise<Hero[]> {
    const res = await fetch(`${API_URL}/api/heroStats`)
    if (!res.ok) throw new Error('Error fetching heroes')

    const data: Hero[] = await res.json()

    // OpenDota devuelve img como "/apps/dota2/images/dota_react/heroes/axe.png"
    // Le agregamos el dominio completo
    return data.map(hero => ({
        ...hero,
        img: `https://cdn.cloudflare.steamstatic.com${hero.img}`
    }))
}