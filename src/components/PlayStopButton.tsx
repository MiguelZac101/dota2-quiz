
type buttonPros = {
    isPaused: boolean,
    onClick: () => void
}

export const PlayStopButton = (props: buttonPros) => {
    return (
        <div className="fixed md:relative left-2 top-4 md:inset-0" title="Play / Stop">
        
            <div className="relative w-6 h-6 md:w-12 md:h-12 cursor-pointer" onClick={props.onClick}>                
                
                {props.isPaused
                    ? <svg viewBox="0 0 24 24" fill="white" ><polygon points="5,3 19,12 5,21" /></svg>
                    : <svg viewBox="0 0 24 24" fill="white" ><rect x="5" y="3" width="4" height="18" /><rect x="15" y="3" width="4" height="18" /></svg>
                }
                 
            </div>
        </div>
    )
}