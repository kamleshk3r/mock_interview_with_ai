"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {auth} from "@/firebase/client";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {signIn, signUp} from "@/lib/actions/auth.action";



const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email:"",
            password:"",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === 'sign-up'){
                const { name, email, password } = values;

                const UserCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: UserCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if(!result?.success){
                    toast.error(result?.message);
                    return;
                }

                toast.success('Account created successfully. Please sign in to continue.');
                router.push('/sign-in')
            }else{

                const { email, password } = values;

                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredential.user.getIdToken();

                if(!idToken){
                    toast.error('There was an error signing in. Please try again.');
                    return;
                }

                await signIn({
                    email, idToken
                })

                toast.success('Signed in successfully.');
                router.push('/')
            }
        }catch(error){
            console.log(error)
            toast.error(`There was an error: ${error}`)
        }
    }

    const isSignIN = type ==='sign-in';

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" width={38} height={32} />
                    <h2 className="text-primary-100">MockMate</h2>
                </div>

                <h3>Practice job interview with AI</h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!isSignIN && (
                        <FormField
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Enter your name" />
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Enter email address"
                        type="email" />
                    <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your Password"
                        type="password"/>

                    <Button className="btn" type="submit">{isSignIN ? 'Sign in' : 'Create an account'}</Button>
                </form>
            </Form>

                <p className="text-center">
                    {isSignIN ? 'Don\'t have an account?' : 'Already have an account?'}
                    <Link href={!isSignIN ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                        {!isSignIN ? 'Sign in' : 'Sign up'}
                    </Link>
                </p>
        </div>
        </div>
    )
}
export default AuthForm
