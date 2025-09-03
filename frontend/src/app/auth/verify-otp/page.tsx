"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../../../api/api.client";

export default function VerifyOtpPage() {
    const router = useRouter();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp.trim()) {
            setError("Please enter the OTP");
            return;
        }

        const formData = sessionStorage.getItem("tempData");

        if (!formData) {
            router.push("/auth");
        } else {
            const parsed: { email: string, password: string, confirmPassword: string, name: string } = JSON.parse(formData)
            setIsLoading(true);
            try {
                const response = await apiClient.post("/auth/verify-otp", { email: parsed.email, otp });

                if (response.data.success) {
                    await apiClient.post("/auth/register", parsed);
                    sessionStorage.removeItem("tempData");
                    router.push("/auth")
                } else {
                    setError("Invalid OTP, please try again.");
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong. Try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">OTP Verification</h2>
                <p className="text-gray-600 text-center mb-4">
                    Enter the OTP sent to your mail.
                </p>

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
                    placeholder="Enter OTP"
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        </div>
    );
}
