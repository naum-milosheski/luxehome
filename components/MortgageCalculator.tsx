'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Percent, Calendar } from 'lucide-react';
import CustomSelect from './CustomSelect';

interface MortgageCalculatorProps {
    homePrice: number;
}

export default function MortgageCalculator({ homePrice }: MortgageCalculatorProps) {
    const [price, setPrice] = useState(homePrice);
    const [downPayment, setDownPayment] = useState(homePrice * 0.2);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const principal = price - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        if (monthlyRate === 0) {
            setMonthlyPayment(principal / numberOfPayments);
        } else {
            const payment =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            setMonthlyPayment(payment);
        }
    }, [price, downPayment, interestRate, loanTerm]);

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-6">Mortgage Calculator</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Home Price */}
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">Home Price</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                value={price}
                                readOnly
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-500 rounded-xl border-none font-bold cursor-default focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Down Payment */}
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">
                            Down Payment ({((downPayment / price) * 100).toFixed(0)}%)
                        </label>
                        <div className="relative mb-2">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark font-bold"
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={price}
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="w-full accent-brand-dark"
                        />
                    </div>

                    {/* Interest Rate & Loan Term */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">Interest Rate</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    step="0.1"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark font-bold"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">Loan Term</label>
                            <CustomSelect
                                options={[
                                    { label: '15 Years', value: '15' },
                                    { label: '30 Years', value: '30' }
                                ]}
                                value={loanTerm.toString()}
                                onChange={(val: string) => setLoanTerm(Number(val))}
                            />
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-brand-dark text-white rounded-2xl p-8 flex flex-col justify-center items-center text-center">
                    <p className="text-brand-lime font-bold mb-2">Estimated Monthly Payment</p>
                    <div className="text-5xl font-bold mb-4">
                        ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-gray-400 text-sm">
                        Based on a {interestRate}% interest rate over {loanTerm} years.
                        <br />
                        Does not include taxes or insurance.
                    </p>
                </div>
            </div>
        </div>
    );
}
