/**
 * Configuração dos projetos do portfólio.
 *
 * Para trocar a imagem de preview de um card:
 * 1. Coloque sua imagem em assets/images/portfolio/previews/ (ex: assets/images/portfolio/previews/acidentes-poa.png)
 * 2. Atualize o campo "preview" abaixo com o caminho local
 *
 * Campos:
 * - preview: caminho local ou URL da imagem do card
 * - previewFallback: emoji exibido se a imagem não carregar
 * - repo: link do repositório GitHub
 * - demo: (opcional) link da demo/site publicado
 */
const PORTFOLIO_PROJECTS = [
  {
    id: 'acidentes-poa',
    title: 'Acidentes de Trânsito — POA',
    category: 'bi personal',
    tags: 'BI · Python, Power BI, SQL',
    repo: 'https://github.com/JoseSoares01/SITE_PORTIFOLIO/tree/main/Dados-Portifoleo/Projeto-1',
    demo: 'https://site-portifolio-eoh.pages.dev/paginas/Analise-1/portifolio.html',
    preview: 'https://raw.githubusercontent.com/JoseSoares01/SITE_PORTIFOLIO/main/Dados-Portifoleo/Projeto-1/Analise_Acidentes.png',
    previewFallback: '🚗',
    previewGradient: 'linear-gradient(135deg, #1a3a5c, #2d6a9f)',
    description: 'Análise de dados abertos municipais — mapa de calor, hotspots e dashboard Power BI.'
  },
  {
    id: 'dashboard-ecommerce',
    title: 'Dashboard E-commerce',
    category: 'bi personal',
    tags: 'BI · Power BI, Azure, SQL Server',
    repo: 'https://github.com/JoseSoares01/SITE_PORTIFOLIO/tree/main/Dados-Portifoleo/Projeto-2',
    demo: 'https://site-portifolio-eoh.pages.dev/paginas/Analise-2/portifolio.html',
    preview: 'https://raw.githubusercontent.com/JoseSoares01/SITE_PORTIFOLIO/main/Dados-Portifoleo/Projeto-2/image-capa-vendas.jpeg',
    previewFallback: '📊',
    previewGradient: 'linear-gradient(135deg, #0d4f3c, #1a8c6e)',
    description: 'Performance de vendas, conversão e sazonalidade — 50+ KPIs monitorados.'
  },
  {
    id: 'churn',
    title: 'Modelo Preditivo de Churn',
    category: 'ml personal',
    tags: 'ML · Python, Scikit-learn, AWS',
    repo: 'https://github.com/JoseSoares01/SITE_PORTIFOLIO/tree/main/Dados-Portifoleo/Projeto-3',
    demo: 'https://site-portifolio-eoh.pages.dev/paginas/Analise-3/portifolio.html',
    preview: 'https://raw.githubusercontent.com/JoseSoares01/SITE_PORTIFOLIO/main/Dados-Portifoleo/Projeto-3/capa-IBM.jpg',
    previewFallback: '🎯',
    previewGradient: 'linear-gradient(135deg, #4a1942, #8b2f7a)',
    description: 'ML sobre dataset IBM HR — 94% acurácia, 28% redução potencial de churn.'
  },
  {
    id: 'saude',
    title: 'Análise Preditiva em Saúde',
    category: 'ml personal',
    tags: 'ML · Python, SHAP, Scikit-learn',
    repo: 'https://github.com/JoseSoares01/SITE_PORTIFOLIO/tree/main/Dados-Portifoleo/Projeto-4',
    demo: 'https://site-portifolio-eoh.pages.dev/paginas/Analise-4/portifolio.html',
    preview: 'https://raw.githubusercontent.com/JoseSoares01/SITE_PORTIFOLIO/main/Dados-Portifoleo/Projeto-4/capa-saude.jpg',
    previewFallback: '🏥',
    previewGradient: 'linear-gradient(135deg, #5c1a1a, #c0392b)',
    description: 'Modelagem de risco cardiovascular — AUC-ROC 91% e protocolo de triagem.'
  },
  {
    id: 'marketing',
    title: 'ROI Marketing Digital',
    category: 'bi personal',
    tags: 'BI · R, Tableau, BigQuery',
    repo: 'https://github.com/JoseSoares01/SITE_PORTIFOLIO/tree/main/Dados-Portifoleo/Projeto-5',
    demo: 'https://site-portifolio-eoh.pages.dev/paginas/Analise-5/portifolio.html',
    preview: 'https://raw.githubusercontent.com/JoseSoares01/SITE_PORTIFOLIO/main/Dados-Portifoleo/Projeto-5/capa-socialmidia%20(2).jpg',
    previewFallback: '📱',
    previewGradient: 'linear-gradient(135deg, #3d2b1f, #8b6914)',
    description: 'Attribution modeling e otimização de budget — ROAS 3.2x nos top canais.'
  },
  {
    id: 'bitcoin',
    title: 'Análise do Bitcoin',
    category: 'bi personal',
    tags: 'BI · Python, Chart.js, APIs',
    repo: 'https://github.com/JoseSoares01/SITE_PORTIFOLIO/tree/main/Dados-Portifoleo/Projeto-6',
    demo: 'https://site-portifolio-eoh.pages.dev/paginas/Analise-6/portifolio.html',
    preview: 'https://raw.githubusercontent.com/JoseSoares01/SITE_PORTIFOLIO/main/Dados-Portifoleo/Projeto-6/capa-investi.jpg',
    previewFallback: '₿',
    previewGradient: 'linear-gradient(135deg, #1a1a2e, #f39c12)',
    description: 'Estudo de halving, volatilidade e indicadores de sentimento para criptoativos.'
  },
  {
    id: 'email-extraction',
    title: 'Extração de Dados de E-mails',
    category: 'automation personal',
    tags: 'Automação · Python, Pandas, IMAP',
    repo: 'https://github.com/JoseSoares01/Email_Attachment_To_Excel',
    preview: 'assets/images/portfolio/previews/email-extraction.png',
    previewFallback: '📧',
    previewGradient: 'linear-gradient(135deg, #1e3a5f, #3498db)',
    description: 'Script Python com IMAP e GUI para download e extração de anexos Excel.'
  },
  {
    id: 'ze-dos-dados-xp',
    title: 'Zé dos Dados XP',
    category: 'web personal',
    tags: 'Web · HTML, CSS, JavaScript',
    repo: 'https://github.com/JoseSoares01/mitchivin-xp',
    preview: 'assets/images/portfolio/mitchivin-xp.png',
    previewFallback: '💻',
    previewGradient: 'linear-gradient(135deg, #0F61CB, #002D99)',
    description: 'Portfólio interativo estilo Windows XP — HTML, CSS e JavaScript.',
    label: 'ZÉ DOS DADOS'
  }
];
