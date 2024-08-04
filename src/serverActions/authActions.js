"use server"

import { signIn, signOut } from "@/auth";


export async function doSocialLogin(formData) {
    const action = formData.get('action')
    console.log(action);
    await signIn(action, { redirectTo: "/" })
}

export async function doLogout() {
    console.log("doLogout");
    await signOut({ redirectTo: "/auth/signin" })
}

export async function doCredentialLogin(formData) {
    console.log("doCredentialLogin called", formData.get('email'), formData.get('password'));
    try {
        const email = formData.get('email')
        const password = formData.get('password')
        console.log("email: ", email, " password: ", password);
        const response = await signIn("credentials", { email, password, redirect: false })

        console.log("doCredentialLogin response: ", response);

        if (response?.error) {
            return { error: response.error };
        }

        return response;

    } catch (error) {
        console.log("throwing error: ", error);
        return { error: error.message };
    }
}