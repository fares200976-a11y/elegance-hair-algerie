import { Category, Product, ShopSettings, Review } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-seche-cheveux',
    name: 'Sèche-cheveux',
    slug: 'seche-cheveux',
    description: 'Sèche-cheveux professionnels ioniques puissants pour un séchage rapide sans abîmer la fibre capillaire.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    productCount: 4
  },
  {
    id: 'cat-lisseurs',
    name: 'Lisseurs',
    slug: 'lisseurs',
    description: 'Lisseurs et fers à lisser en céramique et tourmaline pour un lissage brésilien impeccable et brillant.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
    productCount: 4
  },
  {
    id: 'cat-brosses-chauffantes',
    name: 'Brosses chauffantes',
    slug: 'brosses-chauffantes',
    description: 'Brosses chauffantes et lissantes pour un brushing parfait en quelques minutes.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
    productCount: 3
  },
  {
    id: 'cat-brosses-soufflantes',
    name: 'Brosses soufflantes',
    slug: 'brosses-soufflantes',
    description: 'Brosses soufflantes rotatives ioniques pour donner du volume et sculpter vos cheveux.',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
    productCount: 3
  },
  {
    id: 'cat-boucleurs',
    name: 'Fers à boucler',
    slug: 'boucleurs',
    description: 'Fers à boucler et boucleurs automatiques pour des boucles définies et longue tenue.',
    image: 'https://images.unsplash.com/photo-1584297091622-af8e5cb8568d?w=800&q=80',
    productCount: 3
  },
  {
    id: 'cat-multistylers',
    name: 'Multistylers',
    slug: 'multistylers',
    description: 'Appareils multifonctions 5-en-1 pour sécher, lisser, boucler et donner du volume.',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
    productCount: 2
  },
  {
    id: 'cat-professionnels',
    name: 'Appareils professionnels',
    slug: 'appareils-professionnels',
    description: 'Équipements haute performance conçus pour les coiffeurs et salons de beauté.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    productCount: 3
  },
  {
    id: 'cat-accessoires',
    name: 'Accessoires',
    slug: 'accessoires',
    description: 'Diffuseurs, embouts de précision, pochettes thermiques et sérums protecteurs.',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80',
    productCount: 2
  },
  {
    id: 'cat-promotions',
    name: 'Promotions',
    slug: 'promotions',
    description: 'Profitez de réductions exclusives jusqu\'à -40% sur nos meilleurs appareils de coiffure.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    productCount: 5
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Sèche-Cheveux Professionnel Ionique 2400W Ultra-Fast',
    slug: 'seche-cheveux-professionnel-ionique-2400w',
    categoryId: 'cat-seche-cheveux',
    categoryName: 'Sèche-cheveux',
    brand: 'Élégance Pro',
    skuRef: 'EL-DRY-2400',
    shortDesc: 'Sèche-cheveux professionnel 2400W avec technologie ionique anti-frisottis et moteur AC longue durée.',
    fullDesc: 'Découvrez la puissance salon à domicile avec le Sèche-Cheveux Élégance Pro 2400W. Équipé d\'un générateur d\'ions négatifs haute concentration, il élimine l\'électricité statique et préserve l\'hydratation naturelle des cheveux. Livré avec 2 concentrateurs de précision et un diffuseur de volume.',
    price: 8900,
    oldPrice: 11500,
    isPromo: true,
    stock: 18,
    minStock: 5,
    warranty: '2 ans de garantie avec échange à neuf',
    power: '2400 Watts',
    color: 'Noir Mat / Or Rose',
    temperature: '3 niveaux de température + Touche Air Froid',
    speed: '2 vitesses d\'air ultra-puissantes',
    techSpecs: [
      'Moteur professionnel AC ultra-résistant',
      'Technologie Ionic Shield anti-frisottis',
      'Cordon professionnel de 2.8m rotatif 360°',
      'Grille arrière amovible pour nettoyage facile',
      'Poids équilibré 580g pour une manipulation aisée'
    ],
    boxContent: [
      '1x Sèche-Cheveux Pro 2400W',
      '2x Embouts concentrateurs fins (6mm & 8mm)',
      '1x Diffuseur spécial cheveux bouclés',
      '1x Pochette de rangement en velours',
      '1x Manuel d\'utilisation & Carte de garantie'
    ],
    images: [
      '/src/assets/images/seche_cheveux_pro_1786185879830.jpg',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80'
    ],
    isFeatured: true,
    isNew: true,
    status: 'active',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'Lisseur Professionnel Titanium Ceramic 250°C Pro-Smooth',
    slug: 'lisseur-professionnel-titanium-ceramic-250c',
    categoryId: 'cat-lisseurs',
    categoryName: 'Lisseurs',
    brand: 'Élégance Pro',
    skuRef: 'EL-STRAIGHT-250',
    shortDesc: 'Lisseur plaques flottantes en titane-céramique avec écran numérique jusqu\'à 250°C, idéal pour soins protéines et kératine.',
    fullDesc: 'Conçu spécifiquement pour les professionnels et le lissage brésilien, ce lisseur haut de gamme monte en température en moins de 15 secondes. Les plaques en titane diffusent une chaleur constante sans abîmer les pointes. Obtenez une chevelure ultra-lisse et miroitante dès le premier passage.',
    price: 9800,
    oldPrice: 12900,
    isPromo: true,
    stock: 14,
    minStock: 4,
    warranty: '2 ans de garantie',
    power: '65 Watts',
    color: 'Rose Gold Metallic',
    temperature: 'Réglable de 130°C à 250°C (Écran LCD)',
    speed: 'Chauffe ultra-rapide en 15s',
    techSpecs: [
      'Plaques extra-longues en Titane Miroir (110 x 28 mm)',
      'Système Smart Heat Control anti-brûlure',
      'Arrêt automatique de sécurité après 60 minutes',
      'Verrouillage des plaques pour transport facile',
      'Bi-voltage universel 110V - 240V'
    ],
    boxContent: [
      '1x Lisseur Titane Pro 250°C',
      '1x Tapis/Pochette thermorésistante',
      '2x Pinces à cheveux croco professionnelles',
      '1x Peigne de séparation antistatique'
    ],
    images: [
      '/src/assets/images/lisseur_titanium_1786185890552.jpg',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80'
    ],
    isFeatured: true,
    isNew: true,
    status: 'active',
    createdAt: '2026-08-02T11:00:00Z'
  },
  {
    id: 'prod-003',
    name: 'Multistyler 5-en-1 AirStyling Complete Set',
    slug: 'multistyler-5-en-1-airstyling-complete-set',
    categoryId: 'cat-multistylers',
    categoryName: 'Multistylers',
    brand: 'Élégance Luxe',
    skuRef: 'EL-MULTI-5in1',
    shortDesc: 'Kit multistyler à flux d\'air avec embouts interchangeables : séchage, lissage, boucles automatique et volume.',
    fullDesc: 'Le coffret de coiffure ultime ! Ce multistyler utilise la force de l\'air ionique (effet Coanda) pour enrouler et boucler les cheveux automatiquement sans chaleur extrême. Changez d\'embout en un clic pour réaliser un brushing volumineux, un lissage soyeux ou des boucles glamours.',
    price: 18500,
    oldPrice: 22000,
    isPromo: true,
    stock: 8,
    minStock: 3,
    warranty: '2 ans de garantie',
    power: '1200 Watts',
    color: 'Bronze & Champagne',
    temperature: '3 niveaux de chaleur + air frais',
    speed: 'Moteur numérique V9 110 000 tr/min',
    techSpecs: [
      'Technologie de flux d\'air ionique rotatif',
      'Contrôle intelligent de température mesuré 40x/sec',
      'Embouts interchangeables aimantés avec sécurité',
      'Design ergonomique ultra-léger'
    ],
    boxContent: [
      '1x Base moteur haute performance',
      '2x Rouleaux boucleurs symétriques (30mm & 40mm)',
      '1x Brosse lissante rigide',
      '1x Brosse volumisante ronde',
      '1x Sèche-cheveux pré-séchage rapide',
      '1x Coffret rigide de luxe en cuir PU'
    ],
    images: [
      '/src/assets/images/multistyler_5in1_1786185902351.jpg',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80'
    ],
    isFeatured: true,
    isNew: true,
    status: 'active',
    createdAt: '2026-08-03T09:30:00Z'
  },
  {
    id: 'prod-004',
    name: 'Brosse Chauffante Lissante Ionique SilkBrush',
    slug: 'brosse-chauffante-lissante-ionique-silkbrush',
    categoryId: 'cat-brosses-chauffantes',
    categoryName: 'Brosses chauffantes',
    brand: 'Élégance Beauty',
    skuRef: 'EL-BRUSH-ION',
    shortDesc: 'Brosse lissante à picots en céramique 3D et ions négatifs pour un démêlage et lissage express en 3 minutes.',
    fullDesc: 'Obtenez un lissage naturel plein de mouvement avec la brosse chauffante SilkBrush. Ses picots anti-brûlure protègent votre cuir chevelu tandis que la technologie céramique garantit une répartition uniforme de la chaleur.',
    price: 6500,
    oldPrice: 8200,
    isPromo: true,
    stock: 25,
    minStock: 5,
    warranty: '1 an de garantie',
    power: '50 Watts',
    color: 'Noir & Doré',
    temperature: '150°C à 230°C',
    speed: 'Chauffe instantanée 30s',
    techSpecs: [
      'Picots céramiques 3D haute densité',
      'Embouts isolants anti-brûlure',
      'Afficheur LED de température',
      'Arrêt automatique après 30 min'
    ],
    boxContent: [
      '1x Brosse Chauffante SilkBrush',
      '1x Gant de protection thermique',
      '1x Pochette de voyage'
    ],
    images: [
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80'
    ],
    isFeatured: false,
    isNew: false,
    status: 'active',
    createdAt: '2026-08-04T14:00:00Z'
  },
  {
    id: 'prod-005',
    name: 'Brosse Soufflante Rotative Keratin Volume 1000W',
    slug: 'brosse-soufflante-rotative-keratin-volume-1000w',
    categoryId: 'cat-brosses-soufflantes',
    categoryName: 'Brosses soufflantes',
    brand: 'Élégance Pro',
    skuRef: 'EL-ROT-1000',
    shortDesc: 'Brosse soufflante rotative dans les 2 sens avec revêtement Kératine & Huile d\'Argan pour un brushing glamour.',
    fullDesc: 'Reproduisez les gestes de votre coiffeur sans effort. La rotation automatique multidirectionnelle permet de façonner les racines et les pointes selon vos envies tout en séchant simultanément vos cheveux.',
    price: 7800,
    oldPrice: 9500,
    isPromo: true,
    stock: 12,
    minStock: 4,
    warranty: '1 an de garantie',
    power: '1000 Watts',
    color: 'Blanc Nacre & Or',
    temperature: '2 réglages température/vitesse + Touche Fresh Air',
    speed: 'Rotation bidirectionnelle à vitesse réglable',
    techSpecs: [
      'Revêtement Kératine & Argan infusé',
      '2 brosses interchangeables (50mm et 38mm)',
      'Générateur ionique double puissance',
      'Cordon rotatif 360°'
    ],
    boxContent: [
      '1x Brosse rotative 1000W',
      '1x Embout brosse ronde 50mm',
      '1x Embout brosse ronde 38mm',
      '2x Protège-brosses rigides'
    ],
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80'
    ],
    isFeatured: true,
    isNew: false,
    status: 'active',
    createdAt: '2026-08-04T16:00:00Z'
  },
  {
    id: 'prod-006',
    name: 'Fer à Boucler Automatique Sans Fil AutoCurl Wireless',
    slug: 'fer-a-boucler-automatique-sans-fil-autocurl-wireless',
    categoryId: 'cat-boucleurs',
    categoryName: 'Fers à boucler',
    brand: 'Élégance Tech',
    skuRef: 'EL-CURL-WIRELESS',
    shortDesc: 'Boucleur automatique rechargeable USB sans fil avec chambre de bouclage céramique intelligente.',
    fullDesc: 'Créez des boucles parfaites n\'importe où et en tout temps ! Placez une mèche de cheveux dans la chambre en céramique, appuyez sur le bouton et laissez l\'AutoCurl enrouler automatiquement vos cheveux. Bip sonore de fin de bouclage.',
    price: 7200,
    oldPrice: 8800,
    isPromo: false,
    stock: 3, // Stock faible pour test alerte!
    minStock: 5,
    warranty: '1 an de garantie',
    power: 'Batterie lithium 5200mAh (60 min d\'autonomie)',
    color: 'Gris Sidéral & Rose Gold',
    temperature: '150°C à 200°C (Réglage du sens gauche/droite)',
    speed: 'Minuteur de 8s à 18s',
    techSpecs: [
      'Chambre de bouclage isolée anti-mêlage',
      'Écran LCD intuitif',
      'Recharge rapide par câble USB-C',
      'Fonction Powerbank intégrée'
    ],
    boxContent: [
      '1x Fer à boucler automatique sans fil',
      '1x Câble de recharge USB-C',
      '1x Sacoche de transport luxe',
      '2x Pinces à cheveux',
      '1x Peigne de séparation'
    ],
    images: [
      'https://images.unsplash.com/photo-1584297091622-af8e5cb8568d?w=800&q=80'
    ],
    isFeatured: false,
    isNew: true,
    status: 'active',
    createdAt: '2026-08-05T09:00:00Z'
  },
  {
    id: 'prod-007',
    name: 'Lisseur à Vapeur Professionnel SteamPro Infra-Red 230°C',
    slug: 'lisseur-a-vapeur-professionnel-steampro-infra-red-230c',
    categoryId: 'cat-professionnels',
    categoryName: 'Appareils professionnels',
    brand: 'Élégance Pro',
    skuRef: 'EL-STEAM-230',
    shortDesc: 'Lisseur vapeur continu avec réservoir intégré et technologie infrarouge pour une hydratation maximale.',
    fullDesc: 'La vapeur d\'eau adoucit la fibre capillaire avant le passage des plaques chaudes, réduisant les dommages de 80% par rapport à un lisseur conventionnel. Idéal pour cheveux très crépus, épais ou abîmés.',
    price: 13500,
    oldPrice: 16000,
    isPromo: true,
    stock: 10,
    minStock: 3,
    warranty: '2 ans de garantie',
    power: '85 Watts',
    color: 'Noir Glossy Pro',
    temperature: '150°C à 230°C (5 niveaux)',
    speed: 'Débit vapeur continu réglable',
    techSpecs: [
      'Réservoir d\'eau déminéralisée amovible 40ml',
      'Peigne amovible intégré aux plaques',
      'Plaques céramiques larges 35mm',
      'Technologie Infrarouge réparatrice'
    ],
    boxContent: [
      '1x Lisseur Vapeur SteamPro',
      '1x Flacon doseur d\'eau déminéralisée',
      '1x Peigne amovible de remplacement',
      '1x Gant de protection thermique'
    ],
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80'
    ],
    isFeatured: true,
    isNew: false,
    status: 'active',
    createdAt: '2026-08-05T11:00:00Z'
  },
  {
    id: 'prod-008',
    name: 'Coffret Accessoires Coiffure & Protecteur Thermique Pro',
    slug: 'coffret-accessoires-coiffure-et-protecteur-thermique-pro',
    categoryId: 'cat-accessoires',
    categoryName: 'Accessoires',
    brand: 'Élégance Care',
    skuRef: 'EL-ACC-SET',
    shortDesc: 'Coffret complet : Spray protecteur de chaleur 200ml, brosse démêlante souple, 4 pinces croco & gant thermique.',
    fullDesc: 'Protégez vos cheveux de la chaleur jusqu\'à 230°C avant l\'utilisation de votre sèche-cheveux ou lisseur grâce à notre spray enrichi en huile d\'argan et protéines de soie.',
    price: 3200,
    oldPrice: 4200,
    isPromo: true,
    stock: 40,
    minStock: 10,
    warranty: 'Qualité certifiée',
    power: 'N/A',
    color: 'Rose Poudré',
    temperature: 'N/A',
    speed: 'N/A',
    techSpecs: [
      'Spray Thermo-Protecteur 200ml sans parabène',
      'Brosse souple spéciale démêlage doux sans casse',
      'Pinces croco haute pression antidérapantes',
      'Gant résistant jusqu\'à 250°C'
    ],
    boxContent: [
      '1x Spray Thermo-Protecteur 200ml',
      '1x Brosse ergonomique',
      '4x Pinces croco pro',
      '1x Gant thermique',
      '1x Trousse transparente imperméable'
    ],
    images: [
      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80'
    ],
    isFeatured: false,
    isNew: false,
    status: 'active',
    createdAt: '2026-08-06T10:00:00Z'
  }
];

