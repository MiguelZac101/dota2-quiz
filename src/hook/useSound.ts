import { useRef, useCallback, useEffect } from 'react'

export function useSound(src: string, volume = 0.5) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const audio = new Audio(src)
        audio.volume = volume
        audioRef.current = audio

        return () => {
            audio.pause()
            audioRef.current = null
        }
    }, [src, volume])

    const play = useCallback((durationMs?: number): Promise<void> => {
        return new Promise((resolve) => {
            const audio = audioRef.current
            if (!audio) return resolve()

            audio.currentTime = 0

            let resolved = false
            const safeResolve = () => {
                if (!resolved) {
                    resolved = true  // ← nunca se llama dos veces
                    resolve()
                }
            }

            audio.play().catch(safeResolve)

            if (durationMs) {
                setTimeout(() => {
                    audio.pause()
                    safeResolve()
                }, durationMs)
            } else {
                audio.onended = safeResolve
            }
        })
    }, [])

    const stop = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
        audioRef.current.currentTime = 0
    }, [])

    return { play, stop }
}