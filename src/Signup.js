import { useEffect, useState } from "react";
import "./style.css";

// ✅ usernames 배열 이름 수정
const usernames = ["elroi773", "joe", "jo31"];

// ✅ useDebounce 훅 (오타 수정)
const useDebounce = (value, delay) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
};

// ✅ Username 컴포넌트
const Username = ({ isValid, isLoading, handleChange }) => {
    return (
        <>
            <div className="username">
                <input
                    onChange={handleChange}
                    className="control"
                    placeholder="Username"
                />
                <div className={`spinner ${isLoading ? "loading" : ""}`}></div>
            </div>
            <div className={`validation ${!isValid ? "invalid" : ""}`}>
                Username already taken
            </div>
        </>
    );
};

// ✅ Signup 컴포넌트
export const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [username, setUsername] = useState("");

    const debouncedUsername = useDebounce(username, 500);

    const handleChange = (e) => {
        setIsLoading(true);
        setUsername(e.target.value);
    };

    useEffect(() => {
        setIsValid(!usernames.some((u) => u === debouncedUsername));
        setIsLoading(false);
    }, [debouncedUsername]);

    return (
        <Username
            isLoading={isLoading}
            isValid={isValid}
            handleChange={handleChange}
        />
    );
};
