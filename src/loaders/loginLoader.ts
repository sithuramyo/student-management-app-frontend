// src/loaders/loginLoader.ts
import { redirect, LoaderFunction } from "react-router-dom"
import Cookies from "js-cookie"
import { getDecodedToken } from "@/lib/auth"

export const loginLoader: LoaderFunction = () => {
    const token = Cookies.get("authToken")
    if (!token) return null
    const decoded = getDecodedToken(token);
    switch (decoded.typ) {
        case "Admin":
        case "SuperAdmin":
            throw redirect("/admin/dashboard")
        case "Student":
            throw redirect("/student/home")
        case "Faculty":
            throw redirect("/faculty/panel")
        default:
            return null
    }
}
