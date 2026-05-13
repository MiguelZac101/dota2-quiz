import { useRef, useCallback } from 'react'

export function useSound(src: string, volume = 0.5) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    if (!audioRef.current) {
        audioRef.current = new Audio(src)
        audioRef.current.volume = volume
    }

    const play = useCallback((durationMs?: number): Promise<void> => {
        return new Promise((resolve) => {
            if (!audioRef.current) return resolve()

            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => resolve())

            // Si pasas duración, corta ahí
            if (durationMs) {
                setTimeout(() => {
                    audioRef.current?.pause()
                    resolve()
                }, durationMs)
            } else {
                // Si no, espera a que termine completo
                audioRef.current.onended = () => resolve()
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