import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ResumeDetailed } from '@/database/repositories/ResumeRepository';

export type TemplateId = 'modern' | 'minimal' | 'technical';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  accentColor: string;
}

export const RESUME_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Contemporary balanced layout with elegant indigo headers, divider rules, and clean section flow.',
    accentColor: '#4F46E5',
  },
  {
    id: 'minimal',
    name: 'Minimal ATS',
    description: 'High-compliance single-column grayscale format engineered for maximum ATS parser readability.',
    accentColor: '#1E293B',
  },
  {
    id: 'technical',
    name: 'Technical Developer',
    description: 'Tech-focused layout highlighting GitHub, Portfolio, technical stack chips, and architectural impacts.',
    accentColor: '#0284C7',
  },
];

export function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatBulletPoints(desc: string = ''): string {
  if (!desc) return '';
  const lines = desc.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 1 && !lines[0].startsWith('•') && !lines[0].startsWith('-')) {
    return `<p class="desc-para">${escapeHtml(lines[0])}</p>`;
  }
  const items = lines.map((l) => {
    const clean = l.replace(/^[•\-\*]\s*/, '');
    return `<li>${escapeHtml(clean)}</li>`;
  });
  return `<ul class="bullet-list">${items.join('')}</ul>`;
}

/**
 * Generate HTML string for Modern Professional template
 */
