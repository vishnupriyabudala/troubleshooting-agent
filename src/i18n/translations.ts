export type LanguageCode = 'en' | 'es' | 'hi' | 'te' | 'fr' | 'de' | 'zh' | 'ja' | 'pt' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  direction?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' }
];

export const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    appTitle: 'TechAssist AI',
    tagline: 'Intelligent Technical Support, Step by Step',
    heroTitle: 'Intelligent Technical Support',
    heroDesc: 'Describe your technical problem in plain language. TechAssist AI classifies the issue, isolates root causes, and guides you step-by-step through interactive decision trees.',
    inputPlaceholder: "Describe your technical problem (e.g., 'My laptop is connected to Wi-Fi but websites won't open' or 'My computer is freezing with 100% disk usage')...",
    startDiagnosis: 'Start Diagnosis',
    analyzing: 'Analyzing Problem...',
    newDiagnosis: 'New Diagnosis',
    chooseScenario: 'Or choose a test diagnostic scenario:',
    identifiedCauses: 'Identified Potential Causes for Investigation',
    recommendedAction: 'Recommended Action:',
    selectFinding: 'Select your finding:',
    orTypeAnswer: 'Or type your finding / answer here...',
    send: 'Send',
    copy: 'Copy',
    copied: 'Copied!',
    diagnosticStep: 'Diagnostic Step',
    step: 'Step',
    issueResolved: 'Issue Successfully Resolved',
    outcomeConfirmed: 'Diagnostic Outcome Confirmed',
    startAnother: 'Start Another Diagnosis',
    escalatedSupport: 'Escalated to Technical Support Engineering',
    ticketGenerated: 'Support Ticket Generated',
    viewTicket: 'View Ticket Audit Trail & Status',
    feedbackPrompt: 'How helpful was this diagnostic session?',
    feedbackRecorded: 'Thank you! Your feedback has been recorded in the database.',
    submitFeedback: 'Submit',
    escalateManual: 'Escalate to Support',
    newProblem: 'New Problem',
    language: 'Language',
    yes: 'YES',
    no: 'NO',
    softSurface: 'SOFT SURFACE',
    hardDesk: 'HARD DESK',
    urgentCleanup: 'URGENT QUICK CLEANUP',
    auditCleanup: 'COMPREHENSIVE AUDIT',
    wifiNetwork: 'WI-FI / NETWORK',
    usbCable: 'USB CABLE',
    errorShown: 'YES, ERROR SHOWN',
    disappears: 'NO, JUST DISAPPEARS',
    canBoot: 'CAN BOOT / SAFE MODE',
    stuckLoop: 'STUCK IN LOOP',
    clarificationNeeded: 'Clarification Needed',
    clarificationTitle: "Let's Narrow Down the Issue",
    selectCategory: 'Which category matches what you are seeing?',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    register: 'Register',
    guest: 'Guest Mode',
    engineerRole: 'Engineer',
    profile: 'Profile',
    activeEngine: 'Interactive Diagnostic Engine Active'
  },
  es: {
    appTitle: 'TechAssist AI',
    tagline: 'Soporte Técnico Inteligente, Paso a Paso',
    heroTitle: 'Soporte Técnico Inteligente',
    heroDesc: 'Describe tu problema técnico en lenguaje natural. TechAssist AI clasifica el problema, aísla las causas y te guía paso a paso con árboles de decisión interactivos.',
    inputPlaceholder: "Describe tu problema técnico (ej., 'Mi laptop se conecta a Wi-Fi pero no abren las páginas' o 'Mi computadora se traba con disco al 100%')...",
    startDiagnosis: 'Iniciar Diagnóstico',
    analyzing: 'Analizando Problema...',
    newDiagnosis: 'Nuevo Diagnóstico',
    chooseScenario: 'O elige un escenario de prueba:',
    identifiedCauses: 'Causas Posibles Identificadas para Investigación',
    recommendedAction: 'Acción Recomendada:',
    selectFinding: 'Selecciona tu hallazgo:',
    orTypeAnswer: 'O escribe tu respuesta aquí...',
    send: 'Enviar',
    copy: 'Copiar',
    copied: '¡Copiado!',
    diagnosticStep: 'Paso de Diagnóstico',
    step: 'Paso',
    issueResolved: 'Problema Resuelto Exitosamente',
    outcomeConfirmed: 'Resultado del Diagnóstico Confirmado',
    startAnother: 'Iniciar Otro Diagnóstico',
    escalatedSupport: 'Escalado a Ingeniería de Soporte Técnico',
    ticketGenerated: 'Ticket de Soporte Generado',
    viewTicket: 'Ver Historial de Auditoría del Ticket',
    feedbackPrompt: '¿Qué tan útil fue esta sesión de diagnóstico?',
    feedbackRecorded: '¡Gracias! Tus comentarios fueron registrados en la base de datos.',
    submitFeedback: 'Enviar',
    escalateManual: 'Escalar a Soporte',
    newProblem: 'Nuevo Problema',
    language: 'Idioma',
    yes: 'SÍ',
    no: 'NO',
    softSurface: 'SUPERFICIE BLANDA',
    hardDesk: 'ESCRITORIO RÍGIDO',
    urgentCleanup: 'LIMPIEZA RÁPIDA',
    auditCleanup: 'AUDITORÍA COMPLETA',
    wifiNetwork: 'WI-FI / RED',
    usbCable: 'CABLE USB',
    errorShown: 'SÍ, MUESTRA ERROR',
    disappears: 'NO, SOLO DESAPARECE',
    canBoot: 'INICIA / MODO SEGURO',
    stuckLoop: 'EN BUCLE DE REINICIO',
    clarificationNeeded: 'Aclaración Necesaria',
    clarificationTitle: 'Vamos a Delimitar el Problema',
    selectCategory: '¿Qué categoría describe mejor lo que observas?',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
    register: 'Registrarse',
    guest: 'Modo Invitado',
    engineerRole: 'Ingeniero',
    profile: 'Perfil',
    activeEngine: 'Motor de Diagnóstico Interactivo Activo'
  },
  hi: {
    appTitle: 'टेकअसिस्ट एआई',
    tagline: 'बुद्धिमान तकनीकी सहायता, कदम दर कदम',
    heroTitle: 'बुद्धिमान तकनीकी सहायता',
    heroDesc: 'अपनी तकनीकी समस्या को सरल भाषा में बताएं। टेकअसिस्ट एआई समस्या को पहचानता है, संभावित कारणों की जांच करता है और निर्णय वृक्ष के माध्यम से चरण-दर-चरण समाधान देता है।',
    inputPlaceholder: "अपनी समस्या का वर्णन करें (उदा. 'मेरा लैपटॉप वाई-फाई से कनेक्ट है लेकिन वेबसाइट नहीं खुल रही हैं')...",
    startDiagnosis: 'निदान शुरू करें',
    analyzing: 'समस्या का विश्लेषण जारी है...',
    newDiagnosis: 'नया निदान',
    chooseScenario: 'या एक परीक्षण समस्या चुनें:',
    identifiedCauses: 'जांच के लिए पहचाने गए संभावित कारण',
    recommendedAction: 'सुझाई गई कार्रवाई:',
    selectFinding: 'अपना परिणाम चुनें:',
    orTypeAnswer: 'या अपना उत्तर यहाँ लिखें...',
    send: 'भेजें',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    diagnosticStep: 'निदान चरण',
    step: 'चरण',
    issueResolved: 'समस्या सफलतापूर्वक हल हो गई',
    outcomeConfirmed: 'निदान परिणाम की पुष्टि हुई',
    startAnother: 'एक और निदान शुरू करें',
    escalatedSupport: 'तकनीकी सहायता टीम को भेजा गया',
    ticketGenerated: 'सपोर्ट टिकट तैयार किया गया',
    viewTicket: 'टिकट विवरण और ऑडिट ट्रेल देखें',
    feedbackPrompt: 'यह समस्या निवारण कितना मददगार रहा?',
    feedbackRecorded: 'धन्यवाद! आपकी प्रतिक्रिया डेटाबेस में दर्ज कर ली गई है।',
    submitFeedback: 'सबमिट करें',
    escalateManual: 'सपोर्ट को भेजें',
    newProblem: 'नई समस्या',
    language: 'भाषा',
    yes: 'हाँ',
    no: 'नहीं',
    softSurface: 'मुलायम सतह (बिस्तर/कुशन)',
    hardDesk: 'कठोर मेज / डेस्क',
    urgentCleanup: 'त्वरित सफाई',
    auditCleanup: 'विस्तृत ऑडिट',
    wifiNetwork: 'वाई-फाई / नेटवर्क',
    usbCable: 'यूएसबी केबल',
    errorShown: 'हाँ, त्रुटि दिखाई दी',
    disappears: 'नहीं, अचानक बंद हो गया',
    canBoot: 'बूट हो रहा है / सेफ मोड',
    stuckLoop: 'लूप में अटका है',
    clarificationNeeded: 'स्पष्टीकरण आवश्यक',
    clarificationTitle: 'समस्या को स्पष्ट करें',
    selectCategory: 'कौन सी श्रेणी आपकी समस्या से मेल खाती है?',
    signIn: 'साइन इन करें',
    signOut: 'साइन आउट',
    register: 'रजिस्टर करें',
    guest: 'अतिथि मोड',
    engineerRole: 'इंजीनियर',
    profile: 'प्रोफ़ाइल',
    activeEngine: 'इंटरएक्टिव डायग्नोस्टिक इंजन सक्रिय'
  },
  te: {
    appTitle: 'టెక్ అసిస్ట్ AI',
    tagline: 'తెలివైన సాంకేతిక సహాయం, అంచెలవారీగా',
    heroTitle: 'తెలివైన సాంకేతిక సహాయం',
    heroDesc: 'మీ సమస్యను సాధారణ భాషలో వివరించండి. టెక్ అసిస్ట్ AI సమస్యను వర్గీకరిస్తుంది, కారణాలను గుర్తిస్తుంది మరియు అంచెలవారీగా పరిష్కరిస్తుంది.',
    inputPlaceholder: "మీ సాంకేతిక సమస్యను వివరించండి (ఉదా: 'ల్యాప్‌టాప్ Wi-Fi కి కనెక్ట్ అయింది కానీ వెబ్‌సైట్‌లు ఓపెన్ కావడం లేదు')...",
    startDiagnosis: 'రోగనిర్ధారణ ప్రారంభించండి',
    analyzing: 'సమస్యను విశ్లేషిస్తోంది...',
    newDiagnosis: 'కొత్త నిర్ధారణ',
    chooseScenario: 'లేదా ఒక పరీక్ష దృష్టాంతాన్ని ఎంచుకోండి:',
    identifiedCauses: 'గుర్తించబడిన సంభావ్య కారణాలు',
    recommendedAction: 'సిఫార్సు చేసిన చర్య:',
    selectFinding: 'మీ ఫలితాన్ని ఎంచుకోండి:',
    orTypeAnswer: 'లేదా మీ సమాధానాన్ని ఇక్కడ టైప్ చేయండి...',
    send: 'పంపు',
    copy: 'కాపీ చేయి',
    copied: 'కాపీ చేయబడింది!',
    diagnosticStep: 'నిర్ధారణ దశ',
    step: 'దశ',
    issueResolved: 'సమస్య విజయవంతంగా పరిష్కరించబడింది',
    outcomeConfirmed: 'ఫలితం నిర్ధారించబడింది',
    startAnother: 'మరొక నిర్ధారణ ప్రారంభించండి',
    escalatedSupport: 'టెక్నికల్ సపోర్ట్ ఇంజనీరింగ్‌కు పంపబడింది',
    ticketGenerated: 'సపోర్ట్ టికెట్ రూపొందించబడింది',
    viewTicket: 'టికెట్ ఆడిట్ వివరాలు చూడండి',
    feedbackPrompt: 'ఈ నిర్ధారణ సెషన్ ఎంతవరకు సహాయపడింది?',
    feedbackRecorded: 'ధన్యవాదాలు! మీ అభిప్రాయం డేటాబేస్‌లో నమోదు చేయబడింది.',
    submitFeedback: 'సమర్పించండి',
    escalateManual: 'సపోర్ట్‌కు పంపండి',
    newProblem: 'కొత్త సమస్య',
    language: 'భాష',
    yes: 'అవును',
    no: 'కాదు',
    softSurface: 'మెత్తని ఉపరితలం',
    hardDesk: 'గట్టి డెస్క్',
    urgentCleanup: 'త్వరిత శుభ్రత',
    auditCleanup: 'పూర్తి పరిశీలన',
    wifiNetwork: 'Wi-Fi / నెట్‌వర్క్',
    usbCable: 'USB కేబుల్',
    errorShown: 'అవును, ఎర్రర్ చూపబడింది',
    disappears: 'కాదు, అదృశ్యమైంది',
    canBoot: 'బూట్ అవుతోంది / సేఫ్ మోడ్',
    stuckLoop: 'లూప్‌లో చిక్కుకుంది',
    clarificationNeeded: 'స్పష్టత అవసరం',
    clarificationTitle: 'సమస్యను వివరంగా తెలుసుకుందాం',
    selectCategory: 'మీ సమస్యకు సరిపోయే విభాగాన్ని ఎంచుకోండి',
    signIn: 'సైన్ ఇన్',
    signOut: 'సైన్ అవుట్',
    register: 'రిజిస్టర్',
    guest: 'గెస్ట్ మోడ్',
    engineerRole: 'ఇంజనీర్',
    profile: 'ప్రొఫైల్',
    activeEngine: 'ఇంటరాక్టివ్ డయాగ్నస్టిక్ ఇంజిన్ సక్రియంగా ఉంది'
  },
  fr: {
    appTitle: 'TechAssist AI',
    tagline: 'Support Technique Intelligent, Étape par Étape',
    heroTitle: 'Support Technique Intelligent',
    heroDesc: 'Décrivez votre problème technique en langage simple. TechAssist AI classe le problème, isole les causes et vous guide pas à pas avec des arbres de décision interactifs.',
    inputPlaceholder: "Décrivez votre problème technique (ex: 'Mon ordinateur portable est connecté au Wi-Fi mais les sites ne s'ouvrent pas')...",
    startDiagnosis: 'Démarrer le Diagnostic',
    analyzing: 'Analyse du problème...',
    newDiagnosis: 'Nouveau Diagnostic',
    chooseScenario: 'Ou choisissez un scénario de test :',
    identifiedCauses: 'Causes Potentielles Identifiées pour Enquête',
    recommendedAction: 'Action Recommandée :',
    selectFinding: 'Sélectionnez votre constat :',
    orTypeAnswer: 'Ou tapez votre réponse ici...',
    send: 'Envoyer',
    copy: 'Copier',
    copied: 'Copié !',
    diagnosticStep: 'Étape de Diagnostic',
    step: 'Étape',
    issueResolved: 'Problème Résolu avec Succès',
    outcomeConfirmed: 'Résultat du Diagnostic Confirmé',
    startAnother: 'Démarrer un Autre Diagnostic',
    escalatedSupport: 'Transféré au Support Technique',
    ticketGenerated: 'Ticket de Support Créé',
    viewTicket: "Voir l'Audit du Ticket",
    feedbackPrompt: 'Dans quelle mesure ce diagnostic vous a-t-il aidé ?',
    feedbackRecorded: 'Merci ! Vos commentaires ont été enregistrés.',
    submitFeedback: 'Envoyer',
    escalateManual: 'Transférer au Support',
    newProblem: 'Nouveau Problème',
    language: 'Langue',
    yes: 'OUI',
    no: 'NON',
    softSurface: 'SURFACE SOUPLE',
    hardDesk: 'BUREAU RIGIDE',
    urgentCleanup: 'NETTOYAGE RAPIDE',
    auditCleanup: 'AUDIT COMPLET',
    wifiNetwork: 'WI-FI / RÉSEAU',
    usbCable: 'CÂBLE USB',
    errorShown: 'OUI, ERREUR AFFICHÉE',
    disappears: 'NON, DISPARAÎT',
    canBoot: 'DÉMARRE / MODE SANS ÉCHEC',
    stuckLoop: 'BLOQUÉ EN BOUCLE',
    clarificationNeeded: 'Clarification Nécessaire',
    clarificationTitle: 'Précisons le Problème',
    selectCategory: 'Quelle catégorie correspond le mieux à ce que vous constatez ?',
    signIn: 'Connexion',
    signOut: 'Déconnexion',
    register: "S'inscrire",
    guest: 'Mode Invité',
    engineerRole: 'Ingénieur',
    profile: 'Profil',
    activeEngine: 'Moteur de Diagnostic Interactif Actif'
  },
  de: {
    appTitle: 'TechAssist AI',
    tagline: 'Intelligenter Technischer Support, Schritt für Schritt',
    heroTitle: 'Intelligenter Technischer Support',
    heroDesc: 'Beschreiben Sie Ihr technisches Problem in natürlicher Sprache. TechAssist AI klassifiziert die Störung, isoliert Ursachen und führt Sie schrittweise durch Entscheidungsbäume.',
    inputPlaceholder: "Beschreiben Sie Ihr Problem (z.B. 'Mein Laptop ist mit dem WLAN verbunden, aber Websites laden nicht')...",
    startDiagnosis: 'Diagnose Starten',
    analyzing: 'Problem wird analysiert...',
    newDiagnosis: 'Neue Diagnose',
    chooseScenario: 'Oder wählen Sie ein Testszenario:',
    identifiedCauses: 'Ermittelte Mögliche Ursachen zur Überprüfung',
    recommendedAction: 'Empfohlene Maßnahme:',
    selectFinding: 'Wählen Sie Ihren Befund:',
    orTypeAnswer: 'Oder geben Sie hier Ihre Antwort ein...',
    send: 'Senden',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    diagnosticStep: 'Diagnoseschritt',
    step: 'Schritt',
    issueResolved: 'Problem Erfolgreich Gelöst',
    outcomeConfirmed: 'Diagnoseergebnis Bestätigt',
    startAnother: 'Weitere Diagnose Starten',
    escalatedSupport: 'An Technischen Support Eskaliert',
    ticketGenerated: 'Support-Ticket Erstellt',
    viewTicket: 'Ticket-Verlauf Anzeigen',
    feedbackPrompt: 'Wie hilfreich war diese Diagnosesitzung?',
    feedbackRecorded: 'Vielen Dank! Ihr Feedback wurde gespeichert.',
    submitFeedback: 'Absenden',
    escalateManual: 'Eskalieren',
    newProblem: 'Neues Problem',
    language: 'Sprache',
    yes: 'JA',
    no: 'NEIN',
    softSurface: 'WEICHE UNTERLAGE',
    hardDesk: 'FESTER TISCH',
    urgentCleanup: 'SCHNELLE BEREINIGUNG',
    auditCleanup: 'VOLLSTÄNDIGER AUDIT',
    wifiNetwork: 'WLAN / NETZWERK',
    usbCable: 'USB-KABEL',
    errorShown: 'JA, FEHLER WIRD ANGEZEIGT',
    disappears: 'NEIN, SCHLIESST EINFACH',
    canBoot: 'STARTET / ABGESICHERTER MODUS',
    stuckLoop: 'IN START-SCHLEIFE GEFANGEN',
    clarificationNeeded: 'Klärung Erforderlich',
    clarificationTitle: 'Problem Eingrenzen',
    selectCategory: 'Welche Kategorie beschreibt Ihr Problem am besten?',
    signIn: 'Anmelden',
    signOut: 'Abmelden',
    register: 'Registrieren',
    guest: 'Gast-Modus',
    engineerRole: 'Ingenieur',
    profile: 'Profil',
    activeEngine: 'Interaktive Diagnose-Engine Aktiv'
  },
  zh: {
    appTitle: 'TechAssist AI',
    tagline: '智能技术支持，循序渐进',
    heroTitle: '智能技术支持',
    heroDesc: '用自然语言描述您的技术问题。TechAssist AI 会智能分类故障、定位潜在原因，并通过决策树引导您逐步排查。',
    inputPlaceholder: "描述您的技术问题（例如：'笔记本连接了 Wi-Fi 但网页打不开' 或 '电脑磁盘占用 100% 卡顿'）...",
    startDiagnosis: '开始诊断',
    analyzing: '正在分析问题...',
    newDiagnosis: '新诊断',
    chooseScenario: '或选择测试诊断场景：',
    identifiedCauses: '已识别的可能排查原因',
    recommendedAction: '建议排查操作：',
    selectFinding: '选择您的排查结果：',
    orTypeAnswer: '或在此输入您的回答...',
    send: '发送',
    copy: '复制',
    copied: '已复制！',
    diagnosticStep: '诊断步骤',
    step: '步骤',
    issueResolved: '问题已成功解决',
    outcomeConfirmed: '诊断结论确认',
    startAnother: '开始新的诊断',
    escalatedSupport: '已升级至技术支持工程师',
    ticketGenerated: '已生成技术支持工单',
    viewTicket: '查看工单审计日志与状态',
    feedbackPrompt: '本次诊断排查对您有帮助吗？',
    feedbackRecorded: '感谢您的评价！反馈已存入数据库。',
    submitFeedback: '提交',
    escalateManual: '转交人工支持',
    newProblem: '新问题',
    language: '语言',
    yes: '是',
    no: '否',
    softSurface: '柔软表面（床/沙发）',
    hardDesk: '坚硬桌面',
    urgentCleanup: '快速清理',
    auditCleanup: '全面审查',
    wifiNetwork: 'Wi-Fi / 网络',
    usbCable: 'USB 数据线',
    errorShown: '是，弹出错误代码',
    disappears: '否，闪退直接消失',
    canBoot: '可以开机 / 安全模式',
    stuckLoop: '卡在自动修复循环',
    clarificationNeeded: '需要澄清',
    clarificationTitle: '让我们进一步明确问题',
    selectCategory: '哪个类别最符合您遇到的情况？',
    signIn: '登录',
    signOut: '退出登录',
    register: '注册',
    guest: '访客模式',
    engineerRole: '工程师',
    profile: '个人资料',
    activeEngine: '交互式诊断引擎已就绪'
  },
  ja: {
    appTitle: 'TechAssist AI',
    tagline: 'インテリジェントな技術サポート、ステップバイステップ',
    heroTitle: 'インテリジェント技術サポート',
    heroDesc: '技術的な問題を日常の言葉で入力してください。TechAssist AIが問題を分類し、原因を特定してインタラクティブな決定木で解決へと導きます。',
    inputPlaceholder: "問題を入力してください（例：「Wi-Fiに接続されていますがWebサイトが開きません」「ディスク使用率が100%でフリーズします」）...",
    startDiagnosis: '診断を開始',
    analyzing: '問題を分析中...',
    newDiagnosis: '新しい診断',
    chooseScenario: 'またはテスト診断シナリオを選択：',
    identifiedCauses: '調査対象として特定された原因',
    recommendedAction: '推奨される対処手順：',
    selectFinding: '確認結果を選択してください：',
    orTypeAnswer: 'または回答をここに入力...',
    send: '送信',
    copy: 'コピー',
    copied: 'コピー完了！',
    diagnosticStep: '診断ステップ',
    step: 'ステップ',
    issueResolved: '問題が正常に解決されました',
    outcomeConfirmed: '診断結果が確認されました',
    startAnother: '別の診断を開始',
    escalatedSupport: 'テクニカルサポートエンジニアへエスカレーション済み',
    ticketGenerated: 'サポートチケットが生成されました',
    viewTicket: 'チケット監査履歴とステータスを表示',
    feedbackPrompt: 'この診断セッションは役に立ちましたか？',
    feedbackRecorded: 'ありがとうございます！フィードバックが記録されました。',
    submitFeedback: '送信',
    escalateManual: 'サポートへエスカレーション',
    newProblem: '新しい問題',
    language: '言語',
    yes: 'はい',
    no: 'いいえ',
    softSurface: '柔らかい面（ベッドなど）',
    hardDesk: '硬い机・デスク',
    urgentCleanup: 'クイッククリーンアップ',
    auditCleanup: '包括的監査',
    wifiNetwork: 'Wi-Fi / ネットワーク',
    usbCable: 'USBケーブル',
    errorShown: 'はい、エラーが表示される',
    disappears: 'いいえ、突然終了する',
    canBoot: '起動可能 / セーフモード',
    stuckLoop: '再起動ループで停止',
    clarificationNeeded: '明確化が必要です',
    clarificationTitle: '問題を絞り込みましょう',
    selectCategory: '発生している現象に最も近いカテゴリを選択してください：',
    signIn: 'サインイン',
    signOut: 'サインアウト',
    register: '新規登録',
    guest: 'ゲストモード',
    engineerRole: 'エンジニア',
    profile: 'プロフィール',
    activeEngine: '対話型診断エンジン稼働中'
  },
  pt: {
    appTitle: 'TechAssist AI',
    tagline: 'Suporte Técnico Inteligente, Passo a Passo',
    heroTitle: 'Suporte Técnico Inteligente',
    heroDesc: 'Descreva seu problema técnico em linguagem simples. O TechAssist AI classifica a falha, isola possíveis causas e orienta você passo a passo.',
    inputPlaceholder: "Descreva seu problema técnico (ex.: 'Meu notebook está conectado ao Wi-Fi mas os sites não abrem' ou 'Meu computador trava com disco a 100%')...",
    startDiagnosis: 'Iniciar Diagnóstico',
    analyzing: 'Analisando Problema...',
    newDiagnosis: 'Novo Diagnóstico',
    chooseScenario: 'Ou escolha um cenário de teste:',
    identifiedCauses: 'Causas Potenciais Identificadas para Investigação',
    recommendedAction: 'Ação Recomendada:',
    selectFinding: 'Selecione seu resultado:',
    orTypeAnswer: 'Ou digite sua resposta aqui...',
    send: 'Enviar',
    copy: 'Copiar',
    copied: 'Copiado!',
    diagnosticStep: 'Etapa de Diagnóstico',
    step: 'Etapa',
    issueResolved: 'Problema Resolvido com Sucesso',
    outcomeConfirmed: 'Resultado do Diagnóstico Confirmado',
    startAnother: 'Iniciar Outro Diagnóstico',
    escalatedSupport: 'Escalado para Engenharia de Suporte Técnico',
    ticketGenerated: 'Ticket de Suporte Gerado',
    viewTicket: 'Ver Histórico de Auditoria do Ticket',
    feedbackPrompt: 'Quão útil foi esta sessão de diagnóstico?',
    feedbackRecorded: 'Obrigado! Seu feedback foi registrado no banco de dados.',
    submitFeedback: 'Enviar',
    escalateManual: 'Escalar para Suporte',
    newProblem: 'Novo Problema',
    language: 'Idioma',
    yes: 'SIM',
    no: 'NÃO',
    softSurface: 'SUPERFÍCIE MACIA',
    hardDesk: 'MESA RÍGIDA',
    urgentCleanup: 'LIMPEZA RÁPIDA',
    auditCleanup: 'AUDITORIA COMPLETA',
    wifiNetwork: 'WI-FI / REDE',
    usbCable: 'CABO USB',
    errorShown: 'SIM, MOSTRA ERRO',
    disappears: 'NÃO, APENAS FECHA',
    canBoot: 'INICIA / MODO DE SEGURANÇA',
    stuckLoop: 'TRAVADO EM LOOP',
    clarificationNeeded: 'Esclarecimento Necessário',
    clarificationTitle: 'Vamos Delimitar o Problema',
    selectCategory: 'Qual categoria melhor descreve o que você está vendo?',
    signIn: 'Entrar',
    signOut: 'Sair',
    register: 'Cadastrar',
    guest: 'Modo Convidado',
    engineerRole: 'Engenheiro',
    profile: 'Perfil',
    activeEngine: 'Motor de Diagnóstico Interativo Ativo'
  },
  ar: {
    appTitle: 'تيك أسيست AI',
    tagline: 'دعم فني ذكي، خطوة بخطوة',
    heroTitle: 'الدعم الفني الذكي',
    heroDesc: 'صف مشكلتك التقنية بلغة بسيطة. يقوم تيك أسيست AI بتصنيف المشكلة وعزل الأسباب وتوجيهك خطوة بخطوة عبر أشجار قرارات تفاعلية.',
    inputPlaceholder: "صف مشكلتك التقنية (مثال: 'جهازي متصل بالواي فاي ولكن المواقع لا تفتح' أو 'الكمبيوتر يتجمد مع استهلاك القرص 100%')...",
    startDiagnosis: 'بدء التشخيص',
    analyzing: 'جاري تحليل المشكلة...',
    newDiagnosis: 'تشخيص جديد',
    chooseScenario: 'أو اختر سيناريو تشخيص تجريبي:',
    identifiedCauses: 'الأسباب المحتملة المحددة للفحص',
    recommendedAction: 'الإجراء الموصى به:',
    selectFinding: 'حدد النتيجة الخاصة بك:',
    orTypeAnswer: 'أو اكتب إجابتك هنا...',
    send: 'إرسال',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    diagnosticStep: 'خطوة التشخيص',
    step: 'خطوة',
    issueResolved: 'تم حل المشكلة بنجاح',
    outcomeConfirmed: 'تم تأكيد نتيجة التشخيص',
    startAnother: 'بدء تشخيص آخر',
    escalatedSupport: 'تم التصعيد إلى الدعم الفني الهندسي',
    ticketGenerated: 'تم إنشاء تذكرة دعم فني',
    viewTicket: 'عرض سجل التدقيق وحالة التذكرة',
    feedbackPrompt: 'ما مدى فائدة جلسة التشخيص هذه؟',
    feedbackRecorded: 'شكراً لك! تم تسجيل ملاحظاتك في قاعدة البيانات.',
    submitFeedback: 'إرسال',
    escalateManual: 'تصعيد للدعم الفني',
    newProblem: 'مشكلة جديدة',
    language: 'اللغة',
    yes: 'نعم',
    no: 'لا',
    softSurface: 'سطح ناعم (سرير/وسادة)',
    hardDesk: 'مكتب صلب',
    urgentCleanup: 'تنظيف سريع وعاجل',
    auditCleanup: 'تدقيق وفحص شامل',
    wifiNetwork: 'واي فاي / شبكة',
    usbCable: 'كابل USB',
    errorShown: 'نعم، يظهر رمز خطأ',
    disappears: 'لا، يختفي فجأة',
    canBoot: 'يمكن الإقلاع / الوضع الآمن',
    stuckLoop: 'عالق في حلقة إعادة التشغيل',
    clarificationNeeded: 'مطلوب توضيح',
    clarificationTitle: 'دعنا نحدد المشكلة بدقة',
    selectCategory: 'أي فئة تطابق ما تواجهه بشكل أفضل؟',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    register: 'إنشاء حساب',
    guest: 'وضع الزائر',
    engineerRole: 'مهندس',
    profile: 'الملف الشخصي',
    activeEngine: 'محرك التشخيص التفاعلي نشط'
  }
};

