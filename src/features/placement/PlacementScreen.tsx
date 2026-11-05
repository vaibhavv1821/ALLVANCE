import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Briefcase,
  Building2,
  Calendar,
  Award,
  LayoutDashboard,
  Plus,
  RefreshCw,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppHeader, LoadingIndicator } from '@/components';
import {
  companyRepository,
  CompanyWithCounts,
} from '@/database/repositories/CompanyRepository';
import {
  applicationRepository,
  ApplicationWithCompany,
  ApplicationDetailed,
  ApplicationStatus,
} from '@/database/repositories/ApplicationRepository';
import {
  placementDashboardRepository,
  PlacementDashboardMetrics,
} from '@/database/repositories/PlacementDashboardRepository';
import {
  interviewRepository,
  InterviewWithDetails,
} from '@/database/repositories/InterviewRepository';
import {
  offerRepository,
  OfferWithDetails,
  OfferAcceptanceStatus,
} from '@/database/repositories/OfferRepository';
import { hiringRoundRepository } from '@/database/repositories/HiringRoundRepository';
import { PlacementTabType } from './types';

// Tab Components
import { PlacementDashboardTab } from './components/PlacementDashboardTab';
import { CompanyListTab } from './components/CompanyListTab';
import { CompanyFormModal } from './components/CompanyFormModal';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { ApplicationListTab } from './components/ApplicationListTab';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { InterviewExperienceTab } from './components/InterviewExperienceTab';
import { InterviewFormModal } from './components/InterviewFormModal';
import { OffersTab } from './components/OffersTab';
import { OfferFormModal } from './components/OfferFormModal';

interface PlacementScreenProps {
  showBack?: boolean;
}

