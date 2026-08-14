import { Product, Category } from '../types';

export const UI_TRANSLATIONS: Record<string, { fr: string; ar: string }> = {
  // Navigation & Header
  home: { fr: 'Accueil', ar: 'الرئيسية' },
  shop: { fr: 'Boutique', ar: 'المتجر' },
  hairDryers: { fr: 'Sèche-cheveux', ar: 'مجففات الشعر' },
  straighteners: { fr: 'Lisseurs', ar: 'أجهزة ألمملس' },
  hotBrushes: { fr: 'Brosses chauffantes', ar: 'فرش حرارية' },
  curlers: { fr: 'Boucleurs', ar: 'أجهزة التمويج' },
  multiStylers: { fr: 'Multistylers', ar: 'مصففات متعددة' },
  professional: { fr: 'Professionnels', ar: 'أجهزة احترافية' },
  suitcases: { fr: 'Valises', ar: 'حقائب السفر' },
  handbags: { fr: 'Sacs à Main', ar: 'حقائب يد' },
  backpacks: { fr: 'Sacs à Dos', ar: 'حقائب ظهر' },
  promotions: { fr: 'Promotions', ar: 'التخفيضات' },
  tracking: { fr: 'Suivi Commande', ar: 'تتبع الطلب' },
  contact: { fr: 'Contact', ar: 'اتصل بنا' },
  cart: { fr: 'Mon Panier', ar: 'سلة التسوق' },
  searchPlaceholder: { fr: 'Rechercher un lisseur, sèche-cheveux...', ar: 'ابحث عن مجفف شعر، مملس...' },
  topBannerDelivery: { fr: 'LIVRAISON DANS LES 58 WILAYAS', ar: 'التوصيل متوفر لجميع الـ 58 ولاية' },
  topBannerCod: { fr: 'PAIEMENT À LA LIVRAISON (C.O.D)', ar: 'الدفع نقداً عند الاستلام' },

  // Hero & Homepage
  heroBadge: { fr: 'N°1 des appareils de coiffure professionnels en Algérie', ar: 'الرائد في أجهزة تصفيف الشعر الاحترافية في الجزائر' },
  heroTitle: { fr: 'L’Excellence de la Coiffure Professionnelle à Domicile', ar: 'أحدث أجهزة تصفيف الشعر الاحترافية بين يديك' },
  heroTitleGradient: { fr: 'meilleurs appareils', ar: 'أحدث الأجهزة' },
  heroSubtitle: {
    fr: 'Découvrez notre sélection exclusive d’appareils de coiffure de haute qualité : lisseurs au titane, sèche-cheveux ioniques et brosses soufflantes. Livraison rapide 58 Wilayas.',
    ar: 'اكتشفي تشكيلتنا المميزة من أجهزة الشعر عالية الجودة: مجففات شعر أيونية، أجهزة مملس السيراميك، والفرش الحرارية. توصيل سريع لجميع الولايات.'
  },
  discoverShop: { fr: 'Découvrir la boutique', ar: 'تصفحي المتجر' },
  viewPromos: { fr: 'Voir les promotions (-40%)', ar: 'عرض التخفيضات (-40%)' },
  wilayas58Home: { fr: '58 Wilayas', ar: '58 ولاية' },
  homeDelivery: { fr: 'Livraison à domicile', ar: 'توصيل إلى باب المنزل' },
  codAtReceipt: { fr: 'À la réception', ar: 'عند الاستلام' },
  guaranteedEq: { fr: '100% Garanti', ar: 'مضمون 100%' },
  officialEquip: { fr: 'Matériel officiel', ar: 'معدات أصلية' },
  featuredProductBadge: { fr: 'Produit Phare', ar: 'المنتج الأكثر طلباً' },

  // Homepage sections
  exploreByCat: { fr: 'Explorez par Catégorie', ar: 'تصفحي حسب الفئة' },
  ourRanges: { fr: 'Nos Gammes', ar: 'تشكيلاتنا' },
  viewAllCategories: { fr: 'Voir toutes les catégories', ar: 'عرض كل الفئات' },
  selectionTitle: { fr: 'Nos Meilleurs Appareils de Coiffure', ar: 'أفضل أجهزة تصفيف الشعر لدينا' },
  selectionSub: { fr: 'Sélectionnés pour leur performance, leur fiabilité et leur respect de la fibre capillaire.', ar: 'تم اختيارها بعناية لأدائها العالي وحمايتها لفروة وشعر المرأة.' },
  allProductsTab: { fr: 'Tous nos produits', ar: 'جميع المنتجات' },
  newTab: { fr: 'Nouveautés', ar: 'وصل حديثاً' },
  bestSellersTab: { fr: 'Meilleures Ventes', ar: 'الأكثر مبيعاً' },
  promosTab: { fr: 'Promotions', ar: 'التخفيضات' },
  viewAllShop: { fr: 'Voir tout le catalogue', ar: 'عرض كامل الكتالوج' },
  customerReviewsTitle: { fr: 'Avis de nos clientes en Algérie', ar: 'آراء زبوناتنا في الجزائر' },
  verifiedReviews: { fr: 'Témoignages vérifiés', ar: 'تقييمات حقيقية' },
  reviewGuaranteed: { fr: 'Avis 100% Vérifiés', ar: 'تقييمات مؤكدة 100%' },
  reviewGuaranteedSub: { fr: 'Satisfaction garantie par nos clientes', ar: 'رضا تام من زبوناتنا في الجزائر' },

  // Product Card & Details
  newBadge: { fr: 'Nouveau', ar: 'جديد' },
  lowStockBadge: { fr: 'Stock faible', ar: 'كمية محدودة' },
  outOfStockBadge: { fr: 'Rupture', ar: 'نفذت الكمية' },
  quickBuy: { fr: 'Acheter Directement', ar: 'شراء مباشر' },
  addToCart: { fr: 'Ajouter au panier', ar: 'إضافة إلى السلة' },
  cartBtn: { fr: 'Panier', ar: 'السلة' },
  buyBtn: { fr: 'Acheter', ar: 'شراء' },
  priceDa: { fr: 'DA', ar: 'د.ج' },
  inStock: { fr: 'En Stock', ar: 'متوفر حالياً' },
  warrantyLabel: { fr: 'Garantie', ar: 'الضمان' },
  powerLabel: { fr: 'Puissance', ar: 'القوة' },
  tempLabel: { fr: 'Température', ar: 'درجة الحرارة' },
  colorLabel: { fr: 'Couleur', ar: 'اللون' },
  speedLabel: { fr: 'Vitesse', ar: 'السرعة' },
  techSpecsTab: { fr: 'Fiche Technique', ar: 'المواصفات التقنية' },
  boxContentTab: { fr: 'Contenu du Coffret', ar: 'محتويات العلبة' },
  descriptionTab: { fr: 'Description Détallée', ar: 'الوصف التفصيلي' },
  reviewsTab: { fr: 'Avis Clients', ar: 'آراء الزبائن' },
  quantity: { fr: 'Quantité', ar: 'الكمية' },
  orderViaWhatsapp: { fr: 'Commander par WhatsApp', ar: 'الطلب عبر الواتساب' },
  quickCheckoutExpress: { fr: 'Commande Rapide sans Création de Compte', ar: 'طلب سريع بدون حساب' },
  relatedProducts: { fr: 'Vous aimerez aussi', ar: 'منتجات قد تعجبك' },

  // Shop Page
  shopCatalogTitle: { fr: 'Catalogue d\'Appareils de Coiffure', ar: 'كتالوج أجهزة تصفيف الشعر' },
  shopCatalogSub: { fr: 'Lisseurs, sèche-cheveux, brosses et boucleurs professionnels livrés chez vous.', ar: 'مجففات شعر، أجهزة مملس، وفرش حرارية احترافية مع التوصيل.' },
  filterByCat: { fr: 'Filtrer par catégorie', ar: 'التصفية حسب الفئة' },
  allCategories: { fr: 'Toutes les catégories', ar: 'جميع الفئات' },
  sortBy: { fr: 'Trier par', ar: 'ترتيب حسب' },
  sortPopular: { fr: 'Plus populaires', ar: 'الأكثر شعبية' },
  sortPriceAsc: { fr: 'Prix croissant', ar: 'السعر: من الأقل للأعلى' },
  sortPriceDesc: { fr: 'Prix décroissant', ar: 'السعر: من الأعلى للأقل' },
  noProductsFound: { fr: 'Aucun produit trouvé', ar: 'لم يتم العثور على أي منتج' },
  resetFilters: { fr: 'Réinitialiser les filtres', ar: 'إعادة ضبط التصفية' },

  // Cart Page
  yourCart: { fr: 'Votre Panier', ar: 'سلة التسوق' },
  cartItemsCount: { fr: 'articles dans votre panier', ar: 'منتجات في سلتك' },
  emptyCart: { fr: 'Votre panier est vide', ar: 'سلة التسوق فارغة' },
  emptyCartSub: { fr: 'Découvrez nos appareils de coiffure professionnels et profitez de la livraison 58 Wilayas.', ar: 'تصفحي أجهزة التصفيف الاحترافية واستفيدي من التوصيل لجميع الولايات.' },
  continueShopping: { fr: 'Continuer vos achats', ar: 'مواصلة التسوق' },
  clearCart: { fr: 'Vider le panier', ar: 'تفريغ السلة' },
  orderSummary: { fr: 'Récapitulatif de la commande', ar: 'ملخص الطلبية' },
  subtotal: { fr: 'Sous-total', ar: 'المجموع الفرعي' },
  estimatedShipping: { fr: 'Livraison estimée', ar: 'مصاريف التوصيل' },
  calcAtCheckout: { fr: 'Calculée selon la wilaya', ar: 'تحسب حسب الولاية' },
  freeShippingQualified: { fr: 'Livraison Gratuite qualifiée !', ar: 'توصيل مجاني لطلبك!' },
  total: { fr: 'Total', ar: 'المجموع الإجمالي' },
  proceedToCheckout: { fr: 'Passer la commande', ar: 'إتمام الطلب' },
  codGuaranteedNote: { fr: 'Paiement à la livraison après vérification du colis', ar: 'الدفع نقداً عند الاستلام بعد معاينة الطرد' },

  // Checkout Page
  checkoutTitle: { fr: 'Validation de la Commande', ar: 'تأكيد وشحن الطلبية' },
  checkoutSub: { fr: 'Remplissez vos informations de livraison. Règlement en espèces à la réception.', ar: 'ادخلي معلومات التوصيل. الدفع نقداً عند الاستلام.' },
  customerInfoStep: { fr: '1. Informations Personnelles', ar: '1. المعلومات الشخصية' },
  fullName: { fr: 'Nom & Prénom complet', ar: 'الاسم واللقب الكامل' },
  fullNamePlaceholder: { fr: 'Ex: Sarah Amrani', ar: 'مثال: سارة عمراني' },
  phone: { fr: 'Numéro de Téléphone (Mobile)', ar: 'رقم الهاتف المحمول' },
  phonePlaceholder: { fr: 'Ex: 0550 12 34 56', ar: 'مثال: 0550123456' },
  wilayaStep: { fr: '2. Adresse & Wilaya de Livraison', ar: '2. ولاية وعنوان التوصيل' },
  selectWilaya: { fr: 'Sélectionnez votre Wilaya', ar: 'اختر الولاية' },
  commune: { fr: 'Commune / Ville', ar: 'البلدية / المدينة' },
  communePlaceholder: { fr: 'Ex: Bab Ezzouar, Es Senia...', ar: 'مثال: باب الزوار، السانية...' },
  fullAddress: { fr: 'Adresse exacte de livraison', ar: 'العنوان التفصيلي' },
  addressPlaceholder: { fr: 'Ex: Cité EPLF Villa N°42', ar: 'مثال: حي 1000 مسكن عمارة أ' },
  deliveryTypeStep: { fr: '3. Mode de Livraison', ar: '3. طريقة التوصيل' },
  homeDeliveryOpt: { fr: 'Livraison à Domicile', ar: 'توصيل إلى غاية المنزل' },
  homeDeliverySub: { fr: 'Le livreur vous appelle avant d\'arriver chez vous', ar: 'يتصل بك الموزع قبل الوصول إلى منزلك' },
  agencyDeliveryOpt: { fr: 'Livraison en Agence / Bureau', ar: 'استلام من مكتب التوصيل' },
  agencyDeliverySub: { fr: 'Récupérez votre colis dans le bureau de livraison le plus proche', ar: 'استلم طلبيتك من أقرب مكتب توصيل' },
  confirmOrderBtn: { fr: 'Confirmer Ma Commande (Paiement à la livraison)', ar: 'تأكيد الطلب الآن (الدفع عند الاستلام)' },
  orderProcessing: { fr: 'Traitement de votre commande...', ar: 'جاري تسجيل طلبك...' },

  // Order Confirmation Page
  orderSuccessTitle: { fr: 'Commande Confirmée !', ar: 'تم تأكيد طلبك بنجاح!' },
  orderSuccessSub: { fr: 'Merci pour votre confiance. Notre service client vous contactera par téléphone pour valider l\'expédition.', ar: 'شكراً لثقتكم. سيتصل بك فريقنا هاتفياً لتأكيد الشحن.' },
  orderNumberLabel: { fr: 'Numéro de Commande', ar: 'رقم الطلب' },
  customerDetails: { fr: 'Coordonnées du Destinataire', ar: 'بيانات المستلم' },
  itemsOrdered: { fr: 'Produits Commandés', ar: 'المنتجات المطلوبة' },
  trackOrderBtn: { fr: 'Suivre ma commande', ar: 'تتبع حالة الطلب' },
  downloadInvoiceBtn: { fr: 'Imprimer la facture / Bon de livraison', ar: 'طباعة الفاتورة / وصل التسليم' },

  // Order Tracking Page
  trackOrderTitle: { fr: 'Suivi de Commande en Direct', ar: 'تتبع الطلب مباشرة' },
  trackOrderSub: { fr: 'Saisissez votre numéro de commande et votre numéro de téléphone.', ar: 'أدخلي رقم الطلب ورقم الهاتف لتتبع الشحنة.' },
  orderNumberInput: { fr: 'Numéro de Commande (ex: CMD-2026-000001)', ar: 'رقم الطلب (مثال: CMD-2026-000001)' },
  searchOrderBtn: { fr: 'Rechercher Ma Commande', ar: 'بحث عن الطلب' },
  orderStatusTitle: { fr: 'Statut Actuel de la Commande', ar: 'الحالة الحالية للطلب' },

  // Order Statuses
  statusNouvelle: { fr: 'Nouvelle', ar: 'طلب جديد' },
  statusAConfirmer: { fr: 'À confirmer', ar: 'قيد التأكيد الهاتفي' },
  statusConfirmee: { fr: 'Confirmée', ar: 'تم التأكيد' },
  statusEnPreparation: { fr: 'En préparation', ar: 'قيد التجهيز' },
  statusExpediee: { fr: 'Expédiée', ar: 'تم الشحن' },
  statusEnLivraison: { fr: 'En livraison', ar: 'خرج للتوصيل' },
  statusLivree: { fr: 'Livrée', ar: 'تم التسليم' },
  statusAnnulee: { fr: 'Annulée', ar: 'ملغاة' },

  // Contact Page
  contactTitle: { fr: 'Contactez-Nous', ar: 'اتصلي بنا' },
  contactSub: { fr: 'Une question sur un lisseur, un sèche-cheveux ou votre commande ? Notre équipe est à votre écoute 7j/7.', ar: 'لديك استفسار حول جهاز أو حول طلبك؟ فريقنا في خدمتك طيلة أيام الأسبوع.' },
  ourPhone: { fr: 'Téléphones', ar: 'الهاتف' },
  ourWhatsapp: { fr: 'WhatsApp Direct', ar: 'واتساب مباشر' },
  ourLocation: { fr: 'Notre Adresse', ar: 'عنواننا' },
  workHours: { fr: 'Heures d\'ouverture', ar: 'ساعات العمل' },
  workHoursVal: { fr: '7J/7 de 09:00 à 21:00', ar: '7/7 من 09:00 صباحاً إلى 09:00 مساءً' },
  sendMessageTitle: { fr: 'Envoyez-nous un message', ar: 'أرسلي لنا رسالة' },
  yourMessage: { fr: 'Votre Message', ar: 'رسالتك' },
  sendBtn: { fr: 'Envoyer le message', ar: 'إرسال الرسالة' },

  // Trust Badges & Footer
  delivery58: { fr: "58 Wilayas d'Algérie", ar: '58 ولاية في الجزائر' },
  delivery58Sub: { fr: 'Livraison à domicile & bureau', ar: 'توصيل للمنزل والمكتب' },
  codTitle: { fr: 'Paiement à la Livraison', ar: 'الدفع عند الاستلام' },
  codSub: { fr: 'Vérifiez avant de payer en espèces', ar: 'افحص طلبيتك قبل الدفع نقداً' },
  guarantee: { fr: 'Garantie & Authenticité', ar: 'ضمان وأصالة' },
  guaranteeSub: { fr: '1 à 2 ans de garantie certifiée', ar: 'ضمان موثوق لمدة سنة إلى سنتين' },
  support7d: { fr: 'Service Client 7J/7', ar: 'خدمة الزبائن 7/7' },
  support7dSub: { fr: 'Support par téléphone & WhatsApp', ar: 'دعم عبر الهاتف والواتساب' },
  ourCategories: { fr: 'Nos Rayons', ar: 'أقسامنا' },
  helpTracking: { fr: 'Aide & Suivi', ar: 'المساعدة والتتبع' },
  contactDetails: { fr: 'Coordonnées', ar: 'معلومات الاتصال' },
  copyright: { fr: "Élégance Hair Algérie. Tous droits réservés.", ar: 'إليجانس هير الجزائر. جميع الحقوق محفوظة.' }
};

