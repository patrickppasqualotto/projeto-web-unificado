import { useState } from 'react';
import { useAuth } from './auth-context';
import { CreateForm } from './create-forms';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Plus, 
  Newspaper, 
  Award, 
  Briefcase, 
  Calendar, 
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  ArrowLeft
} from 'lucide-react';

export function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeForm, setActiveForm] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Acesso restrito para administradores
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    { title: 'Total de Notícias', value: '24', icon: Newspaper },
    { title: 'Oportunidades Ativas', value: '12', icon: Award },
    { title: 'Vagas de Estágio', value: '18', icon: Briefcase },
    { title: 'Eventos Programados', value: '8', icon: Calendar },
  ];

  const quickActions = [
    { 
      title: 'Nova Notícia', 
      description: 'Publicar nova notícia ou aviso',
      icon: Newspaper,
      action: 'create-news'
    },
    { 
      title: 'Nova Oportunidade', 
      description: 'Cadastrar oportunidade acadêmica',
      icon: Award,
      action: 'create-opportunity'
    },
    { 
      title: 'Nova Vaga de Estágio', 
      description: 'Adicionar vaga de estágio',
      icon: Briefcase,
      action: 'create-internship'
    },
    { 
      title: 'Novo Evento', 
      description: 'Criar novo evento',
      icon: Calendar,
      action: 'create-event'
    },
    { 
      title: 'Informação Universitária', 
      description: 'Atualizar informações da universidade',
      icon: GraduationCap,
      action: 'create-info'
    },
  ];

  const handleQuickAction = (action: string) => {
    setActiveForm(action);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Formulário enviado:', activeForm, data);
    // Aqui seria implementada a integração com a API
    setActiveForm(null);
    setActiveTab('overview');
  };

  const handleFormCancel = () => {
    setActiveForm(null);
  };

  // Se há um formulário ativo, mostrar apenas o formulário
  if (activeForm) {
    const formTypeMap: Record<string, 'news' | 'opportunity' | 'internship' | 'event' | 'info'> = {
      'create-news': 'news',
      'create-opportunity': 'opportunity', 
      'create-internship': 'internship',
      'create-event': 'event',
      'create-info': 'info'
    };

    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleFormCancel}
            className="text-xs md:text-sm"
          >
            <ArrowLeft className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            Voltar
          </Button>
        </div>
        <CreateForm 
          type={formTypeMap[activeForm]}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg md:text-xl">Painel Administrativo</h2>
        <p className="text-sm text-muted-foreground">
          Bem-vindo, {user.name}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger 
            value="overview" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Visão Geral</span>
            <span className="sm:hidden text-xs">Geral</span>
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Criar</span>
            <span className="sm:hidden text-xs">Criar</span>
          </TabsTrigger>
          <TabsTrigger 
            value="manage" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Gerenciar</span>
            <span className="sm:hidden text-xs">Ger.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                          {stat.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg">Atividade Recente</CardTitle>
              <CardDescription className="text-sm">
                Últimas ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Nova notícia publicada</span>
                  <Badge variant="outline" className="text-xs">Hoje</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Evento criado</span>
                  <Badge variant="outline" className="text-xs">Ontem</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Vaga de estágio adicionada</span>
                  <Badge variant="outline" className="text-xs">2 dias</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent 
                      className="p-4 md:p-6"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm md:text-base font-medium">{action.title}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg">Gerenciamento</CardTitle>
              <CardDescription className="text-sm">
                Ferramentas para administrar o portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Usuários Ativos</p>
                    <p className="text-xs text-muted-foreground">Gerenciar contas de usuário</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Users className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Ver Usuários
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Configurações</p>
                    <p className="text-xs text-muted-foreground">Ajustar configurações do portal</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Settings className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}