import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';

interface CreateFormProps {
  type: 'news' | 'opportunity' | 'internship' | 'event' | 'info';
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CreateForm({ type, onSubmit, onCancel }: CreateFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [date, setDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, date });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFormConfig = () => {
    switch (type) {
      case 'news':
        return {
          title: 'Nova Notícia',
          fields: [
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'excerpt', label: 'Resumo', type: 'text', required: true },
            { name: 'content', label: 'Conteúdo', type: 'textarea', required: true },
            { name: 'author', label: 'Autor', type: 'text', required: true },
            { name: 'type', label: 'Tipo', type: 'select', options: ['Notícia', 'Aviso', 'Comunicado'], required: true },
            { name: 'department', label: 'Departamento', type: 'select', options: ['Reitoria', 'Administração', 'Acadêmico'], required: true },
            { name: 'category', label: 'Categoria', type: 'select', options: ['Geral', 'Acadêmico', 'Administrativo'], required: true },
            { name: 'priority', label: 'Prioridade', type: 'select', options: ['baixa', 'média', 'alta'], required: true },
          ]
        };
      case 'opportunity':
        return {
          title: 'Nova Oportunidade Acadêmica',
          fields: [
            { name: 'title', label: 'Título', type: 'text', required: true },
            { name: 'description', label: 'Descrição', type: 'textarea', required: true },
            { name: 'type', label: 'Tipo', type: 'select', options: ['Bolsa', 'Iniciação Científica', 'Monitoria', 'Extensão'], required: true },
            { name: 'course', label: 'Curso', type: 'text', required: true },
            { name: 'department', label: 'Departamento', type: 'text', required: true },
            { name: 'coordinator', label: 'Coordenador', type: 'text', required: true },
            { name: 'workload', label: 'Carga Horária', type: 'text', required: true },
            { name: 'scholarship', label: 'Bolsa', type: 'text', required: true },
            { name: 'spots', label: 'Vagas', type: 'number', required: true },
            { name: 'duration', label: 'Duração', type: 'text', required: true },
            { name: 'requirements', label: 'Requisitos', type: 'textarea', required: true },
          ]
        };
      case 'internship':
        return {
          title: 'Nova Vaga de Estágio',
          fields: [
            { name: 'title', label: 'Título da Vaga', type: 'text', required: true },
            { name: 'company', label: 'Empresa', type: 'text', required: true },
            { name: 'description', label: 'Descrição', type: 'textarea', required: true },
            { name: 'area', label: 'Área', type: 'select', options: ['Tecnologia', 'Marketing', 'Finanças', 'Engenharia', 'Design'], required: true },
            { name: 'location', label: 'Localização', type: 'text', required: true },
            { name: 'modality', label: 'Modalidade', type: 'select', options: ['Presencial', 'Remoto', 'Híbrido'], required: true },
            { name: 'salary', label: 'Salárjoaio', type: 'text', required: true },
            { name: 'duration', label: 'Duração', type: 'text', required: true },
            { name: 'requirements', label: 'Requisitos', type: 'textarea', required: true },
            { name: 'spots', label: 'Número de Vagas', type: 'number', required: true },
          ]
        };
      case 'event':
        return {
          title: 'Novo Evento',
          fields: [
            { name: 'title', label: 'Título do Evento', type: 'text', required: true },
            { name: 'description', label: 'Descrição', type: 'textarea', required: true },
            { name: 'type', label: 'Tipo', type: 'select', options: ['Semana Acadêmica', 'Workshop', 'Feira', 'Palestra', 'Competição', 'Simpósio'], required: true },
            { name: 'department', label: 'Departamento', type: 'text', required: true },
            { name: 'location', label: 'Local', type: 'text', required: true },
            { name: 'time', label: 'Horário', type: 'text', required: true },
            { name: 'speaker', label: 'Palestrante/Responsável', type: 'text', required: true },
            { name: 'capacity', label: 'Capacidade', type: 'number', required: true },
            { name: 'price', label: 'Preço', type: 'text', required: true },
            { name: 'category', label: 'Categoria', type: 'select', options: ['Acadêmico', 'Técnico', 'Institucional', 'Competição'], required: true },
          ]
        };
      case 'info':
        return {
          title: 'Nova Informação Universitária',
          fields: [
            { name: 'title', label: 'Nome/Título', type: 'text', required: true },
            { name: 'description', label: 'Descrição', type: 'textarea', required: true },
            { name: 'category', label: 'Categoria', type: 'select', options: ['Administrativo', 'Acadêmico', 'Serviços'], required: true },
            { name: 'department', label: 'Departamento', type: 'text', required: true },
            { name: 'location', label: 'Localização', type: 'text', required: true },
            { name: 'phone', label: 'Telefone', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'hours', label: 'Horário de Funcionamento', type: 'text', required: true },
          ]
        };
      default:
        return { title: '', fields: [] };
    }
  };

  const config = getFormConfig();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                  required={field.required}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="min-h-20"
                />
              ) : field.type === 'select' ? (
                <Select onValueChange={(value) => handleInputChange(field.name, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                  required={field.required}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
          
          {(type === 'opportunity' || type === 'event') && (
            <div className="space-y-2">
              <Label className="text-sm">
                {type === 'opportunity' ? 'Prazo de Inscrição' : 'Data do Evento'} 
                <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString('pt-BR') : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-3">
                    <Input
                      type="date"
                      onChange={(e) => setDate(new Date(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="submit" className="flex-1 text-sm md:text-base">
              Criar {config.title.replace('Nova ', '').replace('Novo ', '')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 text-sm md:text-base"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}