import { useState } from 'react';
import { 
  Search, 
  Loader2, 
  Briefcase, 
  Sparkles,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import type { JobSearchResult } from '@/types';

const popularSearches = [
  'Python', 'Machine Learning', 'Data Science', 'React', 'AWS',
  'SQL', 'JavaScript', 'Product Manager', 'DevOps', 'Full Stack'
];

const filters = {
  experience: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
  jobType: ['Full-time', 'Part-time', 'Contract', 'Remote'],
  salary: ['$50k-$80k', '$80k-$120k', '$120k-$160k', '$160k+'],
};

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JobSearchResult | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await apiService.searchJobs(query);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      // Mock data for demo
      setResults({
        skill: query,
        count: Math.floor(Math.random() * 50) + 10,
        results: Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          title: `${query} Specialist ${i + 1}`,
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Search Jobs</h1>
        <p className="text-gray-400">Find jobs by skills, titles, or keywords</p>
      </div>

      {/* Search Box */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by skill, job title, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 py-6 bg-white/5 border-white/10 text-white text-lg placeholder:text-gray-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-white/10 px-4 ${showFilters ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Popular Searches */}
          {!results && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      handleSearch();
                    }}
                    className="px-3 py-1.5 rounded-full text-sm bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card className="bg-white/5 border-white/10 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              {activeFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(filters).map(([category, options]) => (
                <div key={category}>
                  <p className="text-sm text-gray-500 mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleFilter(option)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          activeFilters.includes(option)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className="border-blue-500/30 text-blue-400 pl-3 pr-2 py-1"
            >
              {filter}
              <button
                onClick={() => toggleFilter(filter)}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-fade-in">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-white">
                Found <span className="font-semibold text-blue-400">{results.count}</span> jobs matching "{results.skill}"
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setResults(null);
                setQuery('');
                setActiveFilters([]);
              }}
              className="text-gray-400 hover:text-white"
            >
              Clear search
            </Button>
          </div>

          {/* Results Grid */}
          <div className="grid gap-4">
            {results.results.map((job) => (
              <Card
                key={job.id}
                className="bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all cursor-pointer"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{job.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>Job ID: {job.id}</span>
                          <span>•</span>
                          <span>Match: {Math.floor(Math.random() * 20 + 80)}%</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="border-green-500/30 text-green-400">
                            Active
                          </Badge>
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            {results.skill}
                          </Badge>
                          {activeFilters.slice(0, 2).map((filter) => (
                            <Badge key={filter} variant="outline" className="border-purple-500/30 text-purple-400">
                              {filter}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          {results.count > results.results.length && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              >
                Load More Results
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!results && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Start Searching</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Enter a skill, job title, or keyword to find relevant job listings and salary insights.
          </p>
        </div>
      )}
    </div>
  );
}
