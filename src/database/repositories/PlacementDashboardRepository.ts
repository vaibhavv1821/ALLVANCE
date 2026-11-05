import { BaseRepository } from './BaseRepository';
import { ApplicationWithCompany } from './ApplicationRepository';
import { HiringRoundWithAppInfo } from './HiringRoundRepository';

export interface PipelineStageCount {
  stage: string;
  label: string;
  count: number;
  color: string;
  percentage: number;
}

export interface PlacementDashboardMetrics {
  totalCompanies: number;
  totalApplications: number;
  activeApplications: number;
  upcomingAssessments: number;
  interviewsScheduled: number;
  offersReceived: number;
  rejections: number;
  conversionRate: number; // e.g. 15.5 for 15.5%
  pipelineStages: PipelineStageCount[];
  upcomingEvents: HiringRoundWithAppInfo[];
  recentApplications: ApplicationWithCompany[];
}

export class PlacementDashboardRepository extends BaseRepository {
  async getMetrics(): Promise<PlacementDashboardMetrics> {
    try {
      // 1. Total companies
      const compRow = this.rawDb.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM companies;'
      );
      const totalCompanies = Number(compRow?.count || 0);

      // 2. Application status breakdown
      const appRows = this.rawDb.getAllSync<{ status: string; count: number }>(`
        SELECT status, COUNT(*) as count 
        FROM applications 
        GROUP BY status;
      `);

      const statusCounts: Record<string, number> = {
        WISHLIST: 0,
        APPLIED: 0,
        ASSESSMENT: 0,
        SHORTLISTED: 0,
        INTERVIEW: 0,
        OFFERED: 0,
        REJECTED: 0,
        WITHDRAWN: 0,
        ON_HOLD: 0,
      };

      let totalApplications = 0;
      for (const row of appRows) {
        const count = Number(row.count || 0);
        statusCounts[row.status] = count;
        totalApplications += count;
      }

      const activeApplications =
        statusCounts.APPLIED +
        statusCounts.ASSESSMENT +
        statusCounts.SHORTLISTED +
        statusCounts.INTERVIEW +
        statusCounts.ON_HOLD;

      const offersReceived = statusCounts.OFFERED;
      const rejections = statusCounts.REJECTED;

      // Conversion rate
      const conversionRate =
        totalApplications > 0
          ? Number(((offersReceived / totalApplications) * 100).toFixed(1))
          : 0;

      // 3. Upcoming assessments scheduled
      const assessRow = this.rawDb.getFirstSync<{ count: number }>(`
        SELECT COUNT(*) as count 
        FROM hiring_rounds 
        WHERE round_type IN ('assessment', 'aptitude', 'coding', 'oa')
          AND completion_status = 'SCHEDULED';
      `);
      const upcomingAssessments = Number(assessRow?.count || 0);

      // 4. Interviews scheduled
      const interviewRow = this.rawDb.getFirstSync<{ count: number }>(`
        SELECT COUNT(*) as count 
        FROM hiring_rounds 
        WHERE round_type IN ('technical', 'managerial', 'hr', 'interview')
          AND completion_status = 'SCHEDULED';
      `);
      const interviewsScheduled = Number(interviewRow?.count || 0);

      // 5. Pipeline Stages Visualization Data
      const stagesConfig = [
        { stage: 'WISHLIST', label: 'Wishlist', color: '#818CF8' },
        { stage: 'APPLIED', label: 'Applied', color: '#38BDF8' },
        { stage: 'ASSESSMENT', label: 'Assessment', color: '#F59E0B' },
        { stage: 'SHORTLISTED', label: 'Shortlisted', color: '#0EA5E9' },
        { stage: 'INTERVIEW', label: 'Interview', color: '#A855F7' },
        { stage: 'OFFERED', label: 'Offered', color: '#10B981' },
      ];

      const pipelineStages: PipelineStageCount[] = stagesConfig.map((cfg) => {
        const count = statusCounts[cfg.stage] || 0;
        const percentage =
          totalApplications > 0
            ? Math.round((count / totalApplications) * 100)
            : 0;
        return {
          stage: cfg.stage,
          label: cfg.label,
          count,
          color: cfg.color,
          percentage,
        };
      });

      // 6. Upcoming Events (both assessments & interviews)
      const upcomingEventsRows = this.rawDb.getAllSync<any>(`
        SELECT 
          r.*,
          c.name as company_name,
          a.role_title as role_title
        FROM hiring_rounds r
        INNER JOIN applications a ON r.application_id = a.id
        INNER JOIN companies c ON a.company_id = c.id
        WHERE r.completion_status = 'SCHEDULED'
        ORDER BY CASE WHEN r.scheduled_date IS NULL THEN 1 ELSE 0 END, r.scheduled_date ASC
        LIMIT 4;
      `);

      const upcomingEvents: HiringRoundWithAppInfo[] = upcomingEventsRows.map((r) => ({
        id: r.id,
        applicationId: r.application_id,
        roundName: r.round_name,
        roundType: r.round_type,
        roundOrder: r.round_order,
        scheduledDate: r.scheduled_date,
        completionStatus: r.completion_status,
        result: r.result,
        score: r.score,
        feedback: r.feedback,
        questionsAsked: r.questions_asked,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        companyName: r.company_name,
        roleTitle: r.role_title,
      }));

      // 7. Recent applications
      const recentAppsRows = this.rawDb.getAllSync<any>(`
        SELECT 
          a.*,
          c.name as company_name,
          c.industry as company_industry,
          c.location as company_location,
          c.website as company_website
        FROM applications a
        INNER JOIN companies c ON a.company_id = c.id
        ORDER BY a.created_at DESC
        LIMIT 4;
      `);

      const recentApplications: ApplicationWithCompany[] = recentAppsRows.map((r) => ({
        id: r.id,
        companyId: r.company_id,
        roleId: r.role_id,
        roleTitle: r.role_title,
        jobType: r.job_type,
        ctc: r.ctc,
        fixedSalary: r.fixed_salary,
        variableSalary: r.variable_salary,
        appliedDate: r.applied_date,
        deadlineDate: r.deadline_date,
        source: r.source,
        resumeVersion: r.resume_version,
        status: r.status,
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        companyName: r.company_name,
        companyIndustry: r.company_industry,
        companyLocation: r.company_location,
        companyWebsite: r.company_website,
      }));

      return {
        totalCompanies,
        totalApplications,
        activeApplications,
        upcomingAssessments,
        interviewsScheduled,
        offersReceived,
        rejections,
        conversionRate,
        pipelineStages,
        upcomingEvents,
        recentApplications,
      };
    } catch (error) {
      this.handleError('PlacementDashboardRepository.getMetrics', error);
    }
  }
}

export const placementDashboardRepository = new PlacementDashboardRepository();
