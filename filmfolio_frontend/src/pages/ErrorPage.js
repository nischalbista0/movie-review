import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-8 text-[#305973]">*Please login before using this feature*</h1>
                <button
                    className="bg-[#305973] text-white px-12 py-2 rounded-lg text-xl font-semibold"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
            </div>
        </div>
    );
};
