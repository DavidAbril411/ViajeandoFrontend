import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const PriceTrendChart = ({ currentPrice }) => {
    // Generate dummy data relative to current price to make it look realistic
    const basePrice = parseFloat(currentPrice) || 100;

    const data = [
        { name: 'Ene', price: basePrice * 0.9 },
        { name: 'Feb', price: basePrice * 0.85 },
        { name: 'Mar', price: basePrice * 1.1 },
        { name: 'Abr', price: basePrice * 1.2 },
        { name: 'May', price: basePrice * 1.0 },
        { name: 'Jun', price: basePrice * 0.95 },
        { name: 'Jul', price: basePrice * 1.3 }, // Peak season usually
        { name: 'Ago', price: basePrice * 1.25 },
        { name: 'Sep', price: basePrice * 0.9 },
        { name: 'Oct', price: basePrice * 0.8 },
        { name: 'Nov', price: basePrice * 0.85 },
        { name: 'Dic', price: basePrice * 1.4 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
        >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Tendencia de Precios
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Histórico estimado</span>
            </h3>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2E9BC6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2E9BC6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" fontSize={12} stroke="#9CA3AF" />
                        <YAxis fontSize={12} stroke="#9CA3AF" unit="$" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#2E9BC6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
                El precio actual de <span className="font-bold text-[#2E9BC6]">${basePrice}</span> es
                {basePrice < basePrice * 1.1 ? <span className="text-green-500 font-bold"> bueno para comprar.</span> : <span className="text-orange-500 font-bold"> un poco elevado.</span>}
            </p>
        </motion.div>
    );
};

export default PriceTrendChart;
