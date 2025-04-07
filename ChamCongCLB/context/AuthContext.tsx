"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { getProfile } from "@/actions/auth.actions";

export enum Role {
    ADMIN = "Admin",
    USER = "User",
}

export interface IAuthContextType {
    role: Role;
    setRole: (role: Role) => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>(Role.USER);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                if (profile.ok && profile.data) {
                    const data = profile.data as { roleName: Role };
                    setRole(data.roleName);
                } else {
                    setRole(Role.USER);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setRole(Role.USER);
            }
        };

        fetchProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
