
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Calendar, Tag, FileText, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/components/ui/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createProject, updateProject, getProject, loading } = useProjects();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Web Development',
    'Mobile App',
    'Design',
    'Data Science',
    'DevOps',
    'Marketing',
    'Outros'
  ];

  useEffect(() => {
    if (isEditing) {
      const project = getProject(id);
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          category: project.category,
          date: project.date
        });
      } else {
        toast({
          title: "Erro",
          description: "Projeto não encontrado",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    }
  }, [id, isEditing, getProject, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing) {
        await updateProject(id, formData);
        toast({
          title: "Sucesso!",
          description: "Projeto atualizado com sucesso!"
        });
      } else {
        await createProject(formData);
        toast({
          title: "Sucesso!",
          description: "Projeto criado com sucesso!"
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${isEditing ? 'atualizar' : 'criar'} projeto`,
        variant: "destructive"
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="hover-lift">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="page-transition"
        >
          <Card className="project-card shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isEditing ? 'Editar Projeto' : 'Criar Novo Projeto'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium flex items-center">
                      <Type className="w-4 h-4 mr-2" />
                      Título do Projeto
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Digite o título do projeto"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Categoria
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Data do Projeto
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="h-12 w-full md:w-64"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva seu projeto em detalhes..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 h-12 btn-primary text-white font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {isEditing ? 'Atualizar Projeto' : 'Criar Projeto'}
                      </>
                    )}
                  </Button>
                  
                  <Link to="/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-8"
                    >
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectForm;