// Exact Arabic Translations for Products
const ARABIC_PRODUCT_MAP: Record<string, Partial<Product>> = {
  'prod-001': {
    name: 'مجفف شعر احترافي أيوني 2400 واط فائق السرعة',
    categoryName: 'مجففات الشعر',
    brand: 'إليجانس برو',
    shortDesc: 'مجفف شعر احترافي بقدرة 2400 واط مع تكنولوجيا الأيونات المضادة للتجعد ومحرك AC طويل الأمد.',
    fullDesc: 'اكتشفي قوة الصالون في المنزل مع مجفف الشعر إليجانس برو 2400 واط. مزود بمولد أيونات سالبة عالي التركيز يقضي على الشحنات الكهربائية ويحافظ على الرطوبة الطبيعية للشعر. يأتي مع رأسين للتركيز وموزع كيرلي.',
    warranty: 'ضمان لمدة سنتين مع استبدال بجديد',
    power: '2400 واط',
    color: 'أسود مطفي / ذهبي وردي',
    temperature: '3 مستويات حرارة + زر الهواء البارد',
    speed: 'سرعتان فائقتان للهواء',
    techSpecs: [
      'محرك احترافي AC عالي التحمل',
      'تقنية Ionic Shield المضادة للتجعد',
      'سلك احترافي بطول 2.8 متر يدور 360 درجة',
      'شبكة خلفية قابلة للفك للتنظيف السهل',
      'وزن متوازن 580غ لسهولة الاستخدام'
    ],
    boxContent: [
      '1x مجفف شعر احترافي 2400 واط',
      '2x رؤوس تركيز رفيعة (6 مم و 8 مم)',
      '1x موزع هواء خاص للشعر الكيرلي',
      '1x حقيبة تخزين مخملية',
      '1x دليل الاستخدام وكرت الضمان'
    ]
  },
  'prod-002': {
    name: 'مملس شعر احترافي تيتانيوم سيراميك 250° مئوية',
    categoryName: 'أجهزة ألمملس',
    brand: 'إليجانس برو',
    shortDesc: 'مملس شعر بألواح تيتانيوم وسيراميك مع شاشة رقمية تصل لغاية 250° مئوية، مثالي لعلاج الكيراتين والبروتين.',
    fullDesc: 'مصمم خصيصاً للمحترفين ولجلسات الكيراتين والبروتين، يصل هذا الجهاز إلى درجة الحرارة المطلوبة في أقل من 15 ثانية. ألواح التيتانيوم توزع الحرارة بانتظام لشعر ناعم ولامع كالمآثر.',
    warranty: 'ضمان لمدة سنتين',
    power: '65 واط',
    color: 'وردي ذهبي معدني',
    temperature: 'قابل للتعديل من 130°م إلى 250°م (شاشة LCD)',
    speed: 'تسخين فائق السرعة خلال 15 ثانية',
    techSpecs: [
      'ألواح تيتانيوم مصقولة طويلة جداً (110 × 28 مم)',
      'نظام ذكي لمراقبة الحرارة لمنع الحرق',
      'إيقاف تلقائي للأمان بعد 60 دقيقة',
      'قفل الألواح لسهولة التنقل',
      'جهد عالمي مزدوج 110V - 240V'
    ],
    boxContent: [
      '1x مملس شعر تيتانيوم برو 250°م',
      '1x عازل/حقيبة مقاومة للحرارة',
      '2x ملقط شعر احترافي',
      '1x مشط تقسيم مضاد للشحنات'
    ]
  },
  'prod-003': {
    name: 'مصفف شعر متعدد الاستخدامات 5 في 1 أير ستايلنج',
    categoryName: 'مصففات متعددة',
    brand: 'إليجانس لوكس',
    shortDesc: 'طقم مصفف شعر بالهواء مع رؤوس قابلة للتغيير: تجفيف، تنعيم، تمويج تلقائي وتكثيف.',
    fullDesc: 'مجموعة التصفيف المكتملة! يستخدم تدفق الهواء الأيوني (تأثير كواندا) لتدوير الشعر وتمويجه تلقائياً بدون حرارة مفرطة. غير الرؤوس بضغطة واحدة لتسريحة جذابة وناعمة.',
    warranty: 'ضمان لمدة سنتين',
    power: '1200 واط',
    color: 'برونزي وشامبانيا',
    temperature: '3 مستويات حرارة + هواء بارد',
    speed: 'محرك رقمي V9 بسرعة 110,000 دورة/دقيقة',
    techSpecs: [
      'تقنية تدفق الهواء الأيوني الدوار',
      'تحكم ذكي في الحرارة يقاس 40 مرة/ثانية',
      'رؤوس مغناطيسية قابلة للتغيير مع قفل أمان',
      'تصميم مريح وخفيف الوزن'
    ],
    boxContent: [
      '1x قاعدة المحرك عالية الأداء',
      '2x بكرات تمويج متناظرة (30مم و 40مم)',
      '1x فرشاة تنعيم صلبة',
      '1x فرشاة تكثيف دائرية',
      '1x رأس تجفيف سريع',
      '1x صندوق فاخر من الجلد الصناعي'
    ]
  },
  'prod-004': {
    name: 'فرشاة حرارية لتنعيم الشعر سيلك بروش',
    categoryName: 'فرش حرارية',
    brand: 'إليجانس بيوتي',
    shortDesc: 'فرشاة حرارية بسنان سيراميك ثلاثية الأبعاد وأيونات سالبة لتفكيك التشابك والتنعيم في 3 دقائق.',
    fullDesc: 'احصلي على شعر ناعم وطبيعي مع فرشاة سيلك بروش الحرارية. أسنان مضادة للحرق تحمي فروة رأسك بينما توزع تقنية السيراميك الحرارة بالتساوي.',
    warranty: 'ضمان لمدة سنة',
    power: '50 واط',
    color: 'أسود وذهبي',
    temperature: '150°م إلى 230°م',
    speed: 'تسخين فوري خلال 30 ثانية',
    techSpecs: [
      'أسنان سيراميك 3D عالية الكثافة',
      'رؤوس عازلة مضادة للحرق',
      'شاشة LED لعرض درجة الحرارة',
      'إيقاف تلقائي بعد 30 دقيقة'
    ],
    boxContent: [
      '1x فرشاة حرارية سيلك بروش',
      '1x قفاز حماية حراري',
      '1x حقيبة سفر'
    ]
  },
  'prod-005': {
    name: 'فرشاة دوارة حرارية بالكيراتين والارغان 1000 واط',
    categoryName: 'فرش حرارية',
    brand: 'إليجانس برو',
    shortDesc: 'فرشاة دوارة بالاتجاهين مطلية بالكيراتين وزيت الأرغان لتصفيف راقٍ وحجم مميز.',
    fullDesc: 'احصلي على نتائج الصالون بدون مجهود. الدوران التلقائي المزدوج يسمح بتشكيل الجذور والأطراف حسب رغبتك أثناء تجفيف الشعر.',
    warranty: 'ضمان لمدة سنة',
    power: '1000 واط',
    color: 'أبيض لؤلؤي وذهبي',
    temperature: 'مستويان للحرارة والسرعة + هواء بارد',
    speed: 'دوران مزدوج الاتجاه قابل للتعديل',
    techSpecs: [
      'طلاء غني بالكيراتين والأرغان',
      '2 فرشاة قابلة للتغيير (50 مم و 38 مم)',
      'مولد أيونات مضاعف القوة',
      'سلك دوار 360 درجة'
    ],
    boxContent: [
      '1x فرشاة دوارة 1000 واط',
      '1x رأس فرشاة دائرية 50 مم',
      '1x رأس فرشاة دائرية 38 مم',
      '2x واقي فرشاة صلب'
    ]
  },
  'prod-006': {
    name: 'جهاز تمويج الشعر التلقائي اللاسلكي',
    categoryName: 'أجهزة التمويج',
    brand: 'إليجانس تيك',
    shortDesc: 'جهاز تمويج تلقائي لاسلكي قابل للشحن عبر USB مع حجرة سيراميك ذكية.',
    fullDesc: 'اصنعي تمويجات رائعة في أي مكان وفي أي وقت! ضعي خصلة شعر في حجرة السيراميك، اضغطي على الزر ودعي الجهاز يقوم بالباقي تلقائياً.',
    warranty: 'ضمان لمدة سنة',
    power: 'بطارية ليثيوم 5200mAh (60 دقيقة تشغيل)',
    color: 'رمادي وذهبي وردي',
    temperature: '150°م إلى 200°م (تعديل الاتجاه يمين/يسار)',
    speed: 'مؤقت من 8 ثوانٍ إلى 18 ثانية',
    techSpecs: [
      'حجرة تمويج معزولة مع منع التشابك',
      'شاشة LCD واضحة',
      'شحن سريع عبر كابل USB-C',
      'خاصية شاحن متنقل مدمج'
    ],
    boxContent: [
      '1x جهاز تمويج تلقائي لاسلكي',
      '1x كابل شحن USB-C',
      '1x حقيبة تخزين فاخرة',
      '2x ملاقط شعر',
      '1x مشط تقسيم'
    ]
  },
  'prod-007': {
    name: 'مملس الشعر البخاري الاحترافي بالأشعة تحت الحمراء 230°م',
    categoryName: 'أجهزة احترافية',
    brand: 'إليجانس برو',
    shortDesc: 'مملس شعر بالبخار مع خزان مدمج وتقنية الأشعة تحت الحمراء لأقصى درجات الترطيب.',
    fullDesc: 'بخار الماء يرطب ألياف الشعر قبل مرور الألواح الساخنة، مما يقلل الضرر بنسبة 80%. مثالي للشعر الخشن، الكثيف أو المجهد.',
    warranty: 'ضمان لمدة سنتين',
    power: '85 واط',
    color: 'أسود لامع احترافي',
    temperature: '150°م إلى 230°م (5 مستويات)',
    speed: 'تدفق بخار مستمر قابل للتعديل',
    techSpecs: [
      'خزان مماء منزع 40مل',
      'مشط قابل للفك مدمج بالألواح',
      'ألواح سيراميك عريضة 35 مم',
      'تقنية الأشعة تحت الحمراء المعالجة'
    ],
    boxContent: [
      '1x مملس بخاري ستيم برو',
      '1x قارورة قياس ماء',
      '1x مشط بديل',
      '1x قفاز حماية حراري'
    ]
  },
  'prod-008': {
    name: 'طقم ملحقات التصفيف وبخاخ الحماية الحرارية',
    categoryName: 'إكسسوارات',
    brand: 'إليجانس كير',
    shortDesc: 'طقم كامل: بخاخ حماية من الحرارة 200مل، فرشاة مريحة، 4 ملاقط وقفاز حراري.',
    fullDesc: 'احمي شعرك من الحرارة العالية لغاية 230°م قبل استخدام المجفف أو المملكة بفضل بخاخنا الغني بزيت الأرغان وپروتينات الحرير.',
    warranty: 'جودة معتمدة',
    power: 'غير محدد',
    color: 'وردي ناعم',
    temperature: 'غير محدد',
    speed: 'غير محدد',
    techSpecs: [
      'بخاخ حراري 200مل خالي من البارابين',
      'فرشاة مريحة للتفكيك بدون كسر',
      'ملاقط شعر عالية الضغط',
      'قفاز حراري حتى 250°م'
    ],
    boxContent: [
      '1x بخاخ حماية حرارية 200مل',
      '1x فرشاة مريحة',
      '4x ملاقط شعر',
      '1x قفاز حراري',
      '1x حقيبة شفافة مقاومة للماء'
    ]
  }
};

