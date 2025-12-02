import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Search, Calendar, User, Eye, Filter, ChevronDown, AlertCircle, Info, Megaphone } from "lucide-react";

// Mock data for institutional news
const newsData = [
  {
    id: 1,
    title: "Calendário Acadêmico 2024.2 - Importantes Datas",
    type: "Aviso Acadêmico",
    category: "Acadêmico",
    department: "Administração",
    date: "2024-03-15",
    author: "Secretaria Acadêmica",
    views: 1245,
    priority: "alta",
    content: "Comunicamos as principais datas do calendário acadêmico do segundo semestre de 2024. Início das aulas: 05/08/2024. Período de matrículas: 22/07 a 30/07.",
    excerpt: "Confira as datas importantes do calendário acadêmico 2024.2",
    tags: ["calendário", "matrículas", "datas importantes"]
  },
  {
    id: 2,
    title: "Nova Política de Uso da Biblioteca Central",
    type: "Comunicado",
    category: "Normativo",
    department: "Biblioteca",
    date: "2024-03-12",
    author: "Direção da Biblioteca",
    views: 892,
    priority: "média",
    content: "A partir de 01/04/2024, entra em vigor nova política de empréstimos e uso dos espaços da biblioteca. Confira as principais mudanças e procedimentos.",
    excerpt: "Novas regras para empréstimos e uso dos espaços da biblioteca",
    tags: ["biblioteca", "empréstimos", "política"]
  },
  {
    id: 3,
    title: "Manutenção Programada nos Sistemas - 20/03",
    type: "Manutenção",
    category: "Técnico",
    department: "TI",
    date: "2024-03-10",
    author: "Centro de Tecnologia da Informação",
    views: 567,
    priority: "alta",
    content: "Será realizada manutenção programada nos sistemas acadêmicos no dia 20/03/2024, das 22h às 6h. Durante este período, os sistemas estarão indisponíveis.",
    excerpt: "Sistemas indisponíveis durante manutenção programada",
    tags: ["manutenção", "sistemas", "indisponibilidade"]
  },
  {
    id: 4,
    title: "Processo Seletivo para Representantes Estudantis",
    type: "Edital",
    category: "Estudantil",
    department: "Diretório Acadêmico",
    date: "2024-03-08",
    author: "Diretório Acadêmico Central",
    views: 734,
    priority: "média",
    content: "Abertas as inscrições para representantes estudantis nos colegiados de curso. Período de inscrições: 15/03 a 30/03. Confira os requisitos e documentação necessária.",
    excerpt: "Inscrições abertas para representantes estudantis",
    tags: ["representação estudantil", "edital", "inscrições"]
  },
  {
    id: 5,
    title: "Novo Protocolo de Segurança no Campus",
    type: "Comunicado",
    category: "Segurança",
    department: "Segurança",
    date: "2024-03-05",
    author: "Coordenação de Segurança",
    views: 1156,
    priority: "alta",
    content: "Implementação de novas medidas de segurança no campus universitário. Todos os estudantes e funcionários devem estar cientes dos novos procedimentos.",
    excerpt: "Implementação de novas medidas de segurança no campus",
    tags: ["segurança", "protocolo", "campus"]
  },
  {
    id: 6,
    title: "Programa de Monitoria 2024.2 - Orientações",
    type: "Orientação",
    category: "Acadêmico",
    department: "Coordenação Acadêmica",
    date: "2024-03-03",
    author: "Coordenação de Ensino",
    views: 423,
    priority: "baixa",
    content: "Orientações para estudantes interessados no programa de monitoria. Cronograma de seleção e requisitos para participação no programa.",
    excerpt: "Orientações sobre o programa de monitoria do semestre",
    tags: ["monitoria", "orientações", "cronograma"]
  }
];

const newsTypes = ["Todos", "Aviso Acadêmico", "Comunicado", "Manutenção", "Edital", "Orientação"];
const categories = ["Todos", "Acadêmico", "Normativo", "Técnico", "Estudantil", "Segurança"];
const departments = ["Todos", "Administração", "Biblioteca", "TI", "Diretório Acadêmico", "Segurança", "Coordenação Acadêmica"];
const priorities = ["Todos", "alta", "média", "baixa"];

export function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [selectedPriority, setSelectedPriority] = useState("Todos");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredData = newsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Todos" || item.type === selectedType;
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesDepartment = selectedDepartment === "Todos" || item.department === selectedDepartment;
    const matchesPriority = selectedPriority === "Todos" || item.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesCategory && matchesDepartment && matchesPriority;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("Todos");
    setSelectedCategory("Todos");
    setSelectedDepartment("Todos");
    setSelectedPriority("Todos");
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "alta":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "média":
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Megaphone className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "alta":
        return "destructive";
      case "média":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-lg md:text-xl">Notícias e Avisos</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por título, conteúdo ou palavras-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Collapsible Filters */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown className="h-4 w-4 transition-transform duration-200" style={{
                transform: isFiltersOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {newsTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(department => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority === "Todos" ? priority : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="md:col-span-2 lg:col-span-4">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results count */}
        <p className="text-muted-foreground">
          {filteredData.length} notícia(s) encontrada(s)
        </p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3 md:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredData.map(item => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2 flex-1">
                    {getPriorityIcon(item.priority)}
                    <CardTitle className="text-base md:text-lg leading-tight">{item.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">{item.type}</Badge>
                </div>
                <CardDescription className="text-sm">{item.excerpt}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 pt-0">
              <p className="text-sm">{item.content}</p>
              
              <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm">{formatDate(item.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm">{item.author}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm">{item.views} visualizações</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 md:gap-2">
                <Badge variant="outline" className="text-xs">{item.department}</Badge>
                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                <Badge variant={getPriorityBadgeVariant(item.priority) as any} className="text-xs">
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Button className="w-full mt-3 md:mt-4 text-sm md:text-base">
                Ler Mais
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma notícia encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}