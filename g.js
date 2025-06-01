// ==UserScript==
// @name         Boink Enhancer Pro v2.8.7 (Event UI Enhancements 1 - All)
// @namespace    http://tampermonkey.net/
// @version      2.8.7
// @description  Event UI Enhancements: Select All, Horizontal Buttons, Font improvements. English UI. Fixes: SyntaxError, QuotaError, Event Claims, Notifications, Config Fetch & Apply, Wheel LiveOpId auto-detect, FAB, Upgrades Tab.
// @match        https://boink.boinkers.co/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap
// @require      https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap
// ==/UserScript==

(function() {
    'use strict';

    // Log script loading with new version
    console.log('[🚀] Boink Enhancer Pro v2.8.7 (Event UI Enhancements 1 - All) Loaded!');

    // ------------------------------------------------------
    // Settings & Constants // الإعدادات والثوابت
    // ------------------------------------------------------
    const CONFIG = {
        API: {
            slotUrl: 'https://boink.boinkers.co/api/play/spinSlotMachine/',
            wheelUrl: 'https://boink.boinkers.co/api/play/spinWheelOfFortune/',
            megaUpgradeUrl: 'https://boink.boinkers.co/api/boinkers/megaUpgradeBoinkers',
            singleUpgradeUrl: 'https://boink.boinkers.co/api/boinkers/upgradeBoinker',
            eventClaimBaseUrl: 'https://boink.boinkers.co/api/liveOps/dynamic/',
            addShitBoosterUrl: 'https://boink.boinkers.co/api/boinkers/addShitBooster',
            chargeShieldUrl: 'https://boink.boinkers.co/api/boinkers/chargeShield',
            fetchConfigUrl: 'https://boink.boinkers.co/public/data/config?p=android',
            fetchParamsBase: '?p=android'
        },
        BET_VALUES: { // قيم الرهان
            slot: [1, 2, 3, 5, 10, 25, 50, 100, 150, 500, 1000, 1500, 5000, 10000, 50000, 100000, 500000, 1000000, 50000000, 100000000],
            wheel: [1, 2, 3, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000],
            customSlot: [], // مضاعفات مخصصة للـ Slot
            customWheel: [] // مضاعفات مخصصة للـ Wheel
        },
        MULTIPLIER_RANGES: [ // نطاقات المضاعفات
            { label: '1 - 500', min: 1, max: 500 },
            { label: '1k - 500k', min: 1000, max: 500000 },
            { label: '1M - 100M', min: 1000000, max: 100000000 },
            { label: '100M+', min: 100000001, max: Infinity }
        ],
        WHEEL_PAYLOAD: { // حمولة عجلة الحظ
            liveOpId: '6817575e0dc145bc6a6e89e3' // Default, should be updated from config // افتراضي، يجب تحديثه من الإعدادات
        },
        SELECTORS: { // معرفات العناصر
            settingsMenu: '.settings-menu',
            toggleButtonId: 'toggleScriptButton_pro_v287_evt_all',
            enhancerFloatingButtonId: 'enhancerFloatingBtn_v287_evt_all',
            mainPanelId: 'enhancerProPanel_v287_evt_all',
            mainTabsContainerId: 'enhancerMainTabsContainer_v287_evt_all',
            mainTabButtonClass: 'enhancer-main-tab-button-v287-evt-all',
            mainTabPaneClass: 'enhancer-main-tab-pane-v287-evt-all',
            subTabsContainerClass: 'enhancer-sub-tabs-container',
            subTabButtonClass: 'enhancer-sub-tab-button',
            subTabPaneClass: 'enhancer-sub-tab-pane',
            tokenStatusIndicatorId: 'enhancerTokenStatus_v287_evt_all',
            liveOpIdStatusIndicatorId: 'enhancerLiveOpIdStatus_v287_evt_all',
            vValueStatusIndicatorId: 'enhancerVValueStatus_v287_evt_all',
            configJsonStatusIndicatorId: 'enhancerConfigJsonStatus_v287_evt_all',
            resetConfirmationContainerId: 'enhancerResetConfirmContainer_v287_evt_all',
            addEventFormId: 'enhancerAddEventForm_v287_evt_all',
            eventListContainerId: 'enhancerEventListContainer_v287_evt_all',
            eventGlobalActionsId: 'enhancerEventGlobalActions_v287_evt_all',
            slotMultiplierDisplayButtonIdPrefix: 'multiplier-display-slot-button-',
            slotManualSpinButtonIdPrefix: 'manual-spin-slot-button-',
            slotAutoplayConfigSectionIdPrefix: 'autoplay-config-section-slot-',
            slotAutoplayContentIdPrefix: 'autoplay-content-slot-',
            slotMultiplierSelectionIdPrefix: 'multiplier-selection-slot-',
            wheelMultiplierDisplayButtonIdPrefix: 'multiplier-display-wheel-button-',
            wheelManualSpinButtonIdPrefix: 'manual-spin-wheel-button-',
            wheelAutoplayConfigSectionIdPrefix: 'autoplay-config-section-wheel-',
            wheelAutoplayContentIdPrefix: 'autoplay-content-wheel-',
            wheelMultiplierSelectionIdPrefix: 'multiplier-selection-wheel-',
            notificationContainerId: 'enhancerNotificationContainer_v287_evt_all',
            fetchConfigButtonId: 'enhancerFetchConfigBtn_v287_evt_all'
        },
        STORAGE_KEY: { // مفاتيح التخزين
            token: 'enhancerToken_v287_evt_all',
            liveOpId: 'enhancerLiveOpId_v287_evt_all',
            vValue: 'enhancerVValue_v287_evt_all',
            configJson: 'enhancerConfigJson_v287_evt_all',
            activeMainTab: 'enhancerActiveMainTab_v287_evt_all',
            floatingButtonPosition: 'enhancerFloatingButtonPos_v287_evt_all',
            activeSettingsSubTab: 'enhancerActiveSettingsSubTab_v287_evt_all',
            activeSpinSubTab: 'enhancerActiveSpinSubTab_v287_evt_all',
            activeEventsTasksSubTab: 'enhancerActiveEventsTasksSubTab_v287_evt_all',
            activeBuildSubTab: 'enhancerActiveBuildSubTab_v287_evt_all',
            selectedSlotMultiplierRadio: 'enhancerSelectedSlotMultiplierRadio_v287_evt_all',
            customSlotMultipliers: 'enhancerCustomSlotMultipliers_v287_evt_all',
            autoPlaySlotRunMode: 'enhancerAutoPlaySlotRunMode_v287_evt_all',
            autoPlaySlotTargetCount: 'enhancerAutoPlaySlotTargetCount_v287_evt_all',
            autoPlaySlotDelay: 'enhancerAutoPlaySlotDelay_v287_evt_all',
            autoPlaySlotUseSequence: 'enhancerAutoPlaySlotUseSequence_v287_evt_all',
            autoPlaySlotSequence: 'enhancerAutoPlaySlotSequence_v287_evt_all',
            slotAutoplayCollapsed: 'enhancerSlotAutoplayCollapsed_v287_evt_all',
            selectedWheelMultiplierRadio: 'enhancerSelectedWheelMultiplierRadio_v287_evt_all',
            customWheelMultipliers: 'enhancerCustomWheelMultipliers_v287_evt_all',
            autoPlayWheelRunMode: 'enhancerAutoPlayWheelRunMode_v287_evt_all',
            autoPlayWheelTargetCount: 'enhancerAutoPlayWheelTargetCount_v287_evt_all',
            autoPlayWheelDelay: 'enhancerAutoPlayWheelDelay_v287_evt_all',
            autoPlayWheelUseSequence: 'enhancerAutoPlayWheelUseSequence_v287_evt_all',
            autoPlayWheelSequence: 'enhancerAutoPlayWheelSequence_v287_evt_all',
            wheelAutoplayCollapsed: 'enhancerWheelAutoplayCollapsed_v287_evt_all',
            autoUpgradeAllEnabled: 'enhancerAutoUpgradeAllEnabled_v287_evt_all',
            autoUpgradeAllInterval: 'enhancerAutoUpgradeAllInterval_v287_evt_all',
            autoUpgradeOneEnabled: 'enhancerAutoUpgradeOneEnabled_v287_evt_all',
            autoUpgradeOneInterval: 'enhancerAutoUpgradeOneInterval_v287_evt_all',
            autoUpgradeOnBalanceIncreaseEnabled: 'enhancerAutoUpgradeOnBalanceIncrease_v287_evt_all',
            currentStatsDisplayTab: 'enhancerCurrentStatsTab_v287_evt_all',
            savedEvents: 'enhancerSavedEvents_v287_evt_all'
        },
        MAIN_TABS: [ // التبويبات الرئيسية
            { id: 'settings', label: 'Settings', color: '#9B59B6', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>` },
            { id: 'spin', label: 'SPIN', color: '#E67E22', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>` },
            { id: 'events-tasks', label: 'Events & Tasks', color: '#2ECC71', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>` },
            { id: 'build', label: 'Build', color: '#3498DB', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20V10M12 20V4M18 20V10"></path><path d="M4 20h16"></path></svg>` },
            { id: 'stats', label: 'Stats', color: '#F1C40F', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20V14"></path></svg>` },
        ],
        SETTINGS_SUB_TABS: [ // التبويبات الفرعية للإعدادات
            { id: 'config', label: 'Configuration', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>` },
            { id: 'general', label: 'General', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>` }
        ],
        SPIN_SUB_TABS: [ // التبويبات الفرعية للتدوير
            { id: 'slot', label: 'Slot', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` },
            { id: 'wheel', label: 'Wheel', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>` }
        ],
        EVENTS_TASKS_SUB_TABS: [ // التبويبات الفرعية للفعاليات والمهام
            { id: 'events', label: 'Events', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` },
            { id: 'tasks', label: 'Tasks', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>` }
        ],
        BUILD_SUB_TABS: [ // التبويبات الفرعية للبناء
            { id: 'upgrades', label: 'Upgrades', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>` },
            { id: 'boost', label: 'Boost', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>` }
        ],
        STATS_TABS_ORIGINAL: ["Prize", "Balances", "Energy", "GAE", "Currencies"], // تبويبات الإحصائيات الأصلية
        ICONS: { // الأيقونات
            close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            energy: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
            wheel: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`,
            gold: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><path d="M12 15H7a5 5 0 00-5 5 5 5 0 005 5h10a5 5 0 005-5 5 5 0 00-5-5h-5z"></path></svg>`,
            crypto: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00BCD4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12c0 2.28-1.21 4.38-3.08 5.5L12 22l-5.92-4.5A6.47 6.47 0 013 12a9 9 0 019-9 9 9 0 019 9z"></path><path d="M12 2v5.52"></path><path d="M3.24 7.16L7.5 10.4"></path><path d="M20.76 7.16L16.5 10.4"></path></svg>`,
            add: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
            clear: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
            deleteItem: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            save: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
            key: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
            idCard: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><circle cx="8" cy="10" r="2"></circle><line x1="12" y1="14" x2="17" y2="14"></line><line x1="12" y1="10" x2="17" y2="10"></line></svg>`,
            zap: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
            plusCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
            reset: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
            check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
            xIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
            claim: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            claimMultiple: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            timer: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
            fileJson: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18h-1v-4h-1"></path><path d="M10 22v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"></path></svg>`,
            shield: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
            toolIcon: '🛠️',
            chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
            refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
            selectAll: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
        },
        AUTO_PLAY: { defaultDelay: 1.5, minDelay: 0.5 }, // إعدادات التشغيل التلقائي
        AUTO_UPGRADE: { // إعدادات الترقية التلقائية
            allDefaultInterval: 30,
            oneDefaultInterval: 1,
            minInterval: 0.5,
        }
    };

    // --- Global Application State --- // حالة التطبيق العامة
    const AppState = {
        token: '',
        liveOpId: CONFIG.WHEEL_PAYLOAD.liveOpId,
        vValue: '',
        configJsonContent: '', // Used to populate textarea on load // يستخدم لملء حقل النص عند التحميل
        currentMainTabId: 'spin',
        gameData: { // بيانات اللعبة
            prize: {},
            userGamesEnergy: {},
            newSoftCurrencyAmount: 0,
            previousSoftCurrencyAmount: 0,
            newCryptoCurrencyAmount: 0,
            userGae: {},
            newDynamicCurrencies: {},
            currentStatsDisplayTab: CONFIG.STATS_TABS_ORIGINAL[0]
        },
        autoUpgrade: { // الترقية التلقائية
            all: { isEnabled: false, isPlaying: false, interval: CONFIG.AUTO_UPGRADE.allDefaultInterval, intervalId: null },
            one: { isEnabled: false, isPlaying: false, interval: CONFIG.AUTO_UPGRADE.oneDefaultInterval, intervalId: null },
            onBalanceIncrease: { isEnabled: false }
        },
        slotAutoplayCollapsed: true, // حالة طي قسم التشغيل التلقائي للـ Slot
        wheelAutoplayCollapsed: true, // حالة طي قسم التشغيل التلقائي للـ Wheel
        slotAutoPlay: { isPlayingGlobally: false }, // حالة التشغيل التلقائي الشامل للـ Slot
        wheelAutoPlay: { isPlayingGlobally: false }, // حالة التشغيل التلقائي الشامل للـ Wheel
    };

    // UI Elements // عناصر واجهة المستخدم
    let enhancerFloatingButton = null;
    let mainPanel = null;
    let mainTabsContainer, mainTabsContentArea,
        headerBar, footerStatusContainer,
        slotSpinsCountEl, wheelSpinsCountEl, panelCloseButton,
        statsTabButtonsContainer, statsContentBox, notificationContainer;

    let tokenInputElement, tokenStatusIndicator,
        liveOpIdInputElement, liveOpIdStatusIndicator,
        vValueInputElement, vValueStatusIndicator,
        configJsonInputElement, configJsonStatusIndicator;

    const activeSubTabState = { // حالة التبويبات الفرعية النشطة
        settings: CONFIG.SETTINGS_SUB_TABS[0].id,
        spin: CONFIG.SPIN_SUB_TABS[0].id,
        'events-tasks': CONFIG.EVENTS_TASKS_SUB_TABS[0].id,
        build: CONFIG.BUILD_SUB_TABS[0].id,
    };

    let savedEvents = []; // الفعاليات المحفوظة
    let currentlyEditingEventId = null; // معرف الفعالية قيد التعديل حاليًا
    let eventTimersInterval = null; // مؤقت تحديث عدادات الفعاليات

    const subTabConfigMapping = { // ربط إعدادات التبويبات الفرعية
        settings: CONFIG.SETTINGS_SUB_TABS,
        spin: CONFIG.SPIN_SUB_TABS,
        'events-tasks': CONFIG.EVENTS_TASKS_SUB_TABS,
        build: CONFIG.BUILD_SUB_TABS,
    };
    const subTabContentPopulationMapping = { // ربط ملء محتوى التبويبات الفرعية
        settings: populateSettingsSubTabContent,
        spin: populateSpinSubTabContent,
        'events-tasks': populateEventsTasksSubTabContent,
        build: populateBuildSubTabContent,
    };
     const subTabStorageKeyMapping = { // ربط مفاتيح تخزين التبويبات الفرعية
        settings: CONFIG.STORAGE_KEY.activeSettingsSubTab,
        spin: CONFIG.STORAGE_KEY.activeSpinSubTab,
        'events-tasks': CONFIG.STORAGE_KEY.activeEventsTasksSubTab,
        build: CONFIG.STORAGE_KEY.activeBuildSubTab,
    };

    // --- Helper Functions (Global) --- // وظائف مساعدة (عامة)
    const formatNumber = n => (n === null || n === undefined || isNaN(Number(n))) ? '0' : Number(n).toLocaleString("en-US");
    function formatMultiplier(num) { if (num >= 1000000) return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'M'; if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'k'; return num.toString(); }
    function formatTimeRemaining(endDateString) { const endTime = new Date(endDateString).getTime(); const now = new Date().getTime(); const timeLeft = endTime - now; if (timeLeft <= 0) { return '<span class="timer-expired">Expired</span>'; } const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)); const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000); let timeStr = ''; if (days > 0) timeStr += days + 'd '; if (hours > 0 || days > 0) timeStr += hours + 'h '; if (minutes > 0 || hours > 0 || days > 0) timeStr += minutes + 'm '; timeStr += seconds + 's'; return timeStr.trim(); }
    async function getStoredValue(key, defaultValue) { try { if (typeof GM_getValue === 'function') { return await GM_getValue(key, defaultValue); } else { const storedValue = localStorage.getItem(key); return storedValue !== null ? JSON.parse(storedValue) : defaultValue; } } catch (e) { console.warn(`[Enhancer Warn] Error reading storage key "${key}":`, e); const storedValue = localStorage.getItem(key); return storedValue !== null ? JSON.parse(storedValue) : defaultValue; } }
    async function setStoredValue(key, value) { try { if (typeof GM_setValue === 'function') { await GM_setValue(key, value); } else { localStorage.setItem(key, JSON.stringify(value)); } } catch (e) { console.warn(`[Enhancer Warn] Error writing storage key "${key}":`, e); try { localStorage.setItem(key, JSON.stringify(value)); } catch (lsError) { console.error(`[Enhancer Error] Failed to write to localStorage for key "${key}":`, lsError); } } }
    async function removeStoredValue(key) { try { if (typeof GM_setValue === 'function') { await GM_setValue(key, undefined); } else { localStorage.removeItem(key); } } catch (e) { console.warn(`[Enhancer Warn] Error removing storage key "${key}":`, e); try { localStorage.removeItem(key); } catch (lsError) { console.error(`[Enhancer Error] Failed to remove from localStorage for key "${key}":`, lsError); } } }
    function createButton(text, onClick, classNames = [], type = 'button') { const button = document.createElement('button'); button.type = type; button.className = 'enhancer-styled-button'; classNames.forEach(cn => button.classList.add(cn)); button.innerHTML = text; if (onClick && type !== 'submit') button.addEventListener('click', onClick); return button; }
    function createToggleSwitch(id, isChecked, onChangeCallback) { const toggleLabel = document.createElement('label'); toggleLabel.className = 'enhancer-toggle-switch'; const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = id; checkbox.checked = isChecked; checkbox.addEventListener('change', onChangeCallback); const slider = document.createElement('span'); slider.className = 'enhancer-toggle-slider'; toggleLabel.appendChild(checkbox); toggleLabel.appendChild(slider); return toggleLabel; }
    function createSettingItemRow(labelText, controlElement) { const itemRow = document.createElement('div'); itemRow.className = 'enhancer-setting-item-row'; const label = document.createElement('label'); label.textContent = labelText; if (controlElement.id || (controlElement.querySelector && controlElement.querySelector('input') && controlElement.querySelector('input').id)) { label.htmlFor = controlElement.id || controlElement.querySelector('input').id; } itemRow.appendChild(label); itemRow.appendChild(controlElement); return itemRow; }
    function createLabelInputPair(inputId, labelText, inputType, inputValue, onChangeCallback, inputAttributes = {}) { const container = document.createElement('div'); container.className = 'enhancer-setting-item'; const label = document.createElement('label'); label.htmlFor = inputId; label.textContent = labelText; container.appendChild(label); const input = document.createElement('input'); input.type = inputType; input.id = inputId; input.className = 'enhancer-text-input'; input.value = inputValue; if (onChangeCallback) input.addEventListener('change', onChangeCallback); for (const attr in inputAttributes) { input.setAttribute(attr, inputAttributes[attr]); } container.appendChild(input); return container; }
    function createRadioGroup(name, options, currentValue, onChangeCallback, groupLabelText) { const groupContainer = document.createElement('div'); groupContainer.className = 'enhancer-setting-item'; if (groupLabelText) { const groupLabel = document.createElement('label'); groupLabel.textContent = groupLabelText; groupContainer.appendChild(groupLabel); } const radioGroupDiv = document.createElement('div'); radioGroupDiv.className = 'radio-group'; options.forEach(optionValue => { const radioLabel = document.createElement('label'); const radioInput = document.createElement('input'); radioInput.type = 'radio'; radioInput.name = name; radioInput.value = optionValue; radioInput.checked = (optionValue === currentValue); radioInput.addEventListener('change', (e) => { if (e.target.checked) onChangeCallback(e.target.value); }); const radioSpan = document.createElement('span'); radioSpan.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1); radioLabel.appendChild(radioInput); radioLabel.appendChild(radioSpan); radioGroupDiv.appendChild(radioLabel); }); groupContainer.appendChild(radioGroupDiv); return groupContainer; }
    // --- نهاية الوظائف المساعدة ---

    // --- UI Update & Notification Functions --- // وظائف تحديث الواجهة والإشعارات
    function showNotification(message, type = 'info', details = null) {
        if (!notificationContainer || !notificationContainer.isConnected) {
            console.warn("[Enhancer Warn] Notification container not found for:", message);
            if(typeof updateFooterStatus === 'function') updateFooterStatus(message, type);
            return;
        }
        const notification = document.createElement('div');
        notification.className = `enhancer-notification ${type}`;
        let titleText = type.charAt(0).toUpperCase() + type.slice(1);
        let messageText = message;
        if (details) {
            if (details.prizeType && details.prizeType !== titleText) titleText = details.prizeType;
            if (details.message && details.message !== message) messageText = details.message;
            if (details.prizeValue !== null && details.prizeValue !== undefined) {
                if (!messageText.toLowerCase().includes('value:') && !messageText.toLowerCase().includes(formatNumber(details.prizeValue).toLowerCase())) {
                    messageText += ` (Value: <span class="prize-value">${formatNumber(details.prizeValue)}</span>)`;
                }
            }
        }
        notification.innerHTML = `<strong>${titleText}</strong><div class="notification-message">${messageText}</div>`;
        notification.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => { if (notification.isConnected) notification.remove(); }, 300);
        });
        if (notificationContainer.firstChild) {
            notificationContainer.insertBefore(notification, notificationContainer.firstChild);
        } else {
            notificationContainer.appendChild(notification);
        }
        setTimeout(() => {
            if (notification.isConnected && !notification.classList.contains('fade-out')) {
                notification.classList.add('fade-out');
                setTimeout(() => { if (notification.isConnected) notification.remove(); }, 300);
            }
        }, 7000);
    }

    function updateFooterStatus(text, type = 'info', context = null, contextMultiplier = null, actionType = null) {
        if (footerStatusContainer) {
            let contextHTML = '';
            if (context) {
                contextHTML = `<span class="status-context">(${context}`;
                if (contextMultiplier !== null && actionType === "Spin") contextHTML += ` ×${formatMultiplier(contextMultiplier)}`;
                contextHTML += `)</span>`;
            }
            footerStatusContainer.innerHTML = `<span class="status-message ${type}">${text}</span> ${contextHTML}`;
        }
    }

    function updateSpinsLeftFromState() {
        if (!slotSpinsCountEl && mainPanel && mainPanel.isConnected) {
            const slotSpans = document.querySelectorAll(`#slotSpinsCount_${CONFIG.SELECTORS.mainPanelId}`);
            if (slotSpans.length > 0) slotSpinsCountEl = slotSpans[0];
        }
        if (!wheelSpinsCountEl && mainPanel && mainPanel.isConnected) {
             const wheelSpans = document.querySelectorAll(`#wheelSpinsCount_${CONFIG.SELECTORS.mainPanelId}`);
            if (wheelSpans.length > 0) wheelSpinsCountEl = wheelSpans[0];
        }
        const slotEnergy = AppState.gameData?.userGamesEnergy?.slotMachine?.energy;
        const wheelEnergy = AppState.gameData?.userGamesEnergy?.wheelOfFortune?.energy;
        const slotSpans = document.querySelectorAll(`#slotSpinsCount_${CONFIG.SELECTORS.mainPanelId}`);
        slotSpans.forEach(span => { if (span) { span.textContent = formatNumber(slotEnergy ?? 0); if (span.parentElement) span.parentElement.style.color = (slotEnergy ?? 0) <= 0 ? 'var(--enhancer-error-color)' : ''; } });
        const wheelSpans = document.querySelectorAll(`#wheelSpinsCount_${CONFIG.SELECTORS.mainPanelId}`);
         wheelSpans.forEach(span => { if (span) { span.textContent = formatNumber(wheelEnergy ?? 0); if (span.parentElement) span.parentElement.style.color = (wheelEnergy ?? 0) <= 0 ? 'var(--enhancer-error-color)' : ''; } });
        if (document.getElementById(`main-tab-pane-stats`)?.classList.contains('active') && typeof renderStatsContent === 'function') renderStatsContent();
    }

    window.updateGlobalAutoplayControls = function() {
        const isSlotPlaying = typeof SlotMachineModule !== 'undefined' && SlotMachineModule.isAutoPlaying ? SlotMachineModule.isAutoPlaying() : false;
        const isWheelPlaying = typeof WheelOfFortuneModule !== 'undefined' && WheelOfFortuneModule.isAutoPlaying ? WheelOfFortuneModule.isAutoPlaying() : false;
        const isAnyGameAutoPlaying = isSlotPlaying || isWheelPlaying;
        if (typeof SlotMachineModule !== 'undefined' && SlotMachineModule.updateControlsBasedOnGlobalAutoplay) SlotMachineModule.updateControlsBasedOnGlobalAutoplay(isAnyGameAutoPlaying);
        if (typeof WheelOfFortuneModule !== 'undefined' && WheelOfFortuneModule.updateControlsBasedOnGlobalAutoplay) WheelOfFortuneModule.updateControlsBasedOnGlobalAutoplay(isAnyGameAutoPlaying);
    }

    function renderStatsContent() {
        if (!statsContentBox || !statsContentBox.isConnected) return;
        let html = "";
        const currentDisplayTab = AppState.gameData.currentStatsDisplayTab || CONFIG.STATS_TABS_ORIGINAL[0];
        const { prize, newSoftCurrencyAmount, newCryptoCurrencyAmount, userGamesEnergy, newDynamicCurrencies, userGae } = AppState.gameData;
        const goldIcon = CONFIG.ICONS.gold; const cryptoIcon = CONFIG.ICONS.crypto;
        const infoColor = 'var(--enhancer-info-color)'; const successColor = 'var(--enhancer-success-color)';
        const goldColor = '#FFD700'; const cryptoColor = '#00BCD4';
        switch (currentDisplayTab) {
            case "Prize": html = `<b>🎁 Prize Info:</b> - Type: <span style="color:${infoColor}">${prize?.prizeTypeName ?? "N/A"}</span> - Value: <span style="color:${successColor}">${formatNumber(prize?.prizeValue)}</span> - Particles: ${formatNumber(prize?.prizeParticles)}`; break;
            case "Balances": html = `<b>💰 Balances:</b> - Gold: ${goldIcon}<span style="color:${goldColor}; font-weight: bold;">${formatNumber(newSoftCurrencyAmount)}</span> - Crypto: ${cryptoIcon}<span style="color:${cryptoColor}; font-weight: bold;">${formatNumber(newCryptoCurrencyAmount)}</span>`; break;
            case "Energy": html = `<b>⚡ Energy:</b>`; if (userGamesEnergy && Object.keys(userGamesEnergy).length > 0) { for (const [k, v] of Object.entries(userGamesEnergy)) { const gameName = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); html += `<br><b>${gameName}:</b> &nbsp;&nbsp;- Energy: <span style="color:${infoColor}">${formatNumber(v?.energy)}</span> &nbsp;&nbsp;- Bets Done: ${formatNumber(v?.betsDone)} &nbsp;&nbsp;- Energy Used: ${formatNumber(v?.energyUsed)}`; } } else { html += `No energy data available.`; } break;
            case "GAE": html = `<b>📈 GAE Stats:</b><br> - Resource: ${formatNumber(userGae?.gaeResource)}<br> - Earned Energy: ${formatNumber(userGae?.gaeEnergyEarned)}<br> - Earned Gold: ${formatNumber(userGae?.gaeGoldEarned)}<br> - USD Value: <span style="color:${successColor}">$${formatNumber(userGae?.gaeUsdValue)}</span><br> - Purchases Made: ${formatNumber(userGae?.gaePurchasesMade)}`; break;
            case "Currencies": html = `<b>💎 Dynamic Currencies:</b>`; if (newDynamicCurrencies && Object.keys(newDynamicCurrencies).length > 0) { for (const c of Object.values(newDynamicCurrencies)) { html += `<br>- ${c.presentationName || c.uniqueId || "Unknown Currency"}: <span style="color:${successColor}">${formatNumber(c.balance)}</span>`; } } else { html += `No dynamic currency data available.`; } break;
            default: html = "Select a tab to view stats.";
        }
        statsContentBox.innerHTML = `<div style="--bold-color: var(--enhancer-accent-text-color);">${html.replace(/<b>/g, '<b style="color: var(--bold-color);">')}</div>`;
    }
    // --- نهاية وظائف تحديث الواجهة والإشعارات ---


    // --- API Call & Config Fetch Functions --- // وظائف استدعاء الـ API وجلب الإعدادات
    /**
     * @async
     * @function sendApiRequest
     * @description Sends an API request and processes the response, showing notifications and updating status. // يرسل طلب API ويعالج الاستجابة، مع عرض الإشعارات وتحديث الحالة.
     * @param {string} url - The API endpoint URL. // عنوان URL لنقطة نهاية الـ API.
     * @param {object} options - Fetch options (method, headers, body). // خيارات الجلب (الطريقة، الرؤوس، الجسم).
     * @param {string} loadingMessage - Message to show while loading. // رسالة للعرض أثناء التحميل.
     * @param {string} [actionContext="API Call"] - Context for the action (e.g., "Spin", "Upgrade All"). // سياق الإجراء (مثل "Spin"، "Upgrade All").
     * @param {number|string|null} [contextMultiplier=null] - Multiplier or other context for display. // مضاعف أو سياق آخر للعرض.
     * @returns {Promise<object|null>} Resolves with API data or null on critical failure. // يرجع ببيانات الـ API أو null في حالة الفشل الحرج.
     */
    async function sendApiRequest(url, options, loadingMessage, actionContext = "API Call", contextMultiplier = null) {
        if (!AppState.token) {
            showNotification('Auth token missing.', 'error', { prizeType: `Error: ${actionContext}` });
            updateFooterStatus('Auth token missing.', 'error', 'System');
            if(typeof updateTokenStatusIndicator === 'function') updateTokenStatusIndicator();
            stopAllAutoPlaysAndUpgrades();
            return Promise.reject(new Error('Auth token missing.'));
        }

        let finalUrl = url;
        const isFetchConfigCall = url === CONFIG.API.fetchConfigUrl;

        if (AppState.vValue && !isFetchConfigCall) {
            if (finalUrl.includes('?')) {
                finalUrl += `&v=${AppState.vValue}`;
            } else {
                finalUrl += `?v=${AppState.vValue}`;
            }
        } else if (!AppState.vValue && !isFetchConfigCall && !url.startsWith(CONFIG.API.eventClaimBaseUrl)) { // 'v' not needed for fetchConfig or event claims if missing // 'v' غير مطلوب لجلب الإعدادات أو مطالبات الفعاليات إذا كان مفقودًا
            showNotification('API "v" Parameter missing.', 'error', { prizeType: `Error: ${actionContext}` });
            updateFooterStatus('API "v" Parameter missing.', 'error', 'System');
            if(typeof updateVValueStatusIndicator === 'function') updateVValueStatusIndicator();
            return Promise.reject(new Error('API "v" Parameter missing.'));
        }


        const isEventClaimAction = actionContext.startsWith("Event:");
        let displayMultiplierInFooter = isEventClaimAction ? null : contextMultiplier;
        updateFooterStatus(loadingMessage, 'info', actionContext, displayMultiplierInFooter, isEventClaimAction ? "Claim" : actionContext);

        try {
            const response = await fetch(finalUrl, options);
            const responseCloneForText = response.clone();
            let data;

            try {
                data = await response.json();
            } catch (jsonError) {
                const errorText = await responseCloneForText.text();
                console.error(`API JSON Parse Error for ${finalUrl}:`, jsonError, "Response Text:", errorText);
                const errorMsg = `API Error (${response.status}): Invalid JSON. Server said: ${errorText || response.statusText}`;
                showNotification(errorMsg, 'error', { prizeType: `Error: ${actionContext}`, message: errorMsg });
                updateFooterStatus(`Failed: ${errorMsg}`, 'error', actionContext, displayMultiplierInFooter, isEventClaimAction ? "Claim" : actionContext);
                throw new Error(errorMsg);
            }

            if (!response.ok) {
                let errorMsg = `API Error (${response.status})`;
                if (data && data.message) {
                    errorMsg = data.message;
                } else {
                    try { const textError = await responseCloneForText.text(); if (textError) errorMsg = textError; } catch(e) { /* ignore */ }
                }

                if (response.status === 401 || (errorMsg && (errorMsg.toLowerCase().includes('token') || errorMsg.toLowerCase().includes('unauthorized')))) {
                    errorMsg = "Authentication Error. Token might be invalid or expired.";
                    AppState.token = '';
                    await removeStoredValue(CONFIG.STORAGE_KEY.token);
                    if(typeof updateTokenStatusIndicator === 'function') updateTokenStatusIndicator();
                    stopAllAutoPlaysAndUpgrades();
                }
                showNotification(errorMsg, 'error', { prizeType: `Error: ${actionContext}`, message: errorMsg });
                updateFooterStatus(`Failed: ${errorMsg}`, 'error', actionContext, displayMultiplierInFooter, isEventClaimAction ? "Claim" : actionContext);
                throw new Error(errorMsg);
            }

            if(typeof updateTokenStatusIndicator === 'function') updateTokenStatusIndicator();

            AppState.gameData.previousSoftCurrencyAmount = AppState.gameData.newSoftCurrencyAmount;
            Object.assign(AppState.gameData, {
                prize: data.prize ?? AppState.gameData.prize,
                newSoftCurrencyAmount: data.newSoftCurrencyAmount ?? AppState.gameData.newSoftCurrencyAmount,
                newCryptoCurrencyAmount: data.newCryptoCurrencyAmount ?? AppState.gameData.newCryptoCurrencyAmount,
                userGamesEnergy: data.userGamesEnergy ?? AppState.gameData.userGamesEnergy,
                newDynamicCurrencies: data.newDynamicCurrencies ?? AppState.gameData.newDynamicCurrencies,
                userGae: data.userGae ?? AppState.gameData.userGae,
            });
            updateSpinsLeftFromState();

            let notificationType = 'info';
            let notificationMessage = data.message || `${actionContext} processed.`;
            let notificationTitle = actionContext;
            const isSuccessFromApi = data.success === true;
            const hasPrize = data.prize && typeof data.prize.prizeValue === 'number';

            if (actionContext === "Spin") {
                notificationTitle = data.prize?.prizeTypeName || "Spin Result";
                if (hasPrize) {
                    notificationMessage = data.message || (data.prize.prizeValue > 0 ? `You won ${formatNumber(data.prize.prizeValue)}!` : "No win this time.");
                    notificationType = data.prize.prizeValue > 0 ? 'success' : 'info';
                } else {
                    notificationMessage = data.message || "Spin status unknown.";
                    notificationType = 'info';
                }
                if (data.success === false && !hasPrize) {
                    notificationType = 'error';
                    notificationMessage = data.message || "Spin failed.";
                }
            } else if (isEventClaimAction) {
                const eventNameFromContext = actionContext.split('(')[0].replace('Event:','').trim();
                notificationTitle = `Event: ${eventNameFromContext || 'Claim'}`;
                if (isSuccessFromApi || hasPrize) {
                    notificationType = 'success';
                    notificationMessage = data.message || "Claim successful!";
                    if(data.prize) notificationMessage += ` Prize: ${data.prize.prizeTypeName || ''} ${formatNumber(data.prize.prizeValue || 0)}`;
                } else {
                    notificationType = 'error';
                    notificationMessage = data.message || "Claim failed or already claimed.";
                }
                if (data.message && data.message.toLowerCase().includes("already claimed")) {
                    notificationType = 'info';
                }
            } else if (actionContext === "Upgrade All" || actionContext === "Upgrade One") {
                notificationTitle = actionContext;
                if (isSuccessFromApi) {
                    notificationType = 'success';
                    notificationMessage = data.message || `${actionContext} Successful.`;
                } else if (data.message) {
                    const lowerMessage = data.message.toLowerCase();
                    if (lowerMessage.includes("max level") || lowerMessage.includes("nothing to upgrade") || lowerMessage.includes("not enough funds") || lowerMessage.includes("not enough")) {
                        notificationType = 'info';
                    } else {
                        notificationType = 'error';
                    }
                    notificationMessage = data.message;
                } else {
                    notificationType = 'error';
                    notificationMessage = `${actionContext} Failed. No specific message.`;
                }
            } else {
                notificationTitle = actionContext;
                notificationType = isSuccessFromApi ? 'success' : 'error';
                notificationMessage = data.message || (isSuccessFromApi ? `${actionContext} Successful.` : `${actionContext} Failed.`);
            }

            showNotification(notificationMessage, notificationType, {
                prizeType: notificationTitle,
                prizeValue: (data.prize && data.prize.prizeValue !== undefined) ? data.prize.prizeValue : null,
                message: notificationMessage
            });

            updateFooterStatus(
                data.message || `${actionContext} processed.`,
                notificationType,
                actionContext,
                displayMultiplierInFooter,
                isEventClaimAction ? "Claim" : actionContext
            );

            if (AppState.autoUpgrade.onBalanceIncrease.isEnabled &&
                AppState.gameData.newSoftCurrencyAmount > AppState.gameData.previousSoftCurrencyAmount &&
                actionContext === "Spin") {
                console.log(`[AutoUpgrade] Balance increased. Triggering Upgrade One.`);
                showNotification('Balance increased, auto-upgrading...', 'info');
                updateFooterStatus('Balance increased, auto-upgrading...', 'info', 'System');
                setTimeout(() => sendSingleUpgrade().catch(err => console.warn("Auto-upgrade on balance increase failed:", err)), 500);
            }

            return Promise.resolve(data);

        } catch (error) {
            console.error(`API Request Error (${loadingMessage}) for URL ${finalUrl}:`, error);
            const errorMessageForNotification = error.message || 'Unknown API error';
            if (!errorMessageForNotification.toLowerCase().includes('authentication error') &&
                (!notificationContainer || !Array.from(notificationContainer.children).some(n => n.textContent.includes(errorMessageForNotification.substring(0,50)))) &&
                (!footerStatusContainer || !footerStatusContainer.textContent.includes(errorMessageForNotification.substring(0,50)))) {
                showNotification(errorMessageForNotification, 'error', { prizeType: `Error: ${actionContext}`, message: errorMessageForNotification });
            }
            updateFooterStatus(`Request failed: ${errorMessageForNotification}`, 'error', actionContext, displayMultiplierInFooter, isEventClaimAction ? "Claim" : actionContext);
            return Promise.reject(error);
        }
    }
    // --- نهاية دوال استدعاء الـ API ---

    // --- Slot Machine Module --- // وحدة ماكينة القمار
    const SlotMachineModule = (function(CONFIG_SLOT, AppState_SLOT, globalSendApiRequest, globalUpdateFooterStatus, globalShowNotification, globalUpdateSpinsLeft, globalCreateButton, globalCreateToggleSwitch, globalCreateSettingItemRow, globalCreateLabelInputPair, globalCreateRadioGroup, globalFormatMultiplier, globalSetStoredValue, globalGetStoredValue, globalRemoveStoredValue) {
        const type = 'slot';
        const panelIdSuffix = `-${CONFIG_SLOT.SELECTORS.mainPanelId}`;
        let selectedMultiplier = CONFIG_SLOT.BET_VALUES.slot[0];
        let customMultipliers = [];
        let autoPlayState = { isPlaying: false, delay: CONFIG_SLOT.AUTO_PLAY.defaultDelay, runMode: 'infinite', useSequence: false, sequence: [], sequenceIndex: 0, intervalId: null, runCount: 0, targetCount: 10, currentLoopIteration: 0 };
        let isAutoplaySectionCollapsed = AppState_SLOT.slotAutoplayCollapsed;
        let multiplierDisplayButtonEl, manualSpinButtonEl, apStartButtonEl, apStopButtonEl, apDelayInputEl, apCountInputEl, apUseSequenceToggleEl, apSequenceDisplayEl, apProgressFillEl, apProgressTextEl, apCountInputContainerEl, apProgressContainerEl, autoplayContentEl;

        function sendSlotSpin(multiplierToUse = selectedMultiplier) { const urlBase = CONFIG_SLOT.API.slotUrl + multiplierToUse; const options = { method: 'POST', headers: { Authorization: AppState_SLOT.token, 'Content-Type': 'application/json' }, body: JSON.stringify({}) }; return globalSendApiRequest(urlBase, options, 'Spinning Slot...', "Spin", multiplierToUse); }
        function updateMultiplierDisplayButtonUI() { if (multiplierDisplayButtonEl) { const valueSpan = multiplierDisplayButtonEl.querySelector('.value'); if (valueSpan) valueSpan.textContent = `×${globalFormatMultiplier(selectedMultiplier)}`; } }
        function handleMultiplierRadioChangeUI(value) { selectedMultiplier = parseInt(value, 10); globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.selectedSlotMultiplierRadio, selectedMultiplier); updateMultiplierDisplayButtonUI(); }
        function updateSequenceDisplayUI() { if (!apSequenceDisplayEl) return; apSequenceDisplayEl.innerHTML = ''; if (autoPlayState.sequence.length === 0) { apSequenceDisplayEl.textContent = 'Sequence is empty.'; apSequenceDisplayEl.style.justifyContent = 'center'; apSequenceDisplayEl.style.alignItems = 'center'; } else { apSequenceDisplayEl.style.justifyContent = 'flex-start'; apSequenceDisplayEl.style.alignItems = 'flex-start'; autoPlayState.sequence.forEach((value, index) => { const item = document.createElement('span'); item.className = 'enhancer-sequence-item'; item.textContent = `×${globalFormatMultiplier(value)}`; const deleteBtn = globalCreateButton(CONFIG_SLOT.ICONS.deleteItem.replace('width="12"', 'width="10"').replace('height="12"', 'height="10"'), (e) => { e.stopPropagation(); removeSequenceItemUI(index); }, ['enhancer-delete-sequence-item-btn']); deleteBtn.title = 'Remove this multiplier from sequence'; item.appendChild(deleteBtn); apSequenceDisplayEl.appendChild(item); }); } }
        function addSelectedToSequenceUI() { if (autoPlayState.isPlaying) return; if (selectedMultiplier !== null && selectedMultiplier !== undefined) { autoPlayState.sequence.push(selectedMultiplier); updateSequenceDisplayUI(); globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotSequence, autoPlayState.sequence); } else { globalUpdateFooterStatus('No multiplier selected to add for Slot.', 'info'); } }
        function removeSequenceItemUI(indexToRemove) { if (autoPlayState.isPlaying) return; if (indexToRemove >= 0 && indexToRemove < autoPlayState.sequence.length) { autoPlayState.sequence.splice(indexToRemove, 1); updateSequenceDisplayUI(); globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotSequence, autoPlayState.sequence); } }
        function clearSequenceUI() { if (autoPlayState.isPlaying) return; autoPlayState.sequence = []; updateSequenceDisplayUI(); globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotSequence, autoPlayState.sequence); }
        async function addCustomMultiplierUI(value) { if (!customMultipliers.includes(value)) { customMultipliers.push(value); customMultipliers.sort((a, b) => a - b); await globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.customSlotMultipliers, customMultipliers); globalUpdateFooterStatus(`Custom Slot multiplier ×${globalFormatMultiplier(value)} added.`, 'success'); } else { globalUpdateFooterStatus(`Custom Slot multiplier ×${globalFormatMultiplier(value)} already exists.`, 'info'); } const gridContainerId = CONFIG_SLOT.SELECTORS.slotMultiplierSelectionIdPrefix + panelIdSuffix; const gridContainer = document.getElementById(gridContainerId); if (gridContainer && gridContainer.parentElement) { const newGrid = createMultiplierSelectionGridUI(); gridContainer.parentElement.replaceChild(newGrid, gridContainer); } }
        async function deleteCustomMultiplierUI(value) { const index = customMultipliers.indexOf(value); if (index > -1) { customMultipliers.splice(index, 1); await globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.customSlotMultipliers, customMultipliers); if (selectedMultiplier === value) { selectedMultiplier = CONFIG_SLOT.BET_VALUES.slot[0] || 0; await globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.selectedSlotMultiplierRadio, selectedMultiplier); } globalUpdateFooterStatus(`Custom Slot multiplier ×${globalFormatMultiplier(value)} deleted.`, 'info'); } const gridContainerId = CONFIG_SLOT.SELECTORS.slotMultiplierSelectionIdPrefix + panelIdSuffix; const gridContainer = document.getElementById(gridContainerId); if (gridContainer && gridContainer.parentElement) { const newGrid = createMultiplierSelectionGridUI(); gridContainer.parentElement.replaceChild(newGrid, gridContainer); } updateMultiplierDisplayButtonUI(); }
        function createMultiplierSelectionGridUI() { const mainContainer = document.createElement('div'); mainContainer.className = 'enhancer-multiplier-selection'; mainContainer.id = CONFIG_SLOT.SELECTORS.slotMultiplierSelectionIdPrefix + panelIdSuffix; const customInputArea = document.createElement('div'); customInputArea.className = 'enhancer-custom-multiplier-input-area'; const customInputLabel = document.createElement('label'); customInputLabel.htmlFor = `custom-multiplier-input-slot${panelIdSuffix}`; customInputLabel.textContent = "Add Custom:"; customInputArea.appendChild(customInputLabel); const customInput = document.createElement('input'); customInput.type = 'number'; customInput.id = `custom-multiplier-input-slot${panelIdSuffix}`; customInput.className = 'enhancer-text-input'; customInput.placeholder = 'e.g., 12345'; customInputArea.appendChild(customInput); const addCustomButton = globalCreateButton(CONFIG_SLOT.ICONS.add, () => { const valueNum = parseInt(customInput.value, 10); if (!isNaN(valueNum) && valueNum > 0) { addCustomMultiplierUI(valueNum); customInput.value = ''; } else { globalUpdateFooterStatus('Invalid custom Slot multiplier value.', 'error'); } }, ['enhancer-small-button', 'enhancer-icon-button', 'enhancer-action-button']); addCustomButton.title = "Add Custom Slot Multiplier"; customInputArea.appendChild(addCustomButton); mainContainer.appendChild(customInputArea); const defaultValues = CONFIG_SLOT.BET_VALUES.slot; if (customMultipliers.length > 0) { const customGroupDiv = document.createElement('div'); customGroupDiv.className = 'enhancer-multiplier-group enhancer-custom-multiplier-group'; const customGroupLabel = document.createElement('div'); customGroupLabel.className = 'enhancer-multiplier-group-label'; customGroupLabel.textContent = "Custom Slot Multipliers"; customGroupDiv.appendChild(customGroupLabel); customMultipliers.forEach(value => { const id = `ap-slot-radio-custom-${value}${panelIdSuffix}`; const itemLabel = document.createElement('label'); itemLabel.htmlFor = id; itemLabel.className = 'enhancer-multiplier-item'; const radio = document.createElement('input'); radio.type = 'radio'; radio.id = id; radio.name = `ap-slot-multiplier-radio${panelIdSuffix}`; radio.value = value; radio.checked = (value === selectedMultiplier); radio.addEventListener('change', () => handleMultiplierRadioChangeUI(value)); const span = document.createElement('span'); span.textContent = `×${globalFormatMultiplier(value)}`; itemLabel.appendChild(radio); itemLabel.appendChild(span); const deleteBtn = globalCreateButton(CONFIG_SLOT.ICONS.deleteItem.replace('width="12"', 'width="10"').replace('height="12"', 'height="10"'), (e) => { e.preventDefault(); e.stopPropagation(); deleteCustomMultiplierUI(value); }, ['delete-custom-multiplier-btn']); deleteBtn.title = "Delete this custom multiplier"; itemLabel.appendChild(deleteBtn); customGroupDiv.appendChild(itemLabel); }); mainContainer.appendChild(customGroupDiv); } CONFIG_SLOT.MULTIPLIER_RANGES.forEach(range => { const multipliersInGroup = defaultValues.filter(value => value >= range.min && value <= range.max && !customMultipliers.includes(value)); if (multipliersInGroup.length > 0) { const groupDiv = document.createElement('div'); groupDiv.className = 'enhancer-multiplier-group'; multipliersInGroup.forEach(value => { const id = `ap-slot-radio-default-${value}${panelIdSuffix}`; const itemLabel = document.createElement('label'); itemLabel.htmlFor = id; itemLabel.className = 'enhancer-multiplier-item'; const radio = document.createElement('input'); radio.type = 'radio'; radio.id = id; radio.name = `ap-slot-multiplier-radio${panelIdSuffix}`; radio.value = value; radio.checked = (value === selectedMultiplier); radio.addEventListener('change', () => handleMultiplierRadioChangeUI(value)); const span = document.createElement('span'); span.textContent = `×${globalFormatMultiplier(value)}`; itemLabel.appendChild(radio); itemLabel.appendChild(span); groupDiv.appendChild(itemLabel); }); mainContainer.appendChild(groupDiv); } }); return mainContainer; }
        function updateProgressBarUI(current, total) { if (apProgressFillEl && apProgressTextEl && apProgressContainerEl) { if (total > 0 && autoPlayState.runMode === 'count') { apProgressContainerEl.style.display = 'block'; const percentage = Math.min(100, (current / total) * 100); apProgressFillEl.style.width = `${percentage}%`; apProgressTextEl.textContent = `${current}/${total}`; } else { apProgressContainerEl.style.display = 'none'; apProgressFillEl.style.width = '0%'; apProgressTextEl.textContent = '0/0'; } } }
        function updateAutoPlayControlsUI() { const isPlaying = autoPlayState.isPlaying; if (apStartButtonEl) apStartButtonEl.disabled = isPlaying; if (apStopButtonEl) apStopButtonEl.disabled = !isPlaying; if (manualSpinButtonEl) manualSpinButtonEl.disabled = isPlaying; const configSection = document.getElementById(CONFIG_SLOT.SELECTORS.slotAutoplayConfigSectionIdPrefix + panelIdSuffix); if (configSection && autoplayContentEl) { autoplayContentEl.querySelectorAll(`input, select, button:not(#ap-start-slot${panelIdSuffix}):not(#ap-stop-slot${panelIdSuffix}), .enhancer-toggle-switch input`).forEach(el => { el.disabled = isPlaying; }); } const multiplierGrid = document.getElementById(CONFIG_SLOT.SELECTORS.slotMultiplierSelectionIdPrefix + panelIdSuffix); if (multiplierGrid) { multiplierGrid.querySelectorAll('input[type="radio"], button.enhancer-icon-button, input[type="number"]').forEach(el => el.disabled = isPlaying); } AppState_SLOT.slotAutoPlay.isPlayingGlobally = isPlaying; window.updateGlobalAutoplayControls(); }
        function toggleAutoplaySection(autoplayContentElement, sectionType) { const isCollapsed = autoplayContentElement.classList.toggle('collapsed'); if (sectionType === 'slot') { AppState_SLOT.slotAutoplayCollapsed = isCollapsed; setStoredValue(CONFIG_SLOT.STORAGE_KEY.slotAutoplayCollapsed, isCollapsed); } else if (sectionType === 'wheel') { AppState_SLOT.wheelAutoplayCollapsed = isCollapsed; setStoredValue(CONFIG_SLOT.STORAGE_KEY.wheelAutoplayCollapsed, isCollapsed); } const titleElement = autoplayContentElement.previousElementSibling; if (titleElement) { const chevron = titleElement.querySelector('.enhancer-chevron'); if (chevron) chevron.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'; } }
        function startAutoPlay() { if (autoPlayState.isPlaying) { globalUpdateFooterStatus('Slot Auto-Play is already active.', 'error'); return; } if (!AppState_SLOT.token) { globalUpdateFooterStatus(`Auth Token missing. Cannot start Slot Auto-Play.`, 'error', 'System'); window.updateTokenStatusIndicator(); return; } if (!AppState_SLOT.vValue) { globalUpdateFooterStatus(`API 'v' Parameter missing. Cannot start Slot Auto-Play.`, 'error', 'System'); window.updateVValueStatusIndicator(); return; } let multipliersToUse = []; if (autoPlayState.useSequence) { multipliersToUse = autoPlayState.sequence; if (multipliersToUse.length === 0) { globalUpdateFooterStatus('Slot sequence is empty. Add multipliers first.', 'error', 'System'); return; } } else { if (selectedMultiplier === null || selectedMultiplier === undefined) { globalUpdateFooterStatus('No Slot multiplier selected.', 'error', 'System'); return; } multipliersToUse = [selectedMultiplier]; } autoPlayState.targetCount = (autoPlayState.runMode === 'count') ? Math.max(1, parseInt(apCountInputEl?.value ?? '10', 10)) : Infinity; autoPlayState.runCount = 0; autoPlayState.currentLoopIteration = 0; autoPlayState.sequenceIndex = 0; if (autoPlayState.runMode === 'count') updateProgressBarUI(0, autoPlayState.targetCount); else updateProgressBarUI(0, 0); autoPlayState.isPlaying = true; updateAutoPlayControlsUI(); const runModeText = autoPlayState.runMode === 'count' ? `${autoPlayState.targetCount} ${autoPlayState.useSequence ? 'loops' : 'spins'}` : 'Infinite'; const playModeText = autoPlayState.useSequence ? 'Sequence' : 'Single Multiplier'; globalUpdateFooterStatus(`Starting Slot ${playModeText} Auto-Play (${runModeText}).`, 'info', `Slot Auto`, null, type); const runSpin = () => { if (!autoPlayState.isPlaying) return; const slotEnergy = AppState_SLOT.gameData?.userGamesEnergy?.slotMachine?.energy ?? 0; if (slotEnergy <= 0) { globalUpdateFooterStatus(`Out of energy for Slot. Stopping Auto-Play.`, 'error', 'Slot Auto', null, type); globalShowNotification(`Out of energy for Slot.`, 'error', {prizeType: 'Slot Auto-Play'}); stopAutoPlay(); return; } let currentMultiplierForSpin; if (autoPlayState.useSequence) { if (autoPlayState.sequenceIndex >= multipliersToUse.length) { autoPlayState.currentLoopIteration++; autoPlayState.sequenceIndex = 0; if (autoPlayState.runMode === 'count' && autoPlayState.currentLoopIteration >= autoPlayState.targetCount) { globalUpdateFooterStatus(`Completed ${autoPlayState.targetCount} Slot sequence loops.`, 'success', 'Slot Auto', null, type); stopAutoPlay(); return; } } currentMultiplierForSpin = multipliersToUse[autoPlayState.sequenceIndex]; } else { if (autoPlayState.runMode === 'count' && autoPlayState.runCount >= autoPlayState.targetCount) { globalUpdateFooterStatus(`Completed ${autoPlayState.targetCount} Slot spins.`, 'success', 'Slot Auto', null, type); stopAutoPlay(); return; } currentMultiplierForSpin = multipliersToUse[0]; } sendSlotSpin(currentMultiplierForSpin).then(data => { if (autoPlayState.isPlaying) { autoPlayState.runCount++; if (autoPlayState.useSequence) autoPlayState.sequenceIndex++; if (autoPlayState.runMode === 'count') { const progressCurrent = autoPlayState.useSequence ? autoPlayState.currentLoopIteration : autoPlayState.runCount; updateProgressBarUI(progressCurrent, autoPlayState.targetCount); } if (autoPlayState.isPlaying) autoPlayState.intervalId = setTimeout(runSpin, autoPlayState.delay * 1000); } }).catch(error => { console.error(`[Slot AutoPlay Error]:`, error); if (error.message && error.message.toLowerCase().includes('authentication error')) { if (autoPlayState.isPlaying) stopAutoPlay(); } else if (autoPlayState.isPlaying) autoPlayState.intervalId = setTimeout(runSpin, autoPlayState.delay * 1000); }); }; runSpin(); }
        function stopAutoPlay() { if (!autoPlayState.isPlaying) return; autoPlayState.isPlaying = false; if (autoPlayState.intervalId) clearTimeout(autoPlayState.intervalId); autoPlayState.intervalId = null; updateAutoPlayControlsUI(); if (autoPlayState.runMode === 'count' && autoPlayState.runCount < autoPlayState.targetCount) { const progressCurrent = autoPlayState.useSequence ? autoPlayState.currentLoopIteration : autoPlayState.runCount; updateProgressBarUI(progressCurrent, autoPlayState.targetCount); } globalUpdateFooterStatus(`Slot Auto-Play stopped.`, 'info', 'System'); }
        function createUI(parentElement) { parentElement.innerHTML = ''; const contentPanel = document.createElement('div'); contentPanel.className = 'enhancer-content-panel'; const titleEl = document.createElement('h3'); titleEl.className = 'enhancer-panel-title'; titleEl.innerHTML = `${CONFIG_SLOT.ICONS.energy} Slot Controls`; contentPanel.appendChild(titleEl); const manualControls = document.createElement('div'); manualControls.style.display = 'flex'; manualControls.style.flexDirection = 'column'; manualControls.style.gap = '12px'; manualSpinButtonEl = globalCreateButton(`Spin Slot`, () => { if (autoPlayState.isPlaying) return; sendSlotSpin(selectedMultiplier).catch(error => { console.error(`Manual Slot spin failed:`, error); }); }, ['enhancer-spin-button']); manualSpinButtonEl.id = CONFIG_SLOT.SELECTORS.slotManualSpinButtonIdPrefix + panelIdSuffix; manualControls.appendChild(manualSpinButtonEl); multiplierDisplayButtonEl = globalCreateButton(`Multiplier: <span class="value">X${globalFormatMultiplier(selectedMultiplier)}</span>`, null, ['enhancer-multiplier-display-button']); multiplierDisplayButtonEl.id = CONFIG_SLOT.SELECTORS.slotMultiplierDisplayButtonIdPrefix + panelIdSuffix; multiplierDisplayButtonEl.disabled = true; manualControls.appendChild(multiplierDisplayButtonEl); contentPanel.appendChild(manualControls); contentPanel.appendChild(createMultiplierSelectionGridUI()); const autoplaySection = document.createElement('div'); autoplaySection.className = 'enhancer-autoplay-config-section'; autoplaySection.id = CONFIG_SLOT.SELECTORS.slotAutoplayConfigSectionIdPrefix + panelIdSuffix; const apTitle = document.createElement('h4'); apTitle.className = 'enhancer-panel-subtitle collapsible-title'; apTitle.innerHTML = `Slot Auto-Play Configuration <span class="enhancer-chevron">${CONFIG.ICONS.chevronDown}</span>`; autoplaySection.appendChild(apTitle); autoplayContentEl = document.createElement('div'); autoplayContentEl.className = 'collapsible-content'; autoplayContentEl.id = CONFIG_SLOT.SELECTORS.slotAutoplayContentIdPrefix + panelIdSuffix; if (isAutoplaySectionCollapsed) { autoplayContentEl.classList.add('collapsed'); const chevron = apTitle.querySelector('.enhancer-chevron'); if(chevron) chevron.style.transform = 'rotate(0deg)'; } else { const chevron = apTitle.querySelector('.enhancer-chevron'); if(chevron) chevron.style.transform = 'rotate(180deg)'; } apTitle.addEventListener('click', () => toggleAutoplaySection(autoplayContentEl, 'slot')); const delayInputId = `ap-delay-slot${panelIdSuffix}`; autoplayContentEl.appendChild(globalCreateLabelInputPair(delayInputId, 'Delay (seconds):', 'number', autoPlayState.delay, (e) => { const newDelay = parseFloat(e.target.value); autoPlayState.delay = (!isNaN(newDelay) && newDelay >= CONFIG_SLOT.AUTO_PLAY.minDelay) ? newDelay : CONFIG_SLOT.AUTO_PLAY.defaultDelay; e.target.value = autoPlayState.delay; globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotDelay, autoPlayState.delay); }, { min: CONFIG_SLOT.AUTO_PLAY.minDelay, step: '0.1' })); apDelayInputEl = autoplayContentEl.querySelector(`#${delayInputId}`); const runModeRadioName = `ap-runmode-radio-slot${panelIdSuffix}`; autoplayContentEl.appendChild(globalCreateRadioGroup(runModeRadioName, ['infinite', 'count'], autoPlayState.runMode, (newMode) => { autoPlayState.runMode = newMode; globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotRunMode, newMode); if (apCountInputContainerEl) apCountInputContainerEl.classList.toggle('visible', newMode === 'count'); if (apProgressContainerEl) apProgressContainerEl.style.display = newMode === 'count' ? 'block' : 'none'; if (newMode !== 'count') updateProgressBarUI(0, 0); }, 'Run Mode:')); apCountInputContainerEl = document.createElement('div'); apCountInputContainerEl.id = `ap-count-input-container-slot${panelIdSuffix}`; apCountInputContainerEl.className = 'ap-count-input-container'; apCountInputContainerEl.style.display = autoPlayState.runMode === 'count' ? 'flex' : 'none'; apCountInputContainerEl.style.flexDirection = 'column'; apCountInputContainerEl.style.gap = '4px'; const countInputId = `ap-count-slot${panelIdSuffix}`; apCountInputContainerEl.appendChild(globalCreateLabelInputPair(countInputId, 'Number of Loops/Spins:', 'number', autoPlayState.targetCount, (e) => { const count = parseInt(e.target.value, 10); autoPlayState.targetCount = (!isNaN(count) && count >= 1) ? count : 10; e.target.value = autoPlayState.targetCount; globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotTargetCount, autoPlayState.targetCount); }, { min: '1', step: '1' })); autoplayContentEl.appendChild(apCountInputContainerEl); apCountInputEl = autoplayContentEl.querySelector(`#${countInputId}`); const sequenceSection = document.createElement('div'); sequenceSection.className = 'enhancer-sequence-section'; const useSequenceToggleId = `ap-use-sequence-slot${panelIdSuffix}`; sequenceSection.appendChild(globalCreateSettingItemRow('Use Sequence Mode:', globalCreateToggleSwitch(useSequenceToggleId, autoPlayState.useSequence, (e) => { autoPlayState.useSequence = e.target.checked; globalSetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotUseSequence, e.target.checked); }))); apUseSequenceToggleEl = sequenceSection.querySelector(`#${useSequenceToggleId}`); const sequenceControls = document.createElement('div'); sequenceControls.className = 'enhancer-sequence-controls'; sequenceControls.appendChild(globalCreateButton(`${CONFIG_SLOT.ICONS.add} Add Selected`, addSelectedToSequenceUI, ['enhancer-small-button', 'enhancer-action-button'])); sequenceControls.appendChild(globalCreateButton(`${CONFIG_SLOT.ICONS.clear} Clear Sequence`, clearSequenceUI, ['enhancer-small-button', 'enhancer-delete-button'])); sequenceSection.appendChild(sequenceControls); const seqDisplayLabel = document.createElement('label'); seqDisplayLabel.textContent = 'Current Sequence:'; sequenceSection.appendChild(seqDisplayLabel); apSequenceDisplayEl = document.createElement('div'); apSequenceDisplayEl.className = 'enhancer-sequence-display'; apSequenceDisplayEl.id = `ap-sequence-display-slot${panelIdSuffix}`; sequenceSection.appendChild(apSequenceDisplayEl); autoplayContentEl.appendChild(sequenceSection); apProgressContainerEl = document.createElement('div'); apProgressContainerEl.className = 'enhancer-progress-bar-container'; apProgressContainerEl.id = `ap-progress-container-slot${panelIdSuffix}`; apProgressContainerEl.style.display = autoPlayState.runMode === 'count' ? 'block' : 'none'; const progressBar = document.createElement('div'); progressBar.className = 'enhancer-progress-bar'; apProgressFillEl = document.createElement('div'); apProgressFillEl.className = 'enhancer-progress-bar-fill'; apProgressFillEl.id = `ap-progress-fill-slot${panelIdSuffix}`; apProgressTextEl = document.createElement('span'); apProgressTextEl.className = 'enhancer-progress-bar-text'; apProgressTextEl.id = `ap-progress-text-slot${panelIdSuffix}`; apProgressTextEl.textContent = '0/0'; progressBar.appendChild(apProgressFillEl); progressBar.appendChild(apProgressTextEl); apProgressContainerEl.appendChild(progressBar); autoplayContentEl.appendChild(apProgressContainerEl); const apControlsDiv = document.createElement('div'); apControlsDiv.className = 'enhancer-autoplay-controls'; apStartButtonEl = globalCreateButton(`Start Auto-Play`, startAutoPlay, ['enhancer-action-button']); apStartButtonEl.id = `ap-start-slot${panelIdSuffix}`; apControlsDiv.appendChild(apStartButtonEl); apStopButtonEl = globalCreateButton(`Stop Auto-Play`, stopAutoPlay, ['enhancer-delete-button']); apStopButtonEl.id = `ap-stop-slot${panelIdSuffix}`; apStopButtonEl.disabled = true; apControlsDiv.appendChild(apStopButtonEl); autoplayContentEl.appendChild(apControlsDiv); autoplaySection.appendChild(autoplayContentEl); contentPanel.appendChild(autoplaySection); parentElement.appendChild(contentPanel); updateMultiplierDisplayButtonUI(); updateSequenceDisplayUI(); updateAutoPlayControlsUI(); }
        async function loadState() { selectedMultiplier = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.selectedSlotMultiplierRadio, CONFIG_SLOT.BET_VALUES.slot[0]); customMultipliers = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.customSlotMultipliers, []); autoPlayState.runMode = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotRunMode, 'infinite'); autoPlayState.targetCount = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotTargetCount, 10); autoPlayState.delay = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotDelay, CONFIG_SLOT.AUTO_PLAY.defaultDelay); autoPlayState.useSequence = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotUseSequence, false); autoPlayState.sequence = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotSequence, []); isAutoplaySectionCollapsed = await globalGetStoredValue(CONFIG_SLOT.STORAGE_KEY.slotAutoplayCollapsed, true); AppState_SLOT.slotAutoplayCollapsed = isAutoplaySectionCollapsed; console.log('[SlotModule] State loaded.'); }
        async function resetState() { selectedMultiplier = CONFIG_SLOT.BET_VALUES.slot[0]; customMultipliers = []; autoPlayState = { isPlaying: false, delay: CONFIG_SLOT.AUTO_PLAY.defaultDelay, runMode: 'infinite', useSequence: false, sequence: [], sequenceIndex: 0, intervalId: null, runCount: 0, targetCount: 10, currentLoopIteration: 0 }; isAutoplaySectionCollapsed = true; AppState_SLOT.slotAutoplayCollapsed = true; await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.selectedSlotMultiplierRadio); await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.customSlotMultipliers); await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotRunMode); await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotTargetCount); await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotDelay); await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotUseSequence); await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.autoPlaySlotSequence); await globalRemoveStoredValue(CONFIG_SLOT.STORAGE_KEY.slotAutoplayCollapsed); console.log('[SlotModule] State reset.'); }
        return { createUI: createUI, loadState: loadState, resetState: resetState, stopAutoPlay: stopAutoPlay, isAutoPlaying: () => autoPlayState.isPlaying, updateControlsBasedOnGlobalAutoplay: (isAnyAutoplayActive) => { if (!autoPlayState.isPlaying) { if (manualSpinButtonEl) manualSpinButtonEl.disabled = isAnyAutoplayActive; if (apStartButtonEl) apStartButtonEl.disabled = isAnyAutoplayActive; } } };
    })(CONFIG, AppState, sendApiRequest, updateFooterStatus, showNotification, updateSpinsLeftFromState, createButton, createToggleSwitch, createSettingItemRow, createLabelInputPair, createRadioGroup, formatMultiplier, setStoredValue, getStoredValue, removeStoredValue);
    // --- نهاية وحدة ماكينة القمار ---


    // --- Wheel of Fortune Module --- // وحدة عجلة الحظ
    const WheelOfFortuneModule = (function(CONFIG_WHEEL, AppState_WHEEL, globalSendApiRequest, globalUpdateFooterStatus, globalShowNotification, globalUpdateSpinsLeft, globalCreateButton, globalCreateToggleSwitch, globalCreateSettingItemRow, globalCreateLabelInputPair, globalCreateRadioGroup, globalFormatMultiplier, globalSetStoredValue, globalGetStoredValue, globalRemoveStoredValue) {
        const type = 'wheel';
        const panelIdSuffix = `-${CONFIG_WHEEL.SELECTORS.mainPanelId}`;
        let selectedMultiplier = CONFIG_WHEEL.BET_VALUES.wheel[0];
        let customMultipliers = [];
        let autoPlayState = { isPlaying: false, delay: CONFIG_WHEEL.AUTO_PLAY.defaultDelay, runMode: 'infinite', useSequence: false, sequence: [], sequenceIndex: 0, intervalId: null, runCount: 0, targetCount: 10, currentLoopIteration: 0 };
        let isAutoplaySectionCollapsed = AppState_WHEEL.wheelAutoplayCollapsed;
        let multiplierDisplayButtonEl, manualSpinButtonEl, apStartButtonEl, apStopButtonEl, apDelayInputEl, apCountInputEl, apUseSequenceToggleEl, apSequenceDisplayEl, apProgressFillEl, apProgressTextEl, apCountInputContainerEl, apProgressContainerEl, autoplayContentEl;

        function sendWheelSpin(multiplierToUse = selectedMultiplier) { if (!AppState_WHEEL.liveOpId || AppState_WHEEL.liveOpId === CONFIG.WHEEL_PAYLOAD.liveOpId) { globalUpdateFooterStatus("Wheel LiveOpId missing or default. Please set it in Configuration.", 'error', 'System'); window.updateLiveOpIdStatusIndicator(); if (autoPlayState.isPlaying) stopAutoPlay(); return Promise.reject(new Error("Wheel LiveOpId missing or default.")); } const urlBase = CONFIG_WHEEL.API.wheelUrl + multiplierToUse; const payload = { liveOpId: AppState_WHEEL.liveOpId }; const options = { method: 'POST', headers: { Authorization: AppState_WHEEL.token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }; return globalSendApiRequest(urlBase, options, 'Spinning Wheel...', "Spin", multiplierToUse); }
        function updateMultiplierDisplayButtonUI() { if (multiplierDisplayButtonEl) { const valueSpan = multiplierDisplayButtonEl.querySelector('.value'); if (valueSpan) valueSpan.textContent = `×${globalFormatMultiplier(selectedMultiplier)}`; } }
        function handleMultiplierRadioChangeUI(value) { selectedMultiplier = parseInt(value, 10); globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.selectedWheelMultiplierRadio, selectedMultiplier); updateMultiplierDisplayButtonUI(); }
        function updateSequenceDisplayUI() { if (!apSequenceDisplayEl) return; apSequenceDisplayEl.innerHTML = ''; if (autoPlayState.sequence.length === 0) { apSequenceDisplayEl.textContent = 'Sequence is empty.'; apSequenceDisplayEl.style.justifyContent = 'center'; apSequenceDisplayEl.style.alignItems = 'center'; } else { apSequenceDisplayEl.style.justifyContent = 'flex-start'; apSequenceDisplayEl.style.alignItems = 'flex-start'; autoPlayState.sequence.forEach((value, index) => { const item = document.createElement('span'); item.className = 'enhancer-sequence-item'; item.textContent = `×${globalFormatMultiplier(value)}`; const deleteBtn = globalCreateButton(CONFIG_WHEEL.ICONS.deleteItem.replace('width="12"', 'width="10"').replace('height="12"', 'height="10"'), (e) => { e.stopPropagation(); removeSequenceItemUI(index); }, ['enhancer-delete-sequence-item-btn']); deleteBtn.title = 'Remove this multiplier from sequence'; item.appendChild(deleteBtn); apSequenceDisplayEl.appendChild(item); }); } }
        function addSelectedToSequenceUI() { if (autoPlayState.isPlaying) return; if (selectedMultiplier !== null && selectedMultiplier !== undefined) { autoPlayState.sequence.push(selectedMultiplier); updateSequenceDisplayUI(); globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelSequence, autoPlayState.sequence); } else { globalUpdateFooterStatus('No multiplier selected to add for Wheel.', 'info'); } }
        function removeSequenceItemUI(indexToRemove) { if (autoPlayState.isPlaying) return; if (indexToRemove >= 0 && indexToRemove < autoPlayState.sequence.length) { autoPlayState.sequence.splice(indexToRemove, 1); updateSequenceDisplayUI(); globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelSequence, autoPlayState.sequence); } }
        function clearSequenceUI() { if (autoPlayState.isPlaying) return; autoPlayState.sequence = []; updateSequenceDisplayUI(); globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelSequence, autoPlayState.sequence); }
        async function addCustomMultiplierUI(value) { if (!customMultipliers.includes(value)) { customMultipliers.push(value); customMultipliers.sort((a, b) => a - b); await globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.customWheelMultipliers, customMultipliers); globalUpdateFooterStatus(`Custom Wheel multiplier ×${globalFormatMultiplier(value)} added.`, 'success'); } else { globalUpdateFooterStatus(`Custom Wheel multiplier ×${globalFormatMultiplier(value)} already exists.`, 'info'); } const gridContainerId = CONFIG_WHEEL.SELECTORS.wheelMultiplierSelectionIdPrefix + panelIdSuffix; const gridContainer = document.getElementById(gridContainerId); if (gridContainer && gridContainer.parentElement) { const newGrid = createMultiplierSelectionGridUI(); gridContainer.parentElement.replaceChild(newGrid, gridContainer); } }
        async function deleteCustomMultiplierUI(value) { const index = customMultipliers.indexOf(value); if (index > -1) { customMultipliers.splice(index, 1); await globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.customWheelMultipliers, customMultipliers); if (selectedMultiplier === value) { selectedMultiplier = CONFIG_WHEEL.BET_VALUES.wheel[0] || 0; await globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.selectedWheelMultiplierRadio, selectedMultiplier); } globalUpdateFooterStatus(`Custom Wheel multiplier ×${globalFormatMultiplier(value)} deleted.`, 'info'); } const gridContainerId = CONFIG_WHEEL.SELECTORS.wheelMultiplierSelectionIdPrefix + panelIdSuffix; const gridContainer = document.getElementById(gridContainerId); if (gridContainer && gridContainer.parentElement) { const newGrid = createMultiplierSelectionGridUI(); gridContainer.parentElement.replaceChild(newGrid, gridContainer); } updateMultiplierDisplayButtonUI(); }
        function createMultiplierSelectionGridUI() { const mainContainer = document.createElement('div'); mainContainer.className = 'enhancer-multiplier-selection'; mainContainer.id = CONFIG_WHEEL.SELECTORS.wheelMultiplierSelectionIdPrefix + panelIdSuffix; const customInputArea = document.createElement('div'); customInputArea.className = 'enhancer-custom-multiplier-input-area'; const customInputLabel = document.createElement('label'); customInputLabel.htmlFor = `custom-multiplier-input-wheel${panelIdSuffix}`; customInputLabel.textContent = "Add Custom:"; customInputArea.appendChild(customInputLabel); const customInput = document.createElement('input'); customInput.type = 'number'; customInput.id = `custom-multiplier-input-wheel${panelIdSuffix}`; customInput.className = 'enhancer-text-input'; customInput.placeholder = 'e.g., 12345'; customInputArea.appendChild(customInput); const addCustomButton = globalCreateButton(CONFIG_WHEEL.ICONS.add, () => { const valueNum = parseInt(customInput.value, 10); if (!isNaN(valueNum) && valueNum > 0) { addCustomMultiplierUI(valueNum); customInput.value = ''; } else { globalUpdateFooterStatus('Invalid custom Wheel multiplier value.', 'error'); } }, ['enhancer-small-button', 'enhancer-icon-button', 'enhancer-action-button']); addCustomButton.title = "Add Custom Wheel Multiplier"; customInputArea.appendChild(addCustomButton); mainContainer.appendChild(customInputArea); const defaultValues = CONFIG_WHEEL.BET_VALUES.wheel; if (customMultipliers.length > 0) { const customGroupDiv = document.createElement('div'); customGroupDiv.className = 'enhancer-multiplier-group enhancer-custom-multiplier-group'; const customGroupLabel = document.createElement('div'); customGroupLabel.className = 'enhancer-multiplier-group-label'; customGroupLabel.textContent = "Custom Wheel Multipliers"; customGroupDiv.appendChild(customGroupLabel); customMultipliers.forEach(value => { const id = `ap-wheel-radio-custom-${value}${panelIdSuffix}`; const itemLabel = document.createElement('label'); itemLabel.htmlFor = id; itemLabel.className = 'enhancer-multiplier-item'; const radio = document.createElement('input'); radio.type = 'radio'; radio.id = id; radio.name = `ap-wheel-multiplier-radio${panelIdSuffix}`; radio.value = value; radio.checked = (value === selectedMultiplier); radio.addEventListener('change', () => handleMultiplierRadioChangeUI(value)); const span = document.createElement('span'); span.textContent = `×${globalFormatMultiplier(value)}`; itemLabel.appendChild(radio); itemLabel.appendChild(span); const deleteBtn = globalCreateButton(CONFIG_WHEEL.ICONS.deleteItem.replace('width="12"', 'width="10"').replace('height="12"', 'height="10"'), (e) => { e.preventDefault(); e.stopPropagation(); deleteCustomMultiplierUI(value); }, ['delete-custom-multiplier-btn']); deleteBtn.title = "Delete this custom multiplier"; itemLabel.appendChild(deleteBtn); customGroupDiv.appendChild(itemLabel); }); mainContainer.appendChild(customGroupDiv); } CONFIG_WHEEL.MULTIPLIER_RANGES.forEach(range => { const multipliersInGroup = defaultValues.filter(value => value >= range.min && value <= range.max && !customMultipliers.includes(value)); if (multipliersInGroup.length > 0) { const groupDiv = document.createElement('div'); groupDiv.className = 'enhancer-multiplier-group'; multipliersInGroup.forEach(value => { const id = `ap-wheel-radio-default-${value}${panelIdSuffix}`; const itemLabel = document.createElement('label'); itemLabel.htmlFor = id; itemLabel.className = 'enhancer-multiplier-item'; const radio = document.createElement('input'); radio.type = 'radio'; radio.id = id; radio.name = `ap-wheel-multiplier-radio${panelIdSuffix}`; radio.value = value; radio.checked = (value === selectedMultiplier); radio.addEventListener('change', () => handleMultiplierRadioChangeUI(value)); const span = document.createElement('span'); span.textContent = `×${globalFormatMultiplier(value)}`; itemLabel.appendChild(radio); itemLabel.appendChild(span); groupDiv.appendChild(itemLabel); }); mainContainer.appendChild(groupDiv); } }); return mainContainer; }
        function updateProgressBarUI(current, total) { if (apProgressFillEl && apProgressTextEl && apProgressContainerEl) { if (total > 0 && autoPlayState.runMode === 'count') { apProgressContainerEl.style.display = 'block'; const percentage = Math.min(100, (current / total) * 100); apProgressFillEl.style.width = `${percentage}%`; apProgressTextEl.textContent = `${current}/${total}`; } else { apProgressContainerEl.style.display = 'none'; apProgressFillEl.style.width = '0%'; apProgressTextEl.textContent = '0/0'; } } }
        function updateAutoPlayControlsUI() { const isPlaying = autoPlayState.isPlaying; if (apStartButtonEl) apStartButtonEl.disabled = isPlaying; if (apStopButtonEl) apStopButtonEl.disabled = !isPlaying; if (manualSpinButtonEl) manualSpinButtonEl.disabled = isPlaying; const configSection = document.getElementById(CONFIG_WHEEL.SELECTORS.wheelAutoplayConfigSectionIdPrefix + panelIdSuffix); if (configSection && autoplayContentEl) { autoplayContentEl.querySelectorAll(`input, select, button:not(#ap-start-wheel${panelIdSuffix}):not(#ap-stop-wheel${panelIdSuffix}), .enhancer-toggle-switch input`).forEach(el => { el.disabled = isPlaying; }); } const multiplierGrid = document.getElementById(CONFIG_WHEEL.SELECTORS.wheelMultiplierSelectionIdPrefix + panelIdSuffix); if (multiplierGrid) { multiplierGrid.querySelectorAll('input[type="radio"], button.enhancer-icon-button, input[type="number"]').forEach(el => el.disabled = isPlaying); } AppState_WHEEL.wheelAutoPlay.isPlayingGlobally = isPlaying; window.updateGlobalAutoplayControls(); }
        function toggleAutoplaySection(autoplayContentElement, sectionType) { const isCollapsed = autoplayContentElement.classList.toggle('collapsed'); if (sectionType === 'slot') { AppState_WHEEL.slotAutoplayCollapsed = isCollapsed; setStoredValue(CONFIG_WHEEL.STORAGE_KEY.slotAutoplayCollapsed, isCollapsed); } else if (sectionType === 'wheel') { AppState_WHEEL.wheelAutoplayCollapsed = isCollapsed; setStoredValue(CONFIG_WHEEL.STORAGE_KEY.wheelAutoplayCollapsed, isCollapsed); } const titleElement = autoplayContentElement.previousElementSibling; if (titleElement) { const chevron = titleElement.querySelector('.enhancer-chevron'); if (chevron) chevron.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'; } }
        function startAutoPlay() { if (autoPlayState.isPlaying) { globalUpdateFooterStatus('Wheel Auto-Play is already active.', 'error'); return; } if (!AppState_WHEEL.token) { globalUpdateFooterStatus(`Auth Token missing. Cannot start Wheel Auto-Play.`, 'error', 'System'); window.updateTokenStatusIndicator(); return; } if (!AppState_WHEEL.liveOpId || AppState_WHEEL.liveOpId === CONFIG.WHEEL_PAYLOAD.liveOpId) { globalUpdateFooterStatus(`Wheel LiveOpId missing or default. Set it in Config.`, 'error', 'System'); window.updateLiveOpIdStatusIndicator(); return; } if (!AppState_WHEEL.vValue) { globalUpdateFooterStatus(`API 'v' Parameter missing. Cannot start Wheel Auto-Play.`, 'error', 'System'); window.updateVValueStatusIndicator(); return; } let multipliersToUse = []; if (autoPlayState.useSequence) { multipliersToUse = autoPlayState.sequence; if (multipliersToUse.length === 0) { globalUpdateFooterStatus('Wheel sequence is empty. Add multipliers first.', 'error', 'System'); return; } } else { if (selectedMultiplier === null || selectedMultiplier === undefined) { globalUpdateFooterStatus('No Wheel multiplier selected.', 'error', 'System'); return; } multipliersToUse = [selectedMultiplier]; } autoPlayState.targetCount = (autoPlayState.runMode === 'count') ? Math.max(1, parseInt(apCountInputEl?.value ?? '10', 10)) : Infinity; autoPlayState.runCount = 0; autoPlayState.currentLoopIteration = 0; autoPlayState.sequenceIndex = 0; if (autoPlayState.runMode === 'count') updateProgressBarUI(0, autoPlayState.targetCount); else updateProgressBarUI(0, 0); autoPlayState.isPlaying = true; updateAutoPlayControlsUI(); const runModeText = autoPlayState.runMode === 'count' ? `${autoPlayState.targetCount} ${autoPlayState.useSequence ? 'loops' : 'spins'}` : 'Infinite'; const playModeText = autoPlayState.useSequence ? 'Sequence' : 'Single Multiplier'; globalUpdateFooterStatus(`Starting Wheel ${playModeText} Auto-Play (${runModeText}).`, 'info', `Wheel Auto`, null, type); const runSpin = () => { if (!autoPlayState.isPlaying) return; const wheelEnergy = AppState_WHEEL.gameData?.userGamesEnergy?.wheelOfFortune?.energy ?? 0; if (wheelEnergy <= 0) { globalUpdateFooterStatus(`Out of energy for Wheel. Stopping Auto-Play.`, 'error', 'Wheel Auto', null, type); globalShowNotification(`Out of energy for Wheel.`, 'error', {prizeType: 'Wheel Auto-Play'}); stopAutoPlay(); return; } let currentMultiplierForSpin; if (autoPlayState.useSequence) { if (autoPlayState.sequenceIndex >= multipliersToUse.length) { autoPlayState.currentLoopIteration++; autoPlayState.sequenceIndex = 0; if (autoPlayState.runMode === 'count' && autoPlayState.currentLoopIteration >= autoPlayState.targetCount) { globalUpdateFooterStatus(`Completed ${autoPlayState.targetCount} Wheel sequence loops.`, 'success', 'Wheel Auto', null, type); stopAutoPlay(); return; } } currentMultiplierForSpin = multipliersToUse[autoPlayState.sequenceIndex]; } else { if (autoPlayState.runMode === 'count' && autoPlayState.runCount >= autoPlayState.targetCount) { globalUpdateFooterStatus(`Completed ${autoPlayState.targetCount} Wheel spins.`, 'success', 'Wheel Auto', null, type); stopAutoPlay(); return; } currentMultiplierForSpin = multipliersToUse[0]; } sendWheelSpin(currentMultiplierForSpin).then(data => { if (autoPlayState.isPlaying) { autoPlayState.runCount++; if (autoPlayState.useSequence) autoPlayState.sequenceIndex++; if (autoPlayState.runMode === 'count') { const progressCurrent = autoPlayState.useSequence ? autoPlayState.currentLoopIteration : autoPlayState.runCount; updateProgressBarUI(progressCurrent, autoPlayState.targetCount); } if (autoPlayState.isPlaying) autoPlayState.intervalId = setTimeout(runSpin, autoPlayState.delay * 1000); } }).catch(error => { console.error(`[Wheel AutoPlay Error]:`, error); if (error.message && (error.message.toLowerCase().includes('authentication error') || error.message.toLowerCase().includes('liveopid missing'))) { if (autoPlayState.isPlaying) stopAutoPlay(); } else if (autoPlayState.isPlaying) autoPlayState.intervalId = setTimeout(runSpin, autoPlayState.delay * 1000); }); }; runSpin(); }
        function stopAutoPlay() { if (!autoPlayState.isPlaying) return; autoPlayState.isPlaying = false; if (autoPlayState.intervalId) clearTimeout(autoPlayState.intervalId); autoPlayState.intervalId = null; updateAutoPlayControlsUI(); if (autoPlayState.runMode === 'count' && autoPlayState.runCount < autoPlayState.targetCount) { const progressCurrent = autoPlayState.useSequence ? autoPlayState.currentLoopIteration : autoPlayState.runCount; updateProgressBarUI(progressCurrent, autoPlayState.targetCount); } globalUpdateFooterStatus(`Wheel Auto-Play stopped.`, 'info', 'System'); }
        function createUI(parentElement) { parentElement.innerHTML = ''; const contentPanel = document.createElement('div'); contentPanel.className = 'enhancer-content-panel'; const titleEl = document.createElement('h3'); titleEl.className = 'enhancer-panel-title'; titleEl.innerHTML = `${CONFIG_WHEEL.ICONS.wheel} Wheel Controls`; contentPanel.appendChild(titleEl); const manualControls = document.createElement('div'); manualControls.style.display = 'flex'; manualControls.style.flexDirection = 'column'; manualControls.style.gap = '12px'; manualSpinButtonEl = globalCreateButton(`Spin Wheel`, () => { if (autoPlayState.isPlaying) return; sendWheelSpin(selectedMultiplier).catch(error => { console.error(`Manual Wheel spin failed:`, error); }); }, ['enhancer-spin-button']); manualSpinButtonEl.id = CONFIG_WHEEL.SELECTORS.wheelManualSpinButtonIdPrefix + panelIdSuffix; manualControls.appendChild(manualSpinButtonEl); multiplierDisplayButtonEl = globalCreateButton(`Multiplier: <span class="value">X${globalFormatMultiplier(selectedMultiplier)}</span>`, null, ['enhancer-multiplier-display-button']); multiplierDisplayButtonEl.id = CONFIG_WHEEL.SELECTORS.wheelMultiplierDisplayButtonIdPrefix + panelIdSuffix; multiplierDisplayButtonEl.disabled = true; manualControls.appendChild(multiplierDisplayButtonEl); contentPanel.appendChild(manualControls); contentPanel.appendChild(createMultiplierSelectionGridUI()); const autoplaySection = document.createElement('div'); autoplaySection.className = 'enhancer-autoplay-config-section'; autoplaySection.id = CONFIG_WHEEL.SELECTORS.wheelAutoplayConfigSectionIdPrefix + panelIdSuffix; const apTitle = document.createElement('h4'); apTitle.className = 'enhancer-panel-subtitle collapsible-title'; apTitle.innerHTML = `Wheel Auto-Play Configuration <span class="enhancer-chevron">${CONFIG.ICONS.chevronDown}</span>`; autoplaySection.appendChild(apTitle); autoplayContentEl = document.createElement('div'); autoplayContentEl.className = 'collapsible-content'; autoplayContentEl.id = CONFIG_WHEEL.SELECTORS.wheelAutoplayContentIdPrefix + panelIdSuffix; if (isAutoplaySectionCollapsed) { autoplayContentEl.classList.add('collapsed'); const chevron = apTitle.querySelector('.enhancer-chevron'); if(chevron) chevron.style.transform = 'rotate(0deg)'; } else { const chevron = apTitle.querySelector('.enhancer-chevron'); if(chevron) chevron.style.transform = 'rotate(180deg)'; } apTitle.addEventListener('click', () => toggleAutoplaySection(autoplayContentEl, 'wheel')); const delayInputId = `ap-delay-wheel${panelIdSuffix}`; autoplayContentEl.appendChild(globalCreateLabelInputPair(delayInputId, 'Delay (seconds):', 'number', autoPlayState.delay, (e) => { const newDelay = parseFloat(e.target.value); autoPlayState.delay = (!isNaN(newDelay) && newDelay >= CONFIG_WHEEL.AUTO_PLAY.minDelay) ? newDelay : CONFIG_WHEEL.AUTO_PLAY.defaultDelay; e.target.value = autoPlayState.delay; globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelDelay, autoPlayState.delay); }, { min: CONFIG_WHEEL.AUTO_PLAY.minDelay, step: '0.1' })); apDelayInputEl = autoplayContentEl.querySelector(`#${delayInputId}`); const runModeRadioName = `ap-runmode-radio-wheel${panelIdSuffix}`; autoplayContentEl.appendChild(globalCreateRadioGroup(runModeRadioName, ['infinite', 'count'], autoPlayState.runMode, (newMode) => { autoPlayState.runMode = newMode; globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelRunMode, newMode); if(apCountInputContainerEl) apCountInputContainerEl.classList.toggle('visible', newMode === 'count'); if(apProgressContainerEl) apProgressContainerEl.style.display = newMode === 'count' ? 'block' : 'none'; if (newMode !== 'count') updateProgressBarUI(0, 0); }, 'Run Mode:')); apCountInputContainerEl = document.createElement('div'); apCountInputContainerEl.id = `ap-count-input-container-wheel${panelIdSuffix}`; apCountInputContainerEl.className = 'ap-count-input-container'; apCountInputContainerEl.style.display = autoPlayState.runMode === 'count' ? 'flex' : 'none'; apCountInputContainerEl.style.flexDirection = 'column'; apCountInputContainerEl.style.gap = '4px'; const countInputId = `ap-count-wheel${panelIdSuffix}`; apCountInputContainerEl.appendChild(globalCreateLabelInputPair(countInputId, 'Number of Loops/Spins:', 'number', autoPlayState.targetCount, (e) => { const count = parseInt(e.target.value, 10); autoPlayState.targetCount = (!isNaN(count) && count >= 1) ? count : 10; e.target.value = autoPlayState.targetCount; globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelTargetCount, autoPlayState.targetCount); }, { min: '1', step: '1' })); autoplayContentEl.appendChild(apCountInputContainerEl); apCountInputEl = autoplayContentEl.querySelector(`#${countInputId}`); const sequenceSection = document.createElement('div'); sequenceSection.className = 'enhancer-sequence-section'; const useSequenceToggleId = `ap-use-sequence-wheel${panelIdSuffix}`; sequenceSection.appendChild(globalCreateSettingItemRow('Use Sequence Mode:', globalCreateToggleSwitch(useSequenceToggleId, autoPlayState.useSequence, (e) => { autoPlayState.useSequence = e.target.checked; globalSetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelUseSequence, e.target.checked); }))); apUseSequenceToggleEl = sequenceSection.querySelector(`#${useSequenceToggleId}`); const sequenceControls = document.createElement('div'); sequenceControls.className = 'enhancer-sequence-controls'; sequenceControls.appendChild(globalCreateButton(`${CONFIG_WHEEL.ICONS.add} Add Selected`, addSelectedToSequenceUI, ['enhancer-small-button', 'enhancer-action-button'])); sequenceControls.appendChild(globalCreateButton(`${CONFIG_WHEEL.ICONS.clear} Clear Sequence`, clearSequenceUI, ['enhancer-small-button', 'enhancer-delete-button'])); sequenceSection.appendChild(sequenceControls); const seqDisplayLabel = document.createElement('label'); seqDisplayLabel.textContent = 'Current Sequence:'; sequenceSection.appendChild(seqDisplayLabel); apSequenceDisplayEl = document.createElement('div'); apSequenceDisplayEl.className = 'enhancer-sequence-display'; apSequenceDisplayEl.id = `ap-sequence-display-wheel${panelIdSuffix}`; sequenceSection.appendChild(apSequenceDisplayEl); autoplayContentEl.appendChild(sequenceSection); apProgressContainerEl = document.createElement('div'); apProgressContainerEl.className = 'enhancer-progress-bar-container'; apProgressContainerEl.id = `ap-progress-container-wheel${panelIdSuffix}`; apProgressContainerEl.style.display = autoPlayState.runMode === 'count' ? 'block' : 'none'; const progressBar = document.createElement('div'); progressBar.className = 'enhancer-progress-bar'; apProgressFillEl = document.createElement('div'); apProgressFillEl.className = 'enhancer-progress-bar-fill'; apProgressFillEl.id = `ap-progress-fill-wheel${panelIdSuffix}`; apProgressTextEl = document.createElement('span'); apProgressTextEl.className = 'enhancer-progress-bar-text'; apProgressTextEl.id = `ap-progress-text-wheel${panelIdSuffix}`; apProgressTextEl.textContent = '0/0'; progressBar.appendChild(apProgressFillEl); progressBar.appendChild(apProgressTextEl); apProgressContainerEl.appendChild(progressBar); autoplayContentEl.appendChild(apProgressContainerEl); const apControlsDiv = document.createElement('div'); apControlsDiv.className = 'enhancer-autoplay-controls'; apStartButtonEl = globalCreateButton(`Start Auto-Play`, startAutoPlay, ['enhancer-action-button']); apStartButtonEl.id = `ap-start-wheel${panelIdSuffix}`; apControlsDiv.appendChild(apStartButtonEl); apStopButtonEl = globalCreateButton(`Stop Auto-Play`, stopAutoPlay, ['enhancer-delete-button']); apStopButtonEl.id = `ap-stop-wheel${panelIdSuffix}`; apStopButtonEl.disabled = true; apControlsDiv.appendChild(apStopButtonEl); autoplayContentEl.appendChild(apControlsDiv); autoplaySection.appendChild(autoplayContentEl); contentPanel.appendChild(autoplaySection); parentElement.appendChild(contentPanel); updateMultiplierDisplayButtonUI(); updateSequenceDisplayUI(); updateAutoPlayControlsUI(); }
        async function loadState() { selectedMultiplier = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.selectedWheelMultiplierRadio, CONFIG_WHEEL.BET_VALUES.wheel[0]); customMultipliers = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.customWheelMultipliers, []); autoPlayState.runMode = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelRunMode, 'infinite'); autoPlayState.targetCount = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelTargetCount, 10); autoPlayState.delay = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelDelay, CONFIG_WHEEL.AUTO_PLAY.defaultDelay); autoPlayState.useSequence = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelUseSequence, false); autoPlayState.sequence = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelSequence, []); isAutoplaySectionCollapsed = await globalGetStoredValue(CONFIG_WHEEL.STORAGE_KEY.wheelAutoplayCollapsed, true); AppState_WHEEL.wheelAutoplayCollapsed = isAutoplaySectionCollapsed; console.log('[WheelModule] State loaded.'); }
        async function resetState() { selectedMultiplier = CONFIG_WHEEL.BET_VALUES.wheel[0]; customMultipliers = []; autoPlayState = { isPlaying: false, delay: CONFIG_WHEEL.AUTO_PLAY.defaultDelay, runMode: 'infinite', useSequence: false, sequence: [], sequenceIndex: 0, intervalId: null, runCount: 0, targetCount: 10, currentLoopIteration: 0 }; isAutoplaySectionCollapsed = true; AppState_WHEEL.wheelAutoplayCollapsed = true; await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.selectedWheelMultiplierRadio); await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.customWheelMultipliers); await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelRunMode); await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelTargetCount); await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelDelay); await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelUseSequence); await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.autoPlayWheelSequence); await globalRemoveStoredValue(CONFIG_WHEEL.STORAGE_KEY.wheelAutoplayCollapsed); console.log('[WheelModule] State reset.'); }
        return { createUI: createUI, loadState: loadState, resetState: resetState, stopAutoPlay: stopAutoPlay, isAutoPlaying: () => autoPlayState.isPlaying, updateControlsBasedOnGlobalAutoplay: (isAnyAutoplayActive) => { if (!autoPlayState.isPlaying) { if (manualSpinButtonEl) manualSpinButtonEl.disabled = isAnyAutoplayActive; if (apStartButtonEl) apStartButtonEl.disabled = isAnyAutoplayActive; } } };
    })(CONFIG, AppState, sendApiRequest, updateFooterStatus, showNotification, updateSpinsLeftFromState, createButton, createToggleSwitch, createSettingItemRow, createLabelInputPair, createRadioGroup, formatMultiplier, setStoredValue, getStoredValue, removeStoredValue);
    // --- نهاية وحدة عجلة الحظ ---


    // --- Styles --- // الأنماط
    function addGlobalStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            :root {
                --enhancer-font-primary: "Poppins", "Roboto", sans-serif;
                --enhancer-font-secondary: "Roboto", sans-serif;

                /* New Professional Theme Colors */
                --enhancer-bg-color: #1A1D21; /* لون الخلفية الرئيسي */
                --enhancer-panel-bg-color: #23272E; /* لون خلفية اللوحات */
                --enhancer-content-bg-color: #23272E; /* لون خلفية المحتوى */
                --enhancer-text-color: #ECEFF1; /* لون النص الأساسي */
                --enhancer-secondary-text-color: #B0BEC5; /* لون النص الثانوي */
                --enhancer-border-color: #373C47; /* لون الحدود */
                --enhancer-accent-color: #4FC3F7; /* اللون المميز */
                --enhancer-accent-rgb: 79, 195, 247; /* اللون المميز بصيغة RGB */
                --enhancer-accent-text-color: var(--enhancer-accent-color); /* لون النص المميز */

                --enhancer-error-color: #EF5350; /* لون الخطأ */
                --enhancer-success-color: #66BB6A; /* لون النجاح */
                --enhancer-info-color: #29B6F6; /* لون المعلومات */

                --enhancer-input-bg: #2C313A; /* خلفية حقول الإدخال */
                --enhancer-input-text: var(--enhancer-text-color); /* نص حقول الإدخال */
                --enhancer-input-border: #373C47; /* حدود حقول الإدخال */
                --enhancer-input-border-focus: var(--enhancer-accent-color); /* حدود حقول الإدخال عند التركيز */

                --enhancer-button-bg: transparent; /* خلفية الأزرار */
                --enhancer-button-text: var(--enhancer-accent-color); /* نص الأزرار */
                --enhancer-button-hover-bg: rgba(var(--enhancer-accent-rgb), 0.1); /* خلفية الأزرار عند التحويم */
                --enhancer-button-active-bg: rgba(var(--enhancer-accent-rgb), 0.2); /* خلفية الأزرار عند الضغط */
                --enhancer-button-border: 1px solid var(--enhancer-accent-color); /* حدود الأزرار */

                --enhancer-button-disabled-bg: #3C424D; /* خلفية الأزرار المعطلة */
                --enhancer-button-disabled-text: #788294; /* نص الأزرار المعطلة */
                --enhancer-button-disabled-border: 1px solid #4A505C; /* حدود الأزرار المعطلة */

                --enhancer-scrollbar-thumb: #4A505C; /* لون شريط التمرير */
                --enhancer-scrollbar-track: #23272E; /* لون مسار شريط التمرير */

                --enhancer-border-radius: 8px; /* نصف قطر الحدود */
                --enhancer-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25); /* الظل */
                --enhancer-inner-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2); /* الظل الداخلي */

                /* Main Tab Colors */ /* ألوان التبويبات الرئيسية */
                --enhancer-tab-color-settings: #AB7BBF;
                --enhancer-tab-color-spin: #F39C12;
                --enhancer-tab-color-events: #58D68D;
                --enhancer-tab-color-build: #5DADE2;
                --enhancer-tab-color-stats: #F4D03F;

                /* Active SubTab Colors */ /* ألوان التبويبات الفرعية النشطة */
                --enhancer-subtab-active-settings: var(--enhancer-tab-color-settings);
                --enhancer-subtab-active-spin: var(--enhancer-tab-color-spin);
                --enhancer-subtab-active-events: var(--enhancer-tab-color-events);
                --enhancer-subtab-active-build: var(--enhancer-tab-color-build);

                --enhancer-button-accent-spin: var(--enhancer-tab-color-spin); /* لون مميز لزر الدوران */
                --enhancer-button-accent-action: var(--enhancer-success-color); /* لون مميز لزر الإجراء */
                --enhancer-button-accent-config: var(--enhancer-tab-color-settings); /* لون مميز لزر الإعدادات */
                --enhancer-button-accent-fetch: #80CBC4; /* لون مميز لزر جلب الإعدادات */

                --enhancer-multiplier-selected-bg: var(--enhancer-button-accent-spin); /* خلفية المضاعف المحدد */
                --enhancer-multiplier-selected-text: #FFFFFF; /* نص المضاعف المحدد */
            }
            @keyframes panelFadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
            @keyframes notificationFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes notificationFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }


            #${CONFIG.SELECTORS.enhancerFloatingButtonId} {
                position: fixed; width: 55px; height: 55px; background-color: var(--enhancer-accent-color);
                color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-size: 28px; cursor: pointer; z-index: 100000; box-shadow: var(--enhancer-shadow);
                transition: transform 0.2s ease-out, background-color 0.2s ease; user-select: none;
            }
            #${CONFIG.SELECTORS.enhancerFloatingButtonId}:hover {
                transform: scale(1.1); background-color: color-mix(in srgb, var(--enhancer-accent-color) 85%, black);
            }
            #${CONFIG.SELECTORS.mainPanelId} {
                direction: ltr; background: var(--enhancer-bg-color); color: var(--enhancer-text-color);
                z-index: 99998; box-sizing: border-box; display: none; flex-direction: column;
                font-family: var(--enhancer-font-primary); font-size: 15px;
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh; border: none; border-radius: 0;
                box-shadow: none; overflow: hidden; animation: panelFadeIn 0.25s ease-out forwards;
            }
            #${CONFIG.SELECTORS.mainPanelId} * { box-sizing: border-box; text-shadow: none !important; }

            .enhancer-header-bar {
                background: var(--enhancer-panel-bg-color); padding: 10px 15px;
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid var(--enhancer-border-color); flex-shrink: 0; height: 55px;
            }
            .enhancer-spin-counts-container {
                display: flex; gap: 20px;
                align-items: center;
                position: absolute; left: 50%; transform: translateX(-50%);
            }
            .enhancer-spin-count { display: flex; gap: 8px; align-items: center; font-size: 1.2em; color: var(--enhancer-secondary-text-color); font-weight: 500; }
            .enhancer-spin-count svg { height: 24px; width: 24px; stroke: var(--enhancer-secondary-text-color); }
            .enhancer-spin-count span { color: var(--enhancer-text-color); font-weight: 600; }

            .enhancer-panel-close-button { background: transparent; border: none; cursor: pointer; padding: 6px; width: 36px; height: 36px; border-radius: 50%; transition: background-color 0.2s ease; display: flex; align-items: center; justify-content: center; margin-left: auto; }
            .enhancer-panel-close-button svg { stroke: var(--enhancer-secondary-text-color); transition: stroke 0.2s ease; width: 26px; height: 26px; }
            .enhancer-panel-close-button:hover { background-color: rgba(var(--enhancer-accent-rgb), 0.1); }
            .enhancer-panel-close-button:hover svg { stroke: var(--enhancer-accent-color); }

            #${CONFIG.SELECTORS.mainTabsContainerId} { display: flex; background: var(--enhancer-panel-bg-color); border-bottom: 1px solid var(--enhancer-border-color); flex-shrink: 0; overflow-x: auto; scrollbar-width: thin; scrollbar-color: var(--enhancer-scrollbar-thumb) var(--enhancer-scrollbar-track); }
            #${CONFIG.SELECTORS.mainTabsContainerId}::-webkit-scrollbar { height: 5px; }
            #${CONFIG.SELECTORS.mainTabsContainerId}::-webkit-scrollbar-thumb { background-color: var(--enhancer-scrollbar-thumb); border-radius: 2.5px; }

            .${CONFIG.SELECTORS.mainTabButtonClass} {
                flex-grow: 1; flex-basis: 0; min-width: 90px; background: transparent; border: none;
                border-bottom: 3px solid transparent;
                padding: 10px 12px;
                color: var(--enhancer-secondary-text-color); font-weight: 500; font-size: 0.95em;
                cursor: pointer; border-radius: 0;
                transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
                text-align: center; margin-bottom: -1px;
                opacity: 0.8; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap;
            }
            .${CONFIG.SELECTORS.mainTabButtonClass}:hover { background: rgba(var(--enhancer-accent-rgb),0.05); color: var(--enhancer-text-color); opacity: 1; }
            .${CONFIG.SELECTORS.mainTabButtonClass}[data-tab-id="settings"].active { color: var(--enhancer-tab-color-settings); border-bottom-color: var(--enhancer-tab-color-settings); font-weight: 600; opacity:1; }
            .${CONFIG.SELECTORS.mainTabButtonClass}[data-tab-id="spin"].active { color: var(--enhancer-tab-color-spin); border-bottom-color: var(--enhancer-tab-color-spin); font-weight: 600; opacity:1; }
            .${CONFIG.SELECTORS.mainTabButtonClass}[data-tab-id="events-tasks"].active { color: var(--enhancer-tab-color-events); border-bottom-color: var(--enhancer-tab-color-events); font-weight: 600; opacity:1; }
            .${CONFIG.SELECTORS.mainTabButtonClass}[data-tab-id="build"].active { color: var(--enhancer-tab-color-build); border-bottom-color: var(--enhancer-tab-color-build); font-weight: 600; opacity:1; }
            .${CONFIG.SELECTORS.mainTabButtonClass}[data-tab-id="stats"].active { color: var(--enhancer-tab-color-stats); border-bottom-color: var(--enhancer-tab-color-stats); font-weight: 600; opacity:1; }
            .${CONFIG.SELECTORS.mainTabButtonClass} svg { width: 16px; height: 16px; }

            .enhancer-main-tabs-content-area { flex-grow: 1; overflow-y: auto; background-color: var(--enhancer-bg-color); display: flex; flex-direction: column; scrollbar-width: thin; scrollbar-color: var(--enhancer-scrollbar-thumb) var(--enhancer-scrollbar-track); }
            .enhancer-main-tabs-content-area::-webkit-scrollbar { width: 8px; }
            .enhancer-main-tabs-content-area::-webkit-scrollbar-track { background: var(--enhancer-scrollbar-track); border-radius: 4px; }
            .enhancer-main-tabs-content-area::-webkit-scrollbar-thumb { background-color: var(--enhancer-scrollbar-thumb); border-radius: 4px; }
            .${CONFIG.SELECTORS.mainTabPaneClass} { display: none; flex-direction: column; gap: 12px; padding: 12px; height: 100%; overflow-y: auto; }

            #main-tab-pane-settings.active { border-top: 3px solid var(--enhancer-tab-color-settings); background-color: color-mix(in srgb, var(--enhancer-tab-color-settings) 3%, var(--enhancer-bg-color)); }
            #main-tab-pane-spin.active { border-top: 3px solid var(--enhancer-tab-color-spin); background-color: color-mix(in srgb, var(--enhancer-tab-color-spin) 3%, var(--enhancer-bg-color)); }
            #main-tab-pane-events-tasks.active { border-top: 3px solid var(--enhancer-tab-color-events); background-color: color-mix(in srgb, var(--enhancer-tab-color-events) 3%, var(--enhancer-bg-color)); }
            #main-tab-pane-build.active { border-top: 3px solid var(--enhancer-tab-color-build); background-color: color-mix(in srgb, var(--enhancer-tab-color-build) 3%, var(--enhancer-bg-color)); }
            #main-tab-pane-stats .enhancer-stats-content-wrapper { border-top: 3px solid var(--enhancer-tab-color-stats); background-color: color-mix(in srgb, var(--enhancer-tab-color-stats) 3%, var(--enhancer-bg-color)); padding: 12px; border-radius: var(--enhancer-border-radius); }
            .${CONFIG.SELECTORS.mainTabPaneClass}.active { display: flex; }

            .enhancer-footer-status-bar { background: var(--enhancer-panel-bg-color); padding: 7px 12px; text-align: center; font-weight: 500; font-size: 0.85em; color: var(--enhancer-secondary-text-color); min-height: 32px; display: flex; align-items: center; justify-content: center; border-top: 1px solid var(--enhancer-border-color); flex-shrink: 0; box-shadow: var(--enhancer-inner-shadow); flex-wrap: wrap; gap: 5px 10px; }
            .enhancer-footer-status-bar .status-message { flex-grow: 1; text-align: left;}
            .enhancer-footer-status-bar .status-context { font-size: 0.9em; color: var(--enhancer-accent-text-color); white-space: nowrap; }
            .enhancer-footer-status-bar span.error { color: var(--enhancer-error-color); font-weight: 600; }
            .enhancer-footer-status-bar span.success { color: var(--enhancer-success-color); font-weight: 600; }
            .enhancer-footer-status-bar span.info { color: var(--enhancer-info-color); }
            .enhancer-content-panel { display: flex; flex-direction: column; align-items: stretch; gap: 15px; width: 100%; background-color: var(--enhancer-content-bg-color); padding: 15px; border-radius: var(--enhancer-border-radius); }
            .enhancer-panel-title { font-size: 1.3em; font-weight: 600; color: var(--enhancer-text-color); margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--enhancer-border-color); display: flex; align-items: center; gap: 10px; }
            .enhancer-panel-title svg { stroke: var(--enhancer-accent-color); width: 22px; height: 22px;}

            .enhancer-styled-button { padding: 10px 18px; margin: 0; background: var(--enhancer-button-bg); text-decoration: none; text-transform: none; text-align: center; line-height: 1.4; color: var(--enhancer-button-text); font-size: 0.95em; font-family: var(--enhancer-font-primary); font-weight: 500; letter-spacing: 0.3px; border-radius: var(--enhancer-border-radius); border: var(--enhancer-button-border); cursor: pointer; outline: none; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.1s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; }
            .enhancer-styled-button:hover:not(:disabled) { background: var(--enhancer-button-hover-bg); transform: translateY(-1px); }
            .enhancer-styled-button:active:not(:disabled) { background: var(--enhancer-button-active-bg); transform: translateY(0px); }
            .enhancer-styled-button:disabled { background: var(--enhancer-button-disabled-bg) !important; color: var(--enhancer-button-disabled-text) !important; border-color: var(--enhancer-button-disabled-border) !important; cursor: not-allowed; box-shadow: none !important; transform: none !important; }
            .enhancer-styled-button svg { width: 16px; height: 16px; }

            .enhancer-spin-button { background-color: var(--enhancer-button-accent-spin) !important; border-color: var(--enhancer-button-accent-spin) !important; color: white !important; font-size: 1.1em; padding: 12px 22px; }
            .enhancer-spin-button:hover:not(:disabled) { background-color: color-mix(in srgb, var(--enhancer-button-accent-spin) 85%, black) !important; }
            .enhancer-action-button { background-color: var(--enhancer-button-accent-action) !important; border-color: var(--enhancer-button-accent-action) !important; color: white !important; }
            .enhancer-action-button:hover:not(:disabled) { background-color: color-mix(in srgb, var(--enhancer-button-accent-action) 85%, black) !important; }
            .enhancer-config-button { background-color: var(--enhancer-button-accent-config) !important; border-color: var(--enhancer-button-accent-config) !important; color: white !important; }
            .enhancer-config-button:hover:not(:disabled) { background-color: color-mix(in srgb, var(--enhancer-button-accent-config) 85%, black) !important; }
            .enhancer-fetch-config-button { background-color: var(--enhancer-button-accent-fetch) !important; border-color: var(--enhancer-button-accent-fetch) !important; color: white !important; }
            .enhancer-fetch-config-button:hover:not(:disabled) { background-color: color-mix(in srgb, var(--enhancer-button-accent-fetch) 85%, black) !important; }
            .enhancer-delete-button, .enhancer-cancel-button { background-color: var(--enhancer-error-color) !important; border-color: var(--enhancer-error-color) !important; color: white !important; }
            .enhancer-delete-button:hover:not(:disabled), .enhancer-cancel-button:hover:not(:disabled) { background-color: color-mix(in srgb, var(--enhancer-error-color) 85%, black) !important; }

            .enhancer-multiplier-display-button { font-size: 1em; width: 100%; background-color: var(--enhancer-input-bg); border-color: var(--enhancer-input-border); color: var(--enhancer-text-color); cursor: default; }
            .enhancer-small-button { padding: 8px 14px; font-size: 0.9em; min-height: 38px; }
            .enhancer-icon-button { padding: 8px; font-size: 0.9em; min-width: 38px; }
            .enhancer-multiplier-selection { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--enhancer-border-color); display: flex; flex-direction: column; gap: 12px; }
            .enhancer-multiplier-selection-label { font-size: 0.95em; color: var(--enhancer-secondary-text-color); margin-bottom: 5px; display: block; font-weight: 500;}
            .enhancer-multiplier-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(75px, 1fr)); gap: 7px; padding: 8px; border: 1px solid var(--enhancer-input-border); border-radius: var(--enhancer-border-radius); background-color: var(--enhancer-input-bg); }
            .enhancer-multiplier-item { display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9em; color: var(--enhancer-text-color); padding: 8px 10px; border: 1px solid transparent; border-radius: calc(var(--enhancer-border-radius) - 3px); background-color: var(--enhancer-panel-bg-color); transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; position: relative; }
            .enhancer-multiplier-item input[type="radio"] { display: none; }
            .enhancer-multiplier-item:hover { background-color: rgba(var(--enhancer-accent-rgb), 0.1); border-color: rgba(var(--enhancer-accent-rgb), 0.25); }
            .enhancer-multiplier-item input[type="radio"]:checked + span { background-color: var(--enhancer-multiplier-selected-bg) !important; color: var(--enhancer-multiplier-selected-text) !important; border-color: var(--enhancer-multiplier-selected-bg) !important; font-weight: 600; }
            .enhancer-multiplier-item span { display: block; width: 100%; height: 100%; text-align: center; padding: 5px; border-radius: inherit; border: 1px solid var(--enhancer-input-border); }
            .enhancer-custom-multiplier-input-area { display: flex; gap: 8px; margin-bottom: 10px; align-items: center; }
            .enhancer-custom-multiplier-input-area input[type="number"] { flex-grow: 1; font-size: 0.95em; }
            .enhancer-custom-multiplier-group .enhancer-multiplier-item .delete-custom-multiplier-btn { position: absolute; top: -5px; right: -5px; background-color: var(--enhancer-error-color); color: white; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; line-height: 18px; text-align: center; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; padding:0; }
            .enhancer-custom-multiplier-group .enhancer-multiplier-item:hover .delete-custom-multiplier-btn { opacity: 1; }

            .enhancer-autoplay-config-section { background-color: rgba(0,0,0,0.1); padding: 0; border-radius: var(--enhancer-border-radius); border: 1px solid var(--enhancer-border-color); margin-top: 15px; overflow: hidden; }
            .enhancer-panel-subtitle.collapsible-title { font-size: 1.1em; font-weight: 600; color: var(--enhancer-accent-text-color); margin-bottom: 0; padding: 10px 15px; border-bottom: 1px dashed var(--enhancer-border-color); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background-color 0.2s ease; }
            .enhancer-panel-subtitle.collapsible-title:hover { background-color: rgba(var(--enhancer-accent-rgb), 0.05); }
            .enhancer-chevron { transition: transform 0.3s ease-in-out; display: inline-block; }
            .collapsible-content { padding: 15px; display: flex; flex-direction: column; gap: 15px; max-height: 1800px; overflow: hidden; transition: max-height 0.35s ease-in-out, padding 0.35s ease-in-out, opacity 0.25s ease-in-out; opacity: 1; }
            .collapsible-content.collapsed { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; }

            .enhancer-autoplay-config-section label:not(.enhancer-toggle-switch):not([for^='ap-runmode-radio']) { font-size: 0.95em; color: var(--enhancer-secondary-text-color); margin-bottom: 4px; display: block; font-weight: 500;}
            .enhancer-autoplay-config-section input[type="number"], .enhancer-autoplay-config-section select { width: 100%; padding: 10px 12px; border-radius: var(--enhancer-border-radius); border: 1px solid var(--enhancer-input-border); background-color: var(--enhancer-input-bg); color: var(--enhancer-input-text); font-size: 0.95em; box-shadow: var(--enhancer-inner-shadow); }
            .enhancer-autoplay-config-section .radio-group { display: flex; gap: 10px; margin-bottom: 10px;}
            .enhancer-autoplay-config-section .radio-group label { display: flex; align-items: center; gap: 7px; cursor: pointer; padding: 10px 12px; flex: 1; justify-content: center; border: 1px solid var(--enhancer-input-border); border-radius: var(--enhancer-border-radius); background-color: var(--enhancer-input-bg); font-size: 0.95em; }
            .enhancer-autoplay-config-section .radio-group input[type="radio"] { display: none; }
            .enhancer-autoplay-config-section .radio-group input[type="radio"]:checked + span { font-weight: 600; color: var(--enhancer-accent-color); }
            .enhancer-autoplay-config-section .radio-group label:has(input[type="radio"]:checked) { border-color: var(--enhancer-accent-color); background-color: rgba(var(--enhancer-accent-rgb), 0.08); }
            .ap-count-input-container.visible { display: flex !important; flex-direction: column; gap: 4px; }
            .enhancer-sequence-section { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--enhancer-border-color); }
            .enhancer-sequence-controls { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; flex-wrap: wrap; }
            .enhancer-sequence-display { background-color: var(--enhancer-input-bg); border: 1px solid var(--enhancer-input-border); border-radius: var(--enhancer-border-radius); padding: 12px; min-height: 65px; max-height: 120px; overflow-y: auto; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 0.95em; }
            .enhancer-sequence-item { background-color: rgba(var(--enhancer-accent-rgb), 0.12); border: 1px solid var(--enhancer-accent-color); color: var(--enhancer-accent-color); border-radius: calc(var(--enhancer-border-radius) - 3px); padding: 5px 10px; font-weight: 500; white-space: nowrap; display: flex; align-items: center; gap: 7px; position: relative; }
            .enhancer-delete-sequence-item-btn { background: transparent; border: none; color: var(--enhancer-error-color); cursor: pointer; padding: 0 3px; font-size: 1.1em; line-height: 1; opacity: 0.7; margin-left: 5px; }
            .enhancer-delete-sequence-item-btn:hover { opacity: 1; transform: scale(1.1); }
            .enhancer-sequence-toggle-container { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
            .enhancer-sequence-toggle-container label:not(.enhancer-toggle-switch) { font-size: 0.95em; color: var(--enhancer-secondary-text-color); margin: 0; font-weight: 500; }
            .enhancer-autoplay-controls { display: flex; gap: 12px; margin-top: 15px; }
            .enhancer-progress-bar-container { width: 100%; margin-top: 10px; }
            .enhancer-progress-bar { background-color: var(--enhancer-input-bg); border-radius: var(--enhancer-border-radius); padding: 3px; border: 1px solid var(--enhancer-input-border); position: relative; height: 24px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .enhancer-progress-bar-fill { background-color: var(--enhancer-success-color); height: 100%; border-radius: calc(var(--enhancer-border-radius) - 2px); width: 0%; transition: width 0.2s ease-out; }
            .enhancer-progress-bar-text { position: absolute; color: var(--enhancer-text-color); font-size: 0.85em; font-weight: 600; text-shadow: 1px 1px 1px rgba(0,0,0,0.4); line-height: 24px; }

            .${CONFIG.SELECTORS.subTabsContainerClass} { display: flex; border-bottom: 1px solid var(--enhancer-border-color); margin-bottom: 15px; flex-shrink: 0; }
            .${CONFIG.SELECTORS.subTabButtonClass} {
                flex: 1; background: transparent; border: none;
                border-bottom: 2px solid transparent; padding: 10px 12px;
                color: var(--enhancer-secondary-text-color); font-weight: 500; font-size: 1em;
                cursor: pointer; border-radius: 0;
                transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
                text-align: center; margin-bottom: -1px; opacity: 0.75; position: relative;
                display: flex; align-items: center; justify-content: center; gap: 7px;
            }
            .${CONFIG.SELECTORS.subTabButtonClass}:hover { background: rgba(var(--enhancer-accent-rgb),0.05); color: var(--enhancer-text-color); opacity: 1; }
            #enhancer-settings-sub-tabs-container .${CONFIG.SELECTORS.subTabButtonClass}.active { color: var(--enhancer-subtab-active-settings); border-bottom-color: var(--enhancer-subtab-active-settings); font-weight: 600; opacity:1; }
            #enhancer-spin-sub-tabs-container .${CONFIG.SELECTORS.subTabButtonClass}.active { color: var(--enhancer-subtab-active-spin); border-bottom-color: var(--enhancer-subtab-active-spin); font-weight: 600; opacity:1; }
            #enhancer-events-tasks-sub-tabs-container .${CONFIG.SELECTORS.subTabButtonClass}.active { color: var(--enhancer-subtab-active-events); border-bottom-color: var(--enhancer-subtab-active-events); font-weight: 600; opacity:1; }
            #enhancer-build-sub-tabs-container .${CONFIG.SELECTORS.subTabButtonClass}.active { color: var(--enhancer-subtab-active-build); border-bottom-color: var(--enhancer-subtab-active-build); font-weight: 600; opacity:1; }

            .${CONFIG.SELECTORS.subTabPaneClass} { display: none; flex-direction: column; gap: 18px; animation: panelFadeIn 0.25s forwards; }
            .${CONFIG.SELECTORS.subTabPaneClass}.active { display: flex; }
            .enhancer-setting-item { display: flex; flex-direction: column; gap: 7px; }
            .enhancer-setting-item-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
            .enhancer-setting-item label:not(.enhancer-toggle-switch) { font-size: 0.95em; color: var(--enhancer-secondary-text-color); font-weight: 500; display: flex; align-items: center; gap: 8px; }
            .enhancer-input-group { display: flex; align-items: center; width: 100%; }
            .enhancer-text-input { flex-grow: 1; padding: 10px 12px; border-radius: var(--enhancer-border-radius) 0 0 var(--enhancer-border-radius); border: 1px solid var(--enhancer-input-border); background-color: var(--enhancer-input-bg); color: var(--enhancer-input-text); font-size: 0.95em; font-family: monospace; box-shadow: var(--enhancer-inner-shadow); transition: border-color 0.2s ease; min-width: 120px; border-right: none;}
            .enhancer-text-input:focus { outline: none; border-color: var(--enhancer-input-border-focus); z-index: 1; position:relative; }
            .enhancer-input-group .enhancer-styled-button { border-radius: 0 var(--enhancer-border-radius) var(--enhancer-border-radius) 0; margin-left: -1px; }
            .enhancer-status-indicator { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-left: 8px; transition: background-color 0.2s ease, box-shadow 0.2s ease; flex-shrink: 0; }
            #${CONFIG.SELECTORS.tokenStatusIndicatorId}.valid, #${CONFIG.SELECTORS.liveOpIdStatusIndicatorId}.valid, #${CONFIG.SELECTORS.vValueStatusIndicatorId}.valid, #${CONFIG.SELECTORS.configJsonStatusIndicatorId}.valid { background-color: var(--enhancer-success-color); box-shadow: 0 0 5px var(--enhancer-success-color); }
            #${CONFIG.SELECTORS.tokenStatusIndicatorId}.invalid, #${CONFIG.SELECTORS.liveOpIdStatusIndicatorId}.invalid, #${CONFIG.SELECTORS.vValueStatusIndicatorId}.invalid, #${CONFIG.SELECTORS.configJsonStatusIndicatorId}.invalid { background-color: var(--enhancer-error-color); box-shadow: 0 0 5px var(--enhancer-error-color); }
            .enhancer-textarea-input { flex-grow: 1; padding: 10px 12px; border-radius: var(--enhancer-border-radius); border: 1px solid var(--enhancer-input-border); background-color: var(--enhancer-input-bg); color: var(--enhancer-input-text); font-size: 0.9em; font-family: monospace; box-shadow: var(--enhancer-inner-shadow); transition: border-color 0.2s ease; min-width: 120px; min-height: 100px; resize: vertical; }
            .enhancer-textarea-input:focus { outline: none; border-color: var(--enhancer-input-border-focus); z-index: 1; position:relative; }
            .enhancer-stats-content-wrapper { display: flex; flex-direction: column; gap: 15px; width: 100%;}
            .enhancer-stats-tabs-nav { display: flex; margin-bottom: 15px; border-bottom: 1px solid var(--enhancer-border-color); gap: 0px; flex-shrink: 0; }
            .enhancer-stats-tab-button { flex: 1; background: transparent; border: none; border-bottom: 2px solid transparent; padding: 10px 12px; color: var(--enhancer-secondary-text-color); font-weight: 500; cursor: pointer; border-radius: 0; transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease; font-size: 1em; text-align: center; margin-bottom: -1px; opacity: 0.75; position: relative; }
            .enhancer-stats-tab-button:hover { background: rgba(var(--enhancer-accent-rgb), 0.05); color: var(--enhancer-text-color); opacity: 1; }
            .enhancer-stats-tab-button.active { color: var(--enhancer-tab-color-stats); border-bottom-color: var(--enhancer-tab-color-stats); opacity: 1; font-weight: 600; }
            .enhancer-stats-content-box { font-family: var(--enhancer-font-secondary); font-size: 1em; line-height: 1.7; color: var(--enhancer-text-color); padding-top: 10px; flex-grow: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--enhancer-scrollbar-thumb) var(--enhancer-scrollbar-track); min-height: 200px; }
            .enhancer-stats-content-box::-webkit-scrollbar { width: 7px; }
            .enhancer-stats-content-box::-webkit-scrollbar-track { background: var(--enhancer-scrollbar-track); border-radius: 3.5px; }
            .enhancer-stats-content-box::-webkit-scrollbar-thumb { background-color: var(--enhancer-scrollbar-thumb); border-radius: 3.5px; }
            .enhancer-stats-content-box b { color: var(--enhancer-accent-text-color); font-weight: 600; }
            .enhancer-stats-content-box span[style*="color"] { font-weight: 600; }
            .enhancer-stats-content-box br + b { margin-top: 12px; display: inline-block; }
            .enhancer-stats-content-box img, .enhancer-stats-content-box svg.inline-icon { height: 18px; width: auto; vertical-align: -4px; margin-right: 5px; opacity: 0.85; }
            #${CONFIG.SELECTORS.toggleButtonId} { display: block; width: calc(100% - 20px); margin: 10px auto !important; font-family: var(--enhancer-font-primary) !important; letter-spacing: 0.4px !important; font-size: 1.1em !important; padding: 12px 20px !important; }
            .enhancer-toggle-switch { position: relative; display: inline-block; width: 44px; height: 22px; flex-shrink: 0; }
            .enhancer-toggle-switch input { opacity: 0; width: 0; height: 0; }
            .enhancer-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4A4F5A; transition: .25s; border-radius: 11px; }
            .enhancer-toggle-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: var(--enhancer-text-color); transition: .25s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.25); }
            input:checked + .enhancer-toggle-slider { background-color: var(--enhancer-accent-color); }
            input:checked + .enhancer-toggle-slider:before { transform: translateX(22px); background-color: var(--enhancer-bg-color); }
            input:disabled + .enhancer-toggle-slider { cursor: not-allowed; opacity: 0.6; }
            input:disabled + .enhancer-toggle-slider:before { background-color: #555; }
            .enhancer-interval-input { width: 70px !important; text-align: center; margin-left: 10px; padding: 8px 10px !important; font-size: 0.95em !important; }
            .enhancer-setting-item-row label { flex-grow: 1;}
            .enhancer-setting-item-row .enhancer-toggle-switch { margin-left: auto;}
            .empty-tab-placeholder { text-align: center; font-size: 1.1em; color: var(--enhancer-secondary-text-color); margin-top: 50px; padding:20px; background-color: var(--enhancer-input-bg); border-radius: var(--enhancer-border-radius); border: 1px solid var(--enhancer-border-color); }
            #${CONFIG.SELECTORS.resetConfirmationContainerId} { display: none; align-items: center; gap: 10px; margin-top: 8px; padding: 8px; background-color: rgba(var(--enhancer-accent-rgb), 0.05); border: 1px solid var(--enhancer-border-color); border-radius: var(--enhancer-border-radius); }
            #${CONFIG.SELECTORS.resetConfirmationContainerId} span { font-weight: 500; font-size: 0.95em; }
            .enhancer-event-form { display: flex; flex-direction: column; gap: 12px; padding: 15px; border: 1px solid var(--enhancer-border-color); border-radius: var(--enhancer-border-radius); background-color: var(--enhancer-input-bg); margin-bottom: 20px; }
            .enhancer-event-form input[type="text"], .enhancer-event-form input[type="number"], .enhancer-event-form input[type="datetime-local"] { width: 100%; font-size: 0.95em; }
            .enhancer-event-list { display: flex; flex-direction: column; gap: 10px; }
            .enhancer-event-item { display: flex; align-items: flex-start; padding: 12px 15px; background-color: var(--enhancer-input-bg); border: 1px solid var(--enhancer-border-color); border-radius: var(--enhancer-border-radius); gap: 10px; }
            .enhancer-event-item-checkbox { margin-top: 5px; flex-shrink: 0; transform: scale(0.9); }
            .enhancer-event-item-info { flex-grow: 1; display: flex; flex-direction: column; gap: 4px; }
            .enhancer-event-item-info .event-name { font-weight: 600; color: var(--enhancer-text-color); font-size: 1.1em; } /* Increased font size */
            .enhancer-event-item-info .event-id, .enhancer-event-item-info .event-claims, .enhancer-event-item-info .event-timer { font-size: 0.8em; color: var(--enhancer-secondary-text-color); display: flex; align-items: center; gap: 5px; } /* Decreased font size */
            .enhancer-event-item-info .event-timer svg { width: 12px; height: 12px; }
            .enhancer-event-item-actions { display: flex; flex-direction: row; gap: 8px; flex-shrink: 0; align-items: center; } /* Changed to row and center align */
            .enhancer-event-item-actions .enhancer-styled-button { width: auto; } /* Adjusted width for horizontal layout */
            .enhancer-event-item-actions .enhancer-styled-button svg { width: 14px; height: 14px; }
            .no-events-placeholder { text-align: center; color: var(--enhancer-secondary-text-color); padding: 20px; font-style: italic; }
            #${CONFIG.SELECTORS.eventGlobalActionsId} { display: flex; gap: 10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--enhancer-border-color); }
            .timer-expired { color: var(--enhancer-error-color) !important; font-weight: bold; }
            .enhancer-boost-controls { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; width: 100%;}
            .enhancer-boost-controls .enhancer-styled-button { width: auto; min-width: 200px; }

            #${CONFIG.SELECTORS.notificationContainerId} {
                position: fixed; bottom: 15px; right: 15px; z-index: 100001;
                display: flex; flex-direction: column-reverse; gap: 8px; max-width: 320px;
            }
            .enhancer-notification {
                background-color: rgba(35, 39, 46, 0.92);
                color: var(--enhancer-text-color); padding: 12px 18px;
                border-radius: calc(var(--enhancer-border-radius) - 2px);
                box-shadow: 0 3px 10px rgba(0,0,0,0.25);
                cursor: pointer; font-size: 1em;
                line-height: 1.4; border-left: 4px solid var(--enhancer-info-color);
                animation: notificationFadeIn 0.25s ease-out forwards;
                transition: opacity 0.25s, transform 0.25s;
            }
            .enhancer-notification.success { border-left-color: var(--enhancer-success-color); }
            .enhancer-notification.error { border-left-color: var(--enhancer-error-color); }
            .enhancer-notification.info { border-left-color: var(--enhancer-info-color); }
            .enhancer-notification strong { font-weight: 600; }
            .enhancer-notification .prize-type { color: var(--enhancer-accent-text-color); }
            .enhancer-notification .prize-value { font-weight: bold; }
            .enhancer-notification.fade-out { opacity: 0; transform: scale(0.95) translateX(15px); }


            /* Media Queries for Mobile Responsiveness */ /* استعلامات الوسائط للاستجابة على الهاتف المحمول */
            @media (max-width: 768px) {
                #${CONFIG.SELECTORS.mainPanelId} { font-size: 14px; }
                .${CONFIG.SELECTORS.mainTabButtonClass} { font-size: 0.85em; padding: 9px 7px; min-width: 75px; }
                .${CONFIG.SELECTORS.mainTabButtonClass} svg { width: 15px; height: 15px; }
                .enhancer-header-bar { padding: 7px 9px; height: auto; min-height:48px; flex-wrap: wrap; justify-content: center; }
                .enhancer-spin-counts-container { position: static; transform: none; order: 1; margin-bottom: 4px; gap: 15px; }
                .enhancer-panel-close-button { order: 2; }
                .enhancer-spin-count { font-size: 1em; gap: 6px; }
                .enhancer-spin-count svg { width: 20px; height: 20px; }
                .enhancer-panel-close-button svg { width: 22px; height: 22px; }
                .enhancer-multiplier-group { grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 5px; padding: 7px; }
                .enhancer-multiplier-item { padding: 7px 9px; font-size: 0.85em; }
                .collapsible-content { padding: 12px; gap: 12px; }
                .enhancer-setting-item-row { flex-direction: column; align-items: flex-start; }
                .enhancer-setting-item-row label { margin-bottom: 4px; }
                .enhancer-input-group { flex-direction: column; align-items: stretch; }
                .enhancer-text-input, .enhancer-textarea-input { border-radius: var(--enhancer-border-radius); border-right: 1px solid var(--enhancer-input-border); margin-bottom: 7px; }
                .enhancer-input-group .enhancer-styled-button { border-radius: var(--enhancer-border-radius); margin-left: 0; width: 100%; }
                .enhancer-event-item-actions { flex-direction: row; flex-wrap: wrap; justify-content: flex-start; } /* Allow wrapping for smaller screens */
                .enhancer-event-item-actions .enhancer-styled-button { flex-basis: auto; margin: 4px; min-width: 80px; } /* Adjust button size */
                #${CONFIG.SELECTORS.eventGlobalActionsId} .enhancer-styled-button { margin-bottom: 8px; }
                .enhancer-event-form .enhancer-styled-button { margin-top: 7px; }
                .enhancer-stats-tabs-nav .enhancer-stats-tab-button { font-size: 0.85em; padding: 9px 5px; }
                .enhancer-stats-content-box { font-size: 0.95em; }
                #${CONFIG.SELECTORS.notificationContainerId} { bottom: 8px; right: 8px; left: 8px; max-width: none; align-items: center; }
                .enhancer-notification { width: 88%; max-width: 350px; }
            }

            @media (max-width: 480px) {
                #${CONFIG.SELECTORS.mainPanelId} { font-size: 13px; }
                .${CONFIG.SELECTORS.mainTabButtonClass} { font-size: 0.75em; gap: 3px; min-width: unset; flex-basis: auto; padding: 7px 4px; }
                .${CONFIG.SELECTORS.mainTabButtonClass} svg { display: none; }
                .enhancer-panel-title { font-size: 1.1em; }
                .enhancer-panel-title svg { width: 18px; height: 18px; }
                .enhancer-styled-button { padding: 9px 12px; font-size: 0.9em; }
                .enhancer-spin-button { font-size: 1em; padding: 10px 16px; }
                .enhancer-text-input, .enhancer-textarea-input, .enhancer-autoplay-config-section input[type="number"], .enhancer-autoplay-config-section select { font-size: 0.9em; padding: 9px 10px; }
                .enhancer-custom-multiplier-input-area { flex-direction: column; align-items: stretch; }
                .enhancer-custom-multiplier-input-area input[type="number"] { margin-bottom: 7px; }
                .enhancer-custom-multiplier-input-area .enhancer-styled-button { width: 100%; }
                .enhancer-autoplay-controls { flex-direction: column; }
                .enhancer-autoplay-controls .enhancer-styled-button { width: 100%; }
                .enhancer-event-item { flex-direction: column; align-items: stretch; } /* Stack event item content on very small screens */
                .enhancer-event-item-actions { justify-content: space-around; }
                .enhancer-event-item-actions .enhancer-styled-button { flex-grow:1; }
            }
        `;
        document.head.appendChild(styleSheet);
    }


    // --- Floating Action Button (FAB) Logic --- // منطق الزر العائم
    async function createFloatingActionButton() {
        if (document.getElementById(CONFIG.SELECTORS.enhancerFloatingButtonId)) {
            enhancerFloatingButton = document.getElementById(CONFIG.SELECTORS.enhancerFloatingButtonId);
            enhancerFloatingButton.style.display = 'flex'; // Ensure it's visible if already created // تأكد من أنه مرئي إذا تم إنشاؤه بالفعل
            return;
        }
        enhancerFloatingButton = document.createElement('div');
        enhancerFloatingButton.id = CONFIG.SELECTORS.enhancerFloatingButtonId;
        enhancerFloatingButton.innerHTML = CONFIG.ICONS.toolIcon;
        enhancerFloatingButton.title = "Toggle Enhancer Panel";
        const savedPosition = await getStoredValue(CONFIG.STORAGE_KEY.floatingButtonPosition, { bottom: '20px', right: '20px', left: null, top: null });
        if (savedPosition.left !== null && savedPosition.top !== null) {
            enhancerFloatingButton.style.left = savedPosition.left;
            enhancerFloatingButton.style.top = savedPosition.top;
        } else {
            enhancerFloatingButton.style.bottom = savedPosition.bottom;
            enhancerFloatingButton.style.right = savedPosition.right;
        }
        enhancerFloatingButton.addEventListener('click', async () => {
            if (!mainPanel || !mainPanel.isConnected) {
                mainPanel = createMainPanel();
                document.body.appendChild(mainPanel);
                await loadAllSettingsAndStates(); // Load settings when panel is first created // تحميل الإعدادات عند إنشاء اللوحة لأول مرة
            }
            const isPanelVisible = mainPanel.style.display === 'flex';
            mainPanel.style.display = isPanelVisible ? 'none' : 'flex';
            if (mainPanel.style.display === 'flex') { // If panel is now visible // إذا كانت اللوحة مرئية الآن
                activateMainTab(AppState.currentMainTabId); // Ensure correct tab is shown // تأكد من عرض التبويب الصحيح
            } else { // If panel is now hidden // إذا كانت اللوحة مخفية الآن
                stopAllAutoPlaysAndUpgrades();
                if (eventTimersInterval) clearInterval(eventTimersInterval);
            }
        });
        makeDraggable(enhancerFloatingButton);
        document.body.appendChild(enhancerFloatingButton);
        console.log('[Enhancer] Floating Action Button created.');
    }

    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;
        element.onmousedown = function(event) {
            if (event.button !== 0) return;
            isDragging = true;
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        };
        document.onmousemove = function(event) {
            if (!isDragging) return;
            let newX = event.clientX - offsetX;
            let newY = event.clientY - offsetY;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const elWidth = element.offsetWidth;
            const elHeight = element.offsetHeight;
            if (newX < 5) newX = 5;
            if (newY < 5) newY = 5;
            if (newX + elWidth > screenWidth - 5) newX = screenWidth - elWidth - 5;
            if (newY + elHeight > screenHeight - 5) newY = screenHeight - elHeight - 5;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        };
        document.onmouseup = async function(event) {
            if (isDragging) {
                if (event.button !== 0 && isDragging) return;
                isDragging = false;
                element.style.cursor = 'pointer';
                document.body.style.userSelect = '';
                await setStoredValue(CONFIG.STORAGE_KEY.floatingButtonPosition, {
                    left: element.style.left,
                    top: element.style.top,
                    right: null,
                    bottom: null
                });
            }
        };
        element.ontouchstart = function(event) {
            isDragging = true;
            const touch = event.touches[0];
            offsetX = touch.clientX - element.getBoundingClientRect().left;
            offsetY = touch.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        };
        document.ontouchmove = function(event) {
            if (!isDragging) return;
            const touch = event.touches[0];
            let newX = touch.clientX - offsetX;
            let newY = touch.clientY - offsetY;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const elWidth = element.offsetWidth;
            const elHeight = element.offsetHeight;
            if (newX < 5) newX = 5;
            if (newY < 5) newY = 5;
            if (newX + elWidth > screenWidth - 5) newX = screenWidth - elWidth - 5;
            if (newY + elHeight > screenHeight - 5) newY = screenHeight - elHeight - 5;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        };
        document.ontouchend = async function() {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'pointer';
                document.body.style.userSelect = '';
                await setStoredValue(CONFIG.STORAGE_KEY.floatingButtonPosition, {
                    left: element.style.left,
                    top: element.style.top,
                    right: null,
                    bottom: null
                });
            }
        };
    }
    // --- نهاية منطق الزر العائم ---

    // --- UI Element Creation Functions (Global or to be modularized) --- // وظائف إنشاء عناصر واجهة المستخدم (عامة أو ليتم تقسيمها إلى وحدات)
    function createMainPanel() {
        if (document.getElementById(CONFIG.SELECTORS.mainPanelId)) {
            return document.getElementById(CONFIG.SELECTORS.mainPanelId);
        }
        const panel = document.createElement('div');
        panel.id = CONFIG.SELECTORS.mainPanelId;
        headerBar = createHeaderBar();
        panel.appendChild(headerBar);

        if (!document.getElementById(CONFIG.SELECTORS.notificationContainerId)) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = CONFIG.SELECTORS.notificationContainerId;
            document.body.appendChild(notificationContainer);
        }

        mainTabsContainer = document.createElement('div');
        mainTabsContainer.id = CONFIG.SELECTORS.mainTabsContainerId;
        panel.appendChild(mainTabsContainer);
        mainTabsContentArea = document.createElement('div');
        mainTabsContentArea.className = 'enhancer-main-tabs-content-area';
        panel.appendChild(mainTabsContentArea);
        CONFIG.MAIN_TABS.forEach(tabInfo => {
            const tabButton = document.createElement('button');
            tabButton.className = CONFIG.SELECTORS.mainTabButtonClass;
            tabButton.dataset.tabId = tabInfo.id;
            tabButton.innerHTML = `${tabInfo.icon || ''} ${tabInfo.label}`;
            tabButton.style.setProperty('--active-tab-color', tabInfo.color || 'var(--enhancer-accent-color)');
            tabButton.addEventListener('click', () => activateMainTab(tabInfo.id));
            mainTabsContainer.appendChild(tabButton);
            const tabPane = document.createElement('div');
            tabPane.id = `main-tab-pane-${tabInfo.id}`;
            tabPane.className = CONFIG.SELECTORS.mainTabPaneClass;
            mainTabsContentArea.appendChild(tabPane);
        });
        footerStatusContainer = createFooterStatusBar();
        panel.appendChild(footerStatusContainer);
        console.log('[Enhancer] Main Panel structure created.');
        return panel;
    }

    function createHeaderBar() {
        const header = document.createElement('div');
        header.className = 'enhancer-header-bar';
        const spinsContainer = document.createElement('div');
        spinsContainer.className = 'enhancer-spin-counts-container';
        wheelSpinsCountEl = document.createElement('div');
        wheelSpinsCountEl.className = 'enhancer-spin-count';
        wheelSpinsCountEl.innerHTML = `${CONFIG.ICONS.wheel} <span id="wheelSpinsCount_${CONFIG.SELECTORS.mainPanelId}">0</span>`;
        spinsContainer.appendChild(wheelSpinsCountEl);
        slotSpinsCountEl = document.createElement('div');
        slotSpinsCountEl.className = 'enhancer-spin-count';
        slotSpinsCountEl.innerHTML = `${CONFIG.ICONS.energy} <span id="slotSpinsCount_${CONFIG.SELECTORS.mainPanelId}">0</span>`;
        spinsContainer.appendChild(slotSpinsCountEl);
        header.appendChild(spinsContainer);
        panelCloseButton = createButton(CONFIG.ICONS.close, () => {
            if (mainPanel) mainPanel.style.display = 'none';
            stopAllAutoPlaysAndUpgrades();
            if (eventTimersInterval) clearInterval(eventTimersInterval);
        }, ['enhancer-panel-close-button']);
        panelCloseButton.title = "Close Panel";
        header.appendChild(panelCloseButton);
        return header;
    }
    function createFooterStatusBar() { const footer = document.createElement('div'); footer.className = 'enhancer-footer-status-bar'; return footer; }

    function createSubTabLayout(mainTabPaneElement, mainTabId, subTabsConfigArray, initialSubTabId) {
        mainTabPaneElement.innerHTML = '';
        const subTabsNav = document.createElement('div');
        subTabsNav.className = CONFIG.SELECTORS.subTabsContainerClass;
        subTabsNav.id = `enhancer-${mainTabId}-sub-tabs-container`;
        mainTabPaneElement.appendChild(subTabsNav);
        const subTabsContentArea = document.createElement('div');
        subTabsContentArea.className = 'enhancer-sub-tabs-content-area';
        mainTabPaneElement.appendChild(subTabsContentArea);

        const parentTabColor = CONFIG.MAIN_TABS.find(tab => tab.id === mainTabId)?.color || 'var(--enhancer-subtab-color-default)';

        subTabsConfigArray.forEach(subTabInfo => {
            const subTabButton = createButton(`${subTabInfo.icon || ''} ${subTabInfo.label}`, () => activateSubTab(mainTabId, subTabInfo.id), [CONFIG.SELECTORS.subTabButtonClass.replace('.', '')]);
            subTabButton.dataset.subTabId = subTabInfo.id;
            let activeColorVariable = `--enhancer-subtab-active-${mainTabId}`;
            if (mainTabId === 'settings') activeColorVariable = '--enhancer-subtab-active-settings';
            else if (mainTabId === 'spin') activeColorVariable = '--enhancer-subtab-active-spin';
            else if (mainTabId === 'events-tasks') activeColorVariable = '--enhancer-subtab-active-events';
            else if (mainTabId === 'build') activeColorVariable = '--enhancer-subtab-active-build';

            subTabButton.style.setProperty('--active-subtab-color', `var(${activeColorVariable}, ${parentTabColor})`);
            subTabsNav.appendChild(subTabButton);

            const subTabPane = document.createElement('div');
            subTabPane.id = `sub-tab-pane-${mainTabId}-${subTabInfo.id}`;
            subTabPane.className = CONFIG.SELECTORS.subTabPaneClass;
            subTabsContentArea.appendChild(subTabPane);
        });
        activateSubTab(mainTabId, initialSubTabId);
    }

    function populateMainTabPane(paneElement, tabId) {
        paneElement.innerHTML = '';
        switch (tabId) {
            case 'settings':
                createSubTabLayout(paneElement, 'settings', CONFIG.SETTINGS_SUB_TABS, activeSubTabState.settings);
                break;
            case 'spin':
                createSubTabLayout(paneElement, 'spin', CONFIG.SPIN_SUB_TABS, activeSubTabState.spin);
                break;
            case 'events-tasks':
                createSubTabLayout(paneElement, 'events-tasks', CONFIG.EVENTS_TASKS_SUB_TABS, activeSubTabState['events-tasks']);
                break;
            case 'build':
                createSubTabLayout(paneElement, 'build', CONFIG.BUILD_SUB_TABS, activeSubTabState.build);
                break;
            case 'stats':
                createStatsTabContent(paneElement);
                break;
            default:
                paneElement.textContent = `Content for ${tabId}`;
        }
    }

    function activateMainTab(tabId) {
        AppState.currentMainTabId = tabId;
        setStoredValue(CONFIG.STORAGE_KEY.activeMainTab, tabId);
        if (mainTabsContainer && mainTabsContainer.isConnected) {
            mainTabsContainer.querySelectorAll(`.${CONFIG.SELECTORS.mainTabButtonClass}`).forEach(btn => {
                const isActive = btn.dataset.tabId === tabId;
                btn.classList.toggle('active', isActive);
                const tabConfig = CONFIG.MAIN_TABS.find(t => t.id === btn.dataset.tabId);
                if (tabConfig) {
                    btn.style.color = isActive ? tabConfig.color : 'var(--enhancer-secondary-text-color)';
                    btn.style.borderBottomColor = isActive ? tabConfig.color : 'transparent';
                }
            });
        }
        if (mainTabsContentArea && mainTabsContentArea.isConnected) {
            mainTabsContentArea.querySelectorAll(`.${CONFIG.SELECTORS.mainTabPaneClass}`).forEach(pane => {
                const isActive = pane.id === `main-tab-pane-${tabId}`;
                pane.classList.toggle('active', isActive);
                if (isActive) {
                    populateMainTabPane(pane, tabId);
                    const tabConfig = CONFIG.MAIN_TABS.find(t => t.id === tabId);
                    if (tabConfig) {
                        pane.style.borderColor = tabConfig.color;
                        pane.style.backgroundColor = `color-mix(in srgb, ${tabConfig.color} 3%, var(--enhancer-bg-color))`;
                    }
                }
            });
        }
        if (tabId === 'events-tasks' && activeSubTabState['events-tasks'] === 'events') {
            startEventTimersUpdater();
        } else {
            if (eventTimersInterval) clearInterval(eventTimersInterval);
        }
    }

    function activateSubTab(mainTabId, subTabIdToActivate) {
        activeSubTabState[mainTabId] = subTabIdToActivate;
        setStoredValue(subTabStorageKeyMapping[mainTabId], subTabIdToActivate);

        const subTabsNav = document.getElementById(`enhancer-${mainTabId}-sub-tabs-container`);
        if (subTabsNav && subTabsNav.isConnected) {
            subTabsNav.querySelectorAll(`.${CONFIG.SELECTORS.subTabButtonClass}`).forEach(btn => {
                const isActive = btn.dataset.subTabId === subTabIdToActivate;
                btn.classList.toggle('active', isActive);
                const activeColor = btn.style.getPropertyValue('--active-subtab-color');
                btn.style.color = isActive ? activeColor : 'var(--enhancer-secondary-text-color)';
                btn.style.borderBottomColor = isActive ? activeColor : 'transparent';
            });
        }

        const mainTabPane = document.getElementById(`main-tab-pane-${mainTabId}`);
        if (mainTabPane && mainTabPane.isConnected) {
            const contentArea = mainTabPane.querySelector('.enhancer-sub-tabs-content-area') || mainTabPane;
            contentArea.querySelectorAll(`.${CONFIG.SELECTORS.subTabPaneClass}`).forEach(pane => {
                 pane.classList.remove('active');
                 pane.style.display = 'none';
            });
            const activeSubPane = document.getElementById(`sub-tab-pane-${mainTabId}-${subTabIdToActivate}`);
            if (activeSubPane) {
                activeSubPane.classList.add('active');
                activeSubPane.style.display = 'flex';
                const contentPopulationFn = subTabContentPopulationMapping[mainTabId];
                if (contentPopulationFn) {
                    contentPopulationFn(activeSubPane, subTabIdToActivate);
                } else {
                    activeSubPane.innerHTML = `<div class="empty-tab-placeholder">No content population function for ${mainTabId} - ${subTabIdToActivate}.</div>`;
                }
            }
        }

        if (mainTabId === 'events-tasks' && subTabIdToActivate === 'events') {
            startEventTimersUpdater();
        } else {
            if (mainTabId === 'events-tasks' && eventTimersInterval) {
                clearInterval(eventTimersInterval);
            }
        }
    }

    // --- UI Population Functions --- // وظائف ملء واجهة المستخدم
    function populateSettingsSubTabContent(subTabPaneElement, subTabId) {
        subTabPaneElement.innerHTML = '';
        if (subTabId === 'config') { createConfigSubTabContent(subTabPaneElement); }
        else if (subTabId === 'general') { createGeneralSubTabContent(subTabPaneElement); }
    }

    function populateSpinSubTabContent(subTabPaneElement, subTabId) {
        subTabPaneElement.innerHTML = '';
        if (subTabId === 'slot') {
            if (typeof SlotMachineModule !== 'undefined' && SlotMachineModule.createUI) SlotMachineModule.createUI(subTabPaneElement);
        } else if (subTabId === 'wheel') {
            if (typeof WheelOfFortuneModule !== 'undefined' && WheelOfFortuneModule.createUI) WheelOfFortuneModule.createUI(subTabPaneElement);
        }
    }
    function populateEventsTasksSubTabContent(subTabPaneElement, subTabId) { subTabPaneElement.innerHTML = ''; if (subTabId === 'events') { createEventsTabContent(subTabPaneElement); } else if (subTabId === 'tasks') { const placeholder = document.createElement('div'); placeholder.className = 'empty-tab-placeholder'; placeholder.textContent = `Tasks content will be here.`; subTabPaneElement.appendChild(placeholder); } }
    function populateBuildSubTabContent(subTabPaneElement, subTabId) {
        subTabPaneElement.innerHTML = ''; // Clear previous content // مسح المحتوى السابق
        if (subTabId === 'upgrades') { createUpgradesTabContent(subTabPaneElement); }
        else if (subTabId === 'boost') {
            const contentPanel = document.createElement('div'); contentPanel.className = 'enhancer-content-panel';
            const titleEl = document.createElement('h3'); titleEl.className = 'enhancer-panel-title';
            const boostIcon = CONFIG.BUILD_SUB_TABS.find(t => t.id === 'boost').icon;
            titleEl.innerHTML = `${boostIcon || ''} Boost Controls`; contentPanel.appendChild(titleEl);
            const controlsDiv = document.createElement('div'); controlsDiv.className = 'enhancer-boost-controls';
            const addBoosterButton = createButton(`${CONFIG.ICONS.zap || ''} Activate Booster`, sendAddShitBooster, ['enhancer-action-button']); controlsDiv.appendChild(addBoosterButton);
            const chargeShieldButton = createButton(`${CONFIG.ICONS.shield || ''} Charge Shield`, sendChargeShield, ['enhancer-action-button']); controlsDiv.appendChild(chargeShieldButton);
            contentPanel.appendChild(controlsDiv);
            const placeholder = document.createElement('div'); placeholder.className = 'empty-tab-placeholder'; placeholder.style.marginTop = '20px';
            placeholder.innerHTML = `Boost options and details will be here. <br><small>Note: Buttons above trigger base API calls. Specific booster/shield selection might require payload details not yet implemented in the script.</small>`;
            contentPanel.appendChild(placeholder); subTabPaneElement.appendChild(contentPanel);
        }
    }

    function createConfigSubTabContent(parentElement) {
        const tokenItem = document.createElement('div'); tokenItem.className = 'enhancer-setting-item';
        const tokenLabel = document.createElement('label'); tokenLabel.htmlFor = `enhancer-token-input-${CONFIG.SELECTORS.mainPanelId}`; tokenLabel.innerHTML = `${CONFIG.ICONS.key} Auth Token:`;
        tokenStatusIndicator = document.createElement('span'); tokenStatusIndicator.id = CONFIG.SELECTORS.tokenStatusIndicatorId; tokenStatusIndicator.className = 'enhancer-status-indicator'; tokenLabel.appendChild(tokenStatusIndicator); tokenItem.appendChild(tokenLabel);
        const tokenInputGroup = document.createElement('div'); tokenInputGroup.className = 'enhancer-input-group';
        tokenInputElement = document.createElement('input'); tokenInputElement.type = 'text'; tokenInputElement.id = `enhancer-token-input-${CONFIG.SELECTORS.mainPanelId}`; tokenInputElement.className = 'enhancer-text-input'; tokenInputElement.placeholder = 'Paste your token here'; tokenInputGroup.appendChild(tokenInputElement);
        const saveTokenButton = createButton(`${CONFIG.ICONS.save} Save`, saveToken, ['enhancer-small-button', 'enhancer-config-button']); tokenInputGroup.appendChild(saveTokenButton); tokenItem.appendChild(tokenInputGroup); parentElement.appendChild(tokenItem);

        const liveOpIdItem = document.createElement('div'); liveOpIdItem.className = 'enhancer-setting-item';
        const liveOpIdLabel = document.createElement('label'); liveOpIdLabel.htmlFor = `enhancer-liveopid-input-${CONFIG.SELECTORS.mainPanelId}`; liveOpIdLabel.innerHTML = `${CONFIG.ICONS.idCard} Wheel LiveOpId:`;
        liveOpIdStatusIndicator = document.createElement('span'); liveOpIdStatusIndicator.id = CONFIG.SELECTORS.liveOpIdStatusIndicatorId; liveOpIdStatusIndicator.className = 'enhancer-status-indicator'; liveOpIdLabel.appendChild(liveOpIdStatusIndicator); liveOpIdItem.appendChild(liveOpIdLabel);
        const liveOpIdInputGroup = document.createElement('div'); liveOpIdInputGroup.className = 'enhancer-input-group';
        liveOpIdInputElement = document.createElement('input'); liveOpIdInputElement.type = 'text'; liveOpIdInputElement.id = `enhancer-liveopid-input-${CONFIG.SELECTORS.mainPanelId}`; liveOpIdInputElement.className = 'enhancer-text-input'; liveOpIdInputElement.placeholder = 'Paste Wheel LiveOpId or fetch from config'; liveOpIdInputGroup.appendChild(liveOpIdInputElement);
        const saveLiveOpIdButton = createButton(`${CONFIG.ICONS.save} Save`, () => saveLiveOpId(true), ['enhancer-small-button', 'enhancer-config-button']); // Pass true to clear input // تمرير true لمسح الإدخال
        liveOpIdInputGroup.appendChild(saveLiveOpIdButton); liveOpIdItem.appendChild(liveOpIdInputGroup); parentElement.appendChild(liveOpIdItem);

        const vValueItem = document.createElement('div'); vValueItem.className = 'enhancer-setting-item';
        const vValueLabel = document.createElement('label'); vValueLabel.htmlFor = `enhancer-vvalue-input-${CONFIG.SELECTORS.mainPanelId}`; vValueLabel.innerHTML = `${CONFIG.ICONS.zap} API 'v' Parameter:`;
        vValueStatusIndicator = document.createElement('span'); vValueStatusIndicator.id = CONFIG.SELECTORS.vValueStatusIndicatorId; vValueStatusIndicator.className = 'enhancer-status-indicator'; vValueLabel.appendChild(vValueStatusIndicator); vValueItem.appendChild(vValueLabel);
        const vValueInputGroup = document.createElement('div'); vValueInputGroup.className = 'enhancer-input-group';
        vValueInputElement = document.createElement('input'); vValueInputElement.type = 'text'; vValueInputElement.id = `enhancer-vvalue-input-${CONFIG.SELECTORS.mainPanelId}`; vValueInputElement.className = 'enhancer-text-input'; vValueInputElement.placeholder = 'Enter API "v" value'; vValueInputGroup.appendChild(vValueInputElement);
        const saveVValueButton = createButton(`${CONFIG.ICONS.save} Save`, saveVValue, ['enhancer-small-button', 'enhancer-config-button']); vValueInputGroup.appendChild(saveVValueButton); vValueItem.appendChild(vValueInputGroup); parentElement.appendChild(vValueItem);

        const configJsonItem = document.createElement('div'); configJsonItem.className = 'enhancer-setting-item';
        const configJsonLabel = document.createElement('label'); configJsonLabel.htmlFor = `enhancer-config-json-input-${CONFIG.SELECTORS.mainPanelId}`; configJsonLabel.innerHTML = `${CONFIG.ICONS.fileJson} Config JSON (for Events):`;
        configJsonStatusIndicator = document.createElement('span'); configJsonStatusIndicator.id = CONFIG.SELECTORS.configJsonStatusIndicatorId; configJsonStatusIndicator.className = 'enhancer-status-indicator'; configJsonLabel.appendChild(configJsonStatusIndicator); configJsonItem.appendChild(configJsonLabel);
        configJsonInputElement = document.createElement('textarea'); configJsonInputElement.id = `enhancer-config-json-input-${CONFIG.SELECTORS.mainPanelId}`; configJsonInputElement.className = 'enhancer-textarea-input'; configJsonInputElement.placeholder = 'Paste the entire content of config.json here, or fetch it.';
        configJsonInputElement.style.borderRadius = 'var(--enhancer-border-radius)';
        configJsonItem.appendChild(configJsonInputElement);

        const configButtonsContainer = document.createElement('div');
        configButtonsContainer.style.display = 'flex';
        configButtonsContainer.style.gap = '10px';
        configButtonsContainer.style.marginTop = '8px';

        const fetchConfigButton = createButton(`${CONFIG.ICONS.refresh} Fetch & Apply Config`, fetchAndApplyConfig, ['enhancer-small-button', 'enhancer-fetch-config-button']);
        fetchConfigButton.id = CONFIG.SELECTORS.fetchConfigButtonId;
        fetchConfigButton.title = 'Fetch config, apply events, and attempt to find Wheel LiveOpId';
        configButtonsContainer.appendChild(fetchConfigButton);

        const saveConfigJsonButton = createButton(`${CONFIG.ICONS.save} Load Events from Textarea`, saveConfigAndLoadEvents, ['enhancer-small-button', 'enhancer-action-button']);
        saveConfigJsonButton.title = 'Load events from the content of the textarea above';
        configButtonsContainer.appendChild(saveConfigJsonButton);
        configJsonItem.appendChild(configButtonsContainer);
        parentElement.appendChild(configJsonItem);

        if (tokenInputElement) tokenInputElement.value = AppState.token || '';
        if (liveOpIdInputElement) liveOpIdInputElement.value = AppState.liveOpId || CONFIG.WHEEL_PAYLOAD.liveOpId;
        if (vValueInputElement) vValueInputElement.value = AppState.vValue || '';
        if (configJsonInputElement) configJsonInputElement.value = AppState.configJsonContent || '';
        updateConfigJsonStatusIndicator(!!AppState.configJsonContent);
        updateTokenStatusIndicator();
        updateLiveOpIdStatusIndicator();
        updateVValueStatusIndicator();
    }
    function createGeneralSubTabContent(parentElement) { const resetItem = document.createElement('div'); resetItem.className = 'enhancer-setting-item'; const resetButton = createButton(`${CONFIG.ICONS.reset} Reset All Script Settings`, () => { const confirmContainer = document.getElementById(CONFIG.SELECTORS.resetConfirmationContainerId); if (confirmContainer) confirmContainer.style.display = 'flex'; }, ['enhancer-delete-button']); resetItem.appendChild(resetButton); const confirmationContainer = document.createElement('div'); confirmationContainer.id = CONFIG.SELECTORS.resetConfirmationContainerId; confirmationContainer.style.display = 'none'; const confirmText = document.createElement('span'); confirmText.textContent = 'Are you sure? This cannot be undone.'; confirmationContainer.appendChild(confirmText); const yesButton = createButton(CONFIG.ICONS.check, async () => { await resetAllSettings(); confirmationContainer.style.display = 'none'; updateFooterStatus('All settings have been reset.', 'success'); }, ['enhancer-small-button', 'enhancer-action-button']); yesButton.title = "Yes, reset everything"; confirmationContainer.appendChild(yesButton); const noButton = createButton(CONFIG.ICONS.xIcon, () => { confirmationContainer.style.display = 'none'; }, ['enhancer-small-button', 'enhancer-cancel-button']); noButton.title = "No, cancel"; confirmationContainer.appendChild(noButton); resetItem.appendChild(confirmationContainer); parentElement.appendChild(resetItem); }
    function createUpgradesTabContent(parentElement) {
        parentElement.innerHTML = '';
        const contentPanel = document.createElement('div'); contentPanel.className = 'enhancer-content-panel';
        const titleEl = document.createElement('h3'); titleEl.className = 'enhancer-panel-title';
        const upgradesIcon = CONFIG.BUILD_SUB_TABS.find(t=>t.id==='upgrades').icon;
        titleEl.innerHTML = `${upgradesIcon} Upgrades`;
        contentPanel.appendChild(titleEl);
        contentPanel.appendChild(createButton(`${CONFIG.ICONS.zap} Upgrade All Boinkers`, sendMegaUpgrade, ['enhancer-action-button']));
        contentPanel.appendChild(createButton(`${upgradesIcon} Upgrade One Boinker`, sendSingleUpgrade, ['enhancer-action-button']));

        const autoUpgradeSection = document.createElement('div');
        autoUpgradeSection.className = 'enhancer-autoplay-config-section'; // Re-use style // إعادة استخدام النمط
        autoUpgradeSection.id = `auto-upgrade-config-section-${CONFIG.SELECTORS.mainPanelId}`;

        const auTitle = document.createElement('h4');
        auTitle.className = 'enhancer-panel-subtitle'; // Re-use style // إعادة استخدام النمط
        auTitle.textContent = 'Auto-Upgrade Configuration';
        autoUpgradeSection.appendChild(auTitle);

        autoUpgradeSection.appendChild(createSettingItemRow("Auto Upgrade All (every 30s):", createToggleSwitch(`auto-upgrade-all-toggle-${CONFIG.SELECTORS.mainPanelId}`, AppState.autoUpgrade.all.isEnabled, toggleAutoUpgradeAll)));

        const auOneRow = document.createElement('div');
        auOneRow.className = 'enhancer-setting-item-row';
        const auOneLabel = document.createElement('label');
        auOneLabel.htmlFor = `auto-upgrade-one-toggle-${CONFIG.SELECTORS.mainPanelId}`;
        auOneLabel.textContent = 'Auto Upgrade One:';
        auOneRow.appendChild(auOneLabel);

        const auOneIntervalInput = document.createElement('input');
        auOneIntervalInput.type = 'number';
        auOneIntervalInput.className = 'enhancer-interval-input enhancer-text-input';
        auOneIntervalInput.id = `auto-upgrade-one-interval-${CONFIG.SELECTORS.mainPanelId}`;
        auOneIntervalInput.value = AppState.autoUpgrade.one.interval;
        auOneIntervalInput.min = CONFIG.AUTO_UPGRADE.minInterval;
        auOneIntervalInput.step = '0.1';
        auOneIntervalInput.title = `Interval (seconds), min ${CONFIG.AUTO_UPGRADE.minInterval}`;
        auOneIntervalInput.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val) || val < CONFIG.AUTO_UPGRADE.minInterval) val = CONFIG.AUTO_UPGRADE.oneDefaultInterval;
            AppState.autoUpgrade.one.interval = val;
            e.target.value = val;
            setStoredValue(CONFIG.STORAGE_KEY.autoUpgradeOneInterval, val);
            if (AppState.autoUpgrade.one.isPlaying) {
                stopAutoUpgradeOne();
                startAutoUpgradeOne();
            }
        });
        auOneRow.appendChild(auOneIntervalInput);
        auOneRow.appendChild(createToggleSwitch(`auto-upgrade-one-toggle-${CONFIG.SELECTORS.mainPanelId}`, AppState.autoUpgrade.one.isEnabled, toggleAutoUpgradeOne));
        autoUpgradeSection.appendChild(auOneRow);

        autoUpgradeSection.appendChild(createSettingItemRow("Upgrade One on Balance Increase:", createToggleSwitch(`auto-upgrade-balance-toggle-${CONFIG.SELECTORS.mainPanelId}`, AppState.autoUpgrade.onBalanceIncrease.isEnabled, (e) => {
            AppState.autoUpgrade.onBalanceIncrease.isEnabled = e.target.checked;
            setStoredValue(CONFIG.STORAGE_KEY.autoUpgradeOnBalanceIncreaseEnabled, e.target.checked);
        })));
        contentPanel.appendChild(autoUpgradeSection);
        parentElement.appendChild(contentPanel);
    }
    function createStatsTabContent(parentElement) { const wrapper = document.createElement('div'); wrapper.className = 'enhancer-stats-content-wrapper'; statsTabButtonsContainer = document.createElement("div"); statsTabButtonsContainer.className = 'enhancer-stats-tabs-nav'; CONFIG.STATS_TABS_ORIGINAL.forEach(tabName => { const btn = document.createElement("button"); btn.innerText = tabName; btn.className = 'enhancer-stats-tab-button'; if (tabName === (AppState.gameData.currentStatsDisplayTab || CONFIG.STATS_TABS_ORIGINAL[0])) btn.classList.add('active'); btn.addEventListener('click', () => { AppState.gameData.currentStatsDisplayTab = tabName; setStoredValue(CONFIG.STORAGE_KEY.currentStatsDisplayTab, tabName); Array.from(statsTabButtonsContainer.children).forEach(b => b.classList.remove('active')); btn.classList.add('active'); renderStatsContent(); }); statsTabButtonsContainer.appendChild(btn); }); wrapper.appendChild(statsTabButtonsContainer); statsContentBox = document.createElement("div"); statsContentBox.className = 'enhancer-stats-content-box'; statsContentBox.id = `stats-content-area-${CONFIG.SELECTORS.mainPanelId}`; statsContentBox.innerHTML = `<div>Loading stats...</div>`; wrapper.appendChild(statsContentBox); parentElement.appendChild(wrapper); renderStatsContent(); }
    function createEventsTabContent(parentElement) {
        const contentPanel = document.createElement('div');
        contentPanel.className = 'enhancer-content-panel';

        const titleEl = document.createElement('h3');
        titleEl.className = 'enhancer-panel-title';
        const eventsIcon = CONFIG.EVENTS_TASKS_SUB_TABS.find(t => t.id === 'events').icon;
        titleEl.innerHTML = `${eventsIcon} Manage Events`;
        contentPanel.appendChild(titleEl);

        const globalActionsDiv = document.createElement('div');
        globalActionsDiv.id = CONFIG.SELECTORS.eventGlobalActionsId;
        // Add "Select All" button
        const selectAllButton = createButton(`${CONFIG.ICONS.selectAll} Select All`, handleSelectAllEvents, ['enhancer-small-button', 'enhancer-config-button']);
        selectAllButton.id = 'enhancer-select-all-events-btn';
        globalActionsDiv.appendChild(selectAllButton);
        globalActionsDiv.appendChild(createButton(`${CONFIG.ICONS.claimMultiple} Claim Selected`, handleClaimSelectedEvents, ['enhancer-small-button', 'enhancer-action-button']));
        contentPanel.appendChild(globalActionsDiv);

        const form = document.createElement('form');
        form.id = CONFIG.SELECTORS.addEventFormId;
        form.className = 'enhancer-event-form';
        form.addEventListener('submit', handleSaveEvent);
        form.appendChild(createLabelInputPair('event-name-input', 'Event Name:', 'text', '', null, { required: true, placeholder: 'e.g., Special Chest Event' }));
        form.appendChild(createLabelInputPair('event-id-input', 'Event ID:', 'text', '', null, { required: true, placeholder: 'Paste Event ID here' }));
        form.appendChild(createLabelInputPair('event-claims-input', 'Number of Claims:', 'number', '', null, { required: true, placeholder: 'e.g., 4 (for claims 0,1,2,3)', min: '1' }));
        form.appendChild(createLabelInputPair('event-end-date-input', 'End Date (Optional):', 'datetime-local', '', null, {}));
        const formButtons = document.createElement('div');
        formButtons.style.display = 'flex';
        formButtons.style.gap = '10px';
        formButtons.appendChild(createButton(`${CONFIG.ICONS.save} Save Event`, null, ['enhancer-small-button', 'enhancer-action-button'], 'submit'));
        const cancelButton = createButton('Cancel Edit', () => resetEventForm(), ['enhancer-small-button', 'enhancer-cancel-button', 'enhancer-cancel-edit-event-btn']);
        cancelButton.style.display = 'none';
        formButtons.appendChild(cancelButton);
        form.appendChild(formButtons);
        contentPanel.appendChild(form);

        const eventListContainer = document.createElement('div');
        eventListContainer.id = CONFIG.SELECTORS.eventListContainerId;
        eventListContainer.className = 'enhancer-event-list';
        contentPanel.appendChild(eventListContainer);

        parentElement.appendChild(contentPanel);
        renderEventList();
        startEventTimersUpdater();
    }

    /**
     * @async
     * @function fetchAndApplyConfig
     * @description Fetches config, displays it, processes events, and attempts to find Wheel LiveOpId. // يجلب الإعدادات، يعرضها، يعالج الفعاليات، ويحاول العثور على معرف LiveOpId للعجلة.
     */
    async function fetchAndApplyConfig() {
        if (!configJsonInputElement) {
            console.error("[Enhancer Error] Config JSON input element not found.");
            updateFooterStatus('Config JSON input element not found.', 'error', 'Fetch Config');
            return;
        }
        updateFooterStatus('Fetching config from server...', 'info', 'Fetch Config');
        showNotification('Fetching configuration...', 'info', { prizeType: 'Config Fetch' });
        try {
            const response = await fetch(CONFIG.API.fetchConfigUrl, {
                method: 'GET',
                headers: { 'accept': 'application/json, text/plain, */*', 'cache-control': 'no-cache', 'pragma': 'no-cache' },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error ${response.status}: ${errorText || response.statusText}`);
            }
            const configText = await response.text();
            configJsonInputElement.value = configText;
            try {
                const parsedConfig = JSON.parse(configText);
                await processFetchedConfigData(parsedConfig, false);
                updateFooterStatus('Config fetched and processed successfully.', 'success', 'Fetch Config');
                showNotification('Configuration fetched and events loaded.', 'success', { prizeType: 'Config Fetch' });
            } catch (parseError) {
                console.error("[Enhancer Error] Fetched config is not valid JSON:", parseError);
                updateConfigJsonStatusIndicator(false);
                updateFooterStatus('Fetched config is not valid JSON. See input field for details.', 'error', 'Fetch Config');
                showNotification('Fetched configuration is not valid JSON.', 'error', { prizeType: 'Config Fetch' });
            }
        } catch (error) {
            console.error("[Enhancer Error] Failed to fetch config:", error);
            configJsonInputElement.value = `Error fetching config: ${error.message}`;
            updateConfigJsonStatusIndicator(false);
            updateFooterStatus(`Failed to fetch config: ${error.message}`, 'error', 'Fetch Config');
            showNotification(`Failed to fetch configuration: ${error.message}`, 'error', { prizeType: 'Config Fetch' });
        }
    }


    /**
     * @async
     * @function processFetchedConfigData
     * @description Processes the parsed config data to update events and Wheel LiveOpId. // يعالج بيانات الإعدادات المجزأة لتحديث الفعاليات ومعرف LiveOpId للعجلة.
     * @param {object} parsedConfig - The parsed JSON configuration object. // كائن إعدادات JSON المجزأ.
     * @param {boolean} isInitialLoad - True if called during script initialization. // صحيح إذا تم الاستدعاء أثناء تهيئة السكربت.
     */
    async function processFetchedConfigData(parsedConfig, isInitialLoad = false) {
        if (parsedConfig && parsedConfig.liveOps && Array.isArray(parsedConfig.liveOps)) {
            let newEventsAddedCount = 0;
            const updatedEvents = isInitialLoad ? [...savedEvents] : [];

            let foundWheelLiveOpId = null;

            parsedConfig.liveOps.forEach(liveOp => {
                if (liveOp.isActive) {
                    const existingEventIndex = savedEvents.findIndex(ev => ev.id === liveOp._id);
                    const eventData = {
                        internalId: existingEventIndex > -1 && isInitialLoad ? savedEvents[existingEventIndex].internalId : Date.now().toString() + Math.random().toString(16).slice(2),
                        id: liveOp._id,
                        name: liveOp.liveOpName || 'Unnamed Event',
                        claims: liveOp.dynamicLiveOp && liveOp.dynamicLiveOp.milestones ? liveOp.dynamicLiveOp.milestones.length : 0,
                        endDate: liveOp.endDate || null,
                        selected: existingEventIndex > -1 && isInitialLoad ? savedEvents[existingEventIndex].selected : false
                    };
                    if (existingEventIndex > -1 && isInitialLoad) {
                        updatedEvents[existingEventIndex] = { ...updatedEvents[existingEventIndex], ...eventData };
                    } else if (!isInitialLoad || existingEventIndex === -1) {
                        updatedEvents.push(eventData);
                        if (!isInitialLoad) newEventsAddedCount++;
                    }

                    if (liveOp.liveOpName && liveOp.liveOpName.toUpperCase().includes("WHEEL")) {
                        if (liveOp.dynamicLiveOp && (liveOp.dynamicLiveOp.dcToShow || liveOp.dynamicLiveOp.dcToShow1 || liveOp.dynamicLiveOp.dcToShow2)) {
                            const dcKey = liveOp.dynamicLiveOp.dcToShow || liveOp.dynamicLiveOp.dcToShow1 || liveOp.dynamicLiveOp.dcToShow2;
                            if (typeof dcKey === 'string' && dcKey.toLowerCase().startsWith('dc')) {
                                foundWheelLiveOpId = liveOp._id;
                            }
                        }
                    }
                }
            });
            savedEvents = updatedEvents;
            await setStoredValue(CONFIG.STORAGE_KEY.savedEvents, savedEvents);
            if (typeof renderEventList === 'function') renderEventList();

            if (foundWheelLiveOpId && liveOpIdInputElement) {
                if (AppState.liveOpId !== foundWheelLiveOpId) {
                    AppState.liveOpId = foundWheelLiveOpId;
                    liveOpIdInputElement.value = AppState.liveOpId;
                    await saveLiveOpId(false); // Pass false to prevent clearing input and default notification // تمرير false لمنع مسح الإدخال والإشعار الافتراضي
                    showNotification(`Wheel LiveOpId auto-detected and set to: ${AppState.liveOpId}`, 'success', {prizeType: "Config Update"});
                }
            }


            if (!isInitialLoad) {
                 updateFooterStatus(`Config processed. ${parsedConfig.liveOps.filter(op => op.isActive).length} active events found. ${newEventsAddedCount > 0 ? newEventsAddedCount + ' new added.' : ''}`, 'success', 'Config');
            }
            updateConfigJsonStatusIndicator(true);
        } else {
            if (!isInitialLoad) updateFooterStatus('Invalid Config JSON structure: "liveOps" array not found.', 'error', 'Config');
            updateConfigJsonStatusIndicator(false);
        }
    }

    // Made async to handle await from processFetchedConfigData // تم جعله غير متزامن للتعامل مع await من processFetchedConfigData
    async function saveConfigAndLoadEvents() {
        const jsonText = configJsonInputElement.value;
        if (!jsonText.trim()) {
            updateFooterStatus('Config JSON input is empty.', 'error', 'Settings');
            updateConfigJsonStatusIndicator(false);
            return;
        }
        try {
            const parsedConfig = JSON.parse(jsonText);
            // Do not save the full config to localStorage to avoid QuotaExceededError // لا تحفظ الإعدادات الكاملة في localStorage لتجنب خطأ QuotaExceededError
            // AppState.configJsonContent = jsonText; // This will be set by fetchAndApplyConfig if needed // سيتم تعيين هذا بواسطة fetchAndApplyConfig إذا لزم الأمر
            // await setStoredValue(CONFIG.STORAGE_KEY.configJson, jsonText); // Avoid this // تجنب هذا

            await processFetchedConfigData(parsedConfig, false);
            showNotification('Events loaded from textarea.', 'success', {prizeType: "Config Load"});

        } catch (error) {
            updateFooterStatus(`Error parsing Config JSON: ${error.message}`, 'error', 'Settings');
            console.error("Error parsing Config JSON:", error);
            updateConfigJsonStatusIndicator(false);
             showNotification(`Error parsing Config JSON: ${error.message}`, 'error', {prizeType: "Config Error"});
        }
    }

    async function handleSaveEvent(e) { // Made async // تم جعله غير متزامن
        e.preventDefault();
        const form = e.target;
        const eventName = form.querySelector('#event-name-input').value.trim();
        const eventId = form.querySelector('#event-id-input').value.trim();
        const numClaims = parseInt(form.querySelector('#event-claims-input').value, 10);
        const endDateValue = form.querySelector('#event-end-date-input').value;
        const endDate = endDateValue ? new Date(endDateValue).toISOString() : null;
        if (!eventName || !eventId || isNaN(numClaims) || numClaims <= 0) {
            updateFooterStatus('Please fill all required event fields correctly.', 'error');
            return;
        }
        if (currentlyEditingEventId) {
            const eventIndex = savedEvents.findIndex(ev => ev.internalId === currentlyEditingEventId);
            if (eventIndex > -1) {
                savedEvents[eventIndex] = { ...savedEvents[eventIndex], name: eventName, id: eventId, claims: numClaims, endDate: endDate };
                updateFooterStatus(`Event "${eventName}" updated.`, 'success');
            }
        } else {
            const newEvent = { internalId: Date.now().toString() + Math.random().toString(16).slice(2), name: eventName, id: eventId, claims: numClaims, endDate: endDate, selected: false };
            savedEvents.push(newEvent);
            updateFooterStatus(`Event "${eventName}" added.`, 'success');
        }
        await setStoredValue(CONFIG.STORAGE_KEY.savedEvents, savedEvents); // await here // انتظر هنا
        renderEventList();
        resetEventForm();
    }
    function resetEventForm() { const form = document.getElementById(CONFIG.SELECTORS.addEventFormId); if (form) { form.reset(); form.querySelector('#event-name-input').focus(); form.querySelector('#event-end-date-input').value = ''; form.querySelector('.enhancer-cancel-edit-event-btn').style.display = 'none'; form.querySelector('button[type="submit"]').innerHTML = `${CONFIG.ICONS.save} Save Event`; } currentlyEditingEventId = null; }
    function renderEventList() { const container = document.getElementById(CONFIG.SELECTORS.eventListContainerId); if (!container) return; container.innerHTML = ''; if (savedEvents.length === 0) { container.innerHTML = `<div class="no-events-placeholder">No events added or loaded yet. Add manually or via Config JSON.</div>`; return; } savedEvents.sort((a, b) => { const aExpired = a.endDate && new Date(a.endDate).getTime() <= Date.now(); const bExpired = b.endDate && new Date(b.endDate).getTime() <= Date.now(); if (aExpired && !bExpired) return 1; if (!aExpired && bExpired) return -1; if (a.endDate && b.endDate) { return new Date(a.endDate).getTime() - new Date(b.endDate).getTime(); } else if (a.endDate) { return -1; } else if (b.endDate) { return 1; } return a.name.localeCompare(b.name); }); savedEvents.forEach(event => { const itemDiv = document.createElement('div'); itemDiv.className = 'enhancer-event-item'; itemDiv.dataset.internalId = event.internalId; const checkboxContainer = document.createElement('div'); checkboxContainer.className = 'enhancer-event-item-checkbox'; const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = event.selected || false; checkbox.id = `event-checkbox-${event.internalId}`; checkbox.addEventListener('change', async (e) => { const eventToUpdate = savedEvents.find(ev => ev.internalId === event.internalId); if (eventToUpdate) { eventToUpdate.selected = e.target.checked; await setStoredValue(CONFIG.STORAGE_KEY.savedEvents, savedEvents); } }); checkboxContainer.appendChild(checkbox); itemDiv.appendChild(checkboxContainer); const infoDiv = document.createElement('div'); infoDiv.className = 'enhancer-event-item-info'; const timerId = `event-timer-${event.internalId}`; let timerHTML = ''; if (event.endDate) { timerHTML = `<span class="event-timer" id="${timerId}">${CONFIG.ICONS.timer} ${formatTimeRemaining(event.endDate)}</span>`; } infoDiv.innerHTML = ` <span class="event-name">${event.name}</span> <span class="event-id">ID: ${event.id}</span> <span class="event-claims">Claims: ${event.claims} (0 to ${Math.max(0, event.claims - 1)})</span> ${timerHTML} `; itemDiv.appendChild(infoDiv); const actionsDiv = document.createElement('div'); actionsDiv.className = 'enhancer-event-item-actions'; const claimButton = createButton(`${CONFIG.ICONS.claim} Claim All`, () => handleClaimAllForEvent(event.id, event.claims, event.name), ['enhancer-small-button', 'enhancer-action-button']); actionsDiv.appendChild(claimButton); const editButton = createButton(CONFIG.ICONS.edit, () => populateEventFormForEdit(event.internalId), ['enhancer-small-button', 'enhancer-icon-button', 'enhancer-config-button']); editButton.title = "Edit Event"; actionsDiv.appendChild(editButton); const deleteButton = createButton(CONFIG.ICONS.deleteItem, () => deleteEvent(event.internalId, event.name), ['enhancer-small-button', 'enhancer-icon-button', 'enhancer-delete-button']); deleteButton.title = "Delete Event"; actionsDiv.appendChild(deleteButton); itemDiv.appendChild(actionsDiv); container.appendChild(itemDiv); }); updateAllEventTimers(); }
    function updateAllEventTimers() { savedEvents.forEach(event => { if (event.endDate) { const timerElement = document.getElementById(`event-timer-${event.internalId}`); if (timerElement) { timerElement.innerHTML = `${CONFIG.ICONS.timer} ${formatTimeRemaining(event.endDate)}`; if (new Date(event.endDate).getTime() <= Date.now()) { timerElement.classList.add('timer-expired'); } else { timerElement.classList.remove('timer-expired'); } } } }); }
    function startEventTimersUpdater() { if (eventTimersInterval) clearInterval(eventTimersInterval); eventTimersInterval = setInterval(updateAllEventTimers, 1000); }
    function populateEventFormForEdit(internalId) { const eventToEdit = savedEvents.find(ev => ev.internalId === internalId); if (!eventToEdit) return; const form = document.getElementById(CONFIG.SELECTORS.addEventFormId); if (form) { form.querySelector('#event-name-input').value = eventToEdit.name; form.querySelector('#event-id-input').value = eventToEdit.id; form.querySelector('#event-claims-input').value = eventToEdit.claims; if (eventToEdit.endDate) { const date = new Date(eventToEdit.endDate); const year = date.getFullYear(); const month = (date.getMonth() + 1).toString().padStart(2, '0'); const day = date.getDate().toString().padStart(2, '0'); const hours = date.getHours().toString().padStart(2, '0'); const minutes = date.getMinutes().toString().padStart(2, '0'); form.querySelector('#event-end-date-input').value   = `${year}-${month}-${day}T${hours}:${minutes}`;
        } else {
            form.querySelector('#event-end-date-input').value = '';
        }
        form.querySelector('button[type="submit"]').innerHTML = `${CONFIG.ICONS.save} Update Event`;
        const cancelBtn = form.querySelector('.enhancer-cancel-edit-event-btn');
        if (cancelBtn) cancelBtn.style.display = 'inline-flex';
        currentlyEditingEventId = internalId;
        const eventNameInput = form.querySelector('#event-name-input');
        if (eventNameInput) eventNameInput.focus();
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

async function deleteEvent(internalId, eventName) { // Made async // تم جعله غير متزامن
    savedEvents = savedEvents.filter(event => event.internalId !== internalId);
    await setStoredValue(CONFIG.STORAGE_KEY.savedEvents, savedEvents); // await here // انتظر هنا
    renderEventList();
    updateFooterStatus(`Event "${eventName}" deleted.`, 'info');
    if (currentlyEditingEventId === internalId) {
        resetEventForm();
    }
}

async function handleClaimAllForEvent(eventId, numClaims, eventName) {
    if (!AppState.token) {
        showNotification('Token missing. Cannot claim event.', 'error');
        updateFooterStatus('Token missing.', 'error', 'System'); return;
    }
    // vValue is now handled by sendApiRequest // يتم الآن التعامل مع vValue بواسطة sendApiRequest
    showNotification(`Starting to claim ${numClaims} items for event: <strong>${eventName}</strong>...`, 'info');
    updateFooterStatus(`Starting to claim ${numClaims} items for event: ${eventName}...`, 'info', `Event Claim: ${eventName}`);
    let overallSuccess = true;
    let messages = [];

    for (let i = 0; i < numClaims; i++) {
        const claimIndex = i;
        const url = `${CONFIG.API.eventClaimBaseUrl}${eventId}/${claimIndex}${CONFIG.API.fetchParamsBase}`;
        const options = { method: 'POST', headers: { Authorization: AppState.token, 'Content-Type': 'application/json' }, body: JSON.stringify({}) };
        try {
            updateFooterStatus(`Claiming item ${claimIndex + 1}/${numClaims} for ${eventName}...`, 'info', `Event: ${eventName}`);
            const data = await sendApiRequest(url, options, `Claiming item ${i+1} for ${eventName}`, `Event: ${eventName} (Claim ${i+1})`);
            if (!data || data.success === false) {
                overallSuccess = false;
                const apiMsg = data?.message || "Failed or already claimed.";
                messages.push(`Claim ${i+1}: ${apiMsg}`);
            } else if (data && data.prize) {
                messages.push(`Claim ${i+1}: ${data.prize.prizeTypeName || 'Reward'} - ${formatNumber(data.prize.prizeValue || 0)}`);
            } else if (data && data.message) {
                 messages.push(`Claim ${i+1}: ${data.message}`);
            }
        } catch (error) {
            overallSuccess = false;
            messages.push(`Claim ${i+1}: Critically failed.`);
        }
        if (i < numClaims - 1) {
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    }
    updateFooterStatus(`Finished claiming for ${eventName}. Check notifications.`, overallSuccess ? 'success' : 'warning', 'Event Claim');
}

async function handleClaimSelectedEvents() {
    const selectedEventItems = Array.from(document.querySelectorAll(`#${CONFIG.SELECTORS.eventListContainerId} input[type="checkbox"]:checked`));
    if (selectedEventItems.length === 0) {
        showNotification('No events selected to claim.', 'info');
        updateFooterStatus('No events selected to claim.', 'info', 'Events'); return;
    }
    showNotification(`Starting to claim rewards for ${selectedEventItems.length} selected events...`, 'info');
    updateFooterStatus(`Starting to claim rewards for ${selectedEventItems.length} selected events...`, 'info', 'Events');
    for (const checkbox of selectedEventItems) {
        const itemDiv = checkbox.closest('.enhancer-event-item');
        if (!itemDiv) continue;
        const internalId = itemDiv.dataset.internalId;
        const event = savedEvents.find(ev => ev.internalId === internalId);
        if (event) {
            await handleClaimAllForEvent(event.id, event.claims, event.name);
            if (selectedEventItems.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
    }
    showNotification(`Finished processing selected events. Check individual notifications.`, 'success');
    updateFooterStatus(`Finished processing selected events. Check individual notifications.`, 'success', 'Events');
}

// New function to handle "Select All" events
async function handleSelectAllEvents() {
    const eventListContainer = document.getElementById(CONFIG.SELECTORS.eventListContainerId);
    if (!eventListContainer) return;

    const checkboxes = Array.from(eventListContainer.querySelectorAll('.enhancer-event-item input[type="checkbox"]'));
    if (checkboxes.length === 0) {
        updateFooterStatus('No events to select.', 'info', 'Events');
        return;
    }

    const allSelected = checkboxes.every(cb => cb.checked);
    const newSelectedState = !allSelected;

    for (const checkbox of checkboxes) {
        checkbox.checked = newSelectedState;
        const eventItemDiv = checkbox.closest('.enhancer-event-item');
        if (eventItemDiv) {
            const internalId = eventItemDiv.dataset.internalId;
            const eventToUpdate = savedEvents.find(ev => ev.internalId === internalId);
            if (eventToUpdate) {
                eventToUpdate.selected = newSelectedState;
            }
        }
    }
    await setStoredValue(CONFIG.STORAGE_KEY.savedEvents, savedEvents);
    updateFooterStatus(newSelectedState ? 'All events selected.' : 'All events deselected.', 'info', 'Events');
}


// --- Settings Save/Update Functions --- // وظائف حفظ/تحديث الإعدادات
async function saveToken() { const newToken = tokenInputElement.value.trim(); if (newToken) { AppState.token = newToken; await setStoredValue(CONFIG.STORAGE_KEY.token, AppState.token); showNotification('Token saved.', 'success'); tokenInputElement.value = ''; } else { showNotification('Token input is empty.', 'error'); } updateTokenStatusIndicator(); }
async function saveLiveOpId(clearInput = true) { const newId = liveOpIdInputElement.value.trim(); if (newId) { AppState.liveOpId = newId; await setStoredValue(CONFIG.STORAGE_KEY.liveOpId, AppState.liveOpId); if(clearInput) showNotification('Wheel LiveOpId saved.', 'success'); if(clearInput && liveOpIdInputElement) liveOpIdInputElement.value = ''; } else { if(clearInput) showNotification('LiveOpId input is empty.', 'error'); } updateLiveOpIdStatusIndicator(); }
async function saveVValue() { const newValue = vValueInputElement.value.trim(); if (newValue) { AppState.vValue = newValue; await setStoredValue(CONFIG.STORAGE_KEY.vValue, AppState.vValue); showNotification('API "v" Parameter saved.', 'success'); vValueInputElement.value = ''; } else { showNotification('"v" Parameter input is empty.', 'error'); } updateVValueStatusIndicator(); }

window.updateTokenStatusIndicator = function() { if (tokenStatusIndicator) { tokenStatusIndicator.classList.toggle('valid', !!AppState.token); tokenStatusIndicator.classList.toggle('invalid', !AppState.token); tokenStatusIndicator.title = AppState.token ? "Token: Set" : "Token: Missing"; } }
window.updateLiveOpIdStatusIndicator = function() { if (liveOpIdStatusIndicator) { const isSet = AppState.liveOpId && AppState.liveOpId !== CONFIG.WHEEL_PAYLOAD.liveOpId; liveOpIdStatusIndicator.classList.toggle('valid', isSet); liveOpIdStatusIndicator.classList.toggle('invalid', !isSet); liveOpIdStatusIndicator.title = isSet ? "LiveOpId: Set" : "LiveOpId: Missing or Default"; } }
window.updateVValueStatusIndicator = function() { if (vValueStatusIndicator) { vValueStatusIndicator.classList.toggle('valid', !!AppState.vValue); vValueStatusIndicator.classList.toggle('invalid', !AppState.vValue); vValueStatusIndicator.title = AppState.vValue ? `"v" Value: Set` : `"v" Value: Missing`; } }
function updateConfigJsonStatusIndicator(isValid) { if (configJsonStatusIndicator) { configJsonStatusIndicator.classList.toggle('valid', isValid); configJsonStatusIndicator.classList.toggle('invalid', !isValid); configJsonStatusIndicator.title = isValid ? "Config JSON: Loaded & Valid" : "Config JSON: Not loaded or Invalid"; } }

// --- API Call Functions (Specific Actions) --- // وظائف استدعاء الـ API (إجراءات محددة)
function sendMegaUpgrade() { const urlBase = CONFIG.API.megaUpgradeUrl; const options = { method: 'POST', headers: { Authorization: AppState.token, 'Content-Type': 'application/json' }, body: JSON.stringify({}) }; return sendApiRequest(urlBase, options, 'Sending Upgrade All...', "Upgrade All"); }
function sendSingleUpgrade() { const urlBase = CONFIG.API.singleUpgradeUrl; const options = { method: 'POST', headers: { Authorization: AppState.token, 'Content-Type': 'application/json' }, body: JSON.stringify({}) }; return sendApiRequest(urlBase, options, 'Sending Upgrade One...', "Upgrade One"); }
function sendAddShitBooster() { const urlBase = CONFIG.API.addShitBoosterUrl; const payload = {}; const options = { method: 'POST', headers: { Authorization: AppState.token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }; return sendApiRequest(urlBase, options, 'Activating Booster...', "Activate Booster"); }
function sendChargeShield() { const urlBase = CONFIG.API.chargeShieldUrl; const payload = {}; const options = { method: 'POST', headers: { Authorization: AppState.token, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }; return sendApiRequest(urlBase, options, 'Charging Shield...', "Charge Shield"); }

// --- Auto Upgrade Logic --- // منطق الترقية التلقائية
async function toggleAutoUpgradeAll() { AppState.autoUpgrade.all.isEnabled = !AppState.autoUpgrade.all.isEnabled; await setStoredValue(CONFIG.STORAGE_KEY.autoUpgradeAllEnabled, AppState.autoUpgrade.all.isEnabled); const toggleInput = document.getElementById(`auto-upgrade-all-toggle-${CONFIG.SELECTORS.mainPanelId}`); if(toggleInput) toggleInput.checked = AppState.autoUpgrade.all.isEnabled; if (AppState.autoUpgrade.all.isEnabled) startAutoUpgradeAll(); else stopAutoUpgradeAll(); }
async function startAutoUpgradeAll() { if (AppState.autoUpgrade.all.isPlaying) return; if (!AppState.token || !AppState.vValue) { showNotification("Token or V-Value missing for Auto Upgrade All.", "error", {prizeType: "Auto Upgrade Error"}); updateFooterStatus("Token or V-Value missing for Auto Upgrade All.", "error", "System"); AppState.autoUpgrade.all.isEnabled = false; const t = document.getElementById(`auto-upgrade-all-toggle-${CONFIG.SELECTORS.mainPanelId}`); if(t) t.checked = false; return; } AppState.autoUpgrade.all.isPlaying = true; showNotification('Auto Upgrade All STARTED.', 'info', {prizeType: "Auto Upgrade"}); updateFooterStatus('Auto Upgrade All STARTED.', 'info', "System"); AppState.autoUpgrade.all.intervalId = setInterval(() => { console.log("[AutoUpgrade] Triggering Upgrade All..."); sendMegaUpgrade().catch(err => console.warn("Auto Upgrade All error:", err)); }, AppState.autoUpgrade.all.interval * 1000); stopAllGameAutoPlays(); }
function stopAutoUpgradeAll() { if (!AppState.autoUpgrade.all.isPlaying) return; AppState.autoUpgrade.all.isPlaying = false; clearInterval(AppState.autoUpgrade.all.intervalId); AppState.autoUpgrade.all.intervalId = null; showNotification('Auto Upgrade All STOPPED.', 'info', {prizeType: "Auto Upgrade"}); updateFooterStatus('Auto Upgrade All STOPPED.', 'info', "System"); window.updateGlobalAutoplayControls(); }
async function toggleAutoUpgradeOne() { AppState.autoUpgrade.one.isEnabled = !AppState.autoUpgrade.one.isEnabled; await setStoredValue(CONFIG.STORAGE_KEY.autoUpgradeOneEnabled, AppState.autoUpgrade.one.isEnabled); const toggleInput = document.getElementById(`auto-upgrade-one-toggle-${CONFIG.SELECTORS.mainPanelId}`); if(toggleInput) toggleInput.checked = AppState.autoUpgrade.one.isEnabled; const intervalInput = document.getElementById(`auto-upgrade-one-interval-${CONFIG.SELECTORS.mainPanelId}`); if(intervalInput) intervalInput.disabled = !AppState.autoUpgrade.one.isEnabled; if (AppState.autoUpgrade.one.isEnabled) startAutoUpgradeOne(); else stopAutoUpgradeOne(); }

    async function startAutoUpgradeOne() { // Made async // تم جعله غير متزامن
        if (AppState.autoUpgrade.one.isPlaying) return;
         if (!AppState.token || !AppState.vValue) {
            showNotification("Token or V-Value missing for Auto Upgrade One.", "error", {prizeType: "Auto Upgrade Error"});
            updateFooterStatus("Token or V-Value missing for Auto Upgrade One.", "error", "System");
            AppState.autoUpgrade.one.isEnabled = false;
            const t = document.getElementById(`auto-upgrade-one-toggle-${CONFIG.SELECTORS.mainPanelId}`);
            if(t) t.checked = false;
            return;
        }
        AppState.autoUpgrade.one.isPlaying = true;
        showNotification('Auto Upgrade One STARTED.', 'info', {prizeType: "Auto Upgrade"});
        updateFooterStatus('Auto Upgrade One STARTED.', 'info', "System");
        AppState.autoUpgrade.one.intervalId = setInterval(() => {
            console.log("[AutoUpgrade] Triggering Upgrade One...");
            sendSingleUpgrade().catch(err => console.warn("Auto Upgrade One error:", err));
        }, AppState.autoUpgrade.one.interval * 1000);
        stopAllGameAutoPlays();
    }

    function stopAutoUpgradeOne() {
        if (!AppState.autoUpgrade.one.isPlaying) return;
        AppState.autoUpgrade.one.isPlaying = false;
        clearInterval(AppState.autoUpgrade.one.intervalId);
        AppState.autoUpgrade.one.intervalId = null;
        showNotification('Auto Upgrade One STOPPED.', 'info', {prizeType: "Auto Upgrade"});
        updateFooterStatus('Auto Upgrade One STOPPED.', 'info', "System");
        if (typeof window.updateGlobalAutoplayControls === 'function') window.updateGlobalAutoplayControls();
    }

    /**
     * @function stopAllGameAutoPlays
     * @description Stops autoplay for both slot and wheel. // يوقف التشغيل التلقائي لكل من Slot و Wheel.
     */
    function stopAllGameAutoPlays() {
        if (typeof SlotMachineModule !== 'undefined' && SlotMachineModule.isAutoPlaying && SlotMachineModule.isAutoPlaying()) SlotMachineModule.stopAutoPlay();
        if (typeof WheelOfFortuneModule !== 'undefined' && WheelOfFortuneModule.isAutoPlaying && WheelOfFortuneModule.isAutoPlaying()) WheelOfFortuneModule.stopAutoPlay();
        if (typeof window.updateGlobalAutoplayControls === 'function') window.updateGlobalAutoplayControls();
    }

    /**
     * @function stopAllAutoPlaysAndUpgrades
     * @description Stops all autoplay and auto-upgrade processes. // يوقف جميع عمليات التشغيل التلقائي والترقية التلقائية.
     */
    function stopAllAutoPlaysAndUpgrades() {
        stopAllGameAutoPlays();
        if (AppState.autoUpgrade.all.isPlaying) stopAutoUpgradeAll();
        if (AppState.autoUpgrade.one.isPlaying) stopAutoUpgradeOne();
    }

    // --- Initialization and Main Panel Toggle --- // التهيئة وتبديل اللوحة الرئيسية
    /**
     * @function addToggleButtonToGameMenu
     * @description Adds the enhancer panel toggle button to the game's settings menu. // يضيف زر تبديل لوحة المحسن إلى قائمة إعدادات اللعبة.
     */
    function addToggleButtonToGameMenu() {
        const gameSettingsMenu = document.querySelector(CONFIG.SELECTORS.settingsMenu);
        if (gameSettingsMenu && !document.getElementById(CONFIG.SELECTORS.toggleButtonId)) {
            const originalToggleButton = createButton(`${CONFIG.ICONS.toolIcon} Enhancer`, async () => {
                if (!enhancerFloatingButton || !enhancerFloatingButton.isConnected) {
                    await createFloatingActionButton();
                }
                if (enhancerFloatingButton) enhancerFloatingButton.click();
            });
            originalToggleButton.id = CONFIG.SELECTORS.toggleButtonId;
            originalToggleButton.classList.add('enhancer-styled-button');
            const lastButton = gameSettingsMenu.querySelector('button:last-of-type');
            if (lastButton) {
                gameSettingsMenu.insertBefore(originalToggleButton, lastButton.nextSibling);
            } else {
                gameSettingsMenu.appendChild(originalToggleButton);
            }
            console.log('[Enhancer] Original Toggle Button inserted into game menu.');
        }
    }


    /**
     * @async
     * @function loadAllSettingsAndStates
     * @description Loads all saved settings and states for the script. // يحمل جميع الإعدادات والحالات المحفوظة للسكربت.
     */
    async function loadAllSettingsAndStates() {
        console.log('[Enhancer] Loading all settings and states...');
        AppState.token = await getStoredValue(CONFIG.STORAGE_KEY.token, '');
        AppState.liveOpId = await getStoredValue(CONFIG.STORAGE_KEY.liveOpId, CONFIG.WHEEL_PAYLOAD.liveOpId);
        AppState.vValue = await getStoredValue(CONFIG.STORAGE_KEY.vValue, '');
        AppState.configJsonContent = await getStoredValue(CONFIG.STORAGE_KEY.configJson, '');
        AppState.currentMainTabId = await getStoredValue(CONFIG.STORAGE_KEY.activeMainTab, 'spin');

        activeSubTabState.settings = await getStoredValue(CONFIG.STORAGE_KEY.activeSettingsSubTab, CONFIG.SETTINGS_SUB_TABS[0].id);
        activeSubTabState.spin = await getStoredValue(CONFIG.STORAGE_KEY.activeSpinSubTab, CONFIG.SPIN_SUB_TABS[0].id);
        activeSubTabState['events-tasks'] = await getStoredValue(CONFIG.STORAGE_KEY.activeEventsTasksSubTab, CONFIG.EVENTS_TASKS_SUB_TABS[0].id);
        activeSubTabState.build = await getStoredValue(CONFIG.STORAGE_KEY.activeBuildSubTab, CONFIG.BUILD_SUB_TABS[0].id);

        AppState.slotAutoplayCollapsed = await getStoredValue(CONFIG.STORAGE_KEY.slotAutoplayCollapsed, true);
        AppState.wheelAutoplayCollapsed = await getStoredValue(CONFIG.STORAGE_KEY.wheelAutoplayCollapsed, true);

        if (typeof SlotMachineModule !== 'undefined' && SlotMachineModule.loadState) await SlotMachineModule.loadState();
        if (typeof WheelOfFortuneModule !== 'undefined' && WheelOfFortuneModule.loadState) await WheelOfFortuneModule.loadState();


        AppState.autoUpgrade.all.isEnabled = await getStoredValue(CONFIG.STORAGE_KEY.autoUpgradeAllEnabled, false);
        AppState.autoUpgrade.all.interval = await getStoredValue(CONFIG.STORAGE_KEY.autoUpgradeAllInterval, CONFIG.AUTO_UPGRADE.allDefaultInterval);
        AppState.autoUpgrade.one.isEnabled = await getStoredValue(CONFIG.STORAGE_KEY.autoUpgradeOneEnabled, false);
        AppState.autoUpgrade.one.interval = await getStoredValue(CONFIG.STORAGE_KEY.autoUpgradeOneInterval, CONFIG.AUTO_UPGRADE.oneDefaultInterval);
        AppState.autoUpgrade.onBalanceIncrease.isEnabled = await getStoredValue(CONFIG.STORAGE_KEY.autoUpgradeOnBalanceIncreaseEnabled, false);

        AppState.gameData.currentStatsDisplayTab = await getStoredValue(CONFIG.STORAGE_KEY.currentStatsDisplayTab, CONFIG.STATS_TABS_ORIGINAL[0]);
        savedEvents = await getStoredValue(CONFIG.STORAGE_KEY.savedEvents, []);

        if (mainPanel && mainPanel.isConnected) {
            if (typeof updateTokenStatusIndicator === 'function') updateTokenStatusIndicator();
            if (typeof updateLiveOpIdStatusIndicator === 'function') updateLiveOpIdStatusIndicator();
            if (typeof updateVValueStatusIndicator === 'function') updateVValueStatusIndicator();
            if (typeof updateConfigJsonStatusIndicator === 'function') updateConfigJsonStatusIndicator(!!AppState.configJsonContent);


            if (tokenInputElement) tokenInputElement.value = AppState.token || '';
            if (liveOpIdInputElement) liveOpIdInputElement.value = AppState.liveOpId || CONFIG.WHEEL_PAYLOAD.liveOpId;
            if (vValueInputElement) vValueInputElement.value = AppState.vValue || '';
            if (configJsonInputElement) configJsonInputElement.value = AppState.configJsonContent || '';

            if (mainPanel.style.display === 'flex') {
                activateMainTab(AppState.currentMainTabId);
            }
            updateSpinsLeftFromState();
        }

        if (!AppState.token) { updateFooterStatus('Auth token missing.', 'error', 'System'); }
        else if (!AppState.vValue && CONFIG.API.slotUrl.includes('boink.boinkers.co')) {
             updateFooterStatus('"v" Param missing.', 'error', 'System');
        }
        else if (mainPanel && mainPanel.style.display === 'flex') { updateFooterStatus('Panel loaded and settings applied.', 'info', 'System'); }
        else { updateFooterStatus('Settings loaded.', 'info', 'System');}
    }

    /**
     * @async
     * @function resetAllSettings
     * @description Resets all script settings to their default values. // يعيد تعيين جميع إعدادات السكربت إلى قيمها الافتراضية.
     */
    async function resetAllSettings() {
        console.log("[Enhancer] Resetting all settings...");
        for (const key in CONFIG.STORAGE_KEY) {
            if (key !== 'floatingButtonPosition') { // Do not reset FAB position // لا تعيد تعيين موضع الزر العائم
                 await removeStoredValue(CONFIG.STORAGE_KEY[key]);
            }
        }
        // Reset AppState to defaults // إعادة تعيين AppState إلى القيم الافتراضية
        AppState.token = '';
        AppState.liveOpId = CONFIG.WHEEL_PAYLOAD.liveOpId;
        AppState.vValue = '';
        AppState.configJsonContent = '';
        AppState.currentMainTabId = 'spin';
        activeSubTabState.settings = CONFIG.SETTINGS_SUB_TABS[0].id;
        activeSubTabState.spin = CONFIG.SPIN_SUB_TABS[0].id;
        activeSubTabState['events-tasks'] = CONFIG.EVENTS_TASKS_SUB_TABS[0].id;
        activeSubTabState.build = CONFIG.BUILD_SUB_TABS[0].id;

        AppState.slotAutoplayCollapsed = true;
        AppState.wheelAutoplayCollapsed = true;

        if (typeof SlotMachineModule !== 'undefined' && SlotMachineModule.resetState) await SlotMachineModule.resetState();
        if (typeof WheelOfFortuneModule !== 'undefined' && WheelOfFortuneModule.resetState) await WheelOfFortuneModule.resetState();


        AppState.autoUpgrade = {
            all: { isEnabled: false, isPlaying: false, interval: CONFIG.AUTO_UPGRADE.allDefaultInterval, intervalId: null },
            one: { isEnabled: false, isPlaying: false, interval: CONFIG.AUTO_UPGRADE.oneDefaultInterval, intervalId: null },
            onBalanceIncrease: { isEnabled: false }
        };
        AppState.gameData.currentStatsDisplayTab = CONFIG.STATS_TABS_ORIGINAL[0];
        savedEvents = [];

        if (mainPanel && mainPanel.isConnected) {
            await loadAllSettingsAndStates(); // Reload to apply defaults to UI // إعادة تحميل لتطبيق القيم الافتراضية على واجهة المستخدم
            if (mainPanel.style.display === 'flex') {
                activateMainTab(AppState.currentMainTabId); // Refresh the current tab // تحديث التبويب الحالي
            }
        }
        showNotification('All settings have been reset to default.', 'success');
        updateFooterStatus('All settings have been reset to default.', 'success', 'System');
    }

    /**
     * @async
     * @function initializeScript
     * @description Initializes the script when the page loads. // يهيئ السكربت عند تحميل الصفحة.
     */
    async function initializeScript() {
        try {
            console.log('[Enhancer] Initializing Boink Enhancer Pro v2.8.7 (Event UI Enhancements 1 - All)...');
            addGlobalStyles();
            await createFloatingActionButton();
            await loadAllSettingsAndStates();

            if (AppState.configJsonContent) {
                try {
                    const parsedConfig = JSON.parse(AppState.configJsonContent);
                    if (parsedConfig && parsedConfig.liveOps && Array.isArray(parsedConfig.liveOps)) {
                        console.log('[Enhancer] Processing stored Config JSON for events on init...');
                        await processFetchedConfigData(parsedConfig, true); // Pass true for initial load // تمرير true للتحميل الأولي
                    }
                } catch (e) {
                    console.warn("[Enhancer] Could not process stored Config JSON on init:", e);
                    AppState.configJsonContent = ''; // Clear if invalid // مسح إذا كان غير صالح
                    if (configJsonInputElement) configJsonInputElement.value = ''; // Clear textarea // مسح حقل النص
                    if (typeof updateConfigJsonStatusIndicator === 'function') updateConfigJsonStatusIndicator(false);
                    // Do not remove the key from storage here, allow user to fix it or fetch new one // لا تزيل المفتاح من التخزين هنا، اسمح للمستخدم بإصلاحه أو جلب واحد جديد
                }
            }

            const observer = new MutationObserver(mutationsList => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' && document.querySelector(CONFIG.SELECTORS.settingsMenu) && !document.getElementById(CONFIG.SELECTORS.toggleButtonId)) {
                        addToggleButtonToGameMenu();
                    }
                     // Ensure FAB is visible if it was hidden for some reason // تأكد من أن الزر العائم مرئي إذا كان مخفيًا لسبب ما
                    if (enhancerFloatingButton && enhancerFloatingButton.style.display === 'none' && (!mainPanel || mainPanel.style.display === 'none')) {
                        enhancerFloatingButton.style.display = 'flex';
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            addToggleButtonToGameMenu();

            // Ensure FAB is displayed if not already // تأكد من عرض الزر العائم إذا لم يكن كذلك بالفعل
            if (enhancerFloatingButton && enhancerFloatingButton.style.display !== 'flex') {
                 enhancerFloatingButton.style.display = 'flex';
            }


            console.log('[Enhancer] Boink Enhancer Pro v2.8.7 (Event UI Enhancements 1 - All) initialized successfully!');
        } catch (error) {
            console.error('[Enhancer CRITICAL ERROR] Initialization failed:', error);
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:100000;border-radius:5px;font-family:sans-serif;';
            errorDiv.textContent = 'Fatal Enhancer Pro Error! Check Console (F12).';
            document.body.appendChild(errorDiv);
        }
    }

    // Wait for the game to potentially load its UI elements before initializing the script
    // انتظر حتى تقوم اللعبة بتحميل عناصر واجهة المستخدم الخاصة بها قبل تهيئة السكربت
    setTimeout(initializeScript, 1500);

})();

