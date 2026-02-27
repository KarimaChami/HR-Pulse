import { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
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
  AreaChart,
  Area,
} from 'recharts';

// Mock data for analytics
const salaryTrendData = [
  { month: 'Jan', dataScience: 95000, engineering: 88000, product: 82000 },
  { month: 'Feb', dataScience: 98000, engineering: 90000, product: 84000 },
  { month: 'Mar', dataScience: 102000, engineering: 92000, product: 86000 },
  { month: 'Apr', dataScience: 105000, engineering: 95000, product: 88000 },
  { month: 'May', dataScience: 108000, engineering: 98000, product: 90000 },
  { month: 'Jun', dataScience: 112000, engineering: 102000, product: 92000 },
];

const skillsDemandData = [
  { skill: 'Python', demand: 85, growth: 15 },
  { skill: 'SQL', demand: 78, growth: 8 },
  { skill: 'AWS', demand: 72, growth: 22 },
  { skill: 'React', demand: 68, growth: 12 },
  { skill: 'ML/AI', demand: 65, growth: 35 },
  { skill: 'Docker', demand: 58, growth: 18 },
  { skill: 'Kubernetes', demand: 52, growth: 28 },
  { skill: 'TypeScript', demand: 48, growth: 20 },
];

const locationData = [
  { name: 'San Francisco', value: 28, color: '#3b82f6' },
  { name: 'New York', value: 22, color: '#8b5cf6' },
  { name: 'Seattle', value: 18, color: '#06b6d4' },
  { name: 'Austin', value: 15, color: '#10b981' },
  { name: 'Remote', value: 17, color: '#6b7280' },
];

const experienceSalaryData = [
  { level: 'Entry (0-2y)', min: 55000, max: 75000, avg: 65000 },
  { level: 'Mid (2-5y)', min: 75000, max: 110000, avg: 92000 },
  { level: 'Senior (5-8y)', min: 100000, max: 150000, avg: 125000 },
  { level: 'Staff (8+y)', min: 140000, max: 200000, avg: 170000 },
];

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Deep insights into job market trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
            <Calendar className="w-4 h-4 mr-2" />
            Last 6 months
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="skills"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger 
            value="locations"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400"
          >
            <PieChartIcon className="w-4 h-4 mr-2" />
            Locations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Salary Trends by Role */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Salary Trends by Role</CardTitle>
                <p className="text-sm text-gray-400">Average salaries over time</p>
              </div>
              <div className="flex gap-2">
                {['1m', '3m', '6m', '1y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      timeRange === range
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salaryTrendData}>
                    <defs>
                      <linearGradient id="colorDS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
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
                    <Area 
                      type="monotone" 
                      dataKey="dataScience" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorDS)" 
                      name="Data Science"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engineering" 
                      stroke="#8b5cf6" 
                      fillOpacity={1} 
                      fill="url(#colorEng)" 
                      name="Engineering"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="product" 
                      stroke="#06b6d4" 
                      fillOpacity={1} 
                      fill="url(#colorProd)" 
                      name="Product"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Experience vs Salary */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Salary by Experience Level</CardTitle>
              <p className="text-sm text-gray-400">Salary ranges across experience levels</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={experienceSalaryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="level" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Bar dataKey="min" fill="#6b7280" radius={[4, 4, 0, 0]} name="Min" />
                    <Bar dataKey="avg" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Average" />
                    <Bar dataKey="max" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Max" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Skills Demand</CardTitle>
                <p className="text-sm text-gray-400">Most in-demand skills and growth</p>
              </div>
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsDemandData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="skill" type="category" stroke="#6b7280" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="demand" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Demand %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skills Growth */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skillsDemandData.slice(0, 4).map((skill) => (
              <Card key={skill.skill} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <p className="text-gray-400 text-sm mb-1">{skill.skill}</p>
                  <p className="text-2xl font-bold text-white mb-2">{skill.demand}%</p>
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{skill.growth}%
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Job Distribution by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {locationData.map((entry, index) => (
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
                    {locationData.map((loc) => (
                      <div key={loc.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: loc.color }}
                        />
                        <span className="text-sm text-gray-400">{loc.name}</span>
                        <span className="text-sm text-white font-medium">{loc.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Location Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {locationData.map((loc) => (
                  <div key={loc.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: loc.color }}
                      />
                      <span className="text-white">{loc.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{loc.value}% of jobs</span>
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                        {Math.floor(loc.value * 120)} jobs
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
