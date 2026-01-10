'use client';

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginMutation } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            await loginMutation.mutateAsync({ email, password });
            router.push('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 flex items-center justify-center font-dm-sans">
            <div className="w-full max-w-md">

                {/* Logo */}
                <Link href="/" className="block text-center text-2xl font-extrabold text-black font-dm-sans mb-8 tracking-tight">
                    xenova.
                </Link>

                {/* Card */}
                <div className="bg-[#e8e8e8] rounded-3xl px-8 py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-black font-dm-sans tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-sm text-gray-500 font-dm-sans">
                            Sign in to continue trading on Xenova
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-black font-dm-sans uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-transparent rounded-xl focus:outline-none focus:border-black transition-colors font-dm-sans text-sm text-black placeholder:text-gray-400"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold text-black font-dm-sans uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-transparent rounded-xl focus:outline-none focus:border-black transition-colors font-dm-sans text-sm text-black placeholder:text-gray-400"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full bg-black text-white font-dm-sans font-bold text-sm py-3.5 rounded-xl border-2 border-black hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 font-dm-sans text-center mt-6">
                        No account?{' '}
                        <Link href="/register" className="text-black font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>

                <p className="text-center mt-5">
                    <Link href="/" className="text-xs text-gray-400 font-dm-sans hover:text-black transition-colors">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
