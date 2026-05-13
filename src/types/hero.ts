export type Hero = {
    id: number
    name: string
    localized_name: string
    img: string
    primary_attr: 'str' | 'agi' | 'int' | 'all'
    attack_type: 'Melee' | 'Ranged'
    roles: string[]
    move_speed: number
    base_armor: number
    legs: number
}