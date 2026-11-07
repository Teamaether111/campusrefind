import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  Compass, 
  PlusCircle, 
  Sparkles, 
  User, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff,
  Bell,
  Check,
  ShieldCheck,
  MapPin,
  Map
} from 'lucide-react';
import { 
  CampusItem, 
  Claim, 
  SmartMatchPair, 
  NotificationItem, 
  CampusActivity, 
  ClaimStatus,
  CampusBuildingId
} from './types';
import { 
  getStoredItems, 
  saveStoredItems, 
  getStoredClaims, 
  saveStoredClaims, 
  getStoredNotifications, 
  saveStoredNotifications, 
  getStoredActivities, 
  saveStoredActivities, 
  getStoredUserProfile, 
  resetDemoData, 
  UserProfile 
} from './utils/storage';
import { computeAllSmartMatches } from './utils/smartMatch';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ClaimModal } from './components/ClaimModal';
import { NotificationModal } from './components/NotificationModal';
import { BrandLogo } from './components/BrandLogo';
import { PWAInstallButton } from './components/PWAInstallButton';

// Views
import { HomeScreen } from './views/HomeScreen';
import { ExploreScreen } from './views/ExploreScreen';
import { ReportScreen } from './views/ReportScreen';
import { MatchesScreen } from './views/MatchesScreen';
import { ProfileScreen } from './views/ProfileScreen';

