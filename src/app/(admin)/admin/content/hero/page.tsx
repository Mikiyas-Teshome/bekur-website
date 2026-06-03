'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSection {
  id?: number;
  headline: {
    main: string;
    highlight: string;
    ending: string;
    subtitle: string;
  };
  description: {
    mobile: string;
    desktop: string;
  };
  video: {
    thumbnail: string;
    alt: string;
    youtubeUrl: string;
  };
  clientSatisfaction: {
    count: string;
    label: string;
    avatars: Array<{
      image: string;
      name: string;
      fallback: string;
    }>;
  };
  socialPlatforms: Array<{ name: string; url: string }>;
  background: {
    image: string;
    size: string;
    position: string;
    repeat: string;
  };
}

export default function HeroEditor() {
  const [heroData, setHeroData] = useState<HeroSection>({
    headline: {
      main: '',
      highlight: '',
      ending: '',
      subtitle: ''
    },
    description: {
      mobile: '',
      desktop: ''
    },
    video: {
      thumbnail: '',
      alt: '',
      youtubeUrl: ''
    },
    clientSatisfaction: {
      count: '',
      label: '',
      avatars: []
    },
    socialPlatforms: [],
    background: {
      image: '',
      size: 'cover',
      position: 'center',
      repeat: 'no-repeat'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/hero');
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      toast.error('Failed to load hero data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        toast.success('Hero section saved successfully');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast.error('Failed to save hero section');
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialPlatform = () => {
    setHeroData(prev => ({
      ...prev,
      socialPlatforms: [...prev.socialPlatforms, { name: '', url: '' }]
    }));
  };

  const removeSocialPlatform = (index: number) => {
    setHeroData(prev => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.filter((_, i) => i !== index)
    }));
  };

  const updateSocialPlatform = (index: number, field: 'name' | 'url', value: string) => {
    setHeroData(prev => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.map((platform, i) => 
        i === index ? { ...platform, [field]: value } : platform
      )
    }));
  };

  const addClientAvatar = () => {
    setHeroData(prev => ({
      ...prev,
      clientSatisfaction: {
        ...prev.clientSatisfaction,
        avatars: [...prev.clientSatisfaction.avatars, { image: '', name: '', fallback: '' }]
      }
    }));
  };

  const removeClientAvatar = (index: number) => {
    setHeroData(prev => ({
      ...prev,
      clientSatisfaction: {
        ...prev.clientSatisfaction,
        avatars: prev.clientSatisfaction.avatars.filter((_, i) => i !== index)
      }
    }));
  };

  const updateClientAvatar = (index: number, field: 'image' | 'name' | 'fallback', value: string) => {
    setHeroData(prev => ({
      ...prev,
      clientSatisfaction: {
        ...prev.clientSatisfaction,
        avatars: prev.clientSatisfaction.avatars.map((avatar, i) => 
          i === index ? { ...avatar, [field]: value } : avatar
        )
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading hero section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hero Section Editor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Edit the main hero section content
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headline */}
        <Card>
          <CardHeader>
            <CardTitle>Headline</CardTitle>
            <CardDescription>
              The primary headline text displayed on the hero section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mainText">Main Text</Label>
              <Input
                id="mainText"
                value={heroData.headline.main}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  headline: { ...prev.headline, main: e.target.value }
                }))}
                placeholder="Transform Your"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="highlightText">Highlight Text</Label>
              <Input
                id="highlightText"
                value={heroData.headline.highlight}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  headline: { ...prev.headline, highlight: e.target.value }
                }))}
                placeholder="Business"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endingText">Ending Text</Label>
              <Input
                id="endingText"
                value={heroData.headline.ending}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  headline: { ...prev.headline, ending: e.target.value }
                }))}
                placeholder="With"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={heroData.headline.subtitle}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  headline: { ...prev.headline, subtitle: e.target.value }
                }))}
                placeholder="Digital Innovation."
              />
            </div>
          </CardContent>
        </Card>

        {/* Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Descriptions</CardTitle>
            <CardDescription>
              Description text for mobile and desktop
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descriptionMobile">Mobile Description</Label>
              <Textarea
                id="descriptionMobile"
                value={heroData.description.mobile}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  description: { ...prev.description, mobile: e.target.value }
                }))}
                placeholder="Mobile description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionDesktop">Desktop Description</Label>
              <Textarea
                id="descriptionDesktop"
                value={heroData.description.desktop}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  description: { ...prev.description, desktop: e.target.value }
                }))}
                placeholder="Desktop description..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle>Video</CardTitle>
            <CardDescription>
              YouTube video configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">YouTube URL</Label>
              <Input
                id="videoUrl"
                value={heroData.video.youtubeUrl}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  video: { ...prev.video, youtubeUrl: e.target.value }
                }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoThumbnail">Video Thumbnail URL</Label>
              <Input
                id="videoThumbnail"
                value={heroData.video.thumbnail}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  video: { ...prev.video, thumbnail: e.target.value }
                }))}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoAlt">Video Alt Text</Label>
              <Input
                id="videoAlt"
                value={heroData.video.alt}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  video: { ...prev.video, alt: e.target.value }
                }))}
                placeholder="Hero Video"
              />
            </div>
          </CardContent>
        </Card>

        {/* Client Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle>Client Satisfaction</CardTitle>
            <CardDescription>
              Client count and label display
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientCount">Client Count</Label>
              <Input
                id="clientCount"
                value={heroData.clientSatisfaction.count}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  clientSatisfaction: { ...prev.clientSatisfaction, count: e.target.value }
                }))}
                placeholder="3K+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientLabel">Client Label</Label>
              <Input
                id="clientLabel"
                value={heroData.clientSatisfaction.label}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  clientSatisfaction: { ...prev.clientSatisfaction, label: e.target.value }
                }))}
                placeholder="Satisfied Clients"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Social Platforms</CardTitle>
            <CardDescription>
              Social media links displayed in hero
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {heroData.socialPlatforms.map((platform, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={platform.name}
                  onChange={(e) => updateSocialPlatform(index, 'name', e.target.value)}
                  placeholder="Platform name"
                  className="flex-1"
                />
                <Input
                  value={platform.url}
                  onChange={(e) => updateSocialPlatform(index, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocialPlatform(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSocialPlatform}>
              <Plus className="h-4 w-4 mr-2" />
              Add Platform
            </Button>
          </CardContent>
        </Card>

        {/* Client Avatars */}
        <Card>
          <CardHeader>
            <CardTitle>Client Avatars</CardTitle>
            <CardDescription>
              Client profile images displayed in hero
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {heroData.clientSatisfaction.avatars.map((avatar, index) => (
              <div key={index} className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={avatar.image}
                    onChange={(e) => updateClientAvatar(index, 'image', e.target.value)}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <Input
                    value={avatar.name}
                    onChange={(e) => updateClientAvatar(index, 'name', e.target.value)}
                    placeholder="Client name"
                    className="flex-1"
                  />
                  <Input
                    value={avatar.fallback}
                    onChange={(e) => updateClientAvatar(index, 'fallback', e.target.value)}
                    placeholder="Fallback initials"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeClientAvatar(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addClientAvatar}>
              <Plus className="h-4 w-4 mr-2" />
              Add Avatar
            </Button>
          </CardContent>
        </Card>

        {/* Background */}
        <Card>
          <CardHeader>
            <CardTitle>Background</CardTitle>
            <CardDescription>
              Background image configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={heroData.background.image}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  background: { ...prev.background, image: e.target.value }
                }))}
                placeholder="https://example.com/background.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundSize">Size</Label>
                <Input
                  id="backgroundSize"
                  value={heroData.background.size}
                  onChange={(e) => setHeroData(prev => ({ 
                    ...prev, 
                    background: { ...prev.background, size: e.target.value }
                  }))}
                  placeholder="cover"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundPosition">Position</Label>
                <Input
                  id="backgroundPosition"
                  value={heroData.background.position}
                  onChange={(e) => setHeroData(prev => ({ 
                    ...prev, 
                    background: { ...prev.background, position: e.target.value }
                  }))}
                  placeholder="center"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundRepeat">Repeat</Label>
              <Input
                id="backgroundRepeat"
                value={heroData.background.repeat}
                onChange={(e) => setHeroData(prev => ({ 
                  ...prev, 
                  background: { ...prev.background, repeat: e.target.value }
                }))}
                placeholder="no-repeat"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}