"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";


export async function loginAction(loginCredentials) {


    const { email, password } = loginCredentials;
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/"
        })
    } catch (error) {
        console.log("Error from login Action: ", error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        errorMessage: "Invalid email or password"
                    }
                default:
                    return {
                        errorMessage: "Something went wrong"
                    }
            }
        }
        throw error;
    }
}