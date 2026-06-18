import { generateId, readCollection, writeCollection } from './db'

// Seed data matching alhusseinvolunteeraward.jo reference site

export function seedDatabase() {

  // Seed Hero Slides
  if (readCollection('heroSlides').length === 0) {
    writeCollection('heroSlides', [
      {
        id: generateId(),
        title: 'جائزة الحسين بن عبدالله الثاني للعمل التطوعي',
        subtitle: 'تقدير العطاء وتشجيع العمل التطوعي في المجتمع الأردني',
        image: '/images/hero-1.jpg',
        link: '/about',
        linkText: 'اقرأ المزيد',
        order: 0,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'كن جزءاً من التغيير الإيجابي',
        subtitle: 'ساهم في بناء مجتمع أفضل من خلال العمل التطوعي',
        image: '/images/hero-2.jpg',
        link: '/categories',
        linkText: 'فئات الجائزة',
        order: 1,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  // Seed Navigation
  if (readCollection('navigation').length === 0) {
    writeCollection('navigation', [
      { id: generateId(), label: 'الرئيسية', url: '/', order: 0, active: true, target: '_self' },
      { id: generateId(), label: 'عن الجائزة', url: '/about', order: 1, active: true, target: '_self' },
      { id: generateId(), label: 'الفئات والشروط', url: '/categories', order: 2, active: true, target: '_self' },
      { id: generateId(), label: 'الفعاليات', url: '/events', order: 3, active: true, target: '_self' },
      { id: generateId(), label: 'الشركاء', url: '/partners', order: 4, active: true, target: '_self' },
      { id: generateId(), label: 'الجائزة الدولية', url: '/international', order: 5, active: true, target: '_self' },
    ])
  }

  // Seed News
  if (readCollection('news').length === 0) {
    writeCollection('news', [
      {
        id: generateId(),
        title: 'إطلاق الدورة الجديدة من جائزة الحسين للعمل التطوعي',
        slug: 'new-cycle-launch',
        summary: 'أعلنت أمانة جائزة الحسين بن عبدالله الثاني للعمل التطوعي عن إطلاق الدورة الجديدة من الجائزة',
        content: '<p>أعلنت أمانة جائزة الحسين بن عبدالله الثاني للعمل التطوعي عن إطلاق الدورة الجديدة من الجائزة، والتي تهدف إلى تكريم المتميزين في مجال العمل التطوعي والأهلي في المملكة الأردنية الهاشمية.</p><p>يمكن للراغبين بالمشاركة التقديم عبر الموقع الإلكتروني الرسمي للجائزة.</p>',
        image: '/images/news-1.jpg',
        featured: true,
        published: true,
        publishedAt: '2025-03-15T00:00:00.000Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'ورشة عمل تدريبية للمتطوعين',
        slug: 'volunteer-workshop',
        summary: 'تنظم أمانة الجائزة ورشة عمل تدريبية للمتطوعين في مختلف المحافظات',
        content: '<p>تنظم أمانة جائزة الحسين بن عبدالله الثاني للعمل التطوعي ورشة عمل تدريبية شاملة للمتطوعين في مختلف محافظات المملكة.</p><p>تهدف الورشة إلى تطوير مهارات المتطوعين وتعزيز قدراتهم في مجالات العمل التطوعي المختلفة.</p>',
        image: '/images/news-2.jpg',
        featured: true,
        published: true,
        publishedAt: '2025-02-20T00:00:00.000Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'توقيع اتفاقية شراكة مع منظمات دولية',
        slug: 'partnership-agreement',
        summary: 'وقعت أمانة الجائزة اتفاقية شراكة مع عدد من المنظمات الدولية',
        content: '<p>وقعت أمانة جائزة الحسين بن عبدالله الثاني للعمل التطوعي اتفاقية شراكة تعاون مع عدد من المنظمات الدولية العاملة في مجال العمل التطوعي.</p><p>تهدف الاتفاقية إلى تبادل الخبرات والتجارب في مجال التطوع وتعزيز التعاون الدولي.</p>',
        image: '/images/news-3.jpg',
        featured: true,
        published: true,
        publishedAt: '2025-01-10T00:00:00.000Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  // Seed Award Categories
  if (readCollection('awardCategories').length === 0) {
    writeCollection('awardCategories', [
      {
        id: generateId(),
        title: 'جائزة المتطوع المتميز',
        slug: 'outstanding-volunteer',
        description: 'تمنح للأفراد الذين أظهروا تميزاً ملحوظاً في العمل التطوعي وأسهموا بشكل فعّال في خدمة المجتمع',
        icon: '🏆',
        order: 0,
        active: true,
        criteria: '<p>يجب أن يكون المرشح قد ساهم في ما لا يقل عن 100 ساعة تطوعية خلال السنة</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'جائزة المؤسسة التطوعية',
        slug: 'volunteer-organization',
        description: 'تمنح للمؤسسات والمنظمات التي قدمت مساهمات بارزة في مجال العمل التطوعي',
        icon: '🏢',
        order: 1,
        active: true,
        criteria: '<p>يجب أن تكون المؤسسة قد نفذت ما لا يقل عن 5 مشاريع تطوعية خلال السنة</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'جائزة المبادرة التطوعية',
        slug: 'volunteer-initiative',
        description: 'تمنح للمبادرات التطوعية المبتكرة التي حققت أثراً إيجابياً ملموساً في المجتمع',
        icon: '💡',
        order: 2,
        active: true,
        criteria: '<p>يجب أن تكون المبادرة قد أثرت بشكل إيجابي على ما لا يقل عن 500 مستفيد</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'جائزة الشباب التطوعي',
        slug: 'youth-volunteer',
        description: 'تمنح للشباب الذين أبدعوا في تقديم العمل التطوعي ويمثلون قدوة لجيلهم',
        icon: '⭐',
        order: 3,
        active: true,
        criteria: '<p>يجب أن يكون المرشح بين 18-30 عاماً وساهم في مشاريع تطوعية ملهمة</p>',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  // Seed Volunteer Fields
  if (readCollection('volunteerFields').length === 0) {
    writeCollection('volunteerFields', [
      { id: generateId(), title: 'الصحة', slug: 'health', description: 'العمل التطوعي في القطاع الصحي', icon: '🏥', order: 0, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'التعليم', slug: 'education', description: 'العمل التطوعي في القطاع التعليمي', icon: '📚', order: 1, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'البيئة', slug: 'environment', description: 'العمل التطوعي في حماية البيئة', icon: '🌿', order: 2, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'التنمية المجتمعية', slug: 'community', description: 'العمل التطوعي في التنمية المجتمعية', icon: '🤝', order: 3, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'الثقافة والفنون', slug: 'culture', description: 'العمل التطوعي في القطاع الثقافي', icon: '🎭', order: 4, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'الرياضة', slug: 'sports', description: 'العمل التطوعي في القطاع الرياضي', icon: '⚽', order: 5, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'الإغاثة والطوارئ', slug: 'relief', description: 'العمل التطوعي في الإغاثة', icon: '🆘', order: 6, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ])
  }

  // Seed Steps
  if (readCollection('steps').length === 0) {
    writeCollection('steps', [
      { id: generateId(), title: 'التسجيل', description: 'قم بإنشاء حساب على منصة الجائزة', icon: '📝', order: 0, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'تقديم الطلب', description: 'قم بتعبئة نموذج الترشيح وإرفاق المستندات المطلوبة', icon: '📋', order: 1, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'التقييم', description: 'يقوم فريق التقييم بمراجعة الطلبات واختيار المرشحين', icon: '🔍', order: 2, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), title: 'التكريم', description: 'يتم تكريم الفائزين في حفل رسمي برعاية سامية', icon: '🎖️', order: 3, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ])
  }

  // Seed Partners
  if (readCollection('partners').length === 0) {
    writeCollection('partners', [
      { id: generateId(), name: 'وزارة الشباب', logo: '/images/partner-1.png', url: '#', order: 0, active: true, type: 'partner', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), name: 'الأمم المتحدة', logo: '/images/partner-2.png', url: '#', order: 1, active: true, type: 'partner', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), name: 'الصندوق الأردني الهاشمي', logo: '/images/partner-3.png', url: '#', order: 2, active: true, type: 'sponsor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), name: 'المجلس الأعلى للشباب', logo: '/images/partner-4.png', url: '#', order: 3, active: true, type: 'supporter', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: generateId(), name: 'وزارة التنمية الاجتماعية', logo: '/images/partner-5.png', url: '#', order: 4, active: true, type: 'partner', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ])
  }

  // Seed About Sections
  if (readCollection('aboutSections').length === 0) {
    writeCollection('aboutSections', [
      {
        id: generateId(),
        title: 'من نحن',
        content: '<p>جائزة الحسين بن عبدالله الثاني للعمل التطوعي هي جائزة وطنية تأسست لتكريم وتشجيع العاملين في مجال العمل التطوعي والأهلي في المملكة الأردنية الهاشمية. تسعى الجائزة إلى تعزيز ثقافة العطاء والتطوع في المجتمع الأردني، وإبراز الجهود المتميزة في هذا المجال.</p><p>تمنح الجائزة سنوياً للأفراد والمؤسسات والمبادرات التي قدمت مساهمات بارزة في مجال العمل التطوعي، وذلك في عدة فئات تغطي مختلف جوانب العمل التطوعي.</p>',
        image: '/images/about.jpg',
        order: 0,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  // Seed Statistics
  if (readCollection('statistics').length === 0) {
    writeCollection('statistics', [
      { id: generateId(), label: 'متطوع', value: '15,000+', icon: '👥', order: 0 },
      { id: generateId(), label: 'مشروع تطوعي', value: '2,500+', icon: '📋', order: 1 },
      { id: generateId(), label: 'مستفيد', value: '50,000+', icon: '❤️', order: 2 },
      { id: generateId(), label: 'شريك', value: '120+', icon: '🤝', order: 3 },
    ])
  }

  // Seed Social Links
  if (readCollection('socialLinks').length === 0) {
    writeCollection('socialLinks', [
      { id: generateId(), platform: 'facebook', url: 'https://facebook.com', icon: 'facebook', order: 0, active: true },
      { id: generateId(), platform: 'twitter', url: 'https://twitter.com', icon: 'twitter', order: 1, active: true },
      { id: generateId(), platform: 'instagram', url: 'https://instagram.com', icon: 'instagram', order: 2, active: true },
      { id: generateId(), platform: 'youtube', url: 'https://youtube.com', icon: 'youtube', order: 3, active: true },
      { id: generateId(), platform: 'linkedin', url: 'https://linkedin.com', icon: 'linkedin', order: 4, active: true },
    ])
  }

  // Seed Site Settings
  if (readCollection('siteSettings').length === 0) {
    writeCollection('siteSettings', [
      { id: generateId(), key: 'site_name', value: 'جائزة الحسين بن عبدالله الثاني للعمل التطوعي', group: 'general', label: 'اسم الموقع', type: 'text' },
      { id: generateId(), key: 'site_description', value: 'جائزة وطنية لتكريم وتشجيع العاملين في مجال العمل التطوعي', group: 'general', label: 'وصف الموقع', type: 'textarea' },
      { id: generateId(), key: 'site_logo', value: '/images/logo.png', group: 'appearance', label: 'شعار الموقع', type: 'image' },
      { id: generateId(), key: 'primary_color', value: '#1B5E20', group: 'appearance', label: 'اللون الرئيسي', type: 'color' },
      { id: generateId(), key: 'secondary_color', value: '#8D6E63', group: 'appearance', label: 'اللون الثانوي', type: 'color' },
      { id: generateId(), key: 'contact_email', value: 'info@alhusseinvolunteeraward.jo', group: 'contact', label: 'البريد الإلكتروني', type: 'text' },
      { id: generateId(), key: 'contact_phone', value: '+962 6 1234567', group: 'contact', label: 'رقم الهاتف', type: 'text' },
      { id: generateId(), key: 'contact_address', value: 'عمّان، المملكة الأردنية الهاشمية', group: 'contact', label: 'العنوان', type: 'textarea' },
    ])
  }

  // Seed Admin User
  if (readCollection('users').length === 0) {
    writeCollection('users', [
      {
        id: generateId(),
        email: 'admin@cms.com',
        name: 'المدير',
        password: 'admin123',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  // Seed Pages
  if (readCollection('pages').length === 0) {
    writeCollection('pages', [
      {
        id: generateId(),
        title: 'عن الجائزة',
        slug: 'about',
        content: '<h1>عن الجائزة</h1><p>جائزة الحسين بن عبدالله الثاني للعمل التطوعي هي جائزة وطنية تأسست لتكريم وتشجيع العاملين في مجال العمل التطوعي.</p>',
        published: true,
        order: 0,
        template: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'الفئات والشروط',
        slug: 'categories',
        content: '<h1>الفئات والشروط</h1><p>تتضمن الجائزة عدة فئات تغطي مختلف جوانب العمل التطوعي.</p>',
        published: true,
        order: 1,
        template: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  // Seed Events
  if (readCollection('events').length === 0) {
    writeCollection('events', [
      {
        id: generateId(),
        title: 'حفل تكريم الفائزين',
        slug: 'awards-ceremony',
        description: 'حفل تكريم الفائزين في الدورة الحالية من الجائزة',
        content: '<p>يقام حفل تكريم الفائزين تحت رعاية سامية، حيث يتم تسليم الجوائز والتقدير للمتميزين في مجال العمل التطوعي.</p>',
        image: '/images/event-1.jpg',
        location: 'عمّان - القصر الثقافي الملكي',
        startDate: '2025-06-15T18:00:00.000Z',
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  console.log('✅ Database seeded successfully!')
}