export const COMMON_PROMPTS_TRANSLATED: Record<LanguageCode, Array<{ label: string; text: string }>> = {
  en: [
    { label: 'Wi-Fi No Internet', text: 'My laptop is connected to Wi-Fi but websites are not opening.' },
    { label: 'Laptop Overheating', text: 'My laptop is extremely hot and the fan is spinning very loud.' },
    { label: 'Laptop Slow & Freezing', text: 'My laptop is running very slow with 100% disk usage and lag.' },
    { label: 'Browser Crashing', text: 'My Chrome keeps closing unexpectedly with an Aw Snap error.' },
    { label: 'Printer Not Printing', text: 'My printer is connected but not printing documents from the queue.' },
    { label: 'Storage Full', text: 'My C: drive is completely full with low disk space warnings.' }
  ],
  es: [
    { label: 'Wi-Fi Sin Internet', text: 'Mi laptop está conectada a Wi-Fi pero los sitios web no abren.' },
    { label: 'Sobrecalentamiento', text: 'Mi laptop está extremadamente caliente y el ventilador suena muy fuerte.' },
    { label: 'Lentitud y Congelamiento', text: 'Mi laptop está muy lenta con el disco al 100% y se congela.' },
    { label: 'Navegador se Cierra', text: 'Mi Chrome se cierra inesperadamente con error ¡Oh, no!.' },
    { label: 'Impresora No Imprime', text: 'Mi impresora está conectada pero no imprime los documentos en cola.' },
    { label: 'Disco Lleno', text: 'Mi disco C: está completamente lleno con advertencias de poco espacio.' }
  ],
  hi: [
    { label: 'वाई-फाई नो इंटरनेट', text: 'मेरा लैपटॉप वाई-फाई से जुड़ा है लेकिन वेबसाइट नहीं खुल रही हैं।' },
    { label: 'लैपटॉप ओवरहीटिंग', text: 'मेरा लैपटॉप बहुत गर्म हो रहा है और पंखा बहुत तेज आवाज कर रहा है।' },
    { label: 'लैपटॉप धीमा व हैंग', text: 'मेरा लैपटॉप बहुत धीमा चल रहा है और 100% डिस्क उपयोग के साथ हैंग हो रहा है।' },
    { label: 'ब्राउज़र क्रैश', text: 'मेरा क्रोम अचानक बंद हो जाता है और Aw Snap एरर आता है।' },
    { label: 'प्रिंटर प्रिंट नहीं कर रहा', text: 'प्रिंटर कनेक्ट है लेकिन कतार से दस्तावेज़ प्रिंट नहीं हो रहे हैं।' },
    { label: 'स्टोरेज फुल', text: 'मेरी C: ड्राइव पूरी तरह भर चुकी है और लो डिस्क स्पेस चेतावनी आ रही है।' }
  ],
  te: [
    { label: 'Wi-Fi ఇంటర్నెట్ లేదు', text: 'నా ల్యాప్‌టాప్ Wi-Fi కి కనెక్ట్ అయింది కానీ వెబ్‌సైట్‌లు ఓపెన్ కావడం లేదు.' },
    { label: 'ల్యాప్‌టాప్ వేడెక్కడం', text: 'నా ల్యాప్‌టాప్ చాలా వేడెక్కుతోంది మరియు ఫ్యాన్ పెద్ద శబ్దం చేస్తోంది.' },
    { label: 'ల్యాప్‌టాప్ నెమ్మదిగా ఉండటం', text: 'నా ల్యాప్‌టాప్ 100% డిస్క్ వినియోగంతో చాలా నెమ్మదిగా నడుస్తోంది.' },
    { label: 'బ్రౌజర్ క్రాష్', text: 'నా క్రోమ్ అకస్మాత్తుగా మూసివేయబడుతోంది మరియు Aw Snap ఎర్రర్ వస్తోంది.' },
    { label: 'ప్రింటర్ పని చేయడం లేదు', text: 'ప్రింటర్ కనెక్ట్ అయింది కానీ పత్రాలు ప్రింట్ కావడం లేదు.' },
    { label: 'స్టోరేజ్ నిండిపోయింది', text: 'నా C: డ్రైవ్ పూర్తిగా నిండిపోయింది మరియు తక్కువ స్థలం హెచ్చరిక వస్తోంది.' }
  ],
  fr: [
    { label: 'Wi-Fi Sans Internet', text: 'Mon ordinateur portable est connecté au Wi-Fi mais les sites ne s’ouvrent pas.' },
    { label: 'Surchauffe Ordinateur', text: 'Mon ordinateur portable est brûlant et le ventilateur tourne très fort.' },
    { label: 'Lenteur et Blocages', text: 'Mon ordinateur est très lent avec 100% d’utilisation disque et se fige.' },
    { label: 'Navigateur Plante', text: 'Mon Chrome se ferme tout seul avec une erreur Page plantée.' },
    { label: 'Imprimante Bloquée', text: 'Mon imprimante est connectée mais n’imprime pas les documents.' },
    { label: 'Disque Saturé', text: 'Mon disque C: est plein avec des alertes d’espace disque faible.' }
  ],
  de: [
    { label: 'WLAN Kein Internet', text: 'Mein Laptop ist mit dem WLAN verbunden, aber Websites öffnen nicht.' },
    { label: 'Laptop Überhitzung', text: 'Mein Laptop wird extrem heiß und der Lüfter dreht sehr laut.' },
    { label: 'Laptop Langsam & Friert Ein', text: 'Mein Laptop läuft extrem langsam bei 100% Datenträgerauslastung.' },
    { label: 'Browser Stürzt Ab', text: 'Mein Chrome schließt sich unerwartet mit einem Fehler.' },
    { label: 'Drucker Druckt Nicht', text: 'Mein Drucker ist verbunden, druckt aber keine Dokumente aus der Warteschlange.' },
    { label: 'Festplatte Voll', text: 'Mein Laufwerk C: ist komplett voll mit Warnungen über geringen Speicherplatz.' }
  ],
  zh: [
    { label: 'Wi-Fi 无网络', text: '笔记本连接了 Wi-Fi 但网页打不开。' },
    { label: '笔记本发烫过热', text: '笔记本非常发烫，风扇转速极高噪音很大。' },
    { label: '电脑卡顿死机', text: '电脑运行非常缓慢，磁盘占用率 100% 频繁卡顿。' },
    { label: '浏览器频繁崩溃', text: 'Chrome 浏览器总是意外崩溃并提示“喔唷，崩溃了”。' },
    { label: '打印机无法打印', text: '打印机已连接但打印队列卡住无法出纸。' },
    { label: 'C 盘存储已满', text: 'C 盘空间几乎完全耗尽，频繁提示磁盘空间不足。' }
  ],
  ja: [
    { label: 'Wi-Fi ネット不通', text: 'ノートパソコンがWi-Fiに接続されていますがWebサイトが開きません。' },
    { label: '発熱・ファン異音', text: 'ノートパソコンが異常に熱く、ファンが大きな音で回り続けています。' },
    { label: '動作が重い・フリーズ', text: 'パソコンの動作が非常に重く、ディスク使用率100%で頻繁に停止します。' },
    { label: 'ブラウザが落ちる', text: 'Chromeが突然クラッシュして「エラーが発生しました」と表示されます。' },
    { label: 'プリンター印刷不可', text: 'プリンターは接続されていますがキューの印刷ジョブが出力されません。' },
    { label: 'Cドライブ容量不足', text: 'Cドライブの空き容量が完全になくなり警告が頻発しています。' }
  ],
  pt: [
    { label: 'Wi-Fi Sem Internet', text: 'Meu notebook está conectado ao Wi-Fi mas os sites não abrem.' },
    { label: 'Superaquecimento', text: 'Meu notebook está muito quente e a ventoinha faz muito barulho.' },
    { label: 'Notebook Travando', text: 'Meu notebook está muito lento com 100% de uso de disco.' },
    { label: 'Navegador Travando', text: 'Meu Chrome fecha sozinho com erro Ah, não!.' },
    { label: 'Impressora Não Imprime', text: 'Minha impressora está conectada mas não imprime os documentos.' },
    { label: 'Disco Cheio', text: 'Meu disco C: está completamente cheio com aviso de pouco espaço.' }
  ],
  ar: [
    { label: 'واي فاي بدون إنترنت', text: 'جهازي متصل بشبكة الواي فاي ولكن المواقع الإلكترونية لا تفتح.' },
    { label: 'ارتفاع حرارة اللابتوب', text: 'اللابتوب ساخن جداً وصوت المروحة يدور بصوت عالي ومزعج.' },
    { label: 'بطء وتجمد النظام', text: 'اللابتوب بطيء جداً مع استهلاك القرص 100% وتجمد مستمر.' },
    { label: 'انهيار المتصفح', text: 'متصفح كروم يغلق فجأة وتظهر رسالة خطأ باستمرار.' },
    { label: 'الطابعة لا تطبع', text: 'الطابعة متصلة ولكن المستندات معلقة في قائمة الانتظار.' },
    { label: 'القرص ممتلئ', text: 'القرص C ممتلئ بالكامل وتظهر تحذيرات انخفاض المساحة.' }
  ]
};

