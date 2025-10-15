'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/src/components/ui/form"
import { signUp } from "@/lib/auth-client"
// import { signInWithGoogle } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit avoir au moins 2 caractères." }),
    email: z.string().email({ message: "Email invalide." }),
    password: z.string().min(8, { message: "Mot de passe trop court (≥ 8)." }),

})

export function RegisterForm() {
    const router = useRouter(); // ✅ placé ici (CORRECT)

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        try {
            await signUp.email(
                {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                },
                {
                    onSuccess: () => {
                        router.push("/dashboard")
                    },
                    onError: (error) => {
                        toast.error(error.error.message)
                    }
                },
            )
        } catch (error) {
            toast.error("Une erreur est survenue.")
        }
    }

    return (
        <div className="py-8 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Créer un compte
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Votre email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Votre mot de passe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            S’inscrire
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 flex items-center justify-between">
                    <span className="border-b w-1/3"></span>
                    <span className="text-gray-500 text-sm">OU</span>
                    <span className="border-b w-1/3"></span>
                </div>

                <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition">
                    <FcGoogle size={20} />
                    <span className="text-gray-700 font-medium">S’inscrire avec Google</span>
                </button>

                <p className="mt-4 text-center text-gray-600">
                    Déjà un compte ?{' '}
                    <a href="/login" className="text-indigo-600 hover:underline">
                        Connectez-vous
                    </a>
                </p>
            </div>
        </div>
    )
}