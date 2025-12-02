import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Search, MapPin, Building, Clock, DollarSign, Users, Filter, ChevronDown } from "lucide-react";

// Mock data for internship opportunities
const internshipData = [
  {
    id: 1,
    title: "Desenvolvedor Frontend - React",
    company: "TechCorp Ltda",
    area: "Tecnologia",
    location: "São Paulo, SP",
    modality: "Híbrido",
    salary: "R$ 1.500",
    duration: "12 meses",
    description: "Desenvolvimento de interfaces web usando React, TypeScript e Tailwind CSS",
    requirements: "Cursando Ciência da Computação, Sistemas de Informação ou áreas afins",
    posted: "2024-03-15",
    spots: 2
  },
  {
    id: 2,
    title: "Analista de Marketing Digital",
    company: "Marketing Plus",
    area: "Marketing",
    location: "Rio de Janeiro, RJ",
    modality: "Presencial",
    salary: "R$ 1.200",
    duration: "6 meses",
    description: "Criação de campanhas digitais, análise de métricas e gestão de redes sociais",
    requirements: "Cursando Marketing, Publicidade ou Comunicação Social",
    posted: "2024-03-14",
    spots: 1
  },
  {
    id: 3,
    title: "Assistente Financeiro",
    company: "FinanceGroup",
    area: "Finanças",
    location: "Belo Horizonte, MG",
    modality: "Remoto",
    salary: "R$ 1.300",
    duration: "10 meses",
    description: "Auxílio em análises financeiras, elaboração de relatórios e controle de fluxo de caixa",
    requirements: "Cursando Administração, Economia ou Contabilidade",
    posted: "2024-03-13",
    spots: 3
  },
  {
    id: 4,
    title: "Estagiário de Engenharia Civil",
    company: "Construtora Alpha",
    area: "Engenharia",
    location: "Brasília, DF",
    modality: "Presencial",
    salary: "R$ 1.100",
    duration: "12 meses",
    description: "Acompanhamento de obras, elaboração de projetos e controle de qualidade",
    requirements: "Cursando Engenharia Civil a partir do 6º semestre",
    posted: "2024-03-12",
    spots: 2
  },
  {
    id: 5,
    title: "Designer UX/UI",
    company: "DesignStudio",
    area: "Design",
    location: "Porto Alegre, RS",
    modality: "Híbrido",
    salary: "R$ 1.400",
    duration: "8 meses",
    description: "Criação de interfaces, pesquisa com usuários e prototipagem de aplicações",
    requirements: "Cursando Design, Design Gráfico ou áreas relacionadas",
    posted: "2024-03-11",
    spots: 1
  },
  {
    id: 6,
    title: "Analista de Dados Junior",
    company: "DataCorp",
    area: "Tecnologia",
    location: "São Paulo, SP",
    modality: "Remoto",
    salary: "R$ 1.600",
    duration: "12 meses",
    description: "Análise de dados, criação de dashboards e relatórios usando Python e SQL",
    requirements: "Cursando Estatística, Matemática, Ciência da Computação ou áreas afins",
    posted: "2024-03-10",
    spots: 2
  }
];

const areas = ["Todas", "Tecnologia", "Marketing", "Finanças", "Engenharia", "Design"];
const locations = ["Todas", "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Brasília, DF", "Porto Alegre, RS"];
const modalities = ["Todas", "Presencial", "Remoto", "Híbrido"];

export function InternshipJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [selectedLocation, setSelectedLocation] = useState("Todas");
  const [selectedModality, setSelectedModality] = useState("Todas");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredData = internshipData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "Todas" || item.area === selectedArea;
    const matchesLocation = selectedLocation === "Todas" || item.location === selectedLocation;
    const matchesModality = selectedModality === "Todas" || item.modality === selectedModality;
    
    return matchesSearch && matchesArea && matchesLocation && matchesModality;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedArea("Todas");
    setSelectedLocation("Todas");
    setSelectedModality("Todas");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className="text-lg md:text-xl">Vagas de Estágio</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por vaga, empresa ou descrição..."
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
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedModality} onValueChange={setSelectedModality}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {modalities.map(modality => (
                    <SelectItem key={modality} value={modality}>
                      {modality}
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
          {filteredData.length} vaga(s) encontrada(s)
        </p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3 md:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredData.map(item => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base md:text-lg leading-tight">{item.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1 text-sm">
                    <Building className="h-3 w-3 md:h-4 md:w-4" />
                    {item.company}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs self-start">{item.area}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-3 pt-0">
              <p className="text-sm">{item.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm">{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm">{item.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm">{item.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm">{item.spots} vaga(s)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge variant="outline" className="text-xs w-fit">
                  {item.modality}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Publicado em {new Date(item.posted).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  <strong>Requisitos:</strong> {item.requirements}
                </p>
              </div>

              <Button className="w-full mt-3 md:mt-4 text-sm md:text-base">
                Candidatar-se
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma vaga encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}