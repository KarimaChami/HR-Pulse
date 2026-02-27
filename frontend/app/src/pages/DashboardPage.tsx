import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import type { Job, HealthStatus } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const salaryData = [
  { month: 'Jan', avg: 85000, predicted: 82000 },
  { month: 'Feb', avg: 88000, predicted: 86000 },
  { month: 'Mar', avg: 92000, predicted: 90000 },
  { month: 'Apr', avg: 95000, predicted: 93000 },
  { month: 'May', avg: 98000, predicted: 96000 },
  { month: 'Jun', avg: 102000, predicted: 100000 },
];

const skillsData = [
  { name: 'Python', value: 35, color: '#3b82f6' },
  { name: 'SQL', value: 25, color: '#8b5cf6' },
  { name: 'AWS', value: 20, color: '#06b6d4' },
  { name: 'ML', value: 15, color: '#10b981' },
  { name: 'Other', value: 5, color: '#6b7280' },
];

const jobCategories = [
  { category: 'Data Science', count: 45 },
  { category: 'Engineering', count: 38 },
  { category: 'Product', count: 25 },
  { category: 'Design', count: 18 },
  { category: 'Marketing', count: 12 },
];

export function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, healthData] = await Promise.all([
          apiService.getJobs(5, 0),
          apiService.healthCheck(),
        ]);
        setJobs(jobsData);
        setHealth(healthData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Jobs',
      value: health?.jobs_in_db?.toLocaleString() || '0',
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      color: 'blue',
    },
    {
      title: 'Avg Salary',
      value: '$98,500',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Skills Tracked',
      value: '500+',
      change: '+23%',
      trend: 'up',
      icon: Brain,
      color: 'purple',
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'cyan',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          <TrendingUp className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isUp = stat.trend === 'up';
          return (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {isUp ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={isUp ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 text-sm">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Trends */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">Salary Trends</CardTitle>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
              Last 6 months
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 0 }}
                    name="Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#8b5cf6', strokeWidth: 0 }}
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skills Distribution */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">Top Skills</CardTitle>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              By demand
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {skillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {skillsData.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: skill.color }}
                    />
                    <span className="text-sm text-gray-400">{skill.name}</span>
                    <span className="text-sm text-white font-medium">{skill.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">Recent Jobs</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
                />
              </div>
              <Button variant="outline" size="icon" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="flex items-start justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{job.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-2">{job.skills}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 ml-4">
                      Active
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No jobs found. Start by uploading your job data.
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            >
              View All Jobs
            </Button>
          </CardContent>
        </Card>

        {/* Job Categories */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Job Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="category" type="category" stroke="#6b7280" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
