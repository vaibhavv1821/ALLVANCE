import { BaseRepository } from './BaseRepository';

export interface CompanyDsaStats {
  companyName: string;
  totalProblems: number;
  solvedProblems: number;
  unsolvedProblems: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  completionPercent: number;
}

export class DsaCompanyRepository extends BaseRepository {
  async getAllCompaniesWithStats(): Promise<CompanyDsaStats[]> {
    try {
      const rows = this.rawDb.getAllSync<{
        company_name: string;
        total: number;
        solved: number;
        easy: number;
        medium: number;
        hard: number;
      }>(`
        SELECT 
          c.company_name,
          COUNT(DISTINCT p.id) as total,
          SUM(CASE WHEN p.status = 'solved' THEN 1 ELSE 0 END) as solved,
          SUM(CASE WHEN p.difficulty = 'Easy' THEN 1 ELSE 0 END) as easy,
          SUM(CASE WHEN p.difficulty = 'Medium' THEN 1 ELSE 0 END) as medium,
          SUM(CASE WHEN p.difficulty = 'Hard' THEN 1 ELSE 0 END) as hard
        FROM dsa_problem_companies c
        JOIN dsa_problems p ON c.problem_id = p.id
        GROUP BY c.company_name
        ORDER BY total DESC, solved DESC;
      `);

      return rows.map((r) => {
        const solved = r.solved || 0;
        const total = r.total || 0;
        const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
        return {
          companyName: r.company_name,
          totalProblems: total,
          solvedProblems: solved,
          unsolvedProblems: total - solved,
          easyCount: r.easy || 0,
          mediumCount: r.medium || 0,
          hardCount: r.hard || 0,
          completionPercent: percent,
        };
      });
    } catch (error) {
      this.handleError('DsaCompanyRepository.getAllCompaniesWithStats', error);
    }
  }

  async getPopularCompanies(): Promise<string[]> {
    try {
      const defaultCompanies = [
        'Amazon',
        'Google',
        'Microsoft',
        'Meta',
        'TCS',
        'Infosys',
        'Deloitte',
        'Accenture',
        'Cognizant',
        'Capgemini',
        'Wipro',
        'HCL',
      ];

      const existing = this.rawDb.getAllSync<{ company_name: string }>(
        'SELECT DISTINCT company_name FROM dsa_problem_companies;'
      );

      const existingSet = new Set(existing.map((e) => e.company_name));
      for (const d of defaultCompanies) {
        existingSet.add(d);
      }

      return Array.from(existingSet);
    } catch (error) {
      return ['Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys', 'Deloitte'];
    }
  }
}

export const dsaCompanyRepository = new DsaCompanyRepository();