// Category Arabic Map
const ARABIC_CATEGORY_MAP: Record<string, Partial<Category>> = {
  'cat-seche-cheveux': { name: 'مجففات الشعر', description: 'مجففات شعر احترافية أيونية فائقة القوة لتجفيف سريع وحماية ألياف الشعر.' },
  'seche-cheveux': { name: 'مجففات الشعر', description: 'مجففات شعر احترافية أيونية فائقة القوة لتجفيف سريع وحماية ألياف الشعر.' },
  'cat-lisseurs': { name: 'أجهزة ألمملس', description: 'أجهزة لسر وأدوات تصفيف بالسيراميك والتيتانيوم لتنعيم برازيلي مميز ولامع.' },
  'lisseurs': { name: 'أجهزة ألمملس', description: 'أجهزة لسر وأدوات تصفيف بالسيراميك والتيتانيوم لتنعيم برازيلي مميز ولامع.' },
  'cat-brosses-chauffantes': { name: 'فرش حرارية', description: 'فرش حرارية وتنعيم لتصفيف سريع ومثالي خلال دقائق قليلة.' },
  'brosses-chauffantes': { name: 'فرش حرارية', description: 'فرش حرارية وتنعيم لتصفيف سريع ومثالي خلال دقائق قليلة.' },
  'cat-brosses-soufflantes': { name: 'فرش دوارة', description: 'فرش دوارة أيونية لإعطاء حجم وتصفيف جذاب للشعر.' },
  'brosses-soufflantes': { name: 'فرش دوارة', description: 'فرش دوارة أيونية لإعطاء حجم وتصفيف جذاب للشعر.' },
  'cat-boucleurs': { name: 'أجهزة التمويج', description: 'أجهزة تمويج أوتوماتيكية لتسريحات كيرلي متناسقة وطويلة الثبات.' },
  'boucleurs': { name: 'أجهزة التمويج', description: 'أجهزة تمويج أوتوماتيكية لتسريحات كيرلي متناسقة وطويلة الثبات.' },
  'cat-multistylers': { name: 'مصففات متعددة', description: 'أجهزة متعددة الوظائف 5 في 1 للتجفيف، التنعيم والتمويج.' },
  'multistylers': { name: 'مصففات متعددة', description: 'أجهزة متعددة الوظائف 5 في 1 للتجفيف، التنعيم والتمويج.' },
  'cat-professionnels': { name: 'أجهزة احترافية', description: 'معدات أداء عالي مصممة خصيصاً لصالونات التجميل والحلاقة.' },
  'appareils-professionnels': { name: 'أجهزة احترافية', description: 'معدات أداء عالي مصممة خصيصاً لصالونات التجميل والحلاقة.' },
  'cat-accessoires': { name: 'إكسسوارات', description: 'موزعات هواء، بخاخات حماية حرارية وحقائب لحفظ الأجهزة.' },
  'accessoires': { name: 'إكسسوارات', description: 'موزعات هواء، بخاخات حماية حرارية وحقائب لحفظ الأجهزة.' },
  'cat-promotions': { name: 'التخفيضات', description: 'استفيدي من تخفيضات حصرية تصل حتى -40% على أفضل أجهزة الشعر.' },
  'promotions': { name: 'التخفيضات', description: 'استفيدي من تخفيضات حصرية تصل حتى -40% على أفضل أجهزة الشعر.' }
};

