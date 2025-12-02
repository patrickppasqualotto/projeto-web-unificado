import { useState } from 'react';
import { useAuth } from './auth-context';
import { LoginForm } from './login-form';
import { AdminPanel } from './admin-panel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  LogOut, 
  Settings, 
  Shield,
  Menu,
  UserCircle
} from 'lucide-react';

export function UserDrawer() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'login' | 'profile' | 'admin'>('login');

  const handleLoginSuccess = () => {
    setActiveView('profile');
  };

  const handleLogout = () => {
    logout();
    setActiveView('login');
    setIsOpen(false);
  };

  const handleOpenAdmin = () => {
    setActiveView('admin');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginForm onSuccess={handleLoginSuccess} />;
    }

    if (activeView === 'admin') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveView('profile')}
              className="text-xs md:text-sm"
            >
              ← Voltar ao Perfil
            </Button>
          </div>
          <AdminPanel />
        </div>
      );
    }

    return (
      <div className="space-y-4 md:space-y-6">
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
          <Avatar className="h-12 w-12 md:h-16 md:w-16">
            <AvatarFallback className="text-sm md:text-base">
              {getInitials(user!.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-medium truncate">{user!.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground truncate">{user!.email}</p>
            <Badge variant={user!.role === 'admin' ? 'default' : 'secondary'} className="text-xs mt-1">
              {user!.role === 'admin' ? 'Administrador' : 'Usuário'}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Menu Options */}
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm md:text-base" 
            size="sm"
          >
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm md:text-base" 
            size="sm"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>

          {user!.role === 'admin' && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm md:text-base" 
              size="sm"
              onClick={handleOpenAdmin}
            >
              <Shield className="mr-2 h-4 w-4" />
              Painel Administrativo
            </Button>
          )}
        </div>

        <Separator />

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full text-sm md:text-base" 
          onClick={handleLogout}
          size="sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                <AvatarFallback className="text-xs md:text-sm">
                  {getInitials(user!.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-xs md:text-sm">{user!.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 md:gap-2">
              <UserCircle className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline text-xs md:text-sm">Entrar</span>
            </div>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-96 p-4 md:p-6">
        <SheetHeader className="mb-4 md:mb-6">
          <SheetTitle className="text-base md:text-lg">
            {!isAuthenticated 
              ? 'Acesso ao Portal' 
              : activeView === 'admin' 
                ? 'Administração' 
                : 'Minha Conta'
            }
          </SheetTitle>
        </SheetHeader>
        
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}