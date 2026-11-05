import { eq, desc, like, and, or, sql } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository';
import { companies, Company, NewCompany, applications } from '../schema/placement';
import { generateUUID } from '@/utils/uuid';

export interface CompanyWithCounts extends Company {
  applicationCount: number;
  offersCount: number;
}

export class CompanyRepository extends BaseRepository {
  async getAll(options?: { search?: string; industry?: string }): Promise<Company[]> {
    try {
      const conditions = [];

      if (options?.search && options.search.trim()) {
        const query = `%${options.search.trim()}%`;
        conditions.push(
          or(
            like(companies.name, query),
            like(companies.location, query),
            like(companies.industry, query)
          )
        );
      }

      if (options?.industry && options.industry !== 'ALL') {
        conditions.push(eq(companies.industry, options.industry));
      }

      let q = this.db.select().from(companies);

      if (conditions.length > 0) {
        // @ts-ignore drizzle type check
        q = q.where(and(...conditions));
      }

      const rows = await q.orderBy(desc(companies.createdAt));
      return rows;
    } catch (error) {
      this.handleError('CompanyRepository.getAll', error);
    }
  }

  async getAllWithCounts(options?: { search?: string; industry?: string }): Promise<CompanyWithCounts[]> {
    try {
      const allCompanies = await this.getAll(options);
      if (allCompanies.length === 0) return [];

      // Query application counts per company
      const appCounts = this.rawDb.getAllSync<{
        company_id: string;
        app_count: number;
        offer_count: number;
      }>(`
        SELECT 
          company_id, 
          COUNT(*) as app_count,
          SUM(CASE WHEN status = 'OFFERED' THEN 1 ELSE 0 END) as offer_count
        FROM applications
        GROUP BY company_id;
      `);

      const countsMap = new Map<string, { app_count: number; offer_count: number }>();
      for (const row of appCounts) {
        countsMap.set(row.company_id, {
          app_count: Number(row.app_count || 0),
          offer_count: Number(row.offer_count || 0),
        });
      }

      return allCompanies.map((c) => ({
        ...c,
        applicationCount: countsMap.get(c.id)?.app_count || 0,
        offersCount: countsMap.get(c.id)?.offer_count || 0,
      }));
    } catch (error) {
      this.handleError('CompanyRepository.getAllWithCounts', error);
    }
  }

  async getById(id: string): Promise<Company | null> {
    try {
      const rows = await this.db
        .select()
        .from(companies)
        .where(eq(companies.id, id))
        .limit(1);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      this.handleError(`CompanyRepository.getById(${id})`, error);
    }
  }

  async create(data: {
    name: string;
    industry?: string | null;
    website?: string | null;
    location?: string | null;
    description?: string | null;
    hiringProcess?: string | null;
    eligibilityCriteria?: string | null;
    minCgpa?: number | null;
    eligibleBranches?: string | null;
    packageRange?: string | null;
    notes?: string | null;
  }): Promise<Company> {
    try {
      const now = Date.now();
      const id = generateUUID();
      const newCompany: NewCompany = {
        id,
        name: data.name.trim(),
        industry: data.industry?.trim() || null,
        website: data.website?.trim() || null,
        location: data.location?.trim() || null,
        description: data.description?.trim() || null,
        hiringProcess: data.hiringProcess?.trim() || null,
        eligibilityCriteria: data.eligibilityCriteria?.trim() || null,
        minCgpa: data.minCgpa !== undefined && data.minCgpa !== null ? Number(data.minCgpa) : null,
        eligibleBranches: data.eligibleBranches?.trim() || null,
        packageRange: data.packageRange?.trim() || null,
        notes: data.notes?.trim() || null,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(companies).values(newCompany);
      return (await this.getById(id))!;
    } catch (error) {
      this.handleError('CompanyRepository.create', error);
    }
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      industry: string | null;
      website: string | null;
      location: string | null;
      description: string | null;
      hiringProcess: string | null;
      eligibilityCriteria: string | null;
      minCgpa: number | null;
      eligibleBranches: string | null;
      packageRange: string | null;
      notes: string | null;
    }>
  ): Promise<Company> {
    try {
      const now = Date.now();
      await this.db
        .update(companies)
        .set({
          ...data,
          updatedAt: now,
        })
        .where(eq(companies.id, id));

      return (await this.getById(id))!;
    } catch (error) {
      this.handleError(`CompanyRepository.update(${id})`, error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Cascades automatically to applications, interviews, offers via SQLite FK ON DELETE CASCADE
      await this.db.delete(companies).where(eq(companies.id, id));
      return true;
    } catch (error) {
      this.handleError(`CompanyRepository.delete(${id})`, error);
    }
  }

  async getIndustries(): Promise<string[]> {
    try {
      const rows = this.rawDb.getAllSync<{ industry: string }>(`
        SELECT DISTINCT industry FROM companies 
        WHERE industry IS NOT NULL AND TRIM(industry) != '' 
        ORDER BY industry ASC;
      `);
      return rows.map((r) => r.industry);
    } catch (error) {
      this.handleError('CompanyRepository.getIndustries', error);
    }
  }

  async count(): Promise<number> {
    try {
      const row = this.rawDb.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM companies;'
      );
      return row?.count || 0;
    } catch (error) {
      this.handleError('CompanyRepository.count', error);
    }
  }
}

export const companyRepository = new CompanyRepository();
