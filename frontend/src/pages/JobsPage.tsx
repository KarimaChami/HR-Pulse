import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { apiService } from '@/services/api';
import type { Job, JobSearchResult } from '@/types';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [searchResults, setSearchResults] = useState<JobSearchResult | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [offset]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getJobs(limit, offset);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      fetchJobs();
      return;
    }

    try {
      setIsLoading(true);
      const results = await apiService.searchJobs(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobClick = async (jobId: number) => {
    try {
      const job = await apiService.getJob(jobId);
      setSelectedJob(job);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const extractSkills = (skillsText: string) => {
    if (!skillsText) return [];
    try {
      const parsed = JSON.parse(skillsText);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return skillsText.split(',').map(s => s.trim()).filter(Boolean);
    }
  };

  const displayJobs = searchResults ? searchResults.results.map(r => ({ ...r, skills: '' })) : jobs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
          <p className="text-gray-400">Browse and search through job listings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 w-64 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchResults && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-white">
              Found <span className="font-semibold text-blue-400">{searchResults.count}</span> jobs matching "{searchResults.skill}"
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSearchResults(null);
              setSearchQuery('');
              fetchJobs();
            }}
            className="text-gray-400 hover:text-white"
          >
            Clear search
          </Button>
        </div>
      )}

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : displayJobs.length > 0 ? (
        <div className="grid gap-4">
          {displayJobs.map((job) => (
            <Card 
              key={job.id} 
              className="bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all cursor-pointer"
              onClick={() => handleJobClick(job.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-400">ID: {job.id}</p>
                      </div>
                    </div>
                    
                    {job.skills && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {extractSkills(job.skills).slice(0, 5).map((skill, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="border-blue-500/30 text-blue-400"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {extractSkills(job.skills).length > 5 && (
                          <Badge variant="outline" className="border-white/10 text-gray-400">
                            +{extractSkills(job.skills).length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
          <p className="text-gray-400">Try adjusting your search or upload new job data</p>
        </div>
      )}

      {/* Pagination */}
      {!searchResults && jobs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {offset + 1} to {Math.min(offset + limit, offset + jobs.length)} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(offset + limit)}
              disabled={jobs.length < limit}
              className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="bg-navy-800 border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Job ID: {selectedJob?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <h4 className="text-white font-medium mb-3">Extracted Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJob?.skills && extractSkills(selectedJob.skills).map((skill, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="border-blue-500/30 text-blue-400 px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Raw Skills Data</h4>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <pre className="text-sm text-gray-400 whitespace-pre-wrap overflow-x-auto">
                  {selectedJob?.skills}
                </pre>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={() => {
                  setSelectedJob(null);
                  // Navigate to predictor with job data
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Predict Salary
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
