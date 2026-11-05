import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository';
import {
  applications,
  companies,
  applicationStatusHistory,
  hiringRounds,
  offers,
  Application,
  NewApplication,
  Company,
  ApplicationStatusHistory,
  HiringRound,
  Offer,
} from '../schema/placement';
import { generateUUID } from '@/utils/uuid';

export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'ASSESSMENT'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'ON_HOLD';

export interface ApplicationWithCompany extends Application {
  companyName: string;
  companyIndustry?: string | null;
  companyLocation?: string | null;
  companyWebsite?: string | null;
}

export interface ApplicationDetailed extends ApplicationWithCompany {
  company: Company;
  statusHistory: ApplicationStatusHistory[];
  hiringRounds: HiringRound[];
  offer: Offer | null;
}

export interface ApplicationFilterOptions {
  search?: string;
  status?: ApplicationStatus | 'ALL' | 'ACTIVE';
  companyId?: string;
  minCtc?: number;
  maxCtc?: number;
  sortBy?: 'newest' | 'deadline' | 'ctc';
}

export const ACTIVE_STATUSES: ApplicationStatus[] = [
  'APPLIED',
  'ASSESSMENT',
  'SHORTLISTED',
  'INTERVIEW',
  'ON_HOLD',
];

export class ApplicationRepository extends BaseRepository {
  async getAll(options?: ApplicationFilterOptions): Promise<ApplicationWithCompany[]> {
    try {
      const search = options?.search?.trim() ? `%${options.search.trim()}%` : null;
      const status = options?.status;
      const companyId = options?.companyId;
      const minCtc = options?.minCtc;
      const maxCtc = options?.maxCtc;
      const sortBy = options?.sortBy || 'newest';

      let sqlQuery = `
        SELECT 
          a.*,
          c.name as company_name,
          c.industry as company_industry,
          c.location as company_location,
          c.website as company_website
        FROM applications a
        INNER JOIN companies c ON a.company_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (search) {
        sqlQuery += ` AND (a.role_title LIKE ? OR c.name LIKE ? OR a.source LIKE ?)`;
        params.push(search, search, search);
      }

      if (status && status !== 'ALL') {
        if (status === 'ACTIVE') {
          sqlQuery += ` AND a.status IN ('APPLIED', 'ASSESSMENT', 'SHORTLISTED', 'INTERVIEW', 'ON_HOLD')`;
        } else {
          sqlQuery += ` AND a.status = ?`;
          params.push(status);
        }
      }

      if (companyId) {
        sqlQuery += ` AND a.company_id = ?`;
        params.push(companyId);
      }

      if (minCtc !== undefined && minCtc !== null) {
        sqlQuery += ` AND a.ctc >= ?`;
        params.push(minCtc);
      }

      if (maxCtc !== undefined && maxCtc !== null) {
        sqlQuery += ` AND a.ctc <= ?`;
        params.push(maxCtc);
      }

      switch (sortBy) {
        case 'deadline':
          sqlQuery += ` ORDER BY CASE WHEN a.deadline_date IS NULL THEN 1 ELSE 0 END, a.deadline_date ASC, a.created_at DESC`;
          break;
        case 'ctc':
          sqlQuery += ` ORDER BY CASE WHEN a.ctc IS NULL THEN 1 ELSE 0 END, a.ctc DESC, a.created_at DESC`;
          break;
        case 'newest':
        default:
          sqlQuery += ` ORDER BY a.created_at DESC`;
          break;
      }

      const rows = this.rawDb.getAllSync<any>(sqlQuery, params);

      return rows.map((r) => ({
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
    } catch (error) {
      this.handleError('ApplicationRepository.getAll', error);
    }
  }

  async getById(id: string): Promise<ApplicationWithCompany | null> {
    try {
      const rows = await this.getAll({ search: '' });
      return rows.find((r) => r.id === id) || null;
    } catch (error) {
      this.handleError(`ApplicationRepository.getById(${id})`, error);
    }
  }

  async getDetailed(id: string): Promise<ApplicationDetailed | null> {
    try {
      const baseApp = await this.getById(id);
      if (!baseApp) return null;

      // Get Company
      const compRows = await this.db.select().from(companies).where(eq(companies.id, baseApp.companyId)).limit(1);
      if (compRows.length === 0) return null;

      // Get Status History
      const historyRows = await this.db
        .select()
        .from(applicationStatusHistory)
        .where(eq(applicationStatusHistory.applicationId, id))
        .orderBy(desc(applicationStatusHistory.changedAt));

      // Get Hiring Rounds
      const roundsRows = await this.db
        .select()
        .from(hiringRounds)
        .where(eq(hiringRounds.applicationId, id))
        .orderBy(asc(hiringRounds.roundOrder), asc(hiringRounds.scheduledDate));

      // Get Offer if any
      const offerRows = await this.db
        .select()
        .from(offers)
        .where(eq(offers.applicationId, id))
        .limit(1);

      return {
        ...baseApp,
        company: compRows[0],
        statusHistory: historyRows,
        hiringRounds: roundsRows,
        offer: offerRows.length > 0 ? offerRows[0] : null,
      };
    } catch (error) {
      this.handleError(`ApplicationRepository.getDetailed(${id})`, error);
    }
  }

  async create(data: {
    companyId: string;
    roleTitle: string;
    roleId?: string | null;
    jobType?: string;
    ctc?: number | null;
    fixedSalary?: number | null;
    variableSalary?: number | null;
    appliedDate: number;
    deadlineDate?: number | null;
    source?: string;
    resumeVersion?: string | null;
    status?: ApplicationStatus;
    notes?: string | null;
  }): Promise<Application> {
    try {
      const now = Date.now();
      const id = generateUUID();
      const initialStatus = data.status || 'APPLIED';

      const newApp: NewApplication = {
        id,
        companyId: data.companyId,
        roleId: data.roleId || null,
        roleTitle: data.roleTitle.trim(),
        jobType: data.jobType || 'Full-time',
        ctc: data.ctc !== undefined && data.ctc !== null ? Number(data.ctc) : null,
        fixedSalary: data.fixedSalary !== undefined && data.fixedSalary !== null ? Number(data.fixedSalary) : null,
        variableSalary: data.variableSalary !== undefined && data.variableSalary !== null ? Number(data.variableSalary) : null,
        appliedDate: data.appliedDate,
        deadlineDate: data.deadlineDate || null,
        source: data.source?.trim() || 'Campus',
        resumeVersion: data.resumeVersion?.trim() || null,
        status: initialStatus,
        notes: data.notes?.trim() || null,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(applications).values(newApp);

      // Record initial status history
      const historyId = generateUUID();
      await this.db.insert(applicationStatusHistory).values({
        id: historyId,
        applicationId: id,
        fromStatus: null,
        toStatus: initialStatus,
        changedAt: now,
        notes: 'Initial application submitted',
      });

      const inserted = await this.db.select().from(applications).where(eq(applications.id, id)).limit(1);
      return inserted[0];
    } catch (error) {
      this.handleError('ApplicationRepository.create', error);
    }
  }

  async update(
    id: string,
    data: Partial<{
      companyId: string;
      roleTitle: string;
      roleId: string | null;
      jobType: string;
      ctc: number | null;
      fixedSalary: number | null;
      variableSalary: number | null;
      appliedDate: number;
      deadlineDate: number | null;
      source: string;
      resumeVersion: string | null;
      notes: string | null;
    }>
  ): Promise<Application> {
    try {
      const now = Date.now();
      await this.db
        .update(applications)
        .set({
          ...data,
          updatedAt: now,
        })
        .where(eq(applications.id, id));

      const updated = await this.db.select().from(applications).where(eq(applications.id, id)).limit(1);
      return updated[0];
    } catch (error) {
      this.handleError(`ApplicationRepository.update(${id})`, error);
    }
  }

  async updateStatus(
    id: string,
    newStatus: ApplicationStatus,
    notes?: string
  ): Promise<Application> {
    try {
      const now = Date.now();
      const current = await this.db.select().from(applications).where(eq(applications.id, id)).limit(1);
      if (current.length === 0) {
        throw new Error(`Application ${id} not found`);
      }

      const fromStatus = current[0].status;

      // Update application table
      await this.db
        .update(applications)
        .set({
          status: newStatus,
          updatedAt: now,
        })
        .where(eq(applications.id, id));

      // Append to status history
      const historyId = generateUUID();
      await this.db.insert(applicationStatusHistory).values({
        id: historyId,
        applicationId: id,
        fromStatus,
        toStatus: newStatus,
        changedAt: now,
        notes: notes?.trim() || null,
      });

      const updated = await this.db.select().from(applications).where(eq(applications.id, id)).limit(1);
      return updated[0];
    } catch (error) {
      this.handleError(`ApplicationRepository.updateStatus(${id})`, error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete(applications).where(eq(applications.id, id));
      return true;
    } catch (error) {
      this.handleError(`ApplicationRepository.delete(${id})`, error);
    }
  }

  async getStatusCounts(): Promise<Record<string, number>> {
    try {
      const rows = this.rawDb.getAllSync<{ status: string; count: number }>(`
        SELECT status, COUNT(*) as count 
        FROM applications 
        GROUP BY status;
      `);

      const counts: Record<string, number> = {
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

      for (const row of rows) {
        counts[row.status] = Number(row.count || 0);
      }

      return counts;
    } catch (error) {
      this.handleError('ApplicationRepository.getStatusCounts', error);
    }
  }
}

export const applicationRepository = new ApplicationRepository();
