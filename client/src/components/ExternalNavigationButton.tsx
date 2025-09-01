import { Button } from '@/components/ui/button';
import { useExternalNavigation } from '@/hooks/useExternalNavigation';
import { Palette } from 'lucide-react';

interface ExternalNavigationButtonProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ExternalNavigationButton = ({ 
  url, 
  children, 
  className = '',
  delay = 2000,
  variant = 'default',
  size = 'default'
}: ExternalNavigationButtonProps) => {
  const { navigateToExternal } = useExternalNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToExternal(url, delay);
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
    >
      {children}
    </Button>
  );
};

// Specialized button for "Start Designing" with default styling
export const StartDesigningButton = ({ 
  url = 'https://animated-cheesecake-a81f47.netlify.app/',
  delay = 2000,
  className = 'bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300'
}: {
  url?: string;
  delay?: number;
  className?: string;
}) => {
  return (
    <ExternalNavigationButton
      url={url}
      delay={delay}
      className={className}
    >
      <Palette className="mr-2 h-4 w-4" />
      START DESIGNING
    </ExternalNavigationButton>
  );
};
