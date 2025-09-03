import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Mail, Building, Phone, Settings, Shield } from 'lucide-react';

export default function UserProfile() {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await logout();
      
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Sign Out Failed',
        description: 'An error occurred while signing out.',
        variant: 'destructive',
      });
    } finally {
      setSigningOut(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'designer':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-600">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user.fullName}</CardTitle>
            <CardDescription className="text-lg">
              Welcome to your Master Signs profile
            </CardDescription>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                <Shield className="h-4 w-4 mr-1" />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">Full Name</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500">Email Address</p>
                    {user.isEmailVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                    <p className="text-xs text-gray-500">Phone Number</p>
                  </div>
                </div>
                
                {user.company && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.company}</p>
                      <p className="text-xs text-gray-500">Company</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Member Since</p>
                  <p className="text-sm text-blue-700">
                    {user.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Last Updated</p>
                  <p className="text-sm text-green-700">
                    {user.updatedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {user.address && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Shipping Address</p>
                    <p className="text-sm text-purple-700">
                      {user.address.street}<br />
                      {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                      {user.address.country}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.location.href = '/profile/edit'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {signingOut ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
