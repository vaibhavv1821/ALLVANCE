import { eq, desc } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository';
import { offers, Offer, NewOffer, companies, applications } from '../schema/placement';
import { generateUUID } from '@/utils/uuid';

export type OfferAcceptanceStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface OfferWithDetails extends Offer {
  companyName: string;
  companyIndustry?: string | null;
  companyLocation?: string | null;
}

export class OfferRepository extends BaseRepository {
  async getAll(): Promise<OfferWithDetails[]> {
    try {
      const rows = this.rawDb.getAllSync<any>(`
        SELECT 
          o.*,
          c.name as company_name,
          c.industry as company_industry,
          c.location as company_location
        FROM offers o
        INNER JOIN companies c ON o.company_id = c.id
        ORDER BY o.ctc DESC, o.offer_date DESC;
      `);

      return rows.map((r) => ({
        id: r.id,
        applicationId: r.application_id,
        companyId: r.company_id,
        roleTitle: r.role_title,
        ctc: r.ctc,
        fixedSalary: r.fixed_salary,
        variableSalary: r.variable_salary,
        joiningDate: r.joining_date,
        offerDate: r.offer_date,
        acceptanceStatus: r.acceptance_status,
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        companyName: r.company_name,
        companyIndustry: r.company_industry,
        companyLocation: r.company_location,
      }));
    } catch (error) {
      this.handleError('OfferRepository.getAll', error);
    }
  }

  async getById(id: string): Promise<OfferWithDetails | null> {
    try {
      const all = await this.getAll();
      return all.find((o) => o.id === id) || null;
    } catch (error) {
      this.handleError(`OfferRepository.getById(${id})`, error);
    }
  }

  async create(data: {
    companyId: string;
    applicationId?: string | null;
    roleTitle: string;
    ctc: number;
    fixedSalary?: number | null;
    variableSalary?: number | null;
    joiningDate?: number | null;
    offerDate: number;
    acceptanceStatus?: OfferAcceptanceStatus;
    notes?: string | null;
  }): Promise<OfferWithDetails> {
    try {
      const now = Date.now();
      const id = generateUUID();

      const newOffer: NewOffer = {
        id,
        companyId: data.companyId,
        applicationId: data.applicationId || null,
        roleTitle: data.roleTitle.trim(),
        ctc: Number(data.ctc),
        fixedSalary: data.fixedSalary !== undefined && data.fixedSalary !== null ? Number(data.fixedSalary) : null,
        variableSalary: data.variableSalary !== undefined && data.variableSalary !== null ? Number(data.variableSalary) : null,
        joiningDate: data.joiningDate || null,
        offerDate: data.offerDate,
        acceptanceStatus: data.acceptanceStatus || 'PENDING',
        notes: data.notes?.trim() || null,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(offers).values(newOffer);

      // If tied to an application, update application status to 'OFFERED' if currently not offered
      if (data.applicationId) {
        await this.db
          .update(applications)
          .set({ status: 'OFFERED', updatedAt: now })
          .where(eq(applications.id, data.applicationId));
      }

      return (await this.getById(id))!;
    } catch (error) {
      this.handleError('OfferRepository.create', error);
    }
  }

  async update(
    id: string,
    data: Partial<{
      roleTitle: string;
      ctc: number;
      fixedSalary: number | null;
      variableSalary: number | null;
      joiningDate: number | null;
      offerDate: number;
      acceptanceStatus: OfferAcceptanceStatus;
      notes: string | null;
    }>
  ): Promise<OfferWithDetails> {
    try {
      const now = Date.now();
      await this.db
        .update(offers)
        .set({
          ...data,
          updatedAt: now,
        })
        .where(eq(offers.id, id));

      return (await this.getById(id))!;
    } catch (error) {
      this.handleError(`OfferRepository.update(${id})`, error);
    }
  }

  async updateAcceptanceStatus(id: string, status: OfferAcceptanceStatus): Promise<OfferWithDetails> {
    try {
      return await this.update(id, { acceptanceStatus: status });
    } catch (error) {
      this.handleError(`OfferRepository.updateAcceptanceStatus(${id})`, error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete(offers).where(eq(offers.id, id));
      return true;
    } catch (error) {
      this.handleError(`OfferRepository.delete(${id})`, error);
    }
  }

  async count(): Promise<number> {
    try {
      const row = this.rawDb.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM offers;'
      );
      return row?.count || 0;
    } catch (error) {
      this.handleError('OfferRepository.count', error);
    }
  }
}

export const offerRepository = new OfferRepository();
