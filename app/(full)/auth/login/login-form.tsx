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
import { signIn } from "@/lib/auth-client"
// import { signInWithGoogle } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LoginSchema = z.object({
    email: z.string().email({ message: "Email invalide." }),
    password: z.string().min(8, { message: "Mot de passe trop court (≥ 8)." }),

})

export function LoginForm() {
    const router = useRouter(); // ✅ placé ici (CORRECT)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        try {
            await signIn.email(
                {
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
                            Se Connecter
                        </Button>
                    </form>
                </Form>

                <p className="mt-4 text-center text-gray-600">
                    Vous n&apos;avez pas de compte ?{' '}
                    <a href="/auth/login" className="text-indigo-600 hover:underline">
                        Inscrivez-vous
                    </a>
                </p>
            </div>
        </div>
    )
}