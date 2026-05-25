import { useState, useEffect, useRef } from 'react'
import type { Hero } from '../types/hero'
import type { Question } from '../types/question'
import { useSound } from './useSound'
import type { RoundStatus } from '../components/RoundTracker'
import type { RankingType } from '../components/Ranking'
import { getHeroes } from '../services/heroes'
import { getRandomElements } from '../utils/random'
import { QUESTIONS } from '../data/questions'
import type { Variants } from 'framer-motion'
import { supabase } from '../supabase'

export const useGame = () => {
    const [heroes, setHeroes] = useState<Hero[]>(() => {
        // Intentamos cargar los héroes desde localStorage para evitar llamadas a la API
        const storedHeroes = localStorage.getItem('heroes')
        return storedHeroes ? JSON.parse(storedHeroes) : []
    })
    const [loading, setLoading] = useState(true)
    const [questionSelect, setQuestionSelect] = useState<Question | null>(null)
    const [gameHeroes, setGameHeroes] = useState<Hero[]>([])

    // Contador de rondas para disparar el useEffect de selección de héroes y pregunta cada vez que el jugador responde (o inicia el juego por primera vez)
    const [roundsPlayed, setRoundsPlayed] = useState(0)
    // Estado para guardar el héroe objetivo de la pregunta actual
    const [targetHero, setTargetHero] = useState<Hero | null>(null)
    // Estado para llevar el puntaje del jugador
    const [score, setScore] = useState(0)
    // Estado para llevar la racha de respuestas correctas del jugador
    const [streak, setStreak] = useState(0)

    // Estado para mostrar el resultado después de responder (correcto/incorrecto)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)

    // Sonidos
    const { play: playCorrect } = useSound('/sounds/correct.mp3')
    const { play: playWrong } = useSound('/sounds/wrong.mp3')

    // Sound Streaks
    const { play: playKillingSpree } = useSound('/sounds/streak/killing-spree.mp3')
    const { play: playDominating } = useSound('/sounds/streak/dominating.mp3')
    const { play: playMegaKill } = useSound('/sounds/streak/mega-kill.mp3')
    const { play: playUnstoppable } = useSound('/sounds/streak/unstoppable.mp3')

    // tiempo del timer
    const TIME_ROUND = Number(import.meta.env.VITE_TIME_ROUND) || 10
    const [timeLeft, setTimeLeft] = useState(TIME_ROUND)

    // Estados para el RoundTracker	
    const [roundResults, setRoundResults] = useState<RoundStatus[]>([])
    const [roundHeroes, setRoundHeroes] = useState<(Hero | null)[]>([]) // URLs de héroes por ronda
    const TOTAL_ROUNDS = Number(import.meta.env.VITE_TOTAL_ROUNDS) || 10

    // validar round, para que los useEffect solo carguen una vez
    const roundIdRef = useRef(0)

    // Indicador para pusar el Timer
    const [isPaused, setIsPaused] = useState(true);

    // referencia para setInterval
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // control modal
    const [showModal, setShowModal] = useState(false)
    const [playerName, setPlayerName] = useState('')
    const [saveTriggered, setSaveTriggered] = useState(0)

    // ranking	
    const [ranking, setRanking] = useState<RankingType[]>([])

    //control termino de juego
    const [gameOver, setGameOver] = useState(false)

    //controlar apertura del ranking en movil
    const [isModalOpen, setIsModalOpen] = useState(false)

    //hero block click
    const [isHeroBlockClicked, setIsHeroBlockClicked] = useState(true)

    //save ranking
    const [loadRanking, setLoadRanking] = useState(0)

    //id de fila a marcar en ranking
    const [idLastRowRankingSave,setIdLastRowRankingSave] = useState<string|false>(false)

    //obtener el País
    const obtenerPais = async () => {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        return data.country_code // "PE", "AR", "MX", etc.
    }

    //save ranking
    const guardarPuntaje = async (name:string, points:number) => {
        const country = await obtenerPais()
        const { data, error } = await supabase
            .from('ranking')
            .insert({ name, points, country })
            .select()

        if (error) console.error(error)
        return data?.[0]?.id
    }

    //get Ranking
    const obtenerRanking = async () => {
        const { data, error } = await supabase
            .from('ranking')
            .select('*')            
            .order('points', { ascending: false })
            .limit(10)

        console.log('data:', data)
        console.error(error)
        return data
    }    

    //load ranking data supabase
    useEffect(() => {
        const cargar = async () => {
            const data = await obtenerRanking()
            if (data) setRanking(data??[])
        }
        cargar()
    }, [loadRanking])


    // Cargamos los héroes al montar el componente
    useEffect(() => {
        // Si ya tenemos héroes en el estado (cargados desde localStorage), no hacemos la llamada a la API
        if (heroes.length > 0) {
            setLoading(false)
            return
        }
        getHeroes()
            .then(data => {
                setHeroes(data)
                //guardar en localStorage para evitar futuras llamadas a la API
                localStorage.setItem('heroes', JSON.stringify(data))
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    //seleccionar a los heroes que se mostraran en el grid
    useEffect(() => {
        if (heroes.length > 0) {
            // 1. Elegir pregunta
            const [selectedQuestion] = getRandomElements(QUESTIONS)
            setQuestionSelect(selectedQuestion)

            // 2. Separar correctos e incorrectos usando el mismo filter
            const correctHeroes = heroes.filter(selectedQuestion.filter)
            const wrongHeroes = heroes.filter(h => !selectedQuestion.filter(h))
            if (wrongHeroes.length < 8) return // Validamos que haya suficientes héroes incorrectos para llenar el grid, si no, no hacemos nada y esperamos a la próxima ronda para intentar con otra pregunta diferente (podría pasar con preguntas muy específicas)

            // 3. Validar que haya al menos 1 correcto
            if (correctHeroes.length === 0) return

            // 4. Agarrar 1 correcto random
            const [oneCorrect] = getRandomElements(correctHeroes)

            // 5. Agarrar 8 incorrectos random sin mutar el array original
            const eightWrong = getRandomElements(wrongHeroes, 8)

            // 6. Juntar y desordenar
            const newGameHeroes = [oneCorrect, ...eightWrong].sort(() => 0.5 - Math.random())

            // 7. Guardamos el héroe objetivo para poder validar la respuesta del jugador después
            setTargetHero(oneCorrect);

            // 8. Actualizamos los nuevos héroes en el grid
            setGameHeroes(newGameHeroes)
        }
    }, [heroes, roundsPlayed])

    const getStreakSound = (streak: number) => {
        if (streak === 2) return playKillingSpree()
        if (streak === 3) return playDominating()
        if (streak === 4) return playMegaKill()
        if (streak >= 5) return playUnstoppable()

        return playCorrect(2000) // sonido normal
    }

    // función que maneje TODOS los cambios de ronda
    const goToNextRound = () => {
        //solo pasa de ronda hasta que llegue al TOTAL_ROUNDS
        if (roundsPlayed + 1 < TOTAL_ROUNDS) {
            setShowResult(false)
            setIsHeroBlockClicked(false) //desbloquear click en hero block para la nueva ronda
            setSelectedId(null)
            setRoundsPlayed(p => p + 1)
        } else {
            //juego terminado
            setGameOver(true)
        }

    }

    const handleAnswer = async (hero: Hero) => {
        const thisRoundId = roundIdRef.current // ← captura ID

        // Cancela el timer apenas responde
        clearInterval(intervalRef.current!)
        intervalRef.current = null

        setIsHeroBlockClicked(true) //bloquear click en hero block
        setSelectedId(hero.id)
        setShowResult(true)
        setTimeLeft(0)

        let soundPromise: Promise<void>

        if (targetHero && hero.id === targetHero.id) {

            // Haptic: vibra el celular 50ms al acertar
            if (navigator.vibrate) navigator.vibrate(50)

            soundPromise = getStreakSound(streak + 1) // Reproducir sonido de racha
            const puntosGanados = 10 * (streak + 1) // Base 10 * multiplicador
            setScore(prev => prev + puntosGanados)
            setStreak(prev => prev + 1)

        } else {
            soundPromise = playWrong(2000) // Sonido error
            setStreak(0) // Reiniciar la racha si se responde incorrectamente
        }

        setRoundResults(prev => [...prev, targetHero?.id === hero.id ? 'correct' : 'wrong'])
        setRoundHeroes(prev => [...prev, hero])

        //para mostrar modal antes de que termine el sonido
        if (roundsPlayed + 1 == TOTAL_ROUNDS) {
            setGameOver(true)
        }

        // Espera a que termine el sonido
        await soundPromise

        // Solo pasa de ronda si no cambió
        if (thisRoundId === roundIdRef.current) {
            goToNextRound()
        }

    }

    // Animaciones con Framer Motion
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05 // 50ms entre cada carta
            }
        }
    }

    const item: Variants = {
        hidden: { opacity: 0, scale: 0.6, y: 20 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", damping: 15, stiffness: 300 }
        }
    }

    // useEffect del timer
    useEffect(() => {

        roundIdRef.current += 1
        const currentRoundId = roundIdRef.current

        setTimeLeft(TIME_ROUND)
        setShowResult(false)
        setSelectedId(null)

        let expired = false

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!)
                    intervalRef.current = null

                    if (!expired && currentRoundId === roundIdRef.current) {
                        expired = true
                        setShowResult(true)
                        setRoundResults(p => [...p, 'empty'])
                        setRoundHeroes(p => [...p, null])
                        goToNextRound()
                    }
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            expired = true
        }

    }, [roundsPlayed])

    //para pausar
    useEffect(() => {
        if (isPaused) {
            // Pausar: matar el interval
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            setIsHeroBlockClicked(true) //bloquear click en hero block
        } else {
            setIsHeroBlockClicked(false) //desbloquear click en hero block
            // Reanudar: pero solo si no hay uno corriendo ya
            if (intervalRef.current) return

            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!)
                        intervalRef.current = null
                        setShowResult(true)
                        setRoundResults(p => [...p, 'empty'])
                        setRoundHeroes(p => [...p, null])
                        goToNextRound()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
    }, [isPaused])

    //reiniciar juego
    const onRestart = () => {        
        setRoundsPlayed(0); // ronda a cero
        setRoundResults([]); // lista de estados ( correct, wrong , empty) de heroes marcados
        setRoundHeroes([]); // lista de heroes marcados se vacia
        setScore(0)      // puntaje
        setStreak(0)     // racha
        setIsPaused(false) // si estaba pausado al reiniciar
        setGameOver(false)
        setIdLastRowRankingSave(false) //despintar fila
        setIsHeroBlockClicked(false) //resetear click en hero block
    }

    //abrir modal
    useEffect(() => {
        if (gameOver) {
            setShowModal(true);
        }
    }, [gameOver])

    //agregar jugador al listado de ranking
    useEffect(() => {
        if (!playerName) return  // evita agregar si está vacío
        
        const save = async () => {
            const id = await guardarPuntaje(playerName, score)        
            setIdLastRowRankingSave(id)
            setLoadRanking(prev => prev + 1)             
        }

        save()
        
        
    }, [saveTriggered])    

    return {    
        game: { score, streak, roundsPlayed, loading, total_rounds : TOTAL_ROUNDS,
            isHeroBlockClicked
         },
        timer: { timeLeft, isPaused, setIsPaused },
        round: {             
            roundResults, 
            roundHeroes, 
            gameHeroes, questionSelect, targetHero, selectedId, showResult },
        ranking: { 
            ranking, isModalOpen, setIsModalOpen, 
            idLastRowRankingSave, setIdLastRowRankingSave
        },
        modal: { showModal, setShowModal, playerName, setPlayerName, setSaveTriggered },
        actions: { handleAnswer, onRestart, goToNextRound },                
        animation: {
            container, item
        }        
        
    }
}