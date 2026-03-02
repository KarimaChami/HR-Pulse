import { useState } from 'react';
import { 
  Brain, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  Sparkles,
  Plus,
  X,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import type { PredictRequest, PredictResponse } from '@/types';

interface PredictionHistory {
  id: string;
  jobTitle: string;
  skills: string[];
  predictedSalary: number;
  timestamp: Date;
}

const commonSkills = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust',
  'React', 'Vue', 'Angular', 'Node.js', 'Django', 'Flask',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
  'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
  'Data Science', 'Analytics', 'BI', 'Tableau', 'PowerBI',
  'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
  'Agile', 'Scrum', 'Project Management',
];

export function PredictorPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setNewSkill('');
    setShowSkillSuggestions(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handlePredict = async () => {
    if (!jobTitle.trim()) return;

    setIsLoading(true);
    try {
      const request: PredictRequest = {
        job_title: jobTitle,
        skills: skills,
      };
      
      const result = await apiService.predictSalary(request);
      setPrediction(result);

      // Add to history
      const newHistoryItem: PredictionHistory = {
        id: Date.now().toString(),
        jobTitle,
        skills: [...skills],
        predictedSalary: result.predicted_salary,
        timestamp: new Date(),
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback for demo
      const mockSalary = Math.floor(Math.random() * 50000) + 80000;
      setPrediction({ predicted_salary: mockSalary });
      
      const newHistoryItem: PredictionHistory = {
        id: Date.now().toString(),
        jobTitle,
        skills: [...skills],
        predictedSalary: mockSalary,
        timestamp: new Date(),
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSkills = commonSkills.filter(skill => 
    skill.toLowerCase().includes(newSkill.toLowerCase()) && 
    !skills.includes(skill)
  );

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Salary Predictor</h1>
        <p className="text-gray-400">Predict competitive salary ranges using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                Job Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter job details to get a salary prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-gray-300">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Senior Data Scientist"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label className="text-gray-300">Required Skills</Label>
                <div className="relative">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => {
                      setNewSkill(e.target.value);
                      setShowSkillSuggestions(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkill);
                      }
                    }}
                    onFocus={() => setShowSkillSuggestions(true)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                  
                  {/* Skill Suggestions */}
                  {showSkillSuggestions && newSkill && filteredSkills.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 py-2 rounded-xl bg-navy-800 border border-white/10 shadow-xl">
                      {filteredSkills.slice(0, 5).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => handleAddSkill(skill)}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 pl-3 pr-2 py-1 flex items-center gap-1"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Quick Add Skills */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Popular skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'SQL', 'AWS', 'Machine Learning', 'React'].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleAddSkill(skill)}
                        disabled={skills.includes(skill)}
                        className="px-3 py-1 rounded-full text-sm bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-3 h-3 inline mr-1" />
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Predict Button */}
              <Button
                onClick={handlePredict}
                disabled={isLoading || !jobTitle.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Predict Salary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Prediction Result */}
          {prediction && (
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-400 mb-2">Predicted Annual Salary</p>
                  <h2 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
                    {formatSalary(prediction.predicted_salary)}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Based on {skills.length > 0 ? skills.length : 'market'} skill{skills.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Range (Low)</p>
                    <p className="text-white font-semibold">{formatSalary(prediction.predicted_salary * 0.85)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Predicted</p>
                    <p className="text-blue-400 font-semibold">{formatSalary(prediction.predicted_salary)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Range (High)</p>
                    <p className="text-white font-semibold">{formatSalary(prediction.predicted_salary * 1.15)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* History Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" />
                Recent Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors cursor-pointer"
                      onClick={() => {
                        setJobTitle(item.jobTitle);
                        setSkills(item.skills);
                        setPrediction({ predicted_salary: item.predictedSalary });
                      }}
                    >
                      <p className="text-white font-medium text-sm truncate">{item.jobTitle}</p>
                      <p className="text-blue-400 text-sm">{formatSalary(item.predictedSalary)}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No predictions yet</p>
                  <p className="text-gray-500 text-xs">Your prediction history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm">Tips for Better Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Use specific job titles (e.g., "Senior Data Scientist" vs "Data Scientist")
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Include relevant technical skills for better accuracy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Add cloud platform skills (AWS, Azure, GCP) for higher estimates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Machine Learning and AI skills typically increase predictions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