export const INITIAL_SETTINGS: ShopSettings = {
  storeName: 'Élégance Hair Algérie',
  tagline: 'Appareils de coiffure professionnels haut de gamme',
  logoUrl: '',
  phone: '0550 12 34 56 / 0770 98 76 54',
  whatsappPhone: '213550123456',
  email: 'contact@elegancehair.dz',
  address: 'Cité 1000 Logements, Bab Ezzouar, Alger, Algérie',
  wilaya: '16 - Alger',
  facebookUrl: 'https://facebook.com/elegancehair.dz',
  instagramUrl: 'https://instagram.com/elegancehair.dz',
  tiktokUrl: 'https://tiktok.com/@elegancehair.dz',
  defaultHomeShippingFee: 500,
  defaultAgencyShippingFee: 300,
  freeShippingMinAmount: 25000,
  termsAndConditions: 'Tous nos produits sont garantis d\'origine avec possibilité de vérifier le colis à la livraison avant paiement. Paiement en espèces uniquement.',
  privacyPolicy: 'Vos données personnelles (nom, téléphone, adresse) sont strictement utilisées pour l\'expédition de votre commande en Algérie.'
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-001',
    productName: 'Sèche-Cheveux Professionnel Ionique 2400W Ultra-Fast',
    customerName: 'Amina B.',
    customerWilaya: '16 - Alger',
    rating: 5,
    comment: 'Sèche-cheveux très puissant ! Le séchage prend la moitié du temps par rapport à mon ancien. La livraison à Bab Ezzouar était rapide en 24h.',
    approved: true,
    createdAt: '2026-08-04T12:00:00Z'
  },
  {
    id: 'rev-02',
    productId: 'prod-002',
    productName: 'Lisseur Professionnel Titanium Ceramic 250°C Pro-Smooth',
    customerName: 'Yasmine K.',
    customerWilaya: '31 - Oran',
    rating: 5,
    comment: 'Je l\'ai utilisé pour mon lissage protéine en salon. Résultat incroyable ! Température exacte à 250°C. Je recommande les yeux fermés.',
    approved: true,
    createdAt: '2026-08-05T15:30:00Z'
  },
  {
    id: 'rev-03',
    productId: 'prod-003',
    productName: 'Multistyler 5-en-1 AirStyling Complete Set',
    customerName: 'Lina M.',
    customerWilaya: '25 - Constantine',
    rating: 5,
    comment: 'Franchement le meilleur coffret ! Les boucles tiennent toute la journée sans abîmer les cheveux. Le paiement à la livraison rassure beaucoup.',
    approved: true,
    createdAt: '2026-08-06T18:20:00Z'
  }
];
