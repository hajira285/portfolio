"use client";

import { useEffect, useState } from "react";

type Project = { id: number; title: string; description: string; tech: string; link: string };
type ThemeName = "botanical" | "midnight" | "ocean" | "terracotta" | "purple";
type PortfolioState = { projects: Project[]; skills: string[]; photo: string; theme: ThemeName };

const defaultProjects: Project[] = [
  { id: 1, title: "The Gardeners", description: "A community concept for plant lovers and gardening enthusiasts.", tech: "Next.js, Tailwind CSS", link: "" },
  { id: 2, title: "PlantWise", description: "A plant-learning concept that makes botanical knowledge more accessible.", tech: "Next.js, TypeScript", link: "" },
  { id: 3, title: "Personal Portfolio", description: "My journey in botany, technology, AI, and creative development.", tech: "Next.js, TypeScript, Tailwind CSS", link: "" },
];
const defaultSkills = ["Botany", "Plant Science", "HTML", "Next.js", "TypeScript", "Tailwind CSS", "AI Learning", "MS Excel", "Canva", "Communication", "Organic Gardening"];
const palettes: Record<ThemeName, { label: string; accent: string; border: string }> = {
  botanical: { label: "Botanical", accent: "#477252", border: "#dce5d9" },
  midnight: { label: "Midnight", accent: "#69caff", border: "#2d3c53" },
  ocean: { label: "Ocean Blue", accent: "#247c9d", border: "#d3e5eb" },
  terracotta: { label: "Terracotta", accent: "#b76545", border: "#ead8cd" },
  purple: { label: "Purple Bloom", accent: "#8957b5", border: "#e4d8ef" },
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [skills, setSkills] = useState<string[]>(defaultSkills);
  const [photo, setPhoto] = useState("");
  const [theme, setTheme] = useState<ThemeName>("botanical");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("hajira-portfolio-mode");
    if (savedMode === "dark" || savedMode === "light") setMode(savedMode);
    fetch("/api/portfolio", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const content = (data.content || {}) as Partial<PortfolioState>;
        if (Array.isArray(content.projects)) setProjects(content.projects);
        if (Array.isArray(content.skills)) setSkills(content.skills);
        if (typeof content.photo === "string") setPhoto(content.photo);
        if (content.theme && content.theme in palettes) setTheme(content.theme);
      })
      .catch((error) => console.error("Portfolio load error:", error))
      .finally(() => setLoaded(true));
  }, []);

  const dark = mode === "dark";
  const palette = palettes[theme];
  const colors = {
    bg: dark ? "#101827" : theme === "botanical" ? "#f4f5ed" : theme === "ocean" ? "#edf5f8" : theme === "terracotta" ? "#f8f1eb" : theme === "purple" ? "#f5f0fa" : "#f3f6fb",
    card: dark ? "#1a2639" : "#ffffff",
    text: dark ? "#edf4ff" : theme === "botanical" ? "#24392d" : theme === "ocean" ? "#17384a" : theme === "terracotta" ? "#49342b" : theme === "purple" ? "#352344" : "#243047",
    muted: dark ? "#9eafc7" : "#718075",
    accent: palette.accent,
    border: dark ? "#2d3c53" : palette.border,
  };

  const toggleMode = () => {
    const next = dark ? "light" : "dark";
    setMode(next);
    localStorage.setItem("hajira-portfolio-mode", next);
  };

  return (
    <main style={{ minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "Arial,Helvetica,sans-serif", transition: "background .2s,color .2s" }}>
      <style>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}
        .wrap{width:min(1080px,92%);margin:0 auto}.nav{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:24px 0}
        .navlinks{display:flex;gap:24px;align-items:center}.navlinks a{color:inherit;text-decoration:none;opacity:.8}
        .btn{display:inline-flex;align-items:center;justify-content:center;border:1px solid ${colors.border};background:${colors.card};color:${colors.text};border-radius:30px;padding:11px 17px;text-decoration:none;cursor:pointer}
        .primary{background:${colors.accent};border-color:${colors.accent};color:white}.tag{display:inline-block;border:1px solid ${colors.border};border-radius:30px;padding:7px 12px;color:${colors.accent};background:${colors.card};font-size:12px}
        .hero{display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:35px;padding:55px 0 80px}.hero h1{font-size:clamp(42px,7vw,76px);letter-spacing:-4px;line-height:1.06;margin:18px 0}
        .muted{color:${colors.muted};line-height:1.8}.section{padding:70px 0}.heading{font-size:clamp(32px,5vw,48px);letter-spacing:-2px;margin:15px 0}
        .profile{width:290px;height:290px;max-width:100%;object-fit:cover;border-radius:50%;border:8px solid ${colors.card};box-shadow:0 15px 45px #0001}
        .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:28px}.card,.skill{border:1px solid ${colors.border};background:${colors.card};border-radius:20px;padding:23px}
        .project{display:flex;flex-direction:column;gap:14px;min-height:245px}.project h3{margin:0;font-size:21px}.project p{margin:0;line-height:1.7;color:${colors.muted}}
        .tech{color:${colors.accent};font-size:13px;font-weight:bold}.contactgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;margin-top:25px}
        .footer{border-top:1px solid ${colors.border};padding:26px 0;color:${colors.muted};font-size:13px}
        @media(max-width:740px){.navlinks{display:none}.hero{grid-template-columns:1fr;text-align:center;padding-top:40px}.hero h1{letter-spacing:-2px}.heroactions{justify-content:center}.grid3,.contactgrid{grid-template-columns:1fr}.section{padding:50px 0}.profile{width:235px;height:235px}.heading{letter-spacing:-1px}}
      `}</style>
      <div className="wrap">
        <nav className="nav">
          <a href="#top" style={{ color: colors.accent, fontWeight: 800, textDecoration: "none", fontSize: 22 }}>HS.</a>
          <div className="navlinks"><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
          <button className="btn" onClick={toggleMode}>{dark ? "☀️ Light mode" : "🌙 Dark mode"}</button>
        </nav>

        <section className="hero" id="top">
          <div>
            <span className="tag">🌱 Botany × Technology × AI</span>
            <h1>Hi, I’m <span style={{ color: colors.accent }}>Hajira</span> SaadUllah.</h1>
            <p className="muted" style={{ fontSize: 17, maxWidth: 550 }}>BS Botany student exploring the intersection of plant science, technology, artificial intelligence, and sustainable agriculture.</p>
            <div className="heroactions" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}><a className="btn primary" href="#projects">Explore projects ↗</a><a className="btn" href="#contact">Let’s connect</a></div>
            <p className="muted" style={{ marginTop: 25, fontSize: 13 }}>University of Sargodha · Pakistan</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>{photo ? <img className="profile" src={photo} alt="Hajira's profile" /> : <div className="profile" style={{ display: "grid", placeItems: "center", fontSize: 72, color: "white", background: `linear-gradient(135deg,${colors.accent},${colors.muted})` }}>HS</div>}</div>
        </section>

        <section id="about" className="section">
          <span className="tag">01 — About me</span><h2 className="heading">Curiosity drives everything I build.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}><p className="muted">I’m a Botany student with a growing passion for technology and innovation. I enjoy exploring how plants, ecosystems, and technology connect—and how we can use that knowledge to solve real-world problems.</p><p className="muted">I’m learning web development and AI while building projects. My long-term goal is to bring technology into plant science, research, and sustainable agriculture.</p></div>
        </section>

        <section id="skills" className="section"><span className="tag">02 — Skills & interests</span><h2 className="heading">Things I’m exploring.</h2><p className="muted">My growing toolkit across science and technology.</p><div className="grid3">{skills.map((skill) => <div className="skill" key={skill}><span style={{ color: colors.accent }}>✦ </span>{skill}</div>)}</div></section>

        <section id="projects" className="section"><span className="tag">03 — Projects</span><h2 className="heading">Things I’ve been building.</h2><p className="muted">Ideas, experiments, and projects along my learning journey.</p><div className="grid3">{projects.map((project) => <article className="card project" key={project.id}><div style={{ color: colors.accent, fontSize: 27 }}>✳</div><h3>{project.title}</h3><p>{project.description}</p><div className="tech">{project.tech}</div>{project.link.trim() !== "" && <a className="btn" href={project.link} target="_blank" rel="noreferrer">Visit project ↗</a>}</article>)}</div></section>

        <section id="contact" className="section"><span className="tag">04 — Contact</span><h2 className="heading">Let’s connect & grow.</h2><p className="muted" style={{ maxWidth: 620 }}>Open to learning, collaboration, research opportunities, and connecting with people who are passionate about science and technology.</p><div className="contactgrid"><a className="card" href="mailto:hajirasaadullah03@gmail.com" style={{ color: "inherit", textDecoration: "none" }}><h3>✉ Email</h3><p className="muted">Get in touch</p></a><a className="card" href="https://github.com/hajira285" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}><h3>⌘ GitHub</h3><p className="muted">Explore my code</p></a><a className="card" href="https://www.linkedin.com/in/hajira-saadullah-414989409/" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}><h3>in LinkedIn</h3><p className="muted">Connect professionally</p></a></div></section>

        <footer className="footer"><div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><span>© 2026 Hajira SaadUllah</span><span>Built with curiosity & ☕</span></div></footer>
      </div>
    </main>
  );
}
