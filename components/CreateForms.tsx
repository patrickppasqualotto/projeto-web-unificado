import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

type ContentType = 'university' | 'news' | 'opportunity' | 'internship' | 'event';

interface CreateFormsProps {
  type: ContentType;
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateForms({ type, onBack, onSuccess }: CreateFormsProps) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const API = useMemo(() => (process.env.API_URL as string) || 'http://localhost:4000', []);
  const [categoriaOptions, setCategoriaOptions] = useState<Array<{ id: number; nome: string }>>([]);
  const [tipoOptions, setTipoOptions] = useState<Array<{ id: number; nome: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const catRes = await fetch(`${API}/api/v1/categoria-vaga`);
        const catJson = await catRes.json().catch(() => null);
        if (catRes.ok && catJson?.data) {
          setCategoriaOptions(catJson.data.map((c: any) => ({ id: c.id_categoria, nome: c.nome })));
        }
      } catch {}
      try {
        const tipoRes = await fetch(`${API}/api/v1/oportunidades`);
        const tipoJson = await tipoRes.json().catch(() => null);
        if (tipoRes.ok && Array.isArray(tipoJson?.data)) {
          const map = new Map<number, string>();
          for (const o of tipoJson.data) {
            const t = o.tipoOportunidade;
            if (t?.id_tipo_oportunidade && t?.nome) map.set(t.id_tipo_oportunidade, t.nome);
          }
          setTipoOptions(Array.from(map.entries()).map(([id, nome]) => ({ id, nome })));
        }
      } catch {}
    })();
  }, [API]);

  const formConfigs = {
    university: {
      title: 'Nova Informação Institucional',
      icon: 'school',
      fields: [
        { key: 'title', label: 'Título', placeholder: 'Ex: Calendário Acadêmico 2024' },
        { key: 'category', label: 'Categoria', placeholder: 'Ex: Acadêmico' },
        { key: 'department', label: 'Departamento', placeholder: 'Ex: Secretaria' },
        {
          key: 'description',
          label: 'Descrição',
          placeholder: 'Descreva a informação...',
          multiline: true,
        },
        { key: 'endereco', label: 'Endereço/Localização (opcional)', placeholder: 'Ex: Av. 7 de Setembro, 3165' },
        { key: 'telefone', label: 'Telefone (opcional)', placeholder: 'Ex: (46) 3536-8900' },
        { key: 'email', label: 'E-mail (opcional)', placeholder: 'Ex: contato@utfpr.edu.br' },
        { key: 'link', label: 'Link (opcional)', placeholder: 'https://...' },
      ],
    },
    news: {
      title: 'Nova Notícia',
      icon: 'newspaper',
      fields: [
        { key: 'title', label: 'Título', placeholder: 'Título da notícia' },
        { key: 'category', label: 'Categoria', placeholder: 'Ex: Pesquisa' },
        { key: 'department', label: 'Departamento', placeholder: 'Ex: Comunicação' },
        {
          key: 'content',
          label: 'Conteúdo',
          placeholder: 'Escreva o conteúdo da notícia...',
          multiline: true,
        },
        { key: 'author', label: 'Autor', placeholder: 'Nome do autor' },
      ],
    },
    opportunity: {
      title: 'Nova Oportunidade Acadêmica',
      icon: 'trophy',
      fields: [
        { key: 'title', label: 'Título', placeholder: 'Nome da oportunidade' },
        { key: 'typeId', label: 'Tipo (ID)', placeholder: 'Ex: 1' },
        { key: 'institution', label: 'Instituição', placeholder: 'Nome da instituição' },
        { key: 'deadline', label: 'Prazo (opcional)', placeholder: 'DD/MM/AAAA' },
        {
          key: 'description',
          label: 'Descrição',
          placeholder: 'Descreva a oportunidade...',
          multiline: true,
        },
        { key: 'value', label: 'Valor (opcional)', placeholder: 'R$ 0,00' },
        { key: 'link', label: 'Link para inscrição', placeholder: 'https://...' },
      ],
    },
    internship: {
      title: 'Nova Vaga de Estágio',
      icon: 'briefcase',
      fields: [
        { key: 'title', label: 'Cargo', placeholder: 'Ex: Estagiário em TI' },
        { key: 'company', label: 'Empresa', placeholder: 'Nome da empresa' },
        { key: 'location', label: 'Localização', placeholder: 'Cidade, Estado' },
        { key: 'modality', label: 'Modalidade', placeholder: 'Presencial/Híbrido/Remoto' },
        { key: 'requirements', label: 'Requisitos', placeholder: 'Liste os requisitos...' },
        {
          key: 'description',
          label: 'Descrição',
          placeholder: 'Descreva as atividades e requisitos...',
          multiline: true,
        },
        { key: 'categoryId', label: 'Categoria (ID)', placeholder: 'Ex: 1' },
        { key: 'salary', label: 'Bolsa', placeholder: 'R$ 0,00' },
        { key: 'workload', label: 'Carga Horária', placeholder: 'Ex: 6h/dia' },
        { key: 'tags', label: 'Tags', placeholder: 'Tag1, Tag2, Tag3' },
      ],
    },
    event: {
      title: 'Novo Evento',
      icon: 'calendar',
      fields: [
        { key: 'title', label: 'Nome do Evento', placeholder: 'Nome do evento' },
        { key: 'type', label: 'Tipo', placeholder: 'Ex: Workshop, Palestra' },
        { key: 'date', label: 'Data', placeholder: 'DD/MM/AAAA' },
        { key: 'time', label: 'Horário', placeholder: 'HH:MM' },
        { key: 'location', label: 'Local', placeholder: 'Local do evento' },
        { key: 'organizer', label: 'Organizador', placeholder: 'Quem organiza' },
        {
          key: 'description',
          label: 'Descrição',
          placeholder: 'Descreva o evento...',
          multiline: true,
        },
        { key: 'capacity', label: 'Vagas (opcional)', placeholder: 'Número de vagas' },
      ],
    },
  };

  const config = formConfigs[type];

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    // Validar campos básicos (ignora os com texto "(opcional)" no label)
    const requiredByType: string[] = (() => {
      switch (type) {
        case 'university':
          return ['title', 'category', 'description'];
        case 'news':
          return ['title', 'content']; // subtitulo/categoria opcional
        case 'opportunity':
          return ['title', 'description'];
        case 'internship':
          return ['title', 'description', 'company', 'location'];
        case 'event':
          return ['title', 'date', 'time', 'location'];
        default:
          return [];
      }
    })();

    const emptyFields = requiredByType.filter((key) => !formData[key])
      .map((key) => {
        const f = (config.fields as any).find((x: any) => x.key === key);
        return f?.label || key;
      });

    if (emptyFields.length > 0) {
      Alert.alert('Campos obrigatórios', `Preencha: ${emptyFields.join(', ')}`);
      setSubmitting(false);
      return;
    }

    if (!token) {
      Alert.alert('Autenticação necessária', 'Faça login para cadastrar.');
      setSubmitting(false);
      return;
    }

    try {
      let url = '';
      let body: any = {};

      if (type === 'university') {
        // POST /api/v1/informacoes { chave, titulo, conteudo, endereco, telefone, email }
        url = `${API}/api/v1/informacoes`;
        body = {
          chave: (formData.category || 'geral').trim(),
          titulo: (formData.title || '').trim(),
          conteudo: (formData.description || '').trim(),
          endereco: formData.endereco ? formData.endereco.trim() : null,
          telefone: formData.telefone ? formData.telefone.trim() : null,
          email: formData.email ? formData.email.trim() : null,
        };
      } else if (type === 'news') {
        // POST /api/v1/noticias { titulo, subtitulo?, conteudo, imagem_url?, data_expiracao? }
        url = `${API}/api/v1/noticias`;
        body = {
          titulo: (formData.title || '').trim(),
          subtitulo: (formData.category || '').trim() || null,
          conteudo: (formData.content || '').trim(),
          imagem_url: null,
          data_expiracao: null,
        };
      } else if (type === 'opportunity') {
        // POST /api/v1/oportunidades { titulo, descricao, data_prazo?, id_tipo_oportunidade, link? }
        url = `${API}/api/v1/oportunidades`;
        // Converter prazo opcional
        let prazo: string | null = null;
        if (formData.deadline) {
          const [d, m, y] = (formData.deadline || '').split('/');
          const dt = y && m && d ? new Date(Number(y), Number(m) - 1, Number(d)) : null;
          prazo = dt ? dt.toISOString().substring(0, 10) : null;
        }
        body = {
          titulo: (formData.title || '').trim(),
          descricao: (formData.description || '').trim(),
          data_prazo: prazo,
          id_tipo_oportunidade: Number(formData.typeId || 1),
          link: (formData.link || '').trim() || null,
        };
      } else if (type === 'internship') {
        // POST /api/v1/vagas requer vários campos; mapeamos mínimos
        // Campos obrigatórios: titulo, descricao, requisitos, id_categoria, data_expiracao futura
        url = `${API}/api/v1/vagas`;
        const hojeMais30 = new Date(); hojeMais30.setDate(hojeMais30.getDate() + 30);
        // Preparar tags: criar se necessário e coletar ids
        let tagIds: number[] = [];
        const rawTags = (formData.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        if (rawTags.length > 0) {
          for (const t of rawTags) {
            const tagRes = await fetch(`${API}/api/v1/tags`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ nome: t }),
            });
            const tagJson = await tagRes.json().catch(() => null);
            if (tagRes.ok && tagJson?.data?.id_tag) {
              tagIds.push(tagJson.data.id_tag);
            }
          }
        }

        body = {
          titulo: (formData.title || '').trim(),
          descricao: (formData.description || '').trim(),
          requisitos: (formData.requirements || formData.description || '').trim(),
          salario: (formData.salary || '').trim() || null,
          data_expiracao: hojeMais30.toISOString().substring(0, 10),
          id_categoria: Number(formData.categoryId || 1),
          empresa: (formData.company || '').trim() || null,
          localizacao: (formData.location || '').trim() || null,
          url_externa: null,
          tags: tagIds,
        };
      } else if (type === 'event') {
        // POST /api/v1/eventos { titulo, descricao?, data_inicio, data_fim?, localizacao?, link_inscricao?, id_curso? }
        url = `${API}/api/v1/eventos`;
        // Converter data + hora para ISO
        const [d, m, y] = (formData.date || '').split('/');
        const baseDate = y && m && d ? new Date(Number(y), Number(m) - 1, Number(d)) : new Date();
        const hora = (formData.time || '09:00');
        const [hh, mm] = hora.split(':').map((x) => Number(x));
        // garantir futuro: se data passada, empurra para amanhã
        const now = new Date();
        let dataISO = new Date(baseDate.getTime());
        if (dataISO < now) {
          dataISO = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        }
        dataISO.setHours(hh || 9, mm || 0, 0, 0);
        const fimISO = new Date(dataISO.getTime());
        fimISO.setHours((hh || 9) + 2, mm || 0, 0, 0);

        body = {
          titulo: (formData.title || '').trim(),
          descricao: (formData.description || '').trim() || null,
          data_inicio: dataISO.toISOString(),
          data_fim: fimISO.toISOString(),
          localizacao: (formData.location || '').trim() || null,
          link_inscricao: null,
          id_curso: null,
        };
      }

      if (!url) {
        Alert.alert('Erro', 'Tipo de formulário não suportado');
        return;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || (json && json.success === false)) {
        const msg = (json && (json.error || json.message)) || 'Falha ao cadastrar';
        Alert.alert('Erro', msg);
        setSubmitting(false);
        return;
      }

      Alert.alert('Sucesso!', `${config.title.replace('Nov', 'Cadastrad')} com sucesso!`, [
        { text: 'OK', onPress: onSuccess },
      ]);
      setSubmitting(false);
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      Alert.alert('Erro', 'Não foi possível enviar o formulário.');
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={config.icon as any} size={32} color="#030213" />
          </View>
          <Text style={styles.formTitle}>{config.title}</Text>
        </View>

        <View style={styles.form}>
          {config.fields.map((field) => (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[
                  styles.input,
                  field.multiline && styles.textArea,
                ]}
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChangeText={(text) =>
                  setFormData({ ...formData, [field.key]: text })
                }
                multiline={field.multiline}
                numberOfLines={field.multiline ? 4 : 1}
                textAlignVertical={field.multiline ? 'top' : 'center'}
              />
              {/* Ajuda visual para selects */}
              {type === 'internship' && field.key === 'categoryId' && categoriaOptions.length > 0 && (
                <Text style={{ fontSize: 12, color: '#717182' }}>
                  Categorias: {categoriaOptions.map((c) => `${c.id}:${c.nome}`).join(' | ')}
                </Text>
              )}
              {type === 'opportunity' && field.key === 'typeId' && tipoOptions.length > 0 && (
                <Text style={{ fontSize: 12, color: '#717182' }}>
                  Tipos: {tipoOptions.map((t) => `${t.id}:${t.nome}`).join(' | ')}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onBack}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>{submitting ? 'Enviando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#f3f3f5',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#030213',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#030213',
  },
  input: {
    backgroundColor: '#f3f3f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#030213',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ececf0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#717182',
  },
  submitButton: {
    backgroundColor: '#030213',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
