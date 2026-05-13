import { useRef, useCallback } from 'react'

export function useSound(src: string, volume = 0.5) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    if (!audioRef.current) {
        audioRef.current = new Audio(src)
        audioRef.current.volume = volume
    }

    const play = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => { })
    }, [])

    const stop = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
        audioRef.current.currentTime = 0
    }, [])

    return { play, stop }
}