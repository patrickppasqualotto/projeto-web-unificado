import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Search, Calendar, Clock, DollarSign, BookOpen, Filter, ChevronDown, Users, FileText } from "lucide-react";

// Mock data for academic opportunities
const opportunitiesData = [
  {
    id: 1,
    title: "Monitoria - Cálculo Diferencial e Integral I",
    type: "Monitoria",
    department: "Matemática",
    course: "Engenharias / Exatas",
    deadline: "2024-03-25",
    startDate: "2024-04-01",
    duration: "1 semestre",
    workload: "12h/semana",
    scholarship: "R$ 400,00",
    spots: 2,
    requirements: "Ter cursado a disciplina com aprovação e CR mínimo 7.0",
    description: "Auxiliar estudantes nas atividades de Cálculo I, plantões de dúvidas e correção de exercícios",
    coordinator: "Prof. Dr. João Santos",
    category: "Ensino",
    level: "Graduação"
  },
  {
    id: 2,
    title: "Bolsa de Iniciação Científica - Inteligência Artificial",
    type: "Iniciação Científica",
    department: "Computação",
    course: "Ciência da Computação / Sistemas",
    deadline: "2024-03-30",
    startDate: "2024-04-15",
    duration: "12 meses",
    workload: "20h/semana",
    scholarship: "R$ 500,00",
    spots: 1,
    requirements: "Estar cursando a partir do 4º semestre, conhecimentos em Python",
    description: "Pesquisa em algoritmos de machine learning aplicados à análise de dados educacionais",
    coordinator: "Profa. Dra. Maria Silva",
    category: "Pesquisa",
    level: "Graduação"
  },
  {
    id: 3,
    title: "Bolsa de Mestrado - Sustentabilidade Ambiental",
    type: "Mestrado",
    department: "Biologia",
    course: "Programa de Pós-Graduação em Biologia",
    deadline: "2024-04-10",
    startDate: "2024-08-01",
    duration: "24 meses",
    workload: "Dedicação Exclusiva",
    scholarship: "R$ 2.100,00",
    spots: 3,
    requirements: "Graduação em Biologia ou áreas afins, conhecimentos em ecologia",
    description: "Desenvolvimento de projetos de pesquisa em conservação de ecossistemas urbanos",
    coordinator: "Prof. Dr. Carlos Oliveira",
    category: "Pesquisa",
    level: "Pós-Graduação"
  },
  {
    id: 4,
    title: "Programa de Tutoria - Física Geral",
    type: "Tutoria",
    department: "Física",
    course: "Engenharias",
    deadline: "2024-03-20",
    startDate: "2024-03-25",
    duration: "1 semestre",
    workload: "8h/semana",
    scholarship: "R$ 300,00",
    spots: 4,
    requirements: "Aprovação em Física I e II com média superior a 8.0",
    description: "Orientação de grupos de estudo e apoio pedagógico para estudantes de Física",
    coordinator: "Prof. Ms. Ana Costa",
    category: "Ensino",
    level: "Graduação"
  },
  {
    id: 5,
    title: "Bolsa de Doutorado - Engenharia de Software",
    type: "Doutorado",
    department: "Computação",
    course: "Programa de Pós-Graduação em Computação",
    deadline: "2024-04-05",
    startDate: "2024-08-01",
    duration: "48 meses",
    workload: "Dedicação Exclusiva",
    scholarship: "R$ 2.640,00",
    spots: 1,
    requirements: "Mestrado em Computação ou áreas correlatas, publicações em periódicos",
    description: "Pesquisa em metodologias ágeis para desenvolvimento de software educacional",
    coordinator: "Prof. Dr. Roberto Lima",
    category: "Pesquisa",
    level: "Pós-Graduação"
  },
  {
    id: 6,
    title: "Monitoria - Laboratório de Química Orgânica",
    type: "Monitoria",
    department: "Química",
    course: "Química / Farmácia / Medicina",
    deadline: "2024-03-28",
    startDate: "2024-04-01",
    duration: "1 semestre",
    workload: "10h/semana",
    scholarship: "R$ 350,00",
    spots: 2,
    requirements: "Aprovação em Química Orgânica I e II, disponibilidade para horários vespertinos",
    description: "Auxílio em aulas práticas de laboratório e orientação de experimentos",
    coordinator: "Profa. Dra. Fernanda Rocha",
    category: "Ensino",
    level: "Graduação"
  }
];

const opportunityTypes = ["Todos", "Monitoria", "Iniciação Científica", "Mestrado", "Doutorado", "Tutoria"];
const departments = ["Todos", "Matemática", "Computação", "Biologia", "Física", "Química"];
const categories = ["Todos", "Ensino", "Pesquisa"];
const levels = ["Todos", "Graduação", "Pós-Graduação"];

export function AcademicOpportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredData = opportunitiesData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Todos" || item.type === selectedType;
    const matchesDepartment = selectedDepartment === "Todos" || item.department === selectedDepartment;
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesLevel = selectedLevel === "Todos" || item.level === selectedLevel;
    
    return matchesSearch && matchesType && matchesDepartment && matchesCategory && matchesLevel;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("Todos");
    setSelectedDepartment("Todos");
    setSelectedCategory("Todos");
    setSelectedLevel("Todos");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const isDeadlineClose = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-lg md:text-xl">Oportunidades Acadêmicas</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por título, descrição ou curso..."
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
                  {opportunityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
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

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
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
          {filteredData.length} oportunidade(s) encontrada(s)
        </p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3 md:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredData.map(item => {
          const daysUntilDeadline = getDaysUntilDeadline(item.deadline);
          const isUrgent = isDeadlineClose(item.deadline);
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-base md:text-lg leading-tight">{item.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-sm">
                        <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                        {item.course}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">{item.type}</Badge>
                  </div>
                  {isUrgent && (
                    <Badge variant="destructive" className="w-fit text-xs">
                      Prazo próximo!
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 pt-0">
                <p className="text-sm">{item.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">Prazo: {formatDate(item.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{item.workload}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{item.scholarship}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">{item.spots} vaga(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs md:text-sm">Início: {formatDate(item.startDate)}</span>
                  </div>
                  <div className="text-xs md:text-sm">
                    <span className="text-muted-foreground">Duração: </span>
                    <span>{item.duration}</span>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Coordenador:</strong> {item.coordinator}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Requisitos:</strong> {item.requirements}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 md:gap-2">
                  <Badge variant="outline" className="text-xs">{item.department}</Badge>
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  <Badge variant="outline" className="text-xs">{item.level}</Badge>
                  {daysUntilDeadline > 0 && (
                    <Badge variant={isUrgent ? "destructive" : "default"} className="text-xs">
                      {daysUntilDeadline} dia(s)
                    </Badge>
                  )}
                </div>

                <Button className="w-full mt-3 md:mt-4 text-sm md:text-base">
                  Candidatar-se
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma oportunidade encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}