/**
 * TechAssist AI - Master Application Coordinator
 * B.Tech CSE Intelligent Technical Support & Troubleshooting Agent
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { AgentView } from './components/AgentView.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { IssuesView } from './components/IssuesView.tsx';
import { ConversationsView } from './components/ConversationsView.tsx';
import { TicketsView } from './components/TicketsView.tsx';
import { KnowledgeBaseView } from './components/KnowledgeBaseView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ClarificationModal } from './components/ClarificationModal.tsx';
import { User, DiagnosticSessionState, DashboardStats } from './types.ts';
import { LanguageCode } from './i18n/translations.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('agent');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('techassist_token'));
  const [session, setSession] = useState<DiagnosticSessionState | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
    () => (localStorage.getItem('techassist_lang') as LanguageCode) || 'en'
  );

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('techassist_lang', lang);
  };

  // Clarification state
  const [clarificationOpen, setClarificationOpen] = useState(false);
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [clarificationCategories, setClarificationCategories] = useState<string[]>([]);
  const [pendingProblemText, setPendingProblemText] = useState('');

  // Ticket highlight
  const [highlightTicketId, setHighlightTicketId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Fetch current user and stats
  const fetchAuthUser = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error('Failed to fetch user:', e);
    }
  };

  const fetchStats = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/dashboard/stats', { headers });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard stats:', e);
    }
  };

  useEffect(() => {
    fetchAuthUser();
    fetchStats();
  }, [token]);

  // Start diagnosis
  const handleStartDiagnosis = async (problemText: string, manualProblemId?: string) => {
    setIsLoading(true);
    setPendingProblemText(problemText);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/diagnose/start', {
        method: 'POST',
        headers,
        body: JSON.stringify({ problemText, manualProblemId })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to start diagnosis.');
        return;
      }

      if (data.needsClarification) {
        setClarificationMessage(
          data.clarificationMessage ||
            'I could not confidently identify the exact technical problem. Please choose the closest category:'
        );
        setClarificationCategories(
          data.suggestedCategories || ['Network', 'Hardware', 'Performance', 'Browser', 'Printer', 'Software', 'Operating System', 'Storage']
        );
        setClarificationOpen(true);
        return;
      }

      const s = data.session;
      setSession({
        issueId: s.issueId,
        conversationId: s.conversationId,
        problemId: s.problemId,
        category: s.category,
        title: s.title,
        severity: s.severity,
        symptoms: s.symptoms || [],
        possibleCauses: s.possibleCauses || [],
        currentNodeId: s.currentNodeId,
        stepNumber: s.stepNumber || 1,
        instruction: s.instruction,
        question: s.question,
        options: s.options || [],
        optionsDetails: s.optionsDetails,
        status: 'IN PROGRESS',
        isComplete: false,
        history: []
      });

      setActiveTab('agent');
      fetchStats();
    } catch (e: any) {
      console.error('Error starting diagnosis:', e);
      alert('Diagnostic connection error: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clarification category selected
  const handleClarificationSelect = (category: string) => {
    setClarificationOpen(false);
    const categoryMapping: Record<string, string> = {
      Network: 'wifi-no-internet',
      Hardware: 'laptop-overheating',
      Performance: 'laptop-slow-performance',
      Browser: 'browser-crashes',
      Printer: 'printer-failure',
      Software: 'software-crashes',
      'Operating System': 'os-bsod-boot',
      Storage: 'storage-full'
    };
    const mappedProblemId = categoryMapping[category] || 'wifi-no-internet';
    handleStartDiagnosis(pendingProblemText, mappedProblemId);
  };

  // Submit response to step
  const handleStepResponse = async (response: string) => {
    if (!session || isLoading) return;
    setIsLoading(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/diagnose/step', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          issueId: session.issueId,
          conversationId: session.conversationId,
          problemId: session.problemId,
          currentNodeId: session.currentNodeId,
          response
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Step evaluation failed.');
        return;
      }

      // Append completed step to history
      const newHistoryItem = {
        stepNumber: session.stepNumber,
        instruction: session.instruction,
        question: session.question,
        userResponse: response,
        summary: data.summary
      };

      const updatedHistory = [...session.history, newHistoryItem];

      if (data.isComplete) {
        setSession({
          ...session,
          status: data.status,
          isComplete: true,
          resolutionText: data.resolutionText,
          escalationReason: data.escalationReason,
          ticket: data.ticket,
          history: updatedHistory
        });
      } else {
        setSession({
          ...session,
          status: 'IN PROGRESS',
          currentNodeId: data.currentNodeId,
          stepNumber: data.stepNumber,
          instruction: data.instruction,
          question: data.question,
          options: data.options,
          optionsDetails: data.optionsDetails,
          history: updatedHistory
        });
      }

      fetchStats();
    } catch (e: any) {
      console.error('Step submission error:', e);
      alert('Error advancing step: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual escalation
  const handleEscalateManual = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/diagnose/escalate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          issueId: session.issueId,
          customReason: 'User requested direct Tier 2 technical engineering escalation.'
        })
      });

      const data = await res.json();
      if (res.ok && data.ticket) {
        setSession({
          ...session,
          status: 'ESCALATED',
          isComplete: true,
          escalationReason: data.ticket.escalation_reason,
          ticket: data.ticket
        });
        fetchStats();
      }
    } catch (e) {
      console.error('Manual escalation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setSession(null);
  };

  const handleViewTicket = (ticketId: string) => {
    setHighlightTicketId(ticketId);
    setActiveTab('tickets');
  };

  const handleAuthSuccess = (authenticatedUser: User, userToken: string) => {
    setUser(authenticatedUser);
    setToken(userToken);
    localStorage.setItem('techassist_token', userToken);
    fetchStats();
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('techassist_token');
    setToken(null);
    setUser(null);
    fetchAuthUser();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500/30 selection:text-sky-300">
      {/* Top Header Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onStartNewDiagnosis={() => {
          setSession(null);
          setActiveTab('agent');
        }}
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onNavigateToProfile={() => setActiveTab('profile')}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar with Profile on Left Corner */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openTicketsCount={stats?.openTickets}
          activeIssuesCount={stats?.activeIssues}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'agent' && (
            <AgentView
              session={session}
              isLoading={isLoading}
              onStartDiagnosis={handleStartDiagnosis}
              onStepResponse={handleStepResponse}
              onEscalateManual={handleEscalateManual}
              onResetSession={handleResetSession}
              onViewTicket={handleViewTicket}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              isLoading={isLoading}
              onStartDiagnosis={(text) => handleStartDiagnosis(text)}
              onOpenConversation={(id) => setActiveTab('history')}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'issues' && (
            <IssuesView
              onContinueTroubleshooting={(text, problemId) => handleStartDiagnosis(text, problemId)}
              onViewTicket={handleViewTicket}
            />
          )}

          {activeTab === 'history' && (
            <ConversationsView
              onContinueTroubleshooting={(text, problemId) => handleStartDiagnosis(text, problemId)}
              onViewTicket={handleViewTicket}
            />
          )}

          {activeTab === 'tickets' && (
            <TicketsView highlightTicketId={highlightTicketId} />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeBaseView
              onTestProblemTree={(problemId, title) => handleStartDiagnosis(title, problemId)}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'profile' && (
            <ProfileView
              user={user}
              onOpenAuth={() => setAuthModalOpen(true)}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Clarification Modal for Ambiguous Queries */}
      <ClarificationModal
        isOpen={clarificationOpen}
        message={clarificationMessage}
        categories={clarificationCategories}
        onSelectCategory={handleClarificationSelect}
        onClose={() => setClarificationOpen(false)}
      />
    </div>
  );
}
