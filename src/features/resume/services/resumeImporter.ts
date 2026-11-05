import * as DocumentPicker from 'expo-document-picker';
import { resumeRepository } from '@/database/repositories/ResumeRepository';

export interface ImportResult {
  success: boolean;
  resumeId?: string;
  fileName?: string;
  fileUri?: string;
  fileSize?: number;
  message?: string;
  isJsonBackup?: boolean;
}

export async function pickAndImportResumeDocument(): Promise<ImportResult | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'application/json', 'text/*'],
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const fileName = asset.name || 'Imported_Resume.pdf';
  const fileUri = asset.uri;
  const fileSize = asset.size || 0;
  const isJson = fileName.toLowerCase().endsWith('.json') || asset.mimeType?.includes('json');

  if (isJson) {
    try {
      const response = await fetch(fileUri);
      const text = await response.text();
      const data = JSON.parse(text);

      // Create new resume from JSON snapshot
      const title = data.resume?.title || `Imported - ${fileName.replace(/\.json$/i, '')}`;
      const resumeId = await resumeRepository.createResume({
        title,
        targetRole: data.resume?.targetRole || 'Software Engineer',
        templateId: data.resume?.templateId || 'modern',
        fullName: data.profile?.fullName,
        email: data.profile?.email,
        phone: data.profile?.phone,
        location: data.profile?.location,
        summary: data.profile?.summary,
      });

      // Populate sections if present
      if (Array.isArray(data.education)) {
        for (const edu of data.education) {
          await resumeRepository.addEducation(resumeId, {
            institution: edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.fieldOfStudy || '',
            location: edu.location || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            grade: edu.grade || '',
            description: edu.description || '',
            orderIndex: edu.orderIndex || 0,
          });
        }
      }

      if (Array.isArray(data.experience)) {
        for (const exp of data.experience) {
          await resumeRepository.addExperience(resumeId, {
            company: exp.company || '',
            position: exp.position || '',
            isInternship: exp.isInternship || 0,
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            isCurrent: exp.isCurrent || 0,
            description: exp.description || '',
            orderIndex: exp.orderIndex || 0,
          });
        }
      }

      if (Array.isArray(data.projects)) {
        for (const pr of data.projects) {
          await resumeRepository.addProject(resumeId, {
            title: pr.title || '',
            subtitle: pr.subtitle || '',
            techStack: pr.techStack || '',
            liveUrl: pr.liveUrl || '',
            githubUrl: pr.githubUrl || '',
            startDate: pr.startDate || '',
            endDate: pr.endDate || '',
            description: pr.description || '',
            orderIndex: pr.orderIndex || 0,
          });
        }
      }

      if (Array.isArray(data.skills)) {
        for (const sk of data.skills) {
          await resumeRepository.addSkill(resumeId, {
            category: sk.category || 'General Skills',
            skills: sk.skills || '',
            proficiency: sk.proficiency || 'Advanced',
            isSoftSkill: sk.isSoftSkill || 0,
            orderIndex: sk.orderIndex || 0,
          });
        }
      }

      await resumeRepository.saveImportedFile({
        resumeId,
        fileName,
        fileUri,
        fileSize,
      });

      return {
        success: true,
        resumeId,
        fileName,
        fileUri,
        fileSize,
        isJsonBackup: true,
        message: 'Successfully imported resume from backup JSON.',
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Failed to parse JSON resume: ${e?.message || 'Invalid format'}`,
      };
    }
  } else {
    // For PDF files: Create linked resume entry and save import metadata
    const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const resumeId = await resumeRepository.createResume({
      title: `Imported - ${cleanTitle}`,
      targetRole: 'Software Engineer',
      templateId: 'modern',
      fullName: cleanTitle,
      summary: `Imported from ${fileName}. Use the Editor tab to review and refine your imported profile.`,
    });

    await resumeRepository.saveImportedFile({
      resumeId,
      fileName,
      fileUri,
      fileSize,
    });

    return {
      success: true,
      resumeId,
      fileName,
      fileUri,
      fileSize,
      isJsonBackup: false,
      message: `PDF attached: ${fileName}. New resume draft created.`,
    };
  }
}
