import { useState } from "react"

type ModalProps = {
    openModal: boolean
    onSave: (name: string) => void
    onCancel: () => void
}

export const Modal = ({ openModal, onSave, onCancel }: ModalProps) => {
    const [name, setName] = useState('')

    if(!openModal) return null

    const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === "Enter"){
            onSave(name)
            setName('')
        }

        if(e.key === "Escape"){
            onCancel()
            setName('')
        }
    }    

    return (                
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onCancel}>
            {/* Contenido */}
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-sm flex flex-col gap-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-white text-2xl font-bold text-center">Ingresa tu nombre</h2>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={ handleKeyDown}
                    autoFocus
                    placeholder="Tu nombre..."
                    className="bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <div className="flex gap-4">
                    <button
                        onClick={ () => {
                                onCancel()
                                setName('')
                            }
                        }
                        className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                                onSave(name)
                                setName('')
                            }
                        }
                        disabled={!name.trim()}
                        className="flex-1 py-3 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}