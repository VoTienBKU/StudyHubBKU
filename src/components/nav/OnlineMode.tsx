import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import onlineImg from "@/assets/online.png";
import offlineImg from "@/assets/offline.png";

export const OnlineMode = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const preloadOffline = new Image();
        preloadOffline.src = offlineImg;

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const imgSrc = isOnline ? onlineImg : offlineImg;

    return (
        <Tippy content={isOnline ? "Online" : "Offline"}>
            <img
                src={imgSrc}
                alt={isOnline ? "Online" : "Offline"}
                style={{
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                }}
            />
        </Tippy>
    );
};