function renderModernTemplate(resume: ResumeDetailed): string {
  const p = resume.profile;
  const accent = '#4F46E5';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(p?.fullName || 'Resume')}</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 16mm 16mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      background: #FFFFFF;
      font-size: 10.5pt;
      line-height: 1.45;
      padding: 4px;
    }
    .header {
      border-bottom: 2px solid ${accent};
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .name {
      font-size: 24pt;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }
    .title {
      font-size: 12pt;
      font-weight: 600;
      color: ${accent};
      margin-top: 4px;
    }
    .contact-bar {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 9pt;
      color: #475569;
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
    }
    .contact-item a {
      color: #475569;
      text-decoration: none;
    }
    .section {
      margin-bottom: 15px;
      page-break-inside: auto;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: ${accent};
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }
    .item-card {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 11pt;
      font-weight: 600;
      color: #0F172A;
    }
    .item-subtitle {
      font-size: 10pt;
      font-weight: 500;
      color: #475569;
      margin-top: 1px;
    }
    .item-date {
      font-size: 8.5pt;
      font-weight: 600;
      color: #64748B;
      text-align: right;
    }
    .item-meta {
      font-size: 8.5pt;
      color: #64748B;
      margin-top: 1px;
    }
    .tech-tag {
      font-size: 8.5pt;
      font-weight: 600;
      color: ${accent};
      margin-top: 2px;
    }
    .bullet-list {
      list-style-type: square;
      padding-left: 18px;
      margin-top: 4px;
    }
    .bullet-list li {
      margin-bottom: 3px;
      font-size: 9.5pt;
      color: #334155;
    }
    .desc-para {
      font-size: 9.5pt;
      color: #334155;
      margin-top: 3px;
    }
    .skills-table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: avoid;
    }
    .skills-row td {
      padding: 3px 0;
      font-size: 9.5pt;
      vertical-align: top;
    }
    .skill-cat {
      width: 25%;
      font-weight: 700;
      color: #1E293B;
    }
    .skill-list {
      width: 75%;
      color: #334155;
    }
    .summary-text {
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="name">${escapeHtml(p?.fullName || 'Full Name')}</div>
    ${p?.professionalTitle ? `<div class="title">${escapeHtml(p.professionalTitle)}</div>` : ''}
    <div class="contact-bar">
      ${p?.email ? `<span class="contact-item">${escapeHtml(p.email)}</span>` : ''}
      ${p?.phone ? `<span class="contact-item">• ${escapeHtml(p.phone)}</span>` : ''}
      ${p?.location ? `<span class="contact-item">• ${escapeHtml(p.location)}</span>` : ''}
      ${p?.linkedinUrl ? `<span class="contact-item">• ${escapeHtml(p.linkedinUrl.replace('https://', ''))}</span>` : ''}
      ${p?.githubUrl ? `<span class="contact-item">• ${escapeHtml(p.githubUrl.replace('https://', ''))}</span>` : ''}
      ${p?.portfolioUrl ? `<span class="contact-item">• ${escapeHtml(p.portfolioUrl.replace('https://', ''))}</span>` : ''}
    </div>
  </div>

  <!-- Summary -->
  ${p?.summary ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <div class="summary-text">${escapeHtml(p.summary)}</div>
    </div>
  ` : ''}

  <!-- Education -->
  ${resume.education.length > 0 ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${resume.education.map((e) => `
        <div class="item-card">
          <div class="item-header">
            <span class="item-title">${escapeHtml(e.institution)}</span>
            <span class="item-date">${escapeHtml([e.startDate, e.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          <div class="item-subtitle">${escapeHtml(e.degree)}${e.fieldOfStudy ? ` in ${escapeHtml(e.fieldOfStudy)}` : ''}</div>
          ${e.grade || e.location ? `<div class="item-meta">${[e.grade, e.location].filter(Boolean).map(escapeHtml).join(' | ')}</div>` : ''}
          ${e.description ? formatBulletPoints(e.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Technical Skills -->
  ${resume.skills.length > 0 ? `
    <div class="section">
      <div class="section-title">Technical Skills</div>
      <table class="skills-table">
        ${resume.skills.map((s) => `
          <tr class="skills-row">
            <td class="skill-cat">${escapeHtml(s.category)}:</td>
            <td class="skill-list">${escapeHtml(s.skills)}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  ` : ''}

  <!-- Experience & Internships -->
  ${resume.experience.length > 0 ? `
    <div class="section">
      <div class="section-title">Professional Experience</div>
      ${resume.experience.map((e) => `
        <div class="item-card">
          <div class="item-header">
            <span class="item-title">${escapeHtml(e.position)}</span>
            <span class="item-date">${escapeHtml([e.startDate, e.isCurrent ? 'Present' : e.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          <div class="item-subtitle">${escapeHtml(e.company)}${e.isInternship ? ' (Internship)' : ''}${e.location ? ` | ${escapeHtml(e.location)}` : ''}</div>
          ${e.description ? formatBulletPoints(e.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Projects -->
  ${resume.projects.length > 0 ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${resume.projects.map((pr) => `
        <div class="item-card">
          <div class="item-header">
            <span class="item-title">${escapeHtml(pr.title)}</span>
            <span class="item-date">${escapeHtml([pr.startDate, pr.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          ${pr.techStack ? `<div class="tech-tag">Tech Stack: ${escapeHtml(pr.techStack)}</div>` : ''}
          ${pr.githubUrl || pr.liveUrl ? `<div class="item-meta">${[pr.githubUrl, pr.liveUrl].filter(Boolean).map(escapeHtml).join(' | ')}</div>` : ''}
          ${pr.description ? formatBulletPoints(pr.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Certifications -->
  ${resume.certifications.length > 0 ? `
    <div class="section">
      <div class="section-title">Certifications</div>
      ${resume.certifications.map((c) => `
        <div class="item-card">
          <div class="item-header">
            <span class="item-title">${escapeHtml(c.name)}</span>
            <span class="item-date">${escapeHtml(c.issueDate || '')}</span>
          </div>
          <div class="item-subtitle">${escapeHtml(c.issuer)}${c.credentialId ? ` • ID: ${escapeHtml(c.credentialId)}` : ''}</div>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Achievements -->
  ${resume.achievements.length > 0 ? `
    <div class="section">
      <div class="section-title">Achievements & Extracurricular</div>
      ${resume.achievements.map((a) => `
        <div class="item-card">
          <div class="item-header">
            <span class="item-title">${escapeHtml(a.title)}</span>
            ${a.date ? `<span class="item-date">${escapeHtml(a.date)}</span>` : ''}
          </div>
          ${a.description ? `<div class="desc-para">${escapeHtml(a.description)}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}
</body>
</html>
  `;
}

/**
 * Generate HTML string for Minimal ATS template (Pure single-column black & white)
 */
function renderMinimalAtsTemplate(resume: ResumeDetailed): string {
  const p = resume.profile;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(p?.fullName || 'Resume')}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: "Times New Roman", Times, Georgia, serif;
      color: #000000;
      background: #FFFFFF;
      font-size: 10.5pt;
      line-height: 1.4;
      padding: 2px;
    }
    .header {
      text-align: center;
      margin-bottom: 14px;
      border-bottom: 1px solid #000000;
      padding-bottom: 8px;
    }
    .name {
      font-size: 22pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .contact-line {
      font-size: 9.5pt;
      margin-top: 4px;
    }
    .section {
      margin-bottom: 14px;
      page-break-inside: auto;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #333333;
      padding-bottom: 2px;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }
    .item-card {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
    }
    .bold-title {
      font-weight: bold;
    }
    .italic-subtitle {
      font-style: italic;
    }
    .date-text {
      font-weight: normal;
      text-align: right;
    }
    .bullet-list {
      padding-left: 20px;
      margin-top: 3px;
    }
    .bullet-list li {
      margin-bottom: 2px;
      font-size: 9.5pt;
    }
    .desc-para {
      font-size: 9.5pt;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="name">${escapeHtml(p?.fullName || 'Full Name')}</div>
    <div class="contact-line">
      ${[p?.email, p?.phone, p?.location, p?.linkedinUrl, p?.githubUrl].filter(Boolean).map(escapeHtml).join(' | ')}
    </div>
  </div>

  <!-- Summary -->
  ${p?.summary ? `
    <div class="section">
      <div class="section-title">Summary</div>
      <p class="desc-para">${escapeHtml(p.summary)}</p>
    </div>
  ` : ''}

  <!-- Education -->
  ${resume.education.length > 0 ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${resume.education.map((e) => `
        <div class="item-card">
          <div class="item-row">
            <span class="bold-title">${escapeHtml(e.institution)}</span>
            <span class="date-text">${escapeHtml([e.startDate, e.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          <div class="item-row">
            <span class="italic-subtitle">${escapeHtml(e.degree)}${e.fieldOfStudy ? `, ${escapeHtml(e.fieldOfStudy)}` : ''}</span>
            <span class="date-text">${escapeHtml(e.grade || e.location || '')}</span>
          </div>
          ${e.description ? formatBulletPoints(e.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Skills -->
  ${resume.skills.length > 0 ? `
    <div class="section">
      <div class="section-title">Technical Skills</div>
      ${resume.skills.map((s) => `
        <div class="desc-para">
          <span class="bold-title">${escapeHtml(s.category)}:</span> ${escapeHtml(s.skills)}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Experience -->
  ${resume.experience.length > 0 ? `
    <div class="section">
      <div class="section-title">Experience</div>
      ${resume.experience.map((e) => `
        <div class="item-card">
          <div class="item-row">
            <span class="bold-title">${escapeHtml(e.company)}</span>
            <span class="date-text">${escapeHtml([e.startDate, e.isCurrent ? 'Present' : e.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          <div class="italic-subtitle">${escapeHtml(e.position)}${e.location ? ` - ${escapeHtml(e.location)}` : ''}</div>
          ${e.description ? formatBulletPoints(e.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Projects -->
  ${resume.projects.length > 0 ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${resume.projects.map((pr) => `
        <div class="item-card">
          <div class="item-row">
            <span class="bold-title">${escapeHtml(pr.title)}</span>
            <span class="date-text">${escapeHtml([pr.startDate, pr.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          ${pr.techStack ? `<div class="italic-subtitle">Tools/Tech: ${escapeHtml(pr.techStack)}</div>` : ''}
          ${pr.description ? formatBulletPoints(pr.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Certifications & Achievements -->
  ${(resume.certifications.length > 0 || resume.achievements.length > 0) ? `
    <div class="section">
      <div class="section-title">Certifications & Honors</div>
      <ul class="bullet-list">
        ${resume.certifications.map((c) => `
          <li><span class="bold-title">${escapeHtml(c.name)}</span> - ${escapeHtml(c.issuer)} (${escapeHtml(c.issueDate || '')})</li>
        `).join('')}
        ${resume.achievements.map((a) => `
          <li><span class="bold-title">${escapeHtml(a.title)}</span>: ${escapeHtml(a.description || '')}</li>
        `).join('')}
      </ul>
    </div>
  ` : ''}
</body>
</html>
  `;
}

/**
 * Generate HTML string for Technical Developer template (Highlighting Tech, Repos, Architecture)
 */
function renderTechnicalTemplate(resume: ResumeDetailed): string {
  const p = resume.profile;
  const accent = '#0284C7';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(p?.fullName || 'Resume')}</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 16mm 16mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      font-size: 10pt;
      line-height: 1.45;
    }
    .header {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 14px 16px;
      margin-bottom: 14px;
    }
    .name-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .name {
      font-size: 22pt;
      font-weight: 800;
      color: #0F172A;
      font-family: "SF Pro Display", -apple-system, sans-serif;
    }
    .role-badge {
      background: #E0F2FE;
      color: ${accent};
      font-size: 9.5pt;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 4px;
    }
    .links-bar {
      margin-top: 8px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
      color: #475569;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .section {
      margin-bottom: 14px;
      page-break-inside: auto;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 4px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .item-box {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .title-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0F172A;
    }
    .item-date {
      font-size: 8.5pt;
      font-weight: 600;
      color: #64748B;
    }
    .tech-stack-row {
      display: inline-block;
      background: #F1F5F9;
      color: #0F172A;
      font-family: ui-monospace, monospace;
      font-size: 8.5pt;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px;
      margin: 2px 0 4px 0;
    }
    .bullet-list {
      padding-left: 18px;
      margin-top: 3px;
    }
    .bullet-list li {
      font-size: 9pt;
      color: #334155;
      margin-bottom: 2px;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4px;
      page-break-inside: avoid;
    }
    .skill-entry {
      font-size: 9pt;
    }
    .skill-lbl {
      font-weight: 700;
      color: #0F172A;
    }
    .skill-val {
      color: #334155;
    }
  </style>
</head>
<body>
  <!-- Tech Header -->
  <div class="header">
    <div class="name-row">
      <span class="name">${escapeHtml(p?.fullName || 'Full Name')}</span>
      ${p?.professionalTitle ? `<span class="role-badge">${escapeHtml(p.professionalTitle)}</span>` : ''}
    </div>
    <div class="links-bar">
      ${p?.email ? `<span>email:${escapeHtml(p.email)}</span>` : ''}
      ${p?.phone ? `<span>tel:${escapeHtml(p.phone)}</span>` : ''}
      ${p?.location ? `<span>loc:${escapeHtml(p.location)}</span>` : ''}
      ${p?.githubUrl ? `<span>git:${escapeHtml(p.githubUrl.replace('https://github.com/', ''))}</span>` : ''}
      ${p?.portfolioUrl ? `<span>web:${escapeHtml(p.portfolioUrl.replace('https://', ''))}</span>` : ''}
    </div>
  </div>

  <!-- Technical Skills Top Focus -->
  ${resume.skills.length > 0 ? `
    <div class="section">
      <div class="section-header">
        <span class="section-title">Technical Expertise</span>
      </div>
      <div class="skills-grid">
        ${resume.skills.map((s) => `
          <div class="skill-entry">
            <span class="skill-lbl">${escapeHtml(s.category)}:</span>
            <span class="skill-val">${escapeHtml(s.skills)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : ''}

  <!-- Projects Focus -->
  ${resume.projects.length > 0 ? `
    <div class="section">
      <div class="section-header">
        <span class="section-title">Core Engineering Projects</span>
      </div>
      ${resume.projects.map((pr) => `
        <div class="item-box">
          <div class="title-line">
            <span class="item-title">${escapeHtml(pr.title)}</span>
            <span class="item-date">${escapeHtml([pr.startDate, pr.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          ${pr.techStack ? `<div class="tech-stack-row">[ ${escapeHtml(pr.techStack)} ]</div>` : ''}
          ${pr.description ? formatBulletPoints(pr.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Experience -->
  ${resume.experience.length > 0 ? `
    <div class="section">
      <div class="section-header">
        <span class="section-title">Experience & Internships</span>
      </div>
      ${resume.experience.map((e) => `
        <div class="item-box">
          <div class="title-line">
            <span class="item-title">${escapeHtml(e.position)} @ ${escapeHtml(e.company)}</span>
            <span class="item-date">${escapeHtml([e.startDate, e.isCurrent ? 'Present' : e.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          ${e.description ? formatBulletPoints(e.description) : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Education -->
  ${resume.education.length > 0 ? `
    <div class="section">
      <div class="section-header">
        <span class="section-title">Education</span>
      </div>
      ${resume.education.map((e) => `
        <div class="item-box">
          <div class="title-line">
            <span class="item-title">${escapeHtml(e.institution)}</span>
            <span class="item-date">${escapeHtml([e.startDate, e.endDate].filter(Boolean).join(' - '))}</span>
          </div>
          <div>${escapeHtml(e.degree)}${e.fieldOfStudy ? ` • ${escapeHtml(e.fieldOfStudy)}` : ''} ${e.grade ? `(${escapeHtml(e.grade)})` : ''}</div>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- Certifications & Honors -->
  ${(resume.certifications.length > 0 || resume.achievements.length > 0) ? `
    <div class="section">
      <div class="section-header">
        <span class="section-title">Certifications & Competitions</span>
      </div>
      <ul class="bullet-list">
        ${resume.certifications.map((c) => `
          <li><strong>${escapeHtml(c.name)}</strong> - ${escapeHtml(c.issuer)}</li>
        `).join('')}
        ${resume.achievements.map((a) => `
          <li><strong>${escapeHtml(a.title)}</strong>: ${escapeHtml(a.description || '')}</li>
        `).join('')}
      </ul>
    </div>
  ` : ''}
</body>
</html>
  `;
}

/**
 * Generate PDF file using expo-print
 */
export async function generateResumePdf(
  resume: ResumeDetailed,
  templateId: TemplateId = 'modern'
): Promise<{ uri: string; numberOfPages: number }> {
  let html = '';
  switch (templateId) {
    case 'minimal':
      html = renderMinimalAtsTemplate(resume);
      break;
    case 'technical':
      html = renderTechnicalTemplate(resume);
      break;
    case 'modern':
    default:
      html = renderModernTemplate(resume);
      break;
  }

  // A4 standard points: width 595, height 842
  const file = await Print.printToFileAsync({
    html,
    width: 595,
    height: 842,
    base64: false,
  });

  return {
    uri: file.uri,
    numberOfPages: file.numberOfPages || 1,
  };
}

/**
 * Share PDF file using expo-sharing
 */
export async function shareResumePdf(pdfUri: string, resumeTitle: string = 'Resume'): Promise<boolean> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Native sharing is not supported on this platform.');
  }

  await Sharing.shareAsync(pdfUri, {
    mimeType: 'application/pdf',
    dialogTitle: `Share ${resumeTitle}`,
    UTI: 'com.adobe.pdf',
  });

  return true;
}
