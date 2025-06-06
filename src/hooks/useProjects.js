
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = () => {
    if (!user) return;
    
    const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const userProjects = allProjects.filter(project => project.userId === user.id);
    setProjects(userProjects);
  };

  const createProject = async (projectData) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    setLoading(true);
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      allProjects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(allProjects));
      
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, projectData) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    setLoading(true);
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = allProjects.findIndex(p => p.id === id && p.userId === user.id);
      
      if (projectIndex === -1) {
        throw new Error('Projeto não encontrado');
      }

      const updatedProject = {
        ...allProjects[projectIndex],
        ...projectData,
        updatedAt: new Date().toISOString()
      };

      allProjects[projectIndex] = updatedProject;
      localStorage.setItem('projects', JSON.stringify(allProjects));
      
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    setLoading(true);
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const filteredProjects = allProjects.filter(p => !(p.id === id && p.userId === user.id));
      localStorage.setItem('projects', JSON.stringify(filteredProjects));
      
      setProjects(prev => prev.filter(p => p.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const getProject = (id) => {
    return projects.find(p => p.id === id);
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    loadProjects
  };
};
