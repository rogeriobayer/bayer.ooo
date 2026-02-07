// Project modal details with multiple images, full tech descriptions, and impact metrics
export const projectModalData = {
    powerbi: {
        id: 1,
        slug: "powerbi",
        images: [
            "/powerbi-project.png",
        ],
        technologies: [
            { code: "powerbi", role: "Visualização e dashboards interativos" },
        ],
        impact: [],
    },
    farmaalg: {
        id: 2,
        slug: "farmaalg",
        images: [
            "/farmaalg-project.png",
        ],
        technologies: [
            { code: "react-native", role: "App mobile multiplataforma" },
            { code: "expo", role: "Build e deploy simplificado" },
            { code: "springboot", role: "API backend robusta" },
        ],
        impact: [],
    },
    focuspatrol: {
        id: 3,
        slug: "focuspatrol",
        images: [
            "/focus-patrol-project.png",
        ],
        technologies: [
            { code: "javascript", role: "Lógica principal da extensão" },
            { code: "cloudflare", role: "Landing page e analytics" },
            { code: "chrome", role: "APIs de extensão do navegador" },
        ],
        impact: [
            { value: "5.0 ★", labelKey: "projects.modal.impact.stars" },
            { value: "#20", labelKey: "projects.modal.impact.ph" },
            { value: "+15", labelKey: "projects.modal.impact.countries" },
        ],
    },
};

// Get modal data by project slug
export const getProjectModalData = (slug) => {
    return projectModalData[slug] || null;
};
