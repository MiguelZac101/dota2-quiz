import type { Question } from "../types/question"

export const QUESTIONS: Question[] = [
    // Atributos
    { id: 1, text: "¿Qué héroe es de 'Inteligencia'?", filter: h => h.primary_attr === 'int' },
    { id: 2, text: "¿Qué héroe es de 'Fuerza'?", filter: h => h.primary_attr === 'str' },
    { id: 3, text: "¿Qué héroe es de 'Agilidad'?", filter: h => h.primary_attr === 'agi' },
    { id: 4, text: "¿Qué héroe es 'Universal'?", filter: h => h.primary_attr === 'all' },

    // // Tipo de ataque
    // { id: 5, text: "¿Qué héroe es Melee?", filter: h => h.attack_type === 'Melee' },
    // { id: 6, text: "¿Qué héroe es Ranged?", filter: h => h.attack_type === 'Ranged' },

    // // Roles
    // { id: 7, text: "¿Qué héroe es Carry?", filter: h => h.roles.includes('Carry') },
    // { id: 8, text: "¿Qué héroe es Support?", filter: h => h.roles.includes('Support') },
    // { id: 9, text: "¿Qué héroe es Initiator?", filter: h => h.roles.includes('Initiator') },
    // { id: 10, text: "¿Qué héroe es Nuker?", filter: h => h.roles.includes('Nuker') },
    // { id: 11, text: "¿Qué héroe es Disabler?", filter: h => h.roles.includes('Disabler') },

    // // Stats
    // { id: 12, text: "¿Qué héroe tiene 305+ de velocidad?", filter: h => h.move_speed >= 305 },
    // { id: 13, text: "¿Qué héroe tiene 60+ de daño base?", filter: h => h.base_attack_max >= 60 },
    // { id: 14, text: "¿Qué héroe tiene 5+ de armadura base?", filter: h => h.base_armor >= 5 },

    // // Combinadas
    // { id: 15, text: "¿Qué héroe es de Fuerza y Melee?", filter: h => h.primary_attr === 'str' && h.attack_type === 'Melee' },
    // { id: 16, text: "¿Qué héroe es Int y Support?", filter: h => h.primary_attr === 'int' && h.roles.includes('Support') },
    // { id: 17, text: "¿Qué héroe es Agi y Carry?", filter: h => h.primary_attr === 'agi' && h.roles.includes('Carry') },
]

