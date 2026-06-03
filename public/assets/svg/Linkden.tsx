import React from 'react'

const Linkden = ({ color = "#214A9C" }: { color?: string }) => {
    return (
        <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.3346 11.8125C25.6553 11.8125 27.8809 12.7344 29.5218 14.3753C31.1628 16.0163 32.0846 18.2419 32.0846 20.5625V30.7708H26.2513V20.5625C26.2513 19.789 25.944 19.0471 25.397 18.5001C24.85 17.9531 24.1082 17.6458 23.3346 17.6458C22.5611 17.6458 21.8192 17.9531 21.2722 18.5001C20.7253 19.0471 20.418 19.789 20.418 20.5625V30.7708H14.5846V20.5625C14.5846 18.2419 15.5065 16.0163 17.1475 14.3753C18.7884 12.7344 21.014 11.8125 23.3346 11.8125Z"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.7513 13.2708H2.91797V30.7708H8.7513V13.2708Z"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.83464 8.89583C7.44547 8.89583 8.7513 7.59 8.7513 5.97917C8.7513 4.36834 7.44547 3.0625 5.83464 3.0625C4.2238 3.0625 2.91797 4.36834 2.91797 5.97917C2.91797 7.59 4.2238 8.89583 5.83464 8.89583Z"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default Linkden