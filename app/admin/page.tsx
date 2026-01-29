import { getCurrentUser } from '@/lib/auth';
import { getCurrentProfile } from '@/app/actions/profile';
import { createClient } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import {
    Plus,
    TrendingUp,
    Home,
    Users,
    DollarSign,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Eye,
    Briefcase,
    Calendar
} from 'lucide-react';

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    // Fetch fresh profile from database
    const profile = await getCurrentProfile();
    const displayName = profile?.full_name || user?.email || 'User';

    // Count active listings for current user
    let activeListingsCount = 0;
    if (user) {
        const supabase = await createClient();
        const { count } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'Active');
        activeListingsCount = count || 0;
    }

    return (
        <div className="max-w-7xl mx-auto pb-8">
            {/* 1. PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pt-8">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark">Welcome back, {displayName}</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening in your portfolio today.</p>
                </div>
                <Link
                    href="/admin/add-property"
                    className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-full font-bold hover:bg-brand-lime hover:text-brand-dark transition-all shadow-lg shadow-brand-dark/20 md:self-start"
                >
                    <Plus size={20} />
                    Create New Listing
                </Link>
            </div>

            {/* 2. THE KPI GRID (North Star Metrics) */}
            <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        icon={<DollarSign size={24} className="text-brand-dark" />}
                        label="Total Sales Volume"
                        value="$12.5M"
                        trend="+12% this month"
                        trendUp={true}
                    />
                    <StatCard
                        icon={<Home size={24} className="text-brand-dark" />}
                        label="Active Listings"
                        value={activeListingsCount.toString()}
                        subtext="Properties"
                    />
                    <StatCard
                        icon={<Users size={24} className="text-brand-dark" />}
                        label="Total Leads"
                        value="142"
                        subtext="Potential Buyers"
                    />
                    <StatCard
                        icon={<TrendingUp size={24} className="text-brand-dark" />}
                        label="Avg. Sale Price"
                        value="$1.8M"
                        trend="+5% vs last year"
                        trendUp={true}
                    />
                </div>
            </FadeIn>

            {/* 3. THE SPLIT VIEW (Insights & Activity) */}
            <FadeIn delay={0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Active Pipeline (Wider) */}
                    <div className="lg:col-span-2 bg-brand-card rounded-3xl p-4 md:p-6 xl:p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-brand-dark">Active Pipeline</h2>
                            <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                                <Briefcase size={20} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <PipelineItem
                                label="Negotiation"
                                count="2 Deals"
                                volume="$4.5M volume"
                                color="bg-orange-500"
                                agent="Sarah Miller"
                                date="Due: Oct 24"
                            />
                            <PipelineItem
                                label="Under Contract"
                                count="1 Deal"
                                volume="$2.2M volume"
                                color="bg-blue-500"
                                agent="Mike Ross"
                                date="Closing: Nov 12"
                            />
                            <PipelineItem
                                label="Closed this Month"
                                count="4 Deals"
                                volume="$12.0M volume"
                                color="bg-green-500"
                                agent="James Smith"
                                date="Closed: Oct 15"
                            />
                            <PipelineItem
                                label="New Inquiry"
                                count="5 Leads"
                                volume="$3.8M potential"
                                color="bg-purple-500"
                                agent="Team"
                                date="Today"
                            />
                        </div>
                    </div>

                    {/* Right Column: Revenue Overview (Narrower) */}
                    <div className="bg-brand-card rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-brand-dark">Revenue Growth</h2>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Mock Bar Chart */}
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            <ChartBar height="40%" label="Jan" />
                            <ChartBar height="55%" label="Feb" />
                            <ChartBar height="45%" label="Mar" />
                            <ChartBar height="70%" label="Apr" />
                            <ChartBar height="60%" label="May" />
                            <ChartBar height="85%" label="Jun" active />
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

// Helper Components

function StatCard({ icon, label, value, trend, trendUp, subtext }: any) {
    return (
        <div className="bg-brand-card p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trendUp && <ArrowUpRight size={12} />}
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-bold mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-brand-dark">{value}</h3>
                {subtext && <p className="text-gray-400 text-xs mt-1 font-medium">{subtext}</p>}
            </div>
        </div>
    );
}

function ChartBar({ height, label, active }: { height: string, label: string, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3 w-full group cursor-pointer">
            <div className="w-full relative h-48 flex items-end rounded-t-xl overflow-hidden bg-gray-50">
                <div
                    className={`w-full transition-all duration-500 rounded-t-xl ${active ? 'bg-brand-dark' : 'bg-brand-lime hover:bg-brand-dark/80'}`}
                    style={{ height }}
                />
            </div>
            <span className={`text-xs font-bold ${active ? 'text-brand-dark' : 'text-gray-400'}`}>{label}</span>
        </div>
    );
}

function PipelineItem({ label, count, volume, color, agent, date }: any) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
            <div className={`w-4 h-4 rounded-full ${color} shrink-0`} />
            <div className="flex-1 flex flex-col md:flex-col gap-0">
                <div className="flex items-center gap-2 flex-wrap md:flex-col md:items-start md:gap-0">
                    <p className="text-base md:text-lg font-bold text-brand-dark">{label}</p>
                    <div className="flex items-center gap-2 text-sm md:text-base text-gray-500 md:mt-1 font-medium flex-nowrap">
                        <span>{count}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{volume}</span>
                    </div>
                </div>
            </div>

            {/* Expanded Details for Wider View - Hidden on Tablet */}
            <div className="hidden xl:flex items-center gap-6 mr-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Users size={16} className="text-gray-400" />
                    {agent}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar size={16} className="text-gray-400" />
                    {date}
                </div>
            </div>

            <div className="text-gray-300 group-hover:text-brand-dark transition-colors">
                <ArrowUpRight size={20} />
            </div>
        </div>
    );
}
