import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Search, MapPin, Phone, Mail, Clock, Filter, ChevronDown } from "lucide-react";

// Mock data for university information
const universityData = [
  {
    id: 1,
    title: "Secretaria Acadêmica",
    category: "Administrativo",
    department: "Administração",
    description: "Responsável por matrículas, histórico escolar e documentos acadêmicos",
    location: "Prédio Central - Sala 101",
    phone: "(11) 1234-5678",
    email: "secretaria@universidade.edu.br",
    hours: "08:00 - 17:00"
  },
  {
    id: 2,
    title: "Biblioteca Central",
    category: "Serviços",
    department: "Biblioteca",
    description: "Acervo completo de livros, periódicos e recursos digitais",
    location: "Prédio da Biblioteca - Térreo",
    phone: "(11) 1234-5679",
    email: "biblioteca@universidade.edu.br",
    hours: "07:00 - 22:00"
  },
  {
    id: 3,
    title: "Coordenação de Engenharia",
    category: "Acadêmico",
    department: "Engenharia",
    description: "Coordenação dos cursos de engenharia e orientação acadêmica",
    location: "Prédio de Engenharia - 2º andar",
    phone: "(11) 1234-5680",
    email: "engenharia@universidade.edu.br",
    hours: "08:00 - 18:00"
  },
  {
    id: 4,
    title: "Restaurante Universitário",
    category: "Serviços",
    department: "Alimentação",
    description: "Refeições subsidiadas para estudantes e funcionários",
    location: "Prédio do RU - Térreo",
    phone: "(11) 1234-5681",
    email: "ru@universidade.edu.br",
    hours: "07:00 - 15:00"
  },
  {
    id: 5,
    title: "Centro de Idiomas",
    category: "Acadêmico",
    department: "Letras",
    description: "Cursos de idiomas para comunidade acadêmica",
    location: "Prédio de Letras - 1º andar",
    phone: "(11) 1234-5682",
    email: "idiomas@universidade.edu.br",
    hours: "08:00 - 21:00"
  },
  {
    id: 6,
    title: "Laboratório de Informática",
    category: "Acadêmico",
    department: "Computação",
    description: "Laboratórios com computadores e software especializado",
    location: "Prédio de Computação - Vários andares",
    phone: "(11) 1234-5683",
    email: "lab.info@universidade.edu.br",
    hours: "08:00 - 22:00"
  }
];

const categories = ["Todos", "Administrativo", "Acadêmico", "Serviços"];
const departments = ["Todos", "Administração", "Biblioteca", "Engenharia", "Alimentação", "Letras", "Computação"];

export function UniversityInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredData = universityData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesDepartment = selectedDepartment === "Todos" || item.department === selectedDepartment;
    
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setSelectedDepartment("Todos");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-lg md:text-xl">Informações da Universidade</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou descrição..."
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
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

              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results count */}
        <p className="text-muted-foreground">
          {filteredData.length} resultado(s) encontrado(s)
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredData.map(item => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <CardTitle className="text-base md:text-lg">{item.title}</CardTitle>
                <Badge variant="secondary" className="self-start">{item.category}</Badge>
              </div>
              <CardDescription className="text-sm">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3 pt-0">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm">{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs md:text-sm">{item.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Mail className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm break-all">{item.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs md:text-sm">{item.hours}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.department}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum resultado encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}