import { Link } from "react-router-dom";

export default function Login() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

                <h1 className="text-3xl font-bold text-center">
                    Welcome Back
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Sign in to continue
                </p>

                <form className="space-y-5">

                    <div>

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="********"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div className="flex justify-between text-sm">

                        <label className="flex gap-2">

                            <input type="checkbox" />

                            Remember me

                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-blue-600"
                        >
                            Forgot password?
                        </Link>

                    </div>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold"
                    >
                        Sign In
                    </button>

                </form>

                <div className="my-6 flex items-center">

                    <div className="flex-1 border-b"></div>

                    <span className="mx-3 text-gray-400">
                        OR
                    </span>

                    <div className="flex-1 border-b"></div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <button className="border rounded-lg py-3 hover:bg-gray-100">
                        Google
                    </button>

                    <button className="border rounded-lg py-3 hover:bg-gray-100">
                        Github
                    </button>

                </div>

                <p className="text-center mt-8">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-600 ml-2"
                    >
                        Sign Up
                    </Link>

                </p>

            </div>

        </div>
    );
}