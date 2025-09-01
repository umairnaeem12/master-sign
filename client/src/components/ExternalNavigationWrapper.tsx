import { useExternalNavigation } from '@/hooks/useExternalNavigation';
import LoadingScreen from '@/components/LoadingScreen';

interface ExternalNavigationWrapperProps {
  children: React.ReactNode;
}

export const ExternalNavigationWrapper = ({ children }: ExternalNavigationWrapperProps) => {
  const { isNavigating } = useExternalNavigation();

  return (
    <>
      {children}
      <LoadingScreen isLoading={isNavigating} />
    </>
  );
};
