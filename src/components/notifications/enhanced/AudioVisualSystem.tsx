import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  Zap, 
  Sparkles, 
  Monitor,
  Settings,
  Play,
  Pause,
  TestTube
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notification';

// Audio/Visual Settings Context
interface AudioVisualSettings {
  soundEnabled: boolean;
  volume: number;
  animationsEnabled: boolean;
  browserNotificationsEnabled: boolean;
  soundMap: Record<string, string>;
  animationIntensity: 'subtle' | 'normal' | 'enhanced';
}

interface AudioVisualContextType {
  settings: AudioVisualSettings;
  updateSettings: (settings: Partial<AudioVisualSettings>) => void;
  playNotificationSound: (type: string, priority: string) => void;
  triggerAnimation: (element: HTMLElement, type: string, priority: string) => void;
  showBrowserNotification: (notification: Notification) => void;
}

const AudioVisualContext = createContext<AudioVisualContextType | undefined>(undefined);

export const useAudioVisual = () => {
  const context = useContext(AudioVisualContext);
  if (!context) {
    throw new Error('useAudioVisual must be used within AudioVisualProvider');
  }
  return context;
};

// Sound Library
const NOTIFICATION_SOUNDS = {
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  warning: '/sounds/warning.mp3',
  info: '/sounds/info.mp3',
  urgent: '/sounds/urgent.mp3',
  default: '/sounds/notification.mp3'
};

// Animation Presets
const ANIMATION_PRESETS = {
  subtle: {
    urgent: 'animate-pulse',
    high: 'animate-fade-in',
    medium: 'animate-scale-in',
    low: 'animate-fade-in'
  },
  normal: {
    urgent: 'animate-pulse animate-bounce',
    high: 'animate-scale-in animate-fade-in',
    medium: 'animate-fade-in',
    low: 'animate-fade-in'
  },
  enhanced: {
    urgent: 'animate-pulse animate-bounce animate-[shake_0.5s_ease-in-out_0s_3]',
    high: 'animate-pulse animate-scale-in',
    medium: 'animate-scale-in animate-fade-in',
    low: 'animate-fade-in'
  }
};

// Main Provider Component
export const AudioVisualProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AudioVisualSettings>({
    soundEnabled: true,
    volume: 0.7,
    animationsEnabled: true,
    browserNotificationsEnabled: true,
    soundMap: NOTIFICATION_SOUNDS,
    animationIntensity: 'normal'
  });

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Initialize audio elements
  useEffect(() => {
    Object.entries(NOTIFICATION_SOUNDS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.volume = settings.volume;
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Update volume when settings change
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = settings.volume;
    });
  }, [settings.volume]);

  const updateSettings = (newSettings: Partial<AudioVisualSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const playNotificationSound = async (type: string, priority: string) => {
    if (!settings.soundEnabled) return;

    // Choose sound based on priority first, then type
    let soundKey = priority === 'urgent' ? 'urgent' : type;
    if (!audioRefs.current[soundKey]) {
      soundKey = 'default';
    }

    const audio = audioRefs.current[soundKey];
    if (audio) {
      try {
        audio.currentTime = 0;
        await audio.play();
      } catch (error) {
        console.warn('Failed to play notification sound:', error);
      }
    }
  };

  const triggerAnimation = (element: HTMLElement, type: string, priority: string) => {
    if (!settings.animationsEnabled) return;

    const animations = ANIMATION_PRESETS[settings.animationIntensity];
    const animationClasses = animations[priority as keyof typeof animations] || animations.medium;

    // Remove existing animation classes
    element.classList.remove(...Object.values(ANIMATION_PRESETS.enhanced).join(' ').split(' '));
    
    // Add new animation classes
    const classes = animationClasses.split(' ');
    element.classList.add(...classes);

    // Remove animation classes after completion
    setTimeout(() => {
      element.classList.remove(...classes);
    }, 2000);
  };

  const showBrowserNotification = async (notification: Notification) => {
    if (!settings.browserNotificationsEnabled) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.content,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        silent: !settings.soundEnabled
      });

      // Auto-close non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };
    }
  };

  const contextValue: AudioVisualContextType = {
    settings,
    updateSettings,
    playNotificationSound,
    triggerAnimation,
    showBrowserNotification
  };

  return (
    <AudioVisualContext.Provider value={contextValue}>
      {children}
    </AudioVisualContext.Provider>
  );
};

// Settings Panel Component
export const AudioVisualSettings: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { settings, updateSettings, playNotificationSound } = useAudioVisual();

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] });
  };

  const handleTestSound = (type: string) => {
    playNotificationSound(type, 'medium');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      updateSettings({ browserNotificationsEnabled: permission === 'granted' });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Audio & Visual Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sound Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sound Notifications
            </Label>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>

          {settings.soundEnabled && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Volume</Label>
              <Slider
                value={[settings.volume]}
                onValueChange={handleVolumeChange}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestSound('success')}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Test
                </Button>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Animation Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Visual Animations
            </Label>
            <Switch
              checked={settings.animationsEnabled}
              onCheckedChange={(checked) => updateSettings({ animationsEnabled: checked })}
            />
          </div>

          {settings.animationsEnabled && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Animation Intensity</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['subtle', 'normal', 'enhanced'] as const).map((intensity) => (
                  <Button
                    key={intensity}
                    variant={settings.animationIntensity === intensity ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ animationIntensity: intensity })}
                    className="capitalize"
                  >
                    {intensity}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Browser Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Browser Notifications
            </Label>
            <Switch
              checked={settings.browserNotificationsEnabled}
              onCheckedChange={(checked) => updateSettings({ browserNotificationsEnabled: checked })}
            />
          </div>

          {settings.browserNotificationsEnabled && 'Notification' in window && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Permission: {Notification.permission}
              </p>
              {Notification.permission === 'default' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestNotificationPermission}
                >
                  Request Permission
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Test Section */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Test Notifications</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(NOTIFICATION_SOUNDS).filter(k => k !== 'default').map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleTestSound(type)}
                className="capitalize"
              >
                <TestTube className="h-3 w-3 mr-1" />
                {type}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook for applying animations to components
export const useNotificationAnimation = () => {
  const { settings, triggerAnimation } = useAudioVisual();

  const animateElement = (ref: React.RefObject<HTMLElement>, type: string, priority: string) => {
    if (ref.current && settings.animationsEnabled) {
      triggerAnimation(ref.current, type, priority);
    }
  };

  return { animateElement, animationsEnabled: settings.animationsEnabled };
};