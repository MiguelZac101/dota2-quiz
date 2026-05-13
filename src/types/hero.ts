export type Hero = {
    id: number
    name: string // ej: "npc_dota_hero_axe"
    localized_name: string // ej: "Axe"
    img: string // ej: "/apps/dota2/images/dota_react/heroes/axe.png"

    // Stats que necesitas para las preguntas
    primary_attr: 'str' | 'agi' | 'int' | 'all'
    attack_type: 'Melee' | 'Ranged'
    roles: string[] // ['Carry', 'Support', 'Nuker',...]

    // Stats numéricos
    base_health: number
    base_mana: number
    base_armor: number
    base_attack_min: number
    base_attack_max: number
    base_str: number
    base_agi: number
    base_int: number
    move_speed: number
    base_health_regen: number
    base_mana_regen: number
}