import axios from 'axios'
import type { Hero } from '../types/hero'

export async function getHeroes(): Promise<Hero[]> {
    const { data } = await axios.get<Hero[]>('https://api.opendota.com/api/heroStats')

    // OpenDota devuelve img como "/apps/dota2/images/dota_react/heroes/axe.png"
    // Le agregamos el dominio completo
    return data.map(hero => ({
        ...hero,
        img: `https://cdn.cloudflare.steamstatic.com${hero.img}`
    }))
}