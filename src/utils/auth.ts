// import jwtDecode from "jwt-decode";

// export interface DecodedToken {
//     id: number;
//     username: string;
//     name: string;
//     role: string;
//     iat: number;
//     exp: number;
// }

// export const getUserFromToken = (): DecodedToken | null => {
//     if (typeof window === "undefined") return null;

//     const token = localStorage.getItem("token");
//     if (!token) return null;

//     try {
//         return jwtDecode<DecodedToken>(token);
//     } catch (err) {
//         console.error("Failed to decode token", err);
//         return null;
//     }
// };
