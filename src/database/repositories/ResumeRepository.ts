import { getRawDb } from '../client';
import { generateUUID } from '@/utils/uuid';
import {
  Resume,
  ResumeProfile,
  ResumeSection,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
  ResumeCertification,
  ResumeAchievement,
  ResumeVersion,
  ResumeJobMatch,
  ResumeImportedFile,
} from '../schema/resume';
import { DEFAULT_RESUME_SECTIONS } from '../seed/defaultResume';

export interface ResumeDetailed extends Resume {
  profile: ResumeProfile | null;
  sections: ResumeSection[];
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
  versions: ResumeVersion[];
  jobMatches: ResumeJobMatch[];
  importedFiles: ResumeImportedFile[];
}

export interface ResumeSummary extends Resume {
  fullName?: string;
  email?: string;
  phone?: string;
}

export class ResumeRepository {
  /**
   * Get all resumes sorted by default first, then updated_at descending
   */
  async getAllResumes(): Promise<ResumeSummary[]> {
    const rawDb = getRawDb();
    const rows = rawDb.getAllSync<any>(`
      SELECT 
        r.*,
        p.full_name as fullName,
        p.email as email,
        p.phone as phone
      FROM resumes r
      LEFT JOIN resume_profiles p ON r.id = p.resume_id
      ORDER BY r.is_default DESC, r.updated_at DESC;
    `);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      targetRole: row.target_role,
      templateId: row.template_id,
      isDefault: row.is_default,
      versionName: row.version_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
    }));
  }

  /**
   * Get full resume with all children
   */
  async getResumeDetailed(resumeId: string): Promise<ResumeDetailed | null> {
    const rawDb = getRawDb();

    const resumeRow = rawDb.getFirstSync<any>(
      'SELECT * FROM resumes WHERE id = ?;',
      [resumeId]
    );
    if (!resumeRow) return null;

    const resume: Resume = {
      id: resumeRow.id,
      title: resumeRow.title,
      targetRole: resumeRow.target_role,
      templateId: resumeRow.template_id,
      isDefault: resumeRow.is_default,
      versionName: resumeRow.version_name,
      createdAt: resumeRow.created_at,
      updatedAt: resumeRow.updated_at,
    };

    const profileRow = rawDb.getFirstSync<any>(
      'SELECT * FROM resume_profiles WHERE resume_id = ?;',
      [resumeId]
    );
    const profile: ResumeProfile | null = profileRow
      ? {
          id: profileRow.id,
          resumeId: profileRow.resume_id,
          fullName: profileRow.full_name,
          professionalTitle: profileRow.professional_title,
          email: profileRow.email,
          phone: profileRow.phone,
          location: profileRow.location,
          linkedinUrl: profileRow.linkedin_url,
          githubUrl: profileRow.github_url,
          portfolioUrl: profileRow.portfolio_url,
          summary: profileRow.summary,
          createdAt: profileRow.created_at,
          updatedAt: profileRow.updated_at,
        }
      : null;

    const sectionRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_sections WHERE resume_id = ? ORDER BY order_index ASC;',
      [resumeId]
    );
    const sections: ResumeSection[] = sectionRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      sectionKey: r.section_key,
      title: r.title,
      orderIndex: r.order_index,
      isVisible: r.is_visible,
    }));

    const eduRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_education WHERE resume_id = ? ORDER BY order_index ASC, created_at DESC;',
      [resumeId]
    );
    const education: ResumeEducation[] = eduRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      institution: r.institution,
      degree: r.degree,
      fieldOfStudy: r.field_of_study,
      location: r.location,
      startDate: r.start_date,
      endDate: r.end_date,
      grade: r.grade,
      description: r.description,
      orderIndex: r.order_index,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const expRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_experience WHERE resume_id = ? ORDER BY order_index ASC, created_at DESC;',
      [resumeId]
    );
    const experience: ResumeExperience[] = expRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      isInternship: r.is_internship,
      company: r.company,
      position: r.position,
      location: r.location,
      startDate: r.start_date,
      endDate: r.end_date,
      isCurrent: r.is_current,
      description: r.description,
      orderIndex: r.order_index,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const projRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_projects WHERE resume_id = ? ORDER BY order_index ASC, created_at DESC;',
      [resumeId]
    );
    const projects: ResumeProject[] = projRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      title: r.title,
      subtitle: r.subtitle,
      techStack: r.tech_stack,
      liveUrl: r.live_url,
      githubUrl: r.github_url,
      startDate: r.start_date,
      endDate: r.end_date,
      description: r.description,
      orderIndex: r.order_index,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const skillRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_skills WHERE resume_id = ? ORDER BY order_index ASC, created_at ASC;',
      [resumeId]
    );
    const skills: ResumeSkill[] = skillRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      category: r.category,
      skills: r.skills,
      proficiency: r.proficiency,
      isSoftSkill: r.is_soft_skill,
      orderIndex: r.order_index,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const certRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_certifications WHERE resume_id = ? ORDER BY order_index ASC, created_at DESC;',
      [resumeId]
    );
    const certifications: ResumeCertification[] = certRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      name: r.name,
      issuer: r.issuer,
      issueDate: r.issue_date,
      expiryDate: r.expiry_date,
      credentialId: r.credential_id,
      credentialUrl: r.credential_url,
      orderIndex: r.order_index,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const achRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_achievements WHERE resume_id = ? ORDER BY order_index ASC, created_at DESC;',
      [resumeId]
    );
    const achievements: ResumeAchievement[] = achRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      title: r.title,
      date: r.date,
      description: r.description,
      type: r.type,
      orderIndex: r.order_index,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const verRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_versions WHERE resume_id = ? ORDER BY created_at DESC;',
      [resumeId]
    );
    const versions: ResumeVersion[] = verRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      versionLabel: r.version_label,
      snapshotData: r.snapshot_data,
      createdAt: r.created_at,
    }));

    const matchRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_job_matches WHERE resume_id = ? ORDER BY created_at DESC;',
      [resumeId]
    );
    const jobMatches: ResumeJobMatch[] = matchRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      companyName: r.company_name,
      jobTitle: r.job_title,
      jobDescription: r.job_description,
      matchScore: r.match_score,
      matchedKeywords: r.matched_keywords,
      missingKeywords: r.missing_keywords,
      recommendations: r.recommendations,
      createdAt: r.created_at,
    }));

    const fileRows = rawDb.getAllSync<any>(
      'SELECT * FROM resume_imported_files WHERE resume_id = ? ORDER BY imported_at DESC;',
      [resumeId]
    );
    const importedFiles: ResumeImportedFile[] = fileRows.map((r) => ({
      id: r.id,
      resumeId: r.resume_id,
      fileName: r.file_name,
      fileUri: r.file_uri,
      fileSize: r.file_size,
      importedAt: r.imported_at,
    }));

    return {
      ...resume,
      profile,
      sections,
      education,
      experience,
      projects,
      skills,
      certifications,
      achievements,
      versions,
      jobMatches,
      importedFiles,
    };
  }

  /**
   * Create a new blank or templated resume
   */
  async createResume(data: {
    title: string;
    targetRole?: string;
    templateId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  }): Promise<string> {
    const rawDb = getRawDb();
    const resumeId = generateUUID();
    const profileId = generateUUID();
    const now = Date.now();

    // Check if first resume -> make default
    const countRow = rawDb.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM resumes;'
    );
    const isDefault = !countRow || countRow.count === 0 ? 1 : 0;

    rawDb.execSync('BEGIN TRANSACTION;');
    try {
      rawDb.runSync(
        `INSERT INTO resumes (id, title, target_role, template_id, is_default, version_name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'v1.0', ?, ?);`,
        [resumeId, data.title, data.targetRole || '', data.templateId || 'modern', isDefault, now, now]
      );

      rawDb.runSync(
        `INSERT INTO resume_profiles (id, resume_id, full_name, professional_title, email, phone, location, linkedin_url, github_url, portfolio_url, summary, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, '', '', '', ?, ?, ?);`,
        [
          profileId,
          resumeId,
          data.fullName || 'Your Name',
          data.targetRole || '',
          data.email || '',
          data.phone || '',
          data.location || '',
          data.summary || '',
          now,
          now,
        ]
      );

      for (const sec of DEFAULT_RESUME_SECTIONS) {
        rawDb.runSync(
          `INSERT INTO resume_sections (id, resume_id, section_key, title, order_index, is_visible)
           VALUES (?, ?, ?, ?, ?, ?);`,
          [generateUUID(), resumeId, sec.sectionKey, sec.title, sec.orderIndex, sec.isVisible]
        );
      }

      rawDb.execSync('COMMIT;');
      return resumeId;
    } catch (e) {
      rawDb.execSync('ROLLBACK;');
      throw e;
    }
  }

  /**
   * Duplicate an existing resume with all items
   */
  async duplicateResume(sourceResumeId: string, newTitle: string): Promise<string> {
    const rawDb = getRawDb();
    const source = await this.getResumeDetailed(sourceResumeId);
    if (!source) throw new Error('Source resume not found');

    const newResumeId = generateUUID();
    const now = Date.now();

    rawDb.execSync('BEGIN TRANSACTION;');
    try {
      // 1. Resume
      rawDb.runSync(
        `INSERT INTO resumes (id, title, target_role, template_id, is_default, version_name, created_at, updated_at)
         VALUES (?, ?, ?, ?, 0, ?, ?, ?);`,
        [newResumeId, newTitle, source.targetRole, source.templateId, source.versionName, now, now]
      );

      // 2. Profile
      if (source.profile) {
        rawDb.runSync(
          `INSERT INTO resume_profiles (id, resume_id, full_name, professional_title, email, phone, location, linkedin_url, github_url, portfolio_url, summary, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            newResumeId,
            source.profile.fullName,
            source.profile.professionalTitle,
            source.profile.email,
            source.profile.phone,
            source.profile.location,
            source.profile.linkedinUrl,
            source.profile.githubUrl,
            source.profile.portfolioUrl,
            source.profile.summary,
            now,
            now,
          ]
        );
      }

      // 3. Sections
      for (const sec of source.sections) {
        rawDb.runSync(
          `INSERT INTO resume_sections (id, resume_id, section_key, title, order_index, is_visible)
           VALUES (?, ?, ?, ?, ?, ?);`,
          [generateUUID(), newResumeId, sec.sectionKey, sec.title, sec.orderIndex, sec.isVisible]
        );
      }

      // 4. Education
      for (const edu of source.education) {
        rawDb.runSync(
          `INSERT INTO resume_education (id, resume_id, institution, degree, field_of_study, location, start_date, end_date, grade, description, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            newResumeId,
            edu.institution,
            edu.degree,
            edu.fieldOfStudy,
            edu.location,
            edu.startDate,
            edu.endDate,
            edu.grade,
            edu.description,
            edu.orderIndex,
            now,
            now,
          ]
        );
      }

      // 5. Experience
      for (const exp of source.experience) {
        rawDb.runSync(
          `INSERT INTO resume_experience (id, resume_id, is_internship, company, position, location, start_date, end_date, is_current, description, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            newResumeId,
            exp.isInternship,
            exp.company,
            exp.position,
            exp.location,
            exp.startDate,
            exp.endDate,
            exp.isCurrent,
            exp.description,
            exp.orderIndex,
            now,
            now,
          ]
        );
      }

      // 6. Projects
      for (const proj of source.projects) {
        rawDb.runSync(
          `INSERT INTO resume_projects (id, resume_id, title, subtitle, tech_stack, live_url, github_url, start_date, end_date, description, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            newResumeId,
            proj.title,
            proj.subtitle,
            proj.techStack,
            proj.liveUrl,
            proj.githubUrl,
            proj.startDate,
            proj.endDate,
            proj.description,
            proj.orderIndex,
            now,
            now,
          ]
        );
      }

      // 7. Skills
      for (const sk of source.skills) {
        rawDb.runSync(
          `INSERT INTO resume_skills (id, resume_id, category, skills, proficiency, is_soft_skill, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            newResumeId,
            sk.category,
            sk.skills,
            sk.proficiency,
            sk.isSoftSkill,
            sk.orderIndex,
            now,
            now,
          ]
        );
      }

      // 8. Certifications
      for (const cert of source.certifications) {
        rawDb.runSync(
          `INSERT INTO resume_certifications (id, resume_id, name, issuer, issue_date, expiry_date, credential_id, credential_url, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            newResumeId,
            cert.name,
            cert.issuer,
            cert.issueDate,
            cert.expiryDate,
            cert.credentialId,
            cert.credentialUrl,
            cert.orderIndex,
            now,
            now,
          ]
        );
      }

      // 9. Achievements
      for (const ach of source.achievements) {
        rawDb.runSync(
          `INSERT INTO resume_achievements (id, resume_id, title, date, description, type, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            newResumeId,
            ach.title,
            ach.date,
            ach.description,
            ach.type,
            ach.orderIndex,
            now,
            now,
          ]
        );
      }

      // 10. Initial snapshot for duplicate
      const duplicateSnapshot = {
        resume: { title: newTitle, targetRole: source.targetRole, templateId: source.templateId, versionName: 'v1.0' },
        profile: source.profile,
        sections: source.sections,
        education: source.education,
        experience: source.experience,
        projects: source.projects,
        skills: source.skills,
        certifications: source.certifications,
        achievements: source.achievements,
      };

      rawDb.runSync(
        `INSERT INTO resume_versions (id, resume_id, version_label, snapshot_data, created_at)
         VALUES (?, ?, ?, ?, ?);`,
        [generateUUID(), newResumeId, 'Initial Duplicate Snapshot', JSON.stringify(duplicateSnapshot), now]
      );

      rawDb.execSync('COMMIT;');
      return newResumeId;
    } catch (e) {
      rawDb.execSync('ROLLBACK;');
      throw e;
    }
  }

  /**
   * Update resume metadata
   */
  async updateResume(
    id: string,
    data: {
      title?: string;
      targetRole?: string;
      templateId?: string;
      versionName?: string;
    }
  ): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();
    const sets: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    if (data.title !== undefined) {
      sets.push('title = ?');
      values.push(data.title);
    }
    if (data.targetRole !== undefined) {
      sets.push('target_role = ?');
      values.push(data.targetRole);
    }
    if (data.templateId !== undefined) {
      sets.push('template_id = ?');
      values.push(data.templateId);
    }
    if (data.versionName !== undefined) {
      sets.push('version_name = ?');
      values.push(data.versionName);
    }

    values.push(id);
    rawDb.runSync(`UPDATE resumes SET ${sets.join(', ')} WHERE id = ?;`, values);
  }

  /**
   * Set resume as default
   */
  async setDefaultResume(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.execSync('BEGIN TRANSACTION;');
    try {
      rawDb.runSync('UPDATE resumes SET is_default = 0;');
      rawDb.runSync('UPDATE resumes SET is_default = 1, updated_at = ? WHERE id = ?;', [Date.now(), id]);
      rawDb.execSync('COMMIT;');
    } catch (e) {
      rawDb.execSync('ROLLBACK;');
      throw e;
    }
  }

  /**
   * Delete resume
   */
  async deleteResume(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resumes WHERE id = ?;', [id]);
  }

  /**
   * Update profile details
   */
  async updateProfile(
    resumeId: string,
    profileData: Partial<Omit<ResumeProfile, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();

    const existing = rawDb.getFirstSync<any>(
      'SELECT id FROM resume_profiles WHERE resume_id = ?;',
      [resumeId]
    );

    if (existing) {
      const sets: string[] = ['updated_at = ?'];
      const values: any[] = [now];

      for (const [key, val] of Object.entries(profileData)) {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        sets.push(`${snakeKey} = ?`);
        values.push(val ?? '');
      }
      values.push(resumeId);

      rawDb.runSync(`UPDATE resume_profiles SET ${sets.join(', ')} WHERE resume_id = ?;`, values);
    } else {
      rawDb.runSync(
        `INSERT INTO resume_profiles (id, resume_id, full_name, professional_title, email, phone, location, linkedin_url, github_url, portfolio_url, summary, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          generateUUID(),
          resumeId,
          profileData.fullName || '',
          profileData.professionalTitle || '',
          profileData.email || '',
          profileData.phone || '',
          profileData.location || '',
          profileData.linkedinUrl || '',
          profileData.githubUrl || '',
          profileData.portfolioUrl || '',
          profileData.summary || '',
          now,
          now,
        ]
      );
    }

    // Touch resume updated_at
    rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [now, resumeId]);
  }

  /**
   * Reorder or toggle section visibility
   */
  async updateSectionsOrderAndVisibility(
    resumeId: string,
    sections: { sectionKey: string; title: string; orderIndex: number; isVisible: number }[]
  ): Promise<void> {
    const rawDb = getRawDb();
    rawDb.execSync('BEGIN TRANSACTION;');
    try {
      for (const sec of sections) {
        const existing = rawDb.getFirstSync<any>(
          'SELECT id FROM resume_sections WHERE resume_id = ? AND section_key = ?;',
          [resumeId, sec.sectionKey]
        );
        if (existing) {
          rawDb.runSync(
            'UPDATE resume_sections SET order_index = ?, is_visible = ?, title = ? WHERE id = ?;',
            [sec.orderIndex, sec.isVisible, sec.title, existing.id]
          );
        } else {
          rawDb.runSync(
            `INSERT INTO resume_sections (id, resume_id, section_key, title, order_index, is_visible)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [generateUUID(), resumeId, sec.sectionKey, sec.title, sec.orderIndex, sec.isVisible]
          );
        }
      }
      rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [Date.now(), resumeId]);
      rawDb.execSync('COMMIT;');
    } catch (e) {
      rawDb.execSync('ROLLBACK;');
      throw e;
    }
  }

  // =================== EDUCATION CRUD ===================

  async addEducation(resumeId: string, data: Omit<ResumeEducation, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();
    rawDb.runSync(
      `INSERT INTO resume_education (id, resume_id, institution, degree, field_of_study, location, start_date, end_date, grade, description, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, resumeId, data.institution, data.degree, data.fieldOfStudy || '', data.location || '', data.startDate || '', data.endDate || '', data.grade || '', data.description || '', data.orderIndex || 0, now, now]
    );
    rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [now, resumeId]);
    return id;
  }

  async updateEducation(id: string, data: Partial<Omit<ResumeEducation, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();
    const sets: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    for (const [key, val] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      sets.push(`${snakeKey} = ?`);
      values.push(val ?? '');
    }
    values.push(id);

    rawDb.runSync(`UPDATE resume_education SET ${sets.join(', ')} WHERE id = ?;`, values);
  }

  async deleteEducation(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_education WHERE id = ?;', [id]);
  }

  // =================== EXPERIENCE CRUD ===================

  async addExperience(resumeId: string, data: Omit<ResumeExperience, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();
    rawDb.runSync(
      `INSERT INTO resume_experience (id, resume_id, is_internship, company, position, location, start_date, end_date, is_current, description, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, resumeId, data.isInternship, data.company, data.position, data.location || '', data.startDate || '', data.endDate || '', data.isCurrent || 0, data.description || '', data.orderIndex || 0, now, now]
    );
    rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [now, resumeId]);
    return id;
  }

  async updateExperience(id: string, data: Partial<Omit<ResumeExperience, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();
    const sets: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    for (const [key, val] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      sets.push(`${snakeKey} = ?`);
      values.push(val ?? '');
    }
    values.push(id);

    rawDb.runSync(`UPDATE resume_experience SET ${sets.join(', ')} WHERE id = ?;`, values);
  }

  async deleteExperience(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_experience WHERE id = ?;', [id]);
  }

  // =================== PROJECTS CRUD ===================

  async addProject(resumeId: string, data: Omit<ResumeProject, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();
    rawDb.runSync(
      `INSERT INTO resume_projects (id, resume_id, title, subtitle, tech_stack, live_url, github_url, start_date, end_date, description, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, resumeId, data.title, data.subtitle || '', data.techStack || '', data.liveUrl || '', data.githubUrl || '', data.startDate || '', data.endDate || '', data.description || '', data.orderIndex || 0, now, now]
    );
    rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [now, resumeId]);
    return id;
  }

  async updateProject(id: string, data: Partial<Omit<ResumeProject, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();
    const sets: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    for (const [key, val] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      sets.push(`${snakeKey} = ?`);
      values.push(val ?? '');
    }
    values.push(id);

    rawDb.runSync(`UPDATE resume_projects SET ${sets.join(', ')} WHERE id = ?;`, values);
  }

  async deleteProject(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_projects WHERE id = ?;', [id]);
  }

  // =================== SKILLS CRUD ===================

  async addSkill(resumeId: string, data: Omit<ResumeSkill, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();
    rawDb.runSync(
      `INSERT INTO resume_skills (id, resume_id, category, skills, proficiency, is_soft_skill, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, resumeId, data.category, data.skills, data.proficiency || 'Advanced', data.isSoftSkill || 0, data.orderIndex || 0, now, now]
    );
    rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [now, resumeId]);
    return id;
  }

  async updateSkill(id: string, data: Partial<Omit<ResumeSkill, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();
    const sets: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    for (const [key, val] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      sets.push(`${snakeKey} = ?`);
      values.push(val ?? '');
    }
    values.push(id);

    rawDb.runSync(`UPDATE resume_skills SET ${sets.join(', ')} WHERE id = ?;`, values);
  }

  async deleteSkill(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_skills WHERE id = ?;', [id]);
  }

  // =================== CERTIFICATIONS CRUD ===================

  async addCertification(resumeId: string, data: Omit<ResumeCertification, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();
    rawDb.runSync(
      `INSERT INTO resume_certifications (id, resume_id, name, issuer, issue_date, expiry_date, credential_id, credential_url, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, resumeId, data.name, data.issuer, data.issueDate || '', data.expiryDate || '', data.credentialId || '', data.credentialUrl || '', data.orderIndex || 0, now, now]
    );
    rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [now, resumeId]);
    return id;
  }

  async updateCertification(id: string, data: Partial<Omit<ResumeCertification, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();
    const sets: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    for (const [key, val] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      sets.push(`${snakeKey} = ?`);
      values.push(val ?? '');
    }
    values.push(id);

    rawDb.runSync(`UPDATE resume_certifications SET ${sets.join(', ')} WHERE id = ?;`, values);
  }

  async deleteCertification(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_certifications WHERE id = ?;', [id]);
  }

  // =================== ACHIEVEMENTS CRUD ===================

  async addAchievement(resumeId: string, data: Omit<ResumeAchievement, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();
    rawDb.runSync(
      `INSERT INTO resume_achievements (id, resume_id, title, date, description, type, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, resumeId, data.title, data.date || '', data.description || '', data.type || 'achievement', data.orderIndex || 0, now, now]
    );
    rawDb.runSync('UPDATE resumes SET updated_at = ? WHERE id = ?;', [now, resumeId]);
    return id;
  }

  async updateAchievement(id: string, data: Partial<Omit<ResumeAchievement, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const rawDb = getRawDb();
    const now = Date.now();
    const sets: string[] = ['updated_at = ?'];
    const values: any[] = [now];

    for (const [key, val] of Object.entries(data)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      sets.push(`${snakeKey} = ?`);
      values.push(val ?? '');
    }
    values.push(id);

    rawDb.runSync(`UPDATE resume_achievements SET ${sets.join(', ')} WHERE id = ?;`, values);
  }

  async deleteAchievement(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_achievements WHERE id = ?;', [id]);
  }

  // =================== VERSION SNAPSHOTS ===================

  /**
   * Save a point-in-time snapshot of the resume
   */
  async createSnapshot(resumeId: string, label: string): Promise<string> {
    const rawDb = getRawDb();
    const resume = await this.getResumeDetailed(resumeId);
    if (!resume) throw new Error('Resume not found');

    const id = generateUUID();
    const now = Date.now();

    const snapshotData = {
      resume: {
        title: resume.title,
        targetRole: resume.targetRole,
        templateId: resume.templateId,
        versionName: resume.versionName,
      },
      profile: resume.profile,
      sections: resume.sections,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      skills: resume.skills,
      certifications: resume.certifications,
      achievements: resume.achievements,
    };

    rawDb.runSync(
      `INSERT INTO resume_versions (id, resume_id, version_label, snapshot_data, created_at)
       VALUES (?, ?, ?, ?, ?);`,
      [id, resumeId, label, JSON.stringify(snapshotData), now]
    );

    return id;
  }

  /**
   * Restore resume state from a version snapshot
   */
  async restoreSnapshot(versionId: string): Promise<void> {
    const rawDb = getRawDb();
    const versionRow = rawDb.getFirstSync<any>(
      'SELECT * FROM resume_versions WHERE id = ?;',
      [versionId]
    );
    if (!versionRow) throw new Error('Version snapshot not found');

    const snapshot = JSON.parse(versionRow.snapshot_data);
    const resumeId = versionRow.resume_id;
    const now = Date.now();

    rawDb.execSync('BEGIN TRANSACTION;');
    try {
      // 1. Update resume metadata
      if (snapshot.resume) {
        rawDb.runSync(
          'UPDATE resumes SET title = ?, target_role = ?, template_id = ?, version_name = ?, updated_at = ? WHERE id = ?;',
          [
            snapshot.resume.title,
            snapshot.resume.targetRole,
            snapshot.resume.templateId,
            snapshot.resume.versionName || versionRow.version_label,
            now,
            resumeId,
          ]
        );
      }

      // 2. Clear old children
      rawDb.runSync('DELETE FROM resume_profiles WHERE resume_id = ?;', [resumeId]);
      rawDb.runSync('DELETE FROM resume_sections WHERE resume_id = ?;', [resumeId]);
      rawDb.runSync('DELETE FROM resume_education WHERE resume_id = ?;', [resumeId]);
      rawDb.runSync('DELETE FROM resume_experience WHERE resume_id = ?;', [resumeId]);
      rawDb.runSync('DELETE FROM resume_projects WHERE resume_id = ?;', [resumeId]);
      rawDb.runSync('DELETE FROM resume_skills WHERE resume_id = ?;', [resumeId]);
      rawDb.runSync('DELETE FROM resume_certifications WHERE resume_id = ?;', [resumeId]);
      rawDb.runSync('DELETE FROM resume_achievements WHERE resume_id = ?;', [resumeId]);

      // 3. Restore profile
      if (snapshot.profile) {
        rawDb.runSync(
          `INSERT INTO resume_profiles (id, resume_id, full_name, professional_title, email, phone, location, linkedin_url, github_url, portfolio_url, summary, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            generateUUID(),
            resumeId,
            snapshot.profile.fullName || '',
            snapshot.profile.professionalTitle || '',
            snapshot.profile.email || '',
            snapshot.profile.phone || '',
            snapshot.profile.location || '',
            snapshot.profile.linkedinUrl || '',
            snapshot.profile.githubUrl || '',
            snapshot.profile.portfolioUrl || '',
            snapshot.profile.summary || '',
            now,
            now,
          ]
        );
      }

      // 4. Restore sections
      if (Array.isArray(snapshot.sections)) {
        for (const sec of snapshot.sections) {
          rawDb.runSync(
            `INSERT INTO resume_sections (id, resume_id, section_key, title, order_index, is_visible)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [generateUUID(), resumeId, sec.sectionKey, sec.title, sec.orderIndex, sec.isVisible]
          );
        }
      }

      // 5. Restore education
      if (Array.isArray(snapshot.education)) {
        for (const edu of snapshot.education) {
          rawDb.runSync(
            `INSERT INTO resume_education (id, resume_id, institution, degree, field_of_study, location, start_date, end_date, grade, description, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              edu.institution,
              edu.degree,
              edu.fieldOfStudy || '',
              edu.location || '',
              edu.startDate || '',
              edu.endDate || '',
              edu.grade || '',
              edu.description || '',
              edu.orderIndex || 0,
              now,
              now,
            ]
          );
        }
      }

      // 6. Restore experience
      if (Array.isArray(snapshot.experience)) {
        for (const exp of snapshot.experience) {
          rawDb.runSync(
            `INSERT INTO resume_experience (id, resume_id, is_internship, company, position, location, start_date, end_date, is_current, description, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              exp.isInternship || 0,
              exp.company,
              exp.position,
              exp.location || '',
              exp.startDate || '',
              exp.endDate || '',
              exp.isCurrent || 0,
              exp.description || '',
              exp.orderIndex || 0,
              now,
              now,
            ]
          );
        }
      }

      // 7. Restore projects
      if (Array.isArray(snapshot.projects)) {
        for (const proj of snapshot.projects) {
          rawDb.runSync(
            `INSERT INTO resume_projects (id, resume_id, title, subtitle, tech_stack, live_url, github_url, start_date, end_date, description, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              proj.title,
              proj.subtitle || '',
              proj.techStack || '',
              proj.liveUrl || '',
              proj.githubUrl || '',
              proj.startDate || '',
              proj.endDate || '',
              proj.description || '',
              proj.orderIndex || 0,
              now,
              now,
            ]
          );
        }
      }

      // 8. Restore skills
      if (Array.isArray(snapshot.skills)) {
        for (const sk of snapshot.skills) {
          rawDb.runSync(
            `INSERT INTO resume_skills (id, resume_id, category, skills, proficiency, is_soft_skill, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              sk.category,
              sk.skills,
              sk.proficiency || 'Advanced',
              sk.isSoftSkill || 0,
              sk.orderIndex || 0,
              now,
              now,
            ]
          );
        }
      }

      // 9. Restore certifications
      if (Array.isArray(snapshot.certifications)) {
        for (const cert of snapshot.certifications) {
          rawDb.runSync(
            `INSERT INTO resume_certifications (id, resume_id, name, issuer, issue_date, expiry_date, credential_id, credential_url, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              cert.name,
              cert.issuer,
              cert.issueDate || '',
              cert.expiryDate || '',
              cert.credentialId || '',
              cert.credentialUrl || '',
              cert.orderIndex || 0,
              now,
              now,
            ]
          );
        }
      }

      // 10. Restore achievements
      if (Array.isArray(snapshot.achievements)) {
        for (const ach of snapshot.achievements) {
          rawDb.runSync(
            `INSERT INTO resume_achievements (id, resume_id, title, date, description, type, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              ach.title,
              ach.date || '',
              ach.description || '',
              ach.type || 'achievement',
              ach.orderIndex || 0,
              now,
              now,
            ]
          );
        }
      }

      rawDb.execSync('COMMIT;');
    } catch (e) {
      rawDb.execSync('ROLLBACK;');
      throw e;
    }
  }

  async deleteSnapshot(versionId: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_versions WHERE id = ?;', [versionId]);
  }

  // =================== JOB MATCHES ===================

  async saveJobMatch(
    resumeId: string,
    data: {
      companyName?: string;
      jobTitle?: string;
      jobDescription: string;
      matchScore: number;
      matchedKeywords: string[];
      missingKeywords: string[];
      recommendations: string[];
    }
  ): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();

    rawDb.runSync(
      `INSERT INTO resume_job_matches (id, resume_id, company_name, job_title, job_description, match_score, matched_keywords, missing_keywords, recommendations, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        resumeId,
        data.companyName || '',
        data.jobTitle || '',
        data.jobDescription,
        data.matchScore,
        JSON.stringify(data.matchedKeywords),
        JSON.stringify(data.missingKeywords),
        JSON.stringify(data.recommendations),
        now,
      ]
    );

    return id;
  }

  async deleteJobMatch(id: string): Promise<void> {
    const rawDb = getRawDb();
    rawDb.runSync('DELETE FROM resume_job_matches WHERE id = ?;', [id]);
  }

  // =================== IMPORTED FILES ===================

  async saveImportedFile(data: {
    resumeId?: string | null;
    fileName: string;
    fileUri: string;
    fileSize?: number;
  }): Promise<string> {
    const rawDb = getRawDb();
    const id = generateUUID();
    const now = Date.now();

    rawDb.runSync(
      `INSERT INTO resume_imported_files (id, resume_id, file_name, file_uri, file_size, imported_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [id, data.resumeId || null, data.fileName, data.fileUri, data.fileSize || 0, now]
    );

    return id;
  }
}

export const resumeRepository = new ResumeRepository();
