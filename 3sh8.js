// ==UserScript==
// @name         Glow Effect Module for Poker Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  يضيف خاصية التوهج المتقدمة كـ "موديول" مستقل لسكربت Poker Pro Helper.
// @author       User & Gemini
// @match        https://*.pokergram.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // --- MODULE METADATA & CONFIGURATION ---
    // =================================================================================
    const MODULE_ID = "glowEffectModule_v1";
    // المفتاح الذي يستخدمه السكربت الأصلي لحفظ الإعدادات
    const TARGET_SETTINGS_KEY = 'pokerHelperSettings_v59_Unified';
    // العنصر الذي سننتظر ظهوره لحقن الإعدادات فيه
    const INJECTION_POINT_SELECTOR = '#poker-settings-popup #tab-style';

    let settings = {};
    let isGlowPickerActive = false;

    // =================================================================================
    // --- CORE GLOW LOGIC ---
    // =================================================================================

    /**
     * يقرأ الإعدادات من السكربت الأصلي ويجهز إعدادات التوهج
     */
    function loadSettings() {
        try {
            const saved = localStorage.getItem(TARGET_SETTINGS_KEY);
            settings = saved ? JSON.parse(saved) : {};
            // التأكد من وجود كائن خاص بإعدادات التوهج لتجنب الأخطاء
            if (!settings.glowEffect) {
                settings.glowEffect = { enabled: true, targets: [] };
            }
        } catch (e) {
            console.error("[Glow Module] Error loading target settings:", e);
            settings = { glowEffect: { enabled: true, targets: [] } };
        }
    }

    /**
     * يحفظ الإعدادات المحدثة في نفس ملف إعدادات السكربت الأصلي
     */
    function saveSettings() {
        try {
            localStorage.setItem(TARGET_SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error("[Glow Module] Error saving target settings:", e);
        }
    }

    /**
     * يبدأ وضع اختيار العنصر للتوهج
     */
    function startGlowPicker() {
        if (isGlowPickerActive) return;
        isGlowPickerActive = true;
        document.body.classList.add('glow-picker-active');
        let lastTarget = null;

        const handleMouseMove = e => {
            if (lastTarget) lastTarget.classList.remove('glow-picker-highlight');
            lastTarget = e.target;
            // لا تحدد الواجهة الخاصة بالسكربت نفسه
            if (lastTarget && !lastTarget.closest('#poker-ui-wrapper')) {
                lastTarget.classList.add('glow-picker-highlight');
            }
        };

        const handleMouseClick = e => {
            e.preventDefault();
            e.stopPropagation();
            if (lastTarget) {
                lastTarget.classList.remove('glow-picker-highlight');
                const selector = getCssSelector(lastTarget);
                if (selector && !settings.glowEffect.targets.includes(selector)) {
                    settings.glowEffect.targets.push(selector);
                }
                renderGlowTargetsList();
                updateGlowEffect();
                saveSettings();
            }
            stopGlowPicker();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleMouseClick, { once: true, capture: true });

        function stopGlowPicker() {
            isGlowPickerActive = false;
            document.body.classList.remove('glow-picker-active');
            document.removeEventListener('mousemove', handleMouseMove);
            if (lastTarget) lastTarget.classList.remove('glow-picker-highlight');
        }
    }

    /**
     * يحدث الـ CSS الخاص بالتوهج بناءً على الأهداف المحددة
     */
    function updateGlowEffect() {
        const glowEl = document.getElementById(`${MODULE_ID}-glow-style`);
        if (!glowEl) return;

        // السكربت الأصلي يتحكم في هذا المتغير، نحن فقط نستخدمه
        const borderColorVar = 'var(--interactive-border-color, #08F7FE)';

        if (settings.glowEffect.enabled && settings.glowEffect.targets.length > 0) {
            const selectors = settings.glowEffect.targets.join(', ');
            glowEl.textContent = `
                ${selectors} {
                    border: 2px solid ${borderColorVar} !important;
                    box-shadow: 0 0 10px -2px ${borderColorVar}, inset 0 0 10px -2px ${borderColorVar} !important;
                    transition: border-color 0.5s ease, box-shadow 0.5s ease !important;
                    animation: pulse-border-module 2.5s infinite ease-in-out;
                }
                @keyframes pulse-border-module {
                    0% { box-shadow: 0 0 10px -2px ${borderColorVar}, inset 0 0 10px -2px ${borderColorVar}; }
                    50% { box-shadow: 0 0 25px 0px ${borderColorVar}, inset 0 0 20px 0px ${borderColorVar}; }
                    100% { box-shadow: 0 0 10px -2px ${borderColorVar}, inset 0 0 10px -2px ${borderColorVar}; }
                }
            `;
        } else {
            glowEl.textContent = '';
        }
    }

    /**
     * يعرض قائمة الأهداف المحددة في نافذة الإعدادات
     */
    function renderGlowTargetsList() {
        const container = document.getElementById('glow-targets-list');
        if (!container) return;
        container.innerHTML = '<h4>أهداف التوهج الحالية:</h4>';
        if (!settings.glowEffect.targets || settings.glowEffect.targets.length === 0) {
            container.innerHTML += '<p style="font-size: 12px; color: var(--text-secondary);">لم يتم تحديد أهداف.</p>';
            return;
        }
        settings.glowEffect.targets.forEach((target, index) => {
            container.innerHTML += `
                <div class="glow-target-item">
                    <span>${target.substring(0, 30)}...</span>
                    <button class="delete-glow-target" data-index="${index}">حذف</button>
                </div>`;
        });
    }

    /**
     * ينشئ محدد CSS فريد للعنصر المحدد
     */
    function getCssSelector(el) {
        if (!(el instanceof Element)) return;
        const path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector = '#' + el.id.replace(/(:|\.|\[|\]|,|=)/g, "\\$1");
                path.unshift(selector);
                break;
            } else {
                let sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }


    // =================================================================================
    // --- UI INJECTION & INITIALIZATION ---
    // =================================================================================

    /**
     * يقوم بحقن عناصر التحكم الخاصة بالتوهج في نافذة الإعدادات الأصلية
     */
    function injectUI(injectionPoint) {
        const glowControlsContainer = document.createElement('div');
        glowControlsContainer.id = 'glow-module-container';
        glowControlsContainer.innerHTML = `
            <hr>
            <div class="setting-row-checkbox">
                <label for="glow-effect-toggle">تفعيل تأثير التوهج</label>
                <input type="checkbox" id="glow-effect-toggle">
            </div>
            <button id="pick-glow-target-btn" class="module-btn">أضف هدف توهج</button>
            <div id="glow-targets-list"></div>
        `;
        injectionPoint.appendChild(glowControlsContainer);

        // ربط الأحداث مع العناصر الجديدة
        document.getElementById('glow-effect-toggle').onchange = e => {
            settings.glowEffect.enabled = e.target.checked;
            updateGlowEffect();
            saveSettings();
        };
        document.getElementById('pick-glow-target-btn').onclick = startGlowPicker;
        document.getElementById('glow-targets-list').addEventListener('click', e => {
            if (e.target.matches('.delete-glow-target')) {
                const index = parseInt(e.target.dataset.index, 10);
                settings.glowEffect.targets.splice(index, 1);
                renderGlowTargetsList();
                updateGlowEffect();
                saveSettings();
            }
        });

        // تطبيق الإعدادات المحفوظة
        document.getElementById('glow-effect-toggle').checked = settings.glowEffect.enabled;
        renderGlowTargetsList();
    }

    /**
     * يقوم بحقن الـ CSS الخاص بالوحدة
     */
    function applyStyles() {
        const styleEl = document.createElement('style');
        styleEl.id = `${MODULE_ID}-style`;
        document.head.appendChild(styleEl);
        styleEl.textContent = `
            .glow-picker-active { cursor: crosshair; }
            .glow-picker-highlight { outline: 3px dashed #FF2079 !important; box-shadow: 0 0 15px #FF2079 !important; }
            #glow-targets-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
            .glow-target-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 5px 8px; border-radius: 4px; font-size: 12px; font-family: var(--font-latin); }
            .glow-target-item button { background: #FF2079; color: white; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; }
            #glow-module-container button.module-btn { width: 100%; padding: 8px; margin-top: 5px; }
        `;

        // عنصر منفصل لتأثير التوهج الديناميكي
        const glowEffectStyle = document.createElement('style');
        glowEffectStyle.id = `${MODULE_ID}-glow-style`;
        document.head.appendChild(glowEffectStyle);
    }

    /**
     * الدالة الرئيسية التي تبدأ عمل الوحدة
     */
    function initialize() {
        applyStyles();

        // استخدام مؤقت للبحث عن نافذة الإعدادات الأصلية
        const injectionInterval = setInterval(() => {
            const injectionPoint = document.querySelector(INJECTION_POINT_SELECTOR);
            if (injectionPoint) {
                clearInterval(injectionInterval); // إيقاف البحث بعد العثور على الهدف
                console.log('[Glow Module] Injection point found. Initializing...');
                loadSettings();
                injectUI(injectionPoint);
                updateGlowEffect();
            }
        }, 500); // البحث كل نصف ثانية
    }

    // التأكد من أن الصفحة قد تم تحميلها قبل البدء
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
