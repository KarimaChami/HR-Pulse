// User types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface UserRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Job types
export interface Job {
  id: number;
  title: string;
  skills: string;
}

export interface JobSearchResult {
  skill: string;
  count: number;
  results: Array<{
    id: number;
    title: string;
  }>;
}

// Prediction types
export interface PredictRequest {
  job_title: string;
  skills: string[];
}

export interface PredictResponse {
  job_title: string;
  predicted_salary: number;
  salary_range: string;
  skills_used: string[];
}

// API Response types
export interface ApiError {
  detail: string;
}

export interface HealthStatus {
  status: string;
  jobs_in_db: number;
  api: string;
}

// Dashboard types
export interface DashboardStats {
  totalJobs: number;
  totalSkills: number;
  avgSalary: number;
  predictionsMade: number;
}

export interface SalaryRange {
  range: string;
  count: number;
}

export interface SkillDemand {
  skill: string;
  count: number;
  growth: number;
}
