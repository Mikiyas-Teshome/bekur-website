'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Image, BookOpen, Briefcase, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface StatsData {
  totalContentItems: number;
  blogPosts: number;
  publishedBlogPosts: number;
  portfolioProjects: number;
  mediaFiles: number;
}

const fetchStats = async (): Promise<StatsData> => {
  const response = await fetch('/api/admin/stats', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};

export default function AdminOverview() {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const stats = [
    {
      title: 'Total Content Items',
      value: statsData?.totalContentItems?.toString() ?? '0',
      description: 'Across all sections',
      icon: Settings,
      isLoading: isLoading,
    },
    {
      title: 'Blog Posts',
      value: statsData?.publishedBlogPosts?.toString() ?? '0',
      description: `${statsData?.blogPosts ?? 0} total (${statsData?.publishedBlogPosts ?? 0} published)`,
      icon: BookOpen,
      isLoading: isLoading,
    },
    {
      title: 'Portfolio Projects',
      value: statsData?.portfolioProjects?.toString() ?? '0',
      description: 'Showcase items',
      icon: Briefcase,
      isLoading: isLoading,
    },
    {
      title: 'Media Files',
      value: statsData?.mediaFiles?.toString() ?? '0',
      description: 'Uploaded assets',
      icon: Image,
      isLoading: isLoading,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your website content and settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isLoading ? (
                  <span className="inline-block h-7 w-12 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></span>
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.isLoading ? (
                  <span className="inline-block h-3 w-32 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></span>
                ) : (
                  stat.description
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Settings className="h-4 w-4" />
              <span>Edit homepage content</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <BookOpen className="h-4 w-4" />
              <span>Create new blog post</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Briefcase className="h-4 w-4" />
              <span>Add portfolio project</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Image className="h-4 w-4" />
              <span>Upload media files</span>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