export function getTranslation(lang: LanguageCode, key: string): string {
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key;
}

export function translateOptionLabel(lang: LanguageCode, label: string): string {
  const norm = label.trim().toUpperCase();
  if (norm === 'YES') return getTranslation(lang, 'yes');
  if (norm === 'NO') return getTranslation(lang, 'no');
  if (norm.includes('SOFT SURFACE')) return getTranslation(lang, 'softSurface');
  if (norm.includes('HARD DESK')) return getTranslation(lang, 'hardDesk');
  if (norm.includes('URGENT QUICK CLEANUP')) return getTranslation(lang, 'urgentCleanup');
  if (norm.includes('COMPREHENSIVE AUDIT')) return getTranslation(lang, 'auditCleanup');
  if (norm.includes('WI-FI / NETWORK') || norm.includes('WIFI / NETWORK')) return getTranslation(lang, 'wifiNetwork');
  if (norm.includes('USB CABLE')) return getTranslation(lang, 'usbCable');
  if (norm.includes('ERROR SHOWN')) return getTranslation(lang, 'errorShown');
  if (norm.includes('DISAPPEARS')) return getTranslation(lang, 'disappears');
  if (norm.includes('CAN BOOT')) return getTranslation(lang, 'canBoot');
  if (norm.includes('STUCK IN LOOP')) return getTranslation(lang, 'stuckLoop');
  return label;
}

