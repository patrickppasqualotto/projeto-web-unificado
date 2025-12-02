import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Search, Calendar, MapPin, Users, Clock, Filter, ChevronDown } from "lucide-react";

// Mock data for events
const eventsData = [
  {
    id: 1,
    title: "Semana da Tecnologia 2024",
    type: "Semana Acadêmica",
    department: "Computação",
    date: "2024-04-15",
    endDate: "2024-04-19",
    time: "08:00",
    location: "Auditório Central",
    capacity: 200,
    registered: 156,
    description: "Palestras, workshops e apresentações sobre as mais recentes tendências em tecnologia",
    speaker: "Diversos palestrantes da indústria",
    price: "Gratuito",
    category: "Acadêmico"
  },
  {
    id: 2,
    title: "Workshop: Desenvolvimento Web Moderno",
    type: "Workshop",
    department: "Computação",
    date: "2024-03-25",
    endDate: "2024-03-25",
    time: "14:00",
    location: "Laboratório de Informática 3",
    capacity: 30,
    registered: 28,
    description: "Hands-on sobre React, Node.js e deploy de aplicações web",
    speaker: "Prof. João Silva",
    price: "R$ 50,00",
    category: "Técnico"
  },
  {
    id: 3,
    title: "Feira de Profissões",
    type: "Feira",
    department: "Administração",
    date: "2024-04-10",
    endDate: "2024-04-10",
    time: "09:00",
    location: "Pátio Principal",
    capacity: 500,
    registered: 234,
    description: "Exposição de cursos e oportunidades profissionais para estudantes do ensino médio",
    speaker: "Coordenadores de curso",
    price: "Gratuito",
    category: "Institucional"
  },
  {
    id: 4,
    title: "Palestra: Sustentabilidade e Meio Ambiente",
    type: "Palestra",
    department: "Biologia",
    date: "2024-03-30",
    endDate: "2024-03-30",
    time: "19:00",
    location: "Auditório da Biologia",
    capacity: 100,
    registered: 45,
    description: "Discussão sobre práticas sustentáveis e preservação ambiental",
    speaker: "Dra. Maria Santos",
    price: "Gratuito",
    category: "Acadêmico"
  },
  {
    id: 5,
    title: "Hackathon Universitário",
    type: "Competição",
    department: "Computação",
    date: "2024-05-01",
    endDate: "2024-05-03",
    time: "18:00",
    location: "Centro de Convivência",
    capacity: 120,
    registered: 89,
    description: "48 horas de desenvolvimento intensivo com prêmios para os melhores projetos",
    speaker: "Mentores da indústria",
    price: "R$ 30,00",
    category: "Competição"
  },
  {
    id: 6,
    title: "Simpósio de Engenharia",
    type: "Simpósio",
    department: "Engenharia",
    date: "2024-04-20",
    endDate: "2024-04-22",
    time: "08:30",
    location: "Auditório de Engenharia",
    capacity: 150,
    registered: 112,
    description: "Apresentação de projetos de pesquisa e inovações em engenharia",
    speaker: "Pesquisadores e professores",
    price: "R$ 80,00",
    category: "Acadêmico"
  }
];

const eventTypes = ["Todos", "Semana Acadêmica", "Workshop", "Feira", "Palestra", "Competição", "Simpósio"];
const departments = ["Todos", "Computação", "Administração", "Biologia", "Engenharia"];
const categories = ["Todos", "Acadêmico", "Técnico", "Institucional", "Competição"];

export function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredData = eventsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Todos" || item.type === selectedType;
    const matchesDepartment = selectedDepartment === "Todos" || item.department === selectedDepartment;
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesDepartment && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("Todos");
    setSelectedDepartment("Todos");
    setSelectedCategory("Todos");
  };

  const formatDate = (dateStr: string, endDateStr?: string) => {
    const date = new Date(dateStr);
    const endDate = endDateStr ? new Date(endDateStr) : null;
    
    if (endDate && dateStr !== endDateStr) {
      return `${date.toLocaleDateString('pt-BR')} a ${endDate.toLocaleDateString('pt-BR')}`;
    }
    return date.toLocaleDateString('pt-BR');
  };

  const getAvailability = (capacity: number, registered: number) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 100) return { text: "Lotado", color: "destructive" };
    if (percentage >= 80) return { text: "Poucas vagas", color: "secondary" };
    return { text: "Vagas disponíveis", color: "default" };
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-lg md:text-xl">Eventos</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por título, descrição ou palestrante..."
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
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted rounded-lg">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-48">
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

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40">
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

              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results count */}
        <p className="text-muted-foreground">
          {filteredData.length} evento(s) encontrado(s)
        </p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3 md:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredData.map(item => {
          const availability = getAvailability(item.capacity, item.registered);
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base md:text-lg leading-tight">{item.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm">{item.speaker}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs self-start">{item.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 pt-0">
                <p className="text-sm">{item.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{formatDate(item.date, item.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{item.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{item.registered}/{item.capacity}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 md:gap-2">
                  <Badge variant="outline" className="text-xs">{item.department}</Badge>
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  <Badge variant={availability.color as any} className="text-xs">{availability.text}</Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
                  <span className="font-medium text-sm md:text-base">{item.price}</span>
                  <Button 
                    disabled={availability.text === "Lotado"}
                    className="text-sm md:text-base"
                    size="sm"
                  >
                    {availability.text === "Lotado" ? "Lotado" : "Inscrever-se"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum evento encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}