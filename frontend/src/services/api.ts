import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { 
  User, 
  UserRegister, 
  UserLogin, 
  Token, 
  Job, 
  JobSearchResult,
  PredictRequest,
  PredictResponse,
  HealthStatus 
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: UserRegister): Promise<User> {
    const response = await this.client.post('/register', userData);
    return response.data;
  }

  async login(credentials: UserLogin): Promise<Token> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await this.client.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/me');
    return response.data;
  }

  // Jobs endpoints
  async getJobs(limit: number = 20, offset: number = 0): Promise<Job[]> {
    const response = await this.client.get('/jobs', {
      params: { limit, offset },
    });
    return response.data;
  }

  async searchJobs(skill: string): Promise<JobSearchResult> {
    const response = await this.client.get('/jobs/search', {
      params: { skill },
    });
    return response.data;
  }

  async getJob(jobId: number): Promise<Job> {
    const response = await this.client.get(`/jobs/${jobId}`);
    return response.data;
  }

  // ML Prediction endpoint
  async predictSalary(request: PredictRequest): Promise<PredictResponse> {
    const response = await this.client.post('/predict-salary', request);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<HealthStatus> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
