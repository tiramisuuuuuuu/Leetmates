import styles from './Overlay.module.css';
import { useState } from 'react';
import Window from './Window';

export default function Overlay() {
    const [windowOpen, setWindowOpen] = useState(false);
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        >
            <button
                className={styles.lobbyButton}
                style={{
                    pointerEvents: 'auto',
                }}
                onClick={() => setWindowOpen(prev =>  !prev)}
            >
                <img
                    src="/image.png"
                    alt="togglable Leetmates logo"
                    style={{ width: '100%', height: '100%' }}
                />
            </button>
            <Window open={windowOpen} />
        </div>
    );
}
