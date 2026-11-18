"use client";

import { useEffect, useState } from "react";

type Project = { id: number; title: string; description: string; tech: string; link: string };
type ThemeName = "botanical" | "midnight";
type PortfolioState = { projects: Project[]; skills: string[]; photo: string; theme: ThemeName };
const defaultProjects: Project[] = [
  { id: 1, title: "The Gardeners", description: "A community concept for plant lovers and gardening enthusiasts.", tech: "Next.js, Tailwind CSS", link: "" },
  { id: 2, title: "PlantWise", description: "A plant-learning concept that makes botanical knowledge more accessible.", tech: "Next.js, TypeScript", link: "" },
  { id: 3, title: "Personal Portfolio", description: "My journey in botany, technology, AI, and creative development.", tech: "Next.js, TypeScript, Tailwind CSS", link: "" },
];
const defaultSkills = ["Botany", "Plant Science", "HTML", "Next.js", "TypeScript", "Tailwind CSS", "AI Learning", "MS Excel", "Canva", "Communication", "Organic Gardening"];
const themeOptions: Record<ThemeName, { label: string; bg: string; card: string; text: string; muted: string; accent: string; border: string }> = {
  botanical: { label: "Botanical", bg: "#f4f5ed", card: "#ffffff", text: "#24392d", muted: "#718075", accent: "#477252", border: "#dce5d9" },
  midnight: { label: "Midnight", bg: "#101827", card: "#1a2639", text: "#edf4ff", muted: "#9eafc7", accent: "#69caff", border: "#2d3c53" },
};
const STORAGE_KEY = "hajira-portfolio-editor-v1";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [skills, setSkills] = useState<string[]>(defaultSkills);
  const [photo, setPhoto] = useState<string>("");
  const [theme, setTheme] = useState<ThemeName>("botanical");
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({ title: "", description: "", tech: "", link: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PortfolioState>;
        if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
        if (Array.isArray(parsed.skills)) setSkills(parsed.skills);
        if (typeof parsed.photo === "string") setPhoto(parsed.photo);
        if (parsed.theme && parsed.theme in themeOptions) setTheme(parsed.theme);
      }
    } catch (error) {
      console.warn("Could not load saved portfolio data.", error);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, skills, photo, theme }));
    } catch (error) {
      console.warn("Portfolio data could not be saved. The uploaded photo may be too large.", error);
    }
  }, [ready, projects, skills, photo, theme]);


  const currentTheme = themeOptions[theme];
  const clearProjectForm = () => {
    setProjectForm({ title: "", description: "", tech: "", link: "" });
    setEditingId(null);
  };

  const handlePhotoUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 800;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => alert("Could not read that image. Please try another photo.");
      image.src = String(reader.result);
    };
    reader.onerror = () => alert("Photo upload failed. Please try again.");
    reader.readAsDataURL(file);
  };

  const submitProject = () => {
    if (!projectForm.title.trim()) {
      alert("Please add a project title first.");
      return;
    }
    if (editingId !== null) {
      setProjects((items) => items.map((item) => item.id === editingId ? { ...item, ...projectForm } : item));
    } else {
      setProjects((items) => [...items, { id: Date.now(), ...projectForm }]);
    }
    clearProjectForm();
  };

  const editProject = (project: Project) => {
    setEditingId(project.id);
    setProjectForm({ title: project.title, description: project.description, tech: project.tech, link: project.link });
  };

  const removeProject = (id: number) => {
    if (!window.confirm("Remove this project from your portfolio?")) return;
    setProjects((items) => items.filter((item) => item.id !== id));
    if (editingId === id) clearProjectForm();
  };

  const addSkill = () => {
    const cleanSkill = skillInput.trim();
    if (!cleanSkill) return;
    if (skills.some((item) => item.toLowerCase() === cleanSkill.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills((items) => [...items, cleanSkill]);
    setSkillInput("");
  };

  const resetAll = () => {
    if (!window.confirm("Reset your projects, skills, photo and theme to the original defaults?")) return;
    setProjects(defaultProjects);
    setSkills(defaultSkills);
    setPhoto("");
    setTheme("botanical");
    clearProjectForm();
  };

  return (
    <main className="portfolio" style={{ background: currentTheme.bg, color: currentTheme.text }}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        .portfolio { min-height:100vh; font-family:Arial,Helvetica,sans-serif; transition:background .25s,color .25s; }
        .wrap { width:min(1080px,92%); margin:0 auto; }
        .nav { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:24px 0; }
        .navlinks { display:flex; gap:24px; align-items:center; }
        .navlinks a,.mobilelinks a { color:inherit; text-decoration:none; opacity:.8; }
        .navlinks a:hover,.mobilelinks a:hover { opacity:1; color:${currentTheme.accent}; }
        .mobilelinks { display:flex; flex-direction:column; gap:14px; padding:10px 0 20px; }
        .button { display:inline-flex; align-items:center; justify-content:center; gap:8px; border:1px solid ${currentTheme.border}; background:${currentTheme.card}; color:${currentTheme.text}; border-radius:30px; padding:11px 17px; text-decoration:none; cursor:pointer; transition:.2s; }
        .button:hover { transform:translateY(-2px); }
        .primary { background:${currentTheme.accent}; border-color:${currentTheme.accent}; color:white; }
        .section { padding:78px 0; }
        .tag { display:inline-block; border:1px solid ${currentTheme.border}; border-radius:30px; padding:7px 12px; color:${currentTheme.accent}; background:${currentTheme.card}; font-size:12px; }
        .hero { display:grid; grid-template-columns:1.15fr .85fr; align-items:center; gap:35px; padding:55px 0 80px; }
        .hero h1 { font-size:clamp(42px,7vw,76px); letter-spacing:-4px; line-height:1.06; margin:18px 0; }
        .muted { color:${currentTheme.muted}; line-height:1.8; }
        .heading { font-size:clamp(32px,5vw,48px); letter-spacing:-2px; margin:15px 0; }
        .profile { width:290px; height:290px; max-width:100%; object-fit:cover; border-radius:50%; border:8px solid ${currentTheme.card}; box-shadow:0 15px 45px #0001; }
        .photoCircle { display:flex; justify-content:center; align-items:center; font-size:84px; font-weight:bold; color:white; background:linear-gradient(135deg,${currentTheme.accent},${currentTheme.muted}); }
        .grid3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-top:28px; }
        .card { border:1px solid ${currentTheme.border}; background:${currentTheme.card}; border-radius:20px; padding:23px; }
        .skill { border:1px solid ${currentTheme.border}; background:${currentTheme.card}; border-radius:14px; padding:14px 16px; }
        .project { display:flex; flex-direction:column; gap:14px; min-height:245px; }
        .project h3 { margin:0; font-size:21px; }
        .project p { margin:0; line-height:1.7; color:${currentTheme.muted}; }
        .tech { color:${currentTheme.accent}; font-size:13px; font-weight:bold; }
        .editor { margin:25px 0; border:2px dashed ${currentTheme.accent}; border-radius:20px; padding:22px; background:${currentTheme.card}; }
        .editor input,.editor textarea { width:100%; padding:12px; margin:7px 0 13px; border:1px solid ${currentTheme.border}; border-radius:10px; background:${currentTheme.bg}; color:${currentTheme.text}; }
        .editor textarea { min-height:100px; resize:vertical; }
        .skillchip { display:inline-flex; gap:8px; align-items:center; padding:7px 12px; border-radius:30px; border:1px solid ${currentTheme.border}; background:${currentTheme.bg}; color:${currentTheme.text}; margin:4px; }
        .tiny { border:1px solid ${currentTheme.border}; background:${currentTheme.bg}; color:${currentTheme.text}; border-radius:9px; padding:7px 10px; cursor:pointer; }
        .themebtn { display:inline-flex; align-items:center; gap:9px; margin:5px; padding:9px 12px; border-radius:24px; border:1px solid ${currentTheme.border}; background:${currentTheme.card}; color:${currentTheme.text}; cursor:pointer; }
        .contactgrid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:15px; margin-top:25px; }
        .footer { border-top:1px solid ${currentTheme.border}; padding:26px 0; color:${currentTheme.muted}; font-size:13px; }
        .mobilemenu { display:none; }
        @media(max-width:740px) { .navlinks {display:none;} .mobilemenu{display:block;} .hero{grid-template-columns:1fr;text-align:center;padding-top:40px;} .hero h1{letter-spacing:-2px;} .heroactions{justify-content:center;} .grid3,.contactgrid{grid-template-columns:1fr;} .section{padding:55px 0;} .profile{width:235px;height:235px;} .heading{letter-spacing:-1px;} }
      `}</style>
      <div className="wrap">
        <nav className="nav">
          <a href="#top" style={{ color: currentTheme.accent, fontWeight:800, textDecoration:"none", fontSize:22 }}>HS.</a>
          <div className="navlinks"><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="button" onClick={() => setEditing((value) => !value)}>{editing ? "✓ Finish editing" : "✏️ Edit Portfolio"}</button>
            <button className="tiny mobilemenu" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">☰</button>
          </div>
        </nav>
        {menuOpen && <div className="mobilelinks"><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a><a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></div>}

        {editing && <section className="editor">
          <h2 style={{ marginTop:0 }}>Portfolio editor</h2>
          <p className="muted">Your changes save automatically in this browser.</p>
          <h3>Profile picture</h3>
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:12 }}>
            {photo ? <img src={photo} alt="Current profile preview" style={{ width:110, height:110, borderRadius:"50%", objectFit:"cover", border: `3px solid ${currentTheme.accent}` }} /> : <img src="/profile.png" alt="Current profile preview" onError={(event) => { event.currentTarget.style.display = "none"; }} style={{ width:110, height:110, borderRadius:"50%", objectFit:"cover", border: `3px solid ${currentTheme.accent}` }} />}
            <div style={{ flex:"1", minWidth:220 }}>
              <label htmlFor="portfolio-photo-upload" style={{ display:"block", fontWeight:700, marginBottom:8 }}>Choose a new photo</label>
              <input id="portfolio-photo-upload" type="file" accept="image/*" onChange={(event) => { handlePhotoUpload(event.target.files?.[0]); event.currentTarget.value = ""; }} />
              <p className="muted" style={{ margin:"4px 0", fontSize:13 }}>Select an image from your computer. Your photo preview updates on the page.</p>
              <button className="tiny" type="button" onClick={() => setPhoto("")}>Use default photo</button>
            </div>
          </div>
          <h3 style={{ marginTop:25 }}>Skills</h3>
          <div>{skills.map((skill) => <span className="skillchip" key={skill}>{skill}<button className="tiny" onClick={() => setSkills((items) => items.filter((value) => value !== skill))} aria-label={`Remove ${skill}`}>×</button></span>)}</div>
          <div style={{ display:"flex", gap:9, flexWrap:"wrap", alignItems:"center" }}>
            <input style={{ flex:"1", minWidth:180, margin:0 }} placeholder="Add a skill" value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addSkill(); }} />
            <button className="button primary" onClick={addSkill}>+ Add skill</button>
          </div>
          <h3 style={{ marginTop:28 }}>Manage projects</h3>
          {projects.length === 0 && <p className="muted">No projects yet. Add one below.</p>}
          <div style={{ display:"grid", gap:10, marginBottom:18 }}>
            {projects.map((project) => <div key={project.id} style={{ border:`1px solid ${currentTheme.border}`, borderRadius:12, padding:12, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <div style={{ minWidth:0, flex:1 }}><strong>{project.title}</strong><p className="muted" style={{ margin:"4px 0 0", fontSize:13 }}>{project.tech || "No technologies listed"}</p></div>
              <div style={{ display:"flex", gap:8 }}><button className="tiny" type="button" onClick={() => editProject(project)}>Edit</button><button className="tiny" type="button" onClick={() => removeProject(project.id)}>Remove</button></div>
            </div>)}
          </div>
          <h3>{editingId === null ? "Add new project" : "Edit selected project"}</h3>
          <input placeholder="Project name" value={projectForm.title} onChange={(event) => setProjectForm((form) => ({ ...form, title: event.target.value }))} />
          <textarea placeholder="Project description" value={projectForm.description} onChange={(event) => setProjectForm((form) => ({ ...form, description: event.target.value }))} />
          <input placeholder="Tech used" value={projectForm.tech} onChange={(event) => setProjectForm((form) => ({ ...form, tech: event.target.value }))} />
          <input placeholder="Project URL (optional)" value={projectForm.link} onChange={(event) => setProjectForm((form) => ({ ...form, link: event.target.value }))} />
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}><button className="button primary" onClick={submitProject}>{editingId === null ? "Add project" : "Save project"}</button><button className="button" onClick={clearProjectForm}>Clear</button></div>
          <h3 style={{ marginTop:28 }}>Themes</h3>
          {(Object.keys(themeOptions) as ThemeName[]).map((name) => <button className="themebtn" key={name} onClick={() => setTheme(name)}><span style={{ width:18, height:18, borderRadius:"50%", background:themeOptions[name].accent, display:"inline-block" }} />{themeOptions[name].label}{theme === name ? " ✓" : ""}</button>)}
          <p><button className="tiny" style={{ marginTop:20 }} onClick={resetAll}>Reset portfolio to defaults</button></p>
        </section>}

        <section className="hero" id="top">
          <div>
            <span className="tag">🌱 Botany × Technology × AI</span>
            <h1>Hi, I’m <span style={{ color:currentTheme.accent }}>Hajira</span> SaadUllah.</h1>
            <p className="muted" style={{ fontSize:17, maxWidth:550 }}>BS Botany student exploring the intersection of plant science, technology, artificial intelligence, and sustainable agriculture.</p>
            <div className="heroactions" style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:24 }}><a className="button primary" href="#projects">Explore projects ↗</a><a className="button" href="#contact">Let’s connect</a></div>
            <p className="muted" style={{ marginTop:25, fontSize:13 }}>University of Sargodha · Pakistan</p>
          </div>
          <div style={{ display:"flex", justifyContent:"center" }}>{photo ? <img className="profile" src={photo} alt="Profile" /> : <img className="profile" src="/profile.png" alt="Profile" onError={(event) => { event.currentTarget.style.display = "none"; }} />}</div>
        </section>

        <section id="about" className="section">
          <span className="tag">01 — About me</span><h2 className="heading">Curiosity drives everything I build.</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:18 }}><p className="muted">I’m a Botany student with a growing passion for technology and innovation. I enjoy exploring how plants, ecosystems, and technology connect—and how we can use that knowledge to solve real-world problems.</p><p className="muted">I’m learning web development and AI while building projects. My long-term goal is to bring technology into plant science, research, and sustainable agriculture.</p></div>
        </section>
        <section id="skills" className="section"><span className="tag">02 — Skills & interests</span><h2 className="heading">Things I’m exploring.</h2><p className="muted">My growing toolkit across science and technology.</p><div className="grid3">{skills.map((skill) => <div className="skill" key={skill}><span style={{ color:currentTheme.accent }}>✦ </span>{skill}</div>)}</div></section>
        <section id="projects" className="section"><span className="tag">03 — Projects</span><h2 className="heading">Things I’ve been building.</h2><p className="muted">Ideas, experiments, and projects along my learning journey.</p><div className="grid3">{projects.map((project) => <article className="card project" key={project.id}><div style={{ color:currentTheme.accent, fontSize:27 }}>✳</div><h3>{project.title}</h3><p>{project.description}</p><div className="tech">{project.tech}</div>{project.link.trim() !== "" && <a className="button" href={project.link} target="_blank" rel="noreferrer">Visit project ↗</a>}{editing && <div style={{ display:"flex", gap:8, marginTop:"auto" }}><button className="tiny" onClick={() => editProject(project)}>Edit</button><button className="tiny" onClick={() => removeProject(project.id)}>Delete</button></div>}</article>)}</div></section>
        <section id="contact" className="section"><span className="tag">04 — Contact</span><h2 className="heading">Let’s connect & grow.</h2><p className="muted" style={{ maxWidth:620 }}>Open to learning, collaboration, research opportunities, and connecting with people who are passionate about science and technology.</p><div className="contactgrid"><a className="card" href="mailto:hajirasaadullah03@gmail.com" style={{ color:"inherit", textDecoration:"none" }}><h3>✉ Email</h3><p className="muted">Get in touch</p></a><a className="card" href="https://github.com/hajira285" target="_blank" rel="noreferrer" style={{ color:"inherit", textDecoration:"none" }}><h3>⌘ GitHub</h3><p className="muted">Explore my code</p></a><a className="card" href="https://www.linkedin.com/in/hajira-saadullah-414989409/" target="_blank" rel="noreferrer" style={{ color:"inherit", textDecoration:"none" }}><h3>in LinkedIn</h3><p className="muted">Connect professionally</p></a></div></section>
        <footer className="footer"><div style={{ display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}><span>© 2026 Hajira SaadUllah</span><span>Built with curiosity & ☕</span></div></footer>
      </div>
    </main>
  );
}
