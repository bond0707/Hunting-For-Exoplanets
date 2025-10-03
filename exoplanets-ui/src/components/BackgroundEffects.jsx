import React from 'react';

const BackgroundEffects = () => {
    return (
        <div 
            className="fixed left-0 top-0 -z-50 h-full w-full"
            style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)',
                position: 'fixed',
                pointerEvents: 'none',
            }}
        >
            <div 
                className="absolute inset-0 -z-40 h-full w-full bg-[#0b0f19] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
            ></div>
            <div 
                className="absolute inset-0 -z-30 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e8822,transparent)]"
            ></div>
        </div>
    );
};

export default BackgroundEffects;