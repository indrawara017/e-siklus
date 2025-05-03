import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate, onFinish }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [blink, setBlink] = useState({ days: false, hours: false, minutes: false, seconds: false });
    const [show, setShow] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setShow(false);
                if (onFinish) onFinish();
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setBlink((prevState) => ({
                    days: days !== timeLeft.days,
                    hours: hours !== timeLeft.hours,
                    minutes: minutes !== timeLeft.minutes,
                    seconds: seconds !== timeLeft.seconds,
                }));

                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    const FlipUnit = ({ label, value, blink }) => {
        const [prevValue, setPrevValue] = useState(value);
        const [flipping, setFlipping] = useState(false);

        useEffect(() => {
            if (value !== prevValue) {
                setFlipping(true);
                const timeout = setTimeout(() => {
                    setPrevValue(value);
                    setFlipping(false);
                }, 600);
                return () => clearTimeout(timeout);
            }
        }, [value, prevValue]);

        return (
            <div className="relative w-10 h-13">
                <div className="relative w-full h-full perspective-[1000px]">
                    <div
                        className={`absolute w-full h-full text-white bg-red-500 rounded-xl shadow-lg flex items-center justify-center text-2xl font-extrabold transition-transform duration-600 origin-top preserve-3d ${flipping ? "animate-flip" : ""
                            } ${blink ? "animate-blink" : ""}`}
                    >
                        {value.toString().padStart(2, "0")}
                    </div>
                </div>
                <div className="absolute top-[50px] w-full text-xs text-center text-black">{label}</div>
            </div>
        );
    };

    if (!show) return null;

    return (
        <div className="text-center p-1 w-full">
            <div className="flex justify-center gap-1">
                <FlipUnit label="Hari" value={timeLeft.days} blink={blink.days} />
                <FlipUnit label="Jam" value={timeLeft.hours} blink={blink.hours} />
                <FlipUnit label="Menit" value={timeLeft.minutes} blink={blink.minutes} />
                <FlipUnit label="Detik" value={timeLeft.seconds} blink={blink.seconds} />
            </div>
        </div>
    );
};

export default CountdownTimer;