export const NODE_LOCALIZATIONS: Record<
  string,
  Record<
    LanguageCode,
    { question?: string; instruction?: string }
  >
> = {
  'start': {
    en: {
      question: 'Can another device connected to the same Wi-Fi access the internet?',
      instruction: 'Test internet connectivity on a second device connected to the identical Wi-Fi network.'
    },
    es: {
      question: '¿Puede otro dispositivo conectado a la misma red Wi-Fi acceder a Internet?',
      instruction: 'Prueba la conexión a Internet en un segundo dispositivo conectado a la misma red Wi-Fi.'
    },
    hi: {
      question: 'क्या उसी वाई-फाई से जुड़ा दूसरा उपकरण इंटरनेट एक्सेस कर सकता है?',
      instruction: 'उसी वाई-फाई नेटवर्क से जुड़े किसी दूसरे उपकरण पर इंटरनेट चलाकर जांच करें।'
    },
    te: {
      question: 'అదే Wi-Fi కి కనెక్ట్ చేయబడిన మరొక పరికరం ఇంటర్నెట్‌ను యాక్సెస్ చేయగలదా?',
      instruction: 'అదే Wi-Fi నెట్‌వర్క్‌కి కనెక్ట్ చేయబడిన రెండవ పరికరంలో ఇంటర్నెట్ కనెక్టివిటీని పరీక్షించండి.'
    },
    fr: {
      question: 'Un autre appareil connecté au même Wi-Fi peut-il accéder à Internet ?',
      instruction: 'Testez la connexion Internet sur un second appareil connecté au même réseau Wi-Fi.'
    },
    de: {
      question: 'Kann ein anderes Gerät im selben WLAN auf das Internet zugreifen?',
      instruction: 'Testen Sie die Internetverbindung auf einem zweiten Gerät, das mit demselben WLAN verbunden ist.'
    },
    zh: {
      question: '连接到同一 Wi-Fi 的其他设备可以正常访问互联网吗？',
      instruction: '在连接到同一 Wi-Fi 网络的另一台设备（如手机或另一台电脑）上测试网络。'
    },
    ja: {
      question: '同じWi-Fiに接続された別のデバイスはインターネットにアクセスできますか？',
      instruction: '同じWi-Fiネットワークに接続された2台目のデバイスでインターネット接続をテストしてください。'
    },
    pt: {
      question: 'Outro dispositivo conectado ao mesmo Wi-Fi consegue acessar a internet?',
      instruction: 'Teste a conexão com a internet em um segundo dispositivo conectado à mesma rede Wi-Fi.'
    },
    ar: {
      question: 'هل يمكن لجهاز آخر متصل بنفس شبكة الواي فاي الوصول إلى الإنترنت؟',
      instruction: 'اختبر الاتصال بالإنترنت على جهاز آخر متصل بنفس شبكة الواي فاي.'
    }
  },
  'check-dns-local': {
    en: {
      question: 'After restarting your laptop, can you now load web pages?',
      instruction: 'Flush your local DNS resolver and reset TCP/IP stack:\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) Restart your laptop.'
    },
    es: {
      question: '¿Después de reiniciar la laptop, ahora puedes cargar páginas web?',
      instruction: 'Limpia la caché de DNS local y reinicia la pila TCP/IP:\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) Reinicia tu laptop.'
    },
    hi: {
      question: 'लैपटॉप रीस्टार्ट करने के बाद, क्या अब वेब पेज लोड हो रहे हैं?',
      instruction: 'स्थानीय DNS कैश साफ़ करें और TCP/IP रीसेट करें:\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) अपना लैपटॉप रीस्टार्ट करें।'
    },
    te: {
      question: 'మీ ల్యాప్‌టాప్‌ను రీస్టార్ట్ చేసిన తర్వాత, ఇప్పుడు వెబ్ పేజీలు లోడ్ అవుతున్నాయా?',
      instruction: 'మీ స్థానిక DNS కాష్‌ను క్లియర్ చేసి TCP/IP రీసెట్ చేయండి:\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) మీ ల్యాప్‌టాప్‌ను పునఃప్రారంభించండి.'
    },
    fr: {
      question: 'Après avoir redémarré votre ordinateur, pouvez-vous charger les pages web ?',
      instruction: 'Videz votre cache DNS et réinitialisez la pile TCP/IP :\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) Redémarrez votre PC.'
    },
    de: {
      question: 'Können Sie nach dem Neustart des Laptops Webseiten aufrufen?',
      instruction: 'Lokalen DNS-Cache leeren und TCP/IP-Stack zurücksetzen:\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) Laptop neu starten.'
    },
    zh: {
      question: '重启笔记本电脑后，现在可以正常打开网页了吗？',
      instruction: '刷新本地 DNS 解析缓存并重置 TCP/IP 协议栈：\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) 重启笔记本电脑。'
    },
    ja: {
      question: 'ノートパソコンを再起動した後、Webページを読み込めるようになりましたか？',
      instruction: 'ローカルDNSリゾルバーをフラッシュしTCP/IPスタックをリセットします：\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) PCを再起動。'
    },
    pt: {
      question: 'Após reiniciar o notebook, você consegue carregar as páginas web agora?',
      instruction: 'Limpe o cache DNS local e redefina a pilha TCP/IP:\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) Reinicie o computador.'
    },
    ar: {
      question: 'بعد إعادة تشغيل اللابتوب، هل يمكنك تصفح مواقع الويب الآن؟',
      instruction: 'امسح ذاكرة التخزين المؤقت لـ DNS وأعد ضبط مكدس TCP/IP:\n1) ipconfig /flushdns\n2) netsh winsock reset\n3) أعد تشغيل اللابتوب.'
    }
  },
  'router-reboot-isp': {
    en: {
      question: 'Did power cycling the router and modem restore internet access?',
      instruction: 'Power-cycle your Wi-Fi router and modem: Unplug both, wait 30 seconds, reconnect modem first, then router.'
    },
    es: {
      question: '¿Reiniciar el router y módem restableció el acceso a Internet?',
      instruction: 'Reinicia tu router y módem: Desconecta ambos, espera 30 segundos, conecta primero el módem y luego el router.'
    },
    hi: {
      question: 'क्या राउटर और मॉडेम को रीस्टार्ट करने से इंटरनेट बहाल हुआ?',
      instruction: 'राउटर और मॉडेम को पावर-साइकिल करें: दोनों का प्लग निकालें, 30 सेकंड प्रतीक्षा करें, पहले मॉडेम फिर राउटर चालू करें।'
    },
    te: {
      question: 'రౌటర్ మరియు మోడెమ్‌ను రీస్టార్ట్ చేయడం వల్ల ఇంటర్నెట్ పునరుద్ధరించబడిందా?',
      instruction: 'రౌటర్ మరియు మోడెమ్ పవర్ ఆఫ్ చేయండి: 30 సెకన్లు ఆగి, మొదట మోడెమ్ ఆపై రౌటర్ ఆన్ చేయండి.'
    },
    fr: {
      question: 'Le redémarrage du routeur et de la box a-t-il rétabli Internet ?',
      instruction: 'Redémarrez votre routeur et modem : Débranchez les deux, attendez 30 secondes, rebranchez le modem puis le routeur.'
    },
    de: {
      question: 'Wurde der Internetzugang durch den Neustart von Router und Modem wiederhergestellt?',
      instruction: 'Router und Modem aus- und einschalten: Beide ausstecken, 30 Sekunden warten, erst Modem dann Router anschließen.'
    },
    zh: {
      question: '重新插拔路由器与光猫电源后，网络恢复正常了吗？',
      instruction: '将路由器与调制解调器断电：拔下电源插头等待 30 秒，先通电光猫，指示灯稳定后再通电路由器。'
    },
    ja: {
      question: 'ルーターとモデムの電源を入れ直して、インターネットは復旧しましたか？',
      instruction: 'ルーターとモデムの電源をオフにして30秒待ち、モデムを先に入れてからルーターを接続してください。'
    },
    pt: {
      question: 'Reiniciar o roteador e modem restaurou o acesso à internet?',
      instruction: 'Reinicie seu roteador e modem: Desconecte ambos da tomada, aguarde 30 segundos, ligue o modem e depois o roteador.'
    },
    ar: {
      question: 'هل أدت إعادة تشغيل الراوتر والمودم إلى استعادة الاتصال بالإنترنت؟',
      instruction: 'أعد تشغيل الراوتر والمودم: افصل كليهما من الكهرباء، انتظر 30 ثانية، ثم أعد توصيل المودم أولاً ثم الراوتر.'
    }
  }
};

export function getLocalizedNode(
  nodeId: string,
  lang: LanguageCode,
  fallbackQuestion: string,
  fallbackInstruction: string
): { question: string; instruction: string } {
  const nodeData = NODE_LOCALIZATIONS[nodeId]?.[lang];
  return {
    question: nodeData?.question || fallbackQuestion,
    instruction: nodeData?.instruction || fallbackInstruction
  };
}

