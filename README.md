# Portfolio - Rogério Bayer

Portfolio pessoal desenvolvido em Next.js com suporte a múltiplos idiomas (Português, Inglês e Francês).

## 🚀 Tecnologias Utilizadas

- **Next.js** - Framework React para produção
- **React** - Biblioteca JavaScript para interfaces
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca para animações

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes React
│   ├── contexts/           # Contextos React (LanguageContext)
│   ├── data/              # Dados e configurações
│   ├── hooks/             # Hooks customizados
│   ├── utils/             # Utilitários e configurações
│   └── page.js            # Página principal
```

## 🌐 Funcionalidades

### Componentes Principais
- **Header** - Navegação e seletor de idioma
- **Apresentation** - Apresentação pessoal
- **Summary** - Resumo profissional
- **SkillsSummary** - Resumo de habilidades
- **History** - Histórico profissional
- **Projects** - Projetos principais
- **Footer** - Rodapé com informações

### Sistema de Idiomas
- Troca dinâmica entre idiomas
- Contexto React para gerenciamento de estado
- Traduções organizadas por seções

### Animações
- Animações suaves com Framer Motion
- Configurações personalizadas em `animationConfig.js`

## 🚀 Como Executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em desenvolvimento:**
```bash
npm run dev
```

3. **Build para produção:**
```bash
npm run build
npm start
```

O projeto roda na porta **3001** por padrão.

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

