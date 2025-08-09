import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authService from "../../lib/appwrite/auth";

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const loggedIn = await authService.login(data);
            if (loggedIn) {
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    // Handler for Google login button
    const handleGoogleLogin = () => {
        authService.loginWithGoogle();
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gray-100 transition duration-300`}>
            <div className={`w-full max-w-md p-8 rounded-[10px] shadow-lg bg-white`}>
                <h2 className={`text-3xl font-bold mb-6 text-center text-black`}>
                    Welcome Back to <span className="text-rose-500/90">Trendora</span>
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className={`block mb-2 text-sm font-medium text-black`}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email format",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className={`block mb-2 text-sm font-medium text-black`}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="cursor-pointer w-full bg-gradient-to-r from-rose-300 to-rose-500 text-white py-2.5 rounded-lg hover:from-rose-600 hover:to-rose-400 transition"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <button
                        onClick={handleGoogleLogin} // or handleGoogleSignup for signup page
                        className="w-full py-2.5 rounded-lg border font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2 cursor-pointer"
                        type="button"
                        >
                        {/* Google SVG logo */}
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M21.805 10.023h-9.793v3.954h5.795c-.246 1.29-1.745 3.79-5.795 3.79-3.49 0-6.33-2.88-6.33-6.43s2.84-6.43 6.33-6.43c1.985 0 3.322.847 4.096 1.58l2.79-2.688C17.238 5.564 15.857 4.75 13.78 4.75 8.97 4.75 5.073 8.62 5.073 13.43c0 4.81 3.9 8.68 8.707 8.68 5.032 0 8.323-3.52 8.323-8.477 0-.58-.063-1.02-.298-1.61z"/>
                        </svg>
                        <span>Login with Google</span>
                    </button>
                </div>

                <p className={`mt-6 text-center text-sm text-black/60`}>
                    Don't have an account?
                    <button
                        onClick={() => navigate("/signup")}
                        className="ml-1 text-rose-500 hover:underline cursor-pointer"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
