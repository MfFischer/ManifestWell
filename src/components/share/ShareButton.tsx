'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { shareContent, isShareSupported, type ShareContent } from '@/lib/share';

interface ShareButtonProps {
  content: ShareContent;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showLabel?: boolean;
}

export function ShareButton({
  content,
  variant = 'outline',
  size = 'sm',
  className = '',
  showLabel = false,
}: ShareButtonProps) {
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);

    try {
      const result = await shareContent(content);

      if (result.success) {
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);

        if (result.method === 'clipboard') {
          toast.success('Copied to clipboard!');
        } else {
          toast.success('Shared successfully!');
        }
      } else if (result.error && result.error !== 'Share cancelled') {
        toast.error(result.error);
      }
    } catch {
      toast.error('Failed to share');
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isShared ? Check : (isShareSupported() ? Share2 : Copy);

  if (size === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size="icon"
              className={className}
              onClick={handleShare}
              disabled={isLoading}
            >
              <Icon className={`w-4 h-4 ${isShared ? 'text-green-500' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isShareSupported() ? 'Share' : 'Copy to clipboard'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
      disabled={isLoading}
    >
      <Icon className={`w-4 h-4 ${showLabel ? 'mr-2' : ''} ${isShared ? 'text-green-500' : ''}`} />
      {showLabel && (isShared ? 'Shared!' : isShareSupported() ? 'Share' : 'Copy')}
    </Button>
  );
}

export default ShareButton;