export const PlacementScreen: React.FC<PlacementScreenProps> = ({
  showBack = false,
}) => {
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();

  const [activeTab, setActiveTab] = useState<PlacementTabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [metrics, setMetrics] = useState<PlacementDashboardMetrics | null>(null);
  const [companies, setCompanies] = useState<CompanyWithCounts[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [applications, setApplications] = useState<ApplicationWithCompany[]>([]);
  const [interviews, setInterviews] = useState<InterviewWithDetails[]>([]);
  const [offers, setOffers] = useState<OfferWithDetails[]>([]);

  // Modal states
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyWithCounts | null>(null);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState<CompanyWithCounts | null>(null);

  const [showAppForm, setShowAppForm] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationWithCompany | null>(null);
  const [selectedAppDetail, setSelectedAppDetail] = useState<ApplicationDetailed | null>(null);
  const [preselectedCompanyForApp, setPreselectedCompanyForApp] = useState<string | null>(null);

  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrefill, setOfferPrefill] = useState<{
    companyId?: string;
    roleTitle?: string;
    applicationId?: string;
    ctc?: number | null;
    fixedSalary?: number | null;
    variableSalary?: number | null;
  }>({});

  // Load all module data
  const loadData = useCallback(async () => {
    try {
      const [
        dashboardMetrics,
        allCompanies,
        industryList,
        allApps,
        allInterviews,
        allOffers,
      ] = await Promise.all([
        placementDashboardRepository.getMetrics(),
        companyRepository.getAllWithCounts(),
        companyRepository.getIndustries(),
        applicationRepository.getAll(),
        interviewRepository.getAll(),
        offerRepository.getAll(),
      ]);

      setMetrics(dashboardMetrics);
      setCompanies(allCompanies);
      setIndustries(industryList);
      setApplications(allApps);
      setInterviews(allInterviews);
      setOffers(allOffers);

      // If an application detail modal is currently open, refresh its data
      if (selectedAppDetail) {
        const refreshedApp = await applicationRepository.getDetailed(selectedAppDetail.id);
        setSelectedAppDetail(refreshedApp);
      }

      // If a company detail modal is currently open, refresh its data
      if (selectedCompanyDetail) {
        const refreshedComp = allCompanies.find((c) => c.id === selectedCompanyDetail.id);
        if (refreshedComp) {
          setSelectedCompanyDetail(refreshedComp);
        }
      }
    } catch (error) {
      console.error('[PlacementScreen] Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedAppDetail, selectedCompanyDetail]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Company Handlers
  const handleCreateOrUpdateCompany = async (data: any) => {
    if (editingCompany) {
      await companyRepository.update(editingCompany.id, data);
    } else {
      await companyRepository.create(data);
    }
    setEditingCompany(null);
    loadData();
  };

  const handleDeleteCompany = async (companyId: string) => {
    await companyRepository.delete(companyId);
    setSelectedCompanyDetail(null);
    loadData();
  };

  const handleQuickAddCompany = async (companyName: string): Promise<string> => {
    const created = await companyRepository.create({ name: companyName });
    await loadData();
    return created.id;
  };

  // Application Handlers
  const handleOpenAppDetail = async (appId: string) => {
    try {
      const detailed = await applicationRepository.getDetailed(appId);
      setSelectedAppDetail(detailed);
    } catch (e) {
      console.error('Failed to open app detail:', e);
    }
  };

  const handleCreateOrUpdateApp = async (data: any) => {
    if (editingApp) {
      await applicationRepository.update(editingApp.id, data);
    } else {
      await applicationRepository.create(data);
    }
    setEditingApp(null);
    loadData();
  };

  const handleUpdateAppStatus = async (
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string
  ) => {
    await applicationRepository.updateStatus(applicationId, newStatus, notes);
    loadData();
  };

  const handleDeleteApplication = async (applicationId: string) => {
    await applicationRepository.delete(applicationId);
    setSelectedAppDetail(null);
    loadData();
  };

  // Hiring Round Handlers
  const handleAddRound = async (data: any) => {
    await hiringRoundRepository.create(data);
    loadData();
  };

  const handleUpdateRound = async (roundId: string, data: any) => {
    await hiringRoundRepository.update(roundId, data);
    loadData();
  };

  const handleDeleteRound = async (roundId: string) => {
    await hiringRoundRepository.delete(roundId);
    loadData();
  };

  // Interview Handlers
  const handleCreateInterview = async (data: any) => {
    await interviewRepository.create(data);
    loadData();
  };

  const handleDeleteInterview = async (id: string) => {
    await interviewRepository.delete(id);
    loadData();
  };

  // Offer Handlers
  const handleCreateOffer = async (data: any) => {
    await offerRepository.create(data);
    loadData();
  };

  const handleUpdateOfferStatus = async (
    offerId: string,
    status: OfferAcceptanceStatus
  ) => {
    await offerRepository.updateAcceptanceStatus(offerId, status);
    loadData();
  };

  const handleDeleteOffer = async (offerId: string) => {
    await offerRepository.delete(offerId);
    loadData();
  };

  // Cross-navigation triggers
  const handleOpenApplyForCompany = (comp: CompanyWithCounts) => {
    setPreselectedCompanyForApp(comp.id);
    setEditingApp(null);
    setShowAppForm(true);
  };

  const handleOpenOfferFromApp = (app: ApplicationWithCompany) => {
    setOfferPrefill({
      companyId: app.companyId,
      roleTitle: app.roleTitle,
      applicationId: app.id,
      ctc: app.ctc,
      fixedSalary: app.fixedSalary,
      variableSalary: app.variableSalary,
    });
    setShowOfferForm(true);
  };

  const navTabs: Array<{ id: PlacementTabType; label: string; icon: React.ReactNode }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} color={activeTab === 'dashboard' ? '#FFFFFF' : colors.textSecondary} />,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: <Briefcase size={16} color={activeTab === 'applications' ? '#FFFFFF' : colors.textSecondary} />,
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: <Building2 size={16} color={activeTab === 'companies' ? '#FFFFFF' : colors.textSecondary} />,
    },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: <Calendar size={16} color={activeTab === 'interviews' ? '#FFFFFF' : colors.textSecondary} />,
    },
    {
      id: 'offers',
      label: 'Offers',
      icon: <Award size={16} color={activeTab === 'offers' ? '#FFFFFF' : colors.textSecondary} />,
    },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <AppHeader
        title="Placement Tracker"
        subtitle="Recruitment Pipeline & Offers"
        showBack={showBack}
        showThemeToggle={true}
        rightAction={
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.refreshIconBtn, { backgroundColor: colors.surfaceRaised }]}
          >
            <RefreshCw size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      {/* Sub Navigation Tabs */}
      <View
        style={[
          styles.subTabsContainer,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.surfaceRaised,
                    borderColor: isActive ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                {tab.icon}
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color: isActive ? '#FFFFFF' : colors.textSecondary,
                      fontSize: typography.fontSizes.xs,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContentContainer}>
        {loading ? (
          <LoadingIndicator message="Syncing placement database..." />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <PlacementDashboardTab
                metrics={metrics}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenNewApplication={() => {
                  setPreselectedCompanyForApp(null);
                  setEditingApp(null);
                  setShowAppForm(true);
                }}
                onOpenNewCompany={() => {
                  setEditingCompany(null);
                  setShowCompanyForm(true);
                }}
                onOpenNewInterview={() => setShowInterviewForm(true)}
                onOpenNewOffer={() => {
                  setOfferPrefill({});
                  setShowOfferForm(true);
                }}
                onSelectApplication={handleOpenAppDetail}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationListTab
                applications={applications}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onSelectApplication={handleOpenAppDetail}
                onOpenAddModal={() => {
                  setPreselectedCompanyForApp(null);
                  setEditingApp(null);
                  setShowAppForm(true);
                }}
              />
            )}

            {activeTab === 'companies' && (
              <CompanyListTab
                companies={companies}
                industries={industries}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onSelectCompany={(comp) => setSelectedCompanyDetail(comp)}
                onOpenAddModal={() => {
                  setEditingCompany(null);
                  setShowCompanyForm(true);
                }}
                onOpenApplyToCompany={handleOpenApplyForCompany}
              />
            )}

            {activeTab === 'interviews' && (
              <InterviewExperienceTab
                interviews={interviews}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onOpenAddModal={() => setShowInterviewForm(true)}
                onDeleteInterview={handleDeleteInterview}
              />
            )}

            {activeTab === 'offers' && (
              <OffersTab
                offers={offers}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onOpenAddModal={() => {
                  setOfferPrefill({});
                  setShowOfferForm(true);
                }}
                onUpdateStatus={handleUpdateOfferStatus}
                onDeleteOffer={handleDeleteOffer}
              />
            )}
          </>
        )}
      </View>

      {/* Modals */}
      {/* 1. Company Form Modal */}
      <CompanyFormModal
        visible={showCompanyForm}
        initialData={editingCompany}
        onClose={() => {
          setShowCompanyForm(false);
          setEditingCompany(null);
        }}
        onSubmit={handleCreateOrUpdateCompany}
      />

      {/* 2. Company Detail Modal */}
      <CompanyDetailModal
        visible={selectedCompanyDetail !== null}
        company={selectedCompanyDetail}
        onClose={() => setSelectedCompanyDetail(null)}
        onEdit={(comp) => {
          setEditingCompany(comp);
          setShowCompanyForm(true);
        }}
        onDelete={handleDeleteCompany}
        onAddApplication={handleOpenApplyForCompany}
      />

      {/* 3. Application Form Modal */}
      <ApplicationFormModal
        visible={showAppForm}
        companies={companies}
        preselectedCompanyId={preselectedCompanyForApp}
        initialData={editingApp}
        onClose={() => {
          setShowAppForm(false);
          setEditingApp(null);
          setPreselectedCompanyForApp(null);
        }}
        onSubmit={handleCreateOrUpdateApp}
        onQuickAddCompany={handleQuickAddCompany}
      />

      {/* 4. Application Detail Modal */}
      <ApplicationDetailModal
        visible={selectedAppDetail !== null}
        application={selectedAppDetail}
        onClose={() => setSelectedAppDetail(null)}
        onEdit={(app) => {
          setEditingApp(app);
          setShowAppForm(true);
        }}
        onDelete={handleDeleteApplication}
        onUpdateStatus={handleUpdateAppStatus}
        onAddRound={handleAddRound}
        onUpdateRound={handleUpdateRound}
        onDeleteRound={handleDeleteRound}
        onOpenAddOffer={handleOpenOfferFromApp}
      />

      {/* 5. Interview Experience Form Modal */}
      <InterviewFormModal
        visible={showInterviewForm}
        companies={companies}
        onClose={() => setShowInterviewForm(false)}
        onSubmit={handleCreateInterview}
      />

      {/* 6. Offer Form Modal */}
      <OfferFormModal
        visible={showOfferForm}
        companies={companies}
        preselectedCompanyId={offerPrefill.companyId}
        preselectedRole={offerPrefill.roleTitle}
        preselectedAppId={offerPrefill.applicationId}
        preselectedCtc={offerPrefill.ctc}
        preselectedFixed={offerPrefill.fixedSalary}
        preselectedVariable={offerPrefill.variableSalary}
        onClose={() => {
          setShowOfferForm(false);
          setOfferPrefill({});
        }}
        onSubmit={handleCreateOffer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTabsContainer: {
    borderBottomWidth: 1,
  },
  tabsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  tabButtonText: {
    fontWeight: '700',
  },
  tabContentContainer: {
    flex: 1,
  },
});