export function translateCategory(cat: Category, isAr: boolean): Category {
  if (!isAr) return cat;

  const found = ARABIC_CATEGORY_MAP[cat.id] || ARABIC_CATEGORY_MAP[cat.slug];
  if (found) {
    return {
      ...cat,
      name: found.name || cat.name,
      description: found.description || cat.description
    };
  }
  return cat;
}

export function translateProduct(p: Product, isAr: boolean): Product {
  if (!isAr) return p;

  const found = ARABIC_PRODUCT_MAP[p.id];
  if (found) {
    return {
      ...p,
      name: found.name || p.name,
      categoryName: found.categoryName || p.categoryName,
      brand: found.brand || p.brand,
      shortDesc: found.shortDesc || p.shortDesc,
      fullDesc: found.fullDesc || p.fullDesc,
      warranty: found.warranty || p.warranty,
      power: found.power || p.power,
      color: found.color || p.color,
      temperature: found.temperature || p.temperature,
      speed: found.speed || p.speed,
      techSpecs: found.techSpecs || p.techSpecs,
      boxContent: found.boxContent || p.boxContent
    };
  }

  // Generic fallback translation for any dynamically added products
  return {
    ...p,
    categoryName: p.categoryName ? (ARABIC_CATEGORY_MAP[p.categoryId]?.name || p.categoryName) : p.categoryName
  };
}
