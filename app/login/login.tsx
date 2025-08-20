"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { email, z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Link from "next/link";
import { Github } from "lucide-react"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})


export function LoginForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    await signIn.email({
        email: values.email,
        password: values.password,
    },
    {
        onSuccess: () => {
            router.push('/dashboard');
            router.refresh();
        },
        onError: (error) => {
            toast(error.error.message)
        },
    }
);
  }

  async function SignInWithGithub(provider:string) {
    await signIn.social({
        provider: provider,
        callbackURL: '/dashboard',
    },
    {
        onSuccess: () => {
            router.push('/dashboard');
            router.refresh();
        },
        onError: (error) => {
            toast(error.error.message)
        },
    }
);
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="" {...field} className="w-full"/>
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
                <Input type="password" placeholder="" {...field} className="w-full"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Se connecter</Button>
      </form>
      <div className="">
        <p className="flex justify-between">Pas de compte ? <Link href="/register" className="text-blue-500 hover:underline">S'inscrire</Link></p>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <p>Ou</p><hr />
        <Button type="submit" className="w-full" onClick={() => SignInWithGithub('github')} >
          <Github size={8}/> Se connecter avec GitHub
        </Button>
      </div>
    </Form>
  )
}