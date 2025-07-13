// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

export interface AuthUser {
    id: number;
    name: string;
    username: string;
    role: string;
}

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userString = localStorage.getItem("user");
            const tokenString = localStorage.getItem("token");

            if (userString && tokenString) {
                try {
                    const parsedUser = JSON.parse(userString);
                    setUser(parsedUser);
                    setToken(tokenString);
                } catch (e) {
                    console.error("Failed to parse user:", e);
                    setUser(null);
                    setToken(null);
                }
            }
        }
        setLoading(false);
    }, []);

    return { user, token, loading };
}