export default function App() {
  const [items, setItems] = useState<CampusItem[]>(getStoredItems);
  const [claims, setClaims] = useState<Claim[]>(getStoredClaims);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [activities, setActivities] = useState<CampusActivity[]>(getStoredActivities);
  const [user, setUser] = useState<UserProfile>(getStoredUserProfile);

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'report' | 'matches' | 'profile'>('home');
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<CampusBuildingId | null>(null);

  // Modals
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<CampusItem | null>(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<CampusItem | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Desktop simulator mode (preview mobile framing)
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

  // Online / Offline status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Compute SmartMatches reactively whenever items list changes
  const smartMatches = useMemo(() => {
    return computeAllSmartMatches(items);
  }, [items]);

  // Handle new item created from Report screen
  const handleItemCreated = (newItem: CampusItem) => {
    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    saveStoredItems(updatedItems);

    // Add activity
    const newActivity: CampusActivity = {
      id: `act-${Date.now()}`,
      itemTitle: newItem.title,
      category: newItem.category,
      location: newItem.locationDetail.split(',')[0],
      timestamp: 'Just now',
      action: newItem.type === 'lost' ? 'reported_lost' : 'reported_found',
      badge: newItem.type === 'lost' ? 'Lost Report Filed' : 'Found Item Registered',
    };
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    saveStoredActivities(updatedActivities);

    // Compute matches for this new item and notify if high score
    const newMatches = computeAllSmartMatches(updatedItems);
    const itemMatch = newMatches.find(m => m.lostItem.id === newItem.id || m.foundItem.id === newItem.id);
    if (itemMatch && itemMatch.totalScore >= 75) {
      const matchNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `${itemMatch.totalScore}% Match for "${newItem.title}"`,
        message: `SmartMatch detected a potential counterpart reported at ${itemMatch.lostItem.id === newItem.id ? itemMatch.foundItem.locationDetail : itemMatch.lostItem.locationDetail}.`,
        timestamp: 'Just now',
        read: false,
        type: 'match',
        targetTab: 'matches',
        targetItemId: newItem.id,
      };
      const updatedNotifs = [matchNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveStoredNotifications(updatedNotifs);
    }
  };

  // Handle new claim submission
  const handleSubmitClaim = (newClaim: Claim) => {
    const updatedClaims = [newClaim, ...claims];
    setClaims(updatedClaims);
    saveStoredClaims(updatedClaims);

    // Update item status to 'claimed' if not already
    const updatedItems = items.map(it => 
      it.id === newClaim.itemId ? { ...it, status: 'claimed' as const } : it
    );
    setItems(updatedItems);
    saveStoredItems(updatedItems);

    // Add claim notification
    const claimNotif: NotificationItem = {
      id: `notif-claim-${Date.now()}`,
      title: `Claim Logged: ${newClaim.itemTitle}`,
      message: `Your ownership claim #${newClaim.id} is Under Review. Please bring your student ID to Gate 1.`,
      timestamp: 'Just now',
      read: false,
      type: 'claim',
      targetTab: 'profile',
    };
    const updatedNotifs = [claimNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Update claim status (e.g. approve or mark recovered)
  const handleUpdateClaimStatus = (claimId: string, newStatus: ClaimStatus, notes?: string) => {
    const updatedClaims = claims.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: newStatus,
          reviewerNotes: notes || c.reviewerNotes,
        };
      }
      return c;
    });
    setClaims(updatedClaims);
    saveStoredClaims(updatedClaims);

    // If marked recovered, update corresponding item status to 'recovered'
    const targetClaim = claims.find(c => c.id === claimId);
    if (targetClaim && newStatus === 'Recovered') {
      const updatedItems = items.map(it => 
        it.id === targetClaim.itemId ? { ...it, status: 'recovered' as const } : it
      );
      setItems(updatedItems);
      saveStoredItems(updatedItems);

      // Add recovered activity
      const recActivity: CampusActivity = {
        id: `act-rec-${Date.now()}`,
        itemTitle: targetClaim.itemTitle,
        category: 'Personal Belongings',
        location: 'Security Desk Gate 1',
        timestamp: 'Just now',
        action: 'recovered',
        badge: 'Reunited at Gate 1',
      };
      setActivities([recActivity, ...activities]);
      saveStoredActivities([recActivity, ...activities]);
    }
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // Demo reset
  const handleResetDemo = () => {
    resetDemoData();
    setItems(getStoredItems());
    setClaims(getStoredClaims());
    setNotifications(getStoredNotifications());
    setActivities(getStoredActivities());
    setUser(getStoredUserProfile());
    setActiveTab('home');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-1.5 text-center font-medium flex items-center justify-center gap-1.5 shadow-xs sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode: Cached campus listings are being displayed.</span>
        </div>
      )}

      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        matchesCount={smartMatches.length}
        user={user}
      />

      {/* Main Content Layout with optional Desktop Mobile Simulator Toggle */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-12">
        {/* Desktop Viewport Simulator Floating Switch */}
        <div className="hidden lg:flex items-center justify-end mb-3">
          <button
            onClick={() => setIsMobileSimulator(!isMobileSimulator)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-2xs text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition"
          >
            {isMobileSimulator ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-600" />
                <span>Switch to Full Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Mobile Frame Preview</span>
              </>
            )}
          </button>
        </div>

        {/* Framing container */}
        <div className={isMobileSimulator ? 'max-w-md mx-auto bg-slate-50 rounded-[40px] border-8 border-slate-900 shadow-2xl p-4 overflow-hidden min-h-[780px]' : ''}>
          {/* Active Tab Screen */}
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              items={items}
              smartMatches={smartMatches}
              activities={activities}
              onNavigateTab={setActiveTab}
              onStartReport={(type) => {
                setReportType(type);
                setActiveTab('report');
              }}
              onSearchQuery={(q) => {
                setSearchQuery(q);
                setActiveTab('explore');
              }}
              onViewItemDetails={setSelectedItemForDetail}
              onInitiateClaim={setSelectedItemForClaim}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreScreen
              items={items}
              initialSearchQuery={searchQuery}
              initialLocationFilter={locationFilter}
              onViewDetails={setSelectedItemForDetail}
              onInitiateClaim={setSelectedItemForClaim}
            />
          )}

          {activeTab === 'report' && (
            <ReportScreen
              user={user}
              initialType={reportType}
              onItemCreated={handleItemCreated}
              onNavigateToMatches={() => setActiveTab('matches')}
              onNavigateToExplore={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesScreen
              user={user}
              matches={smartMatches}
              onInitiateClaim={setSelectedItemForClaim}
              onViewDetails={setSelectedItemForDetail}
              onNavigateToReport={() => {
                setReportType('lost');
                setActiveTab('report');
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              user={user}
              items={items}
              claims={claims}
              onViewItemDetails={setSelectedItemForDetail}
              onUpdateClaimStatus={handleUpdateClaimStatus}
              onResetDemo={handleResetDemo}
              onNavigateToReport={() => {
                setReportType('lost');
                setActiveTab('report');
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchesCount={smartMatches.length}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onInitiateClaim={(item) => setSelectedItemForClaim(item)}
        onFindMatches={(item) => {
          setActiveTab('matches');
        }}
      />

      {/* Secure Claim Verification Modal */}
      <ClaimModal
        item={selectedItemForClaim}
        user={user}
        onClose={() => setSelectedItemForClaim(null)}
        onSubmitClaim={handleSubmitClaim}
      />

      {/* Campus Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={(notif) => {
          setIsNotificationsOpen(false);
          if (notif.targetTab) setActiveTab(notif.targetTab);
        }}
      />
    </div>
  );
}
