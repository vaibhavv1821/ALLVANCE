import { eq, desc } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository';
import { companyRoles, CompanyRole, NewCompanyRole } from '../schema/placement';
import { generateUUID } from '@/utils/uuid';

export class CompanyRoleRepository extends BaseRepository {
  async getByCompanyId(companyId: string): Promise<CompanyRole[]> {
    try {
      return await this.db
        .select()
        .from(companyRoles)
        .where(eq(companyRoles.companyId, companyId))
        .orderBy(desc(companyRoles.createdAt));
    } catch (error) {
      this.handleError(`CompanyRoleRepository.getByCompanyId(${companyId})`, error);
    }
  }

  async create(data: {
    companyId: string;
    roleTitle: string;
    jobType?: string;
    location?: string | null;
    ctc?: number | null;
    fixedSalary?: number | null;
    variableSalary?: number | null;
    eligibleBranches?: string | null;
    minCgpa?: number | null;
    description?: string | null;
  }): Promise<CompanyRole> {
    try {
      const now = Date.now();
      const id = generateUUID();
      const newRole: NewCompanyRole = {
        id,
        companyId: data.companyId,
        roleTitle: data.roleTitle.trim(),
        jobType: data.jobType || 'Full-time',
        location: data.location?.trim() || null,
        ctc: data.ctc !== undefined && data.ctc !== null ? Number(data.ctc) : null,
        fixedSalary: data.fixedSalary !== undefined && data.fixedSalary !== null ? Number(data.fixedSalary) : null,
        variableSalary: data.variableSalary !== undefined && data.variableSalary !== null ? Number(data.variableSalary) : null,
        eligibleBranches: data.eligibleBranches?.trim() || null,
        minCgpa: data.minCgpa !== undefined && data.minCgpa !== null ? Number(data.minCgpa) : null,
        description: data.description?.trim() || null,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(companyRoles).values(newRole);
      const rows = await this.db.select().from(companyRoles).where(eq(companyRoles.id, id)).limit(1);
      return rows[0];
    } catch (error) {
      this.handleError('CompanyRoleRepository.create', error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete(companyRoles).where(eq(companyRoles.id, id));
      return true;
    } catch (error) {
      this.handleError(`CompanyRoleRepository.delete(${id})`, error);
    }
  }
}

export const companyRoleRepository = new CompanyRoleRepository();
