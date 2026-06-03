import React from 'react'

const Email = ({ color = "#214A9C" }: { color?: string }) => {
    return (
        <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.5846 6.68945L19.4728 15.0413C19.0278 15.2998 18.5224 15.4359 18.0079 15.4359C17.4933 15.4359 16.9879 15.2998 16.543 15.0413L3.41797 6.68945M6.33464 2.31445H29.668C31.2788 2.31445 32.5846 3.62029 32.5846 5.23112V22.7311C32.5846 24.3419 31.2788 25.6478 29.668 25.6478H6.33464C4.7238 25.6478 3.41797 24.3419 3.41797 22.7311V5.23112C3.41797 3.62029 4.7238 2.31445 6.33464 2.31445Z"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default Email