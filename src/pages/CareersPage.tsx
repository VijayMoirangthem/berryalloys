import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { COMPANY_INFO } from '../data/company';
import { CAREERS_DEPARTMENTS, JOB_VACANCIES } from '../data/communityNewsCareersDocs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { SplitText } from '../components/motion/SplitText';
import { CreepyButton } from '../components/ui/CreepyButton';
import { FlipFadeText } from '../components/ui/FlipFadeText';
import { ImageScatter } from '../components/ui/ImageScatter';
import { IndustrialButton } from '../components/ui/IndustrialButton';
import { LIFE_CULTURE_SCATTER_SETS } from '../data/showcaseCollections';

interface CareersFormState {
  mode: 'role' | 'general';
  roleTitle: string;
  department: string;
  fullName: string;
  mobile: string;
  email: string;
  fileName: string;
  fileSizeBytes: number;
}

export function CareersPage() {
  const [form, setForm] = useState<CareersFormState>({
    mode: 'role',
    roleTitle: JOB_VACANCIES[0].title,
    department: CAREERS_DEPARTMENTS[0],
    fullName: '',
    mobile: '',
    email: '',
    fileName: '',
    fileSizeBytes: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedDemo, setSubmittedDemo] = useState<CareersFormState | null>(null);

  const maxMb = form.mode === 'role' ? 5 : 10;

  const selectVacancy = (title: string, department: string) => {
    setForm((prev) => ({
      ...prev,
      mode: 'role',
      roleTitle: title,
      department,
    }));
    setSubmittedDemo(null);
    document.getElementById('careers-application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!/^[+]?[\d\s()-]{8,16}$/.test(form.mobile.trim())) {
      nextErrors.mobile = 'Please enter a valid 8–16 digit mobile number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (form.mode === 'role' && !form.roleTitle.trim()) {
      nextErrors.roleTitle = 'Please select or enter a target role.';
    }
    if (!form.fileName) {
      nextErrors.cv = 'Please attach a sample CV file (PDF, DOCX, JPG, or PNG).';
    } else if (form.fileSizeBytes > maxMb * 1024 * 1024) {
      nextErrors.cv = `Selected file exceeds the ${maxMb} MB limit for ${
        form.mode === 'role' ? 'role-specific' : 'general'
      } applications.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmittedDemo(form);
  };

  const inputClass =
    'w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#FFFFFF] border border-[#10243A]/20 text-[#10243A] focus:border-brand focus:outline-none dark:bg-[#07111F] dark:border-[#F4F8FC]/20 dark:text-[#F4F8FC] dark:focus:border-[#69C5F5]';

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Careers' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            People & Workplace · {COMPANY_INFO.workforceStory.motto}
          </p>
          <SplitText
            text="Engineering, plant operations & commercial teams."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
          />
          <p className="text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
            {COMPANY_INFO.workforceStory.narrative}
          </p>
        </div>

        {/* People & Workplace Photo Showcase */}
        <section aria-labelledby="workforce-showcase-heading" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-[#10243A]/14 dark:border-[#F4F8FC]/14 divide-y sm:divide-y-0 sm:divide-x divide-[#10243A]/14 dark:divide-[#F4F8FC]/14 bg-white dark:bg-[#12243B]">
            {COMPANY_INFO.workforceStory.highlights.map((item) => (
              <div key={item.metric} className="p-4 sm:p-5 space-y-1">
                <p className="font-display text-xl sm:text-2xl font-bold uppercase text-brand dark:text-[#69C5F5]">
                  {item.metric}
                </p>
                <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 id="workforce-showcase-heading" className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              People &amp; Culture Across Berry Alloys Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  code: '01 · Inclusive Recognition',
                  title: 'Women Employees & Family Scholarships',
                  summary:
                    'Celebrating women team members alongside academic scholarships, bicycles, and school supplies awarded to employee families.',
                  sites: 'Equal-Opportunity Workplace',
                  asset: ASSETS.careersWomenTeam,
                },
                {
                  code: '02 · Plant & Commercial Teams',
                  title: 'Cross-Functional Collaboration',
                  summary:
                    'Metallurgical operations, quality assurance, logistics, and corporate MIS teams spanning Bobbili, Dhalbhumgarh, Kolkata, and Vizag.',
                  sites: '11 Functional Departments',
                  asset: ASSETS.careersWorkplaceCulture,
                },
                {
                  code: '03 · Workforce Welfare',
                  title: 'Safety, Mentorship & Community',
                  summary:
                    'Structured pre-shift ISO 45001 safety briefings, practical mentoring, and periodic multi-specialty health checkups.',
                  sites: 'ET Edge Best Organization 2026',
                  asset: ASSETS.careersCommunityGathering,
                },
              ].map((card) => (
                <article
                  key={card.code}
                  className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#10243A] overflow-hidden">
                      <ResilientImage
                        src={card.asset.src}
                        alt={card.asset.alt}
                        className="w-full h-full object-cover object-center"
                        containerClassName="w-full h-full"
                      />
                    </div>
                    <div className="p-5 sm:p-6 space-y-2">
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                        {card.code}
                      </p>
                      <h3 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                        {card.summary}
                      </p>
                    </div>
                  </div>
                  <p className="mx-5 sm:mx-6 pb-5 pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                    {card.sites}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Workplace Pillars */}
        <section aria-labelledby="culture-heading" className="pt-8 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 id="culture-heading" className="font-display text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Workplace Practices
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 px-4 py-1.5">
                <span className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Core Ethos:
                </span>
                <FlipFadeText
                  words={['TRAINING', 'MENTORSHIP', 'SAFETY', 'HEALTHCARE', 'INCLUSION', 'TEAMWORK']}
                  className="min-h-[34px]"
                  textClassName="text-lg sm:text-xl"
                />
              </div>
              <CreepyButton
                type="button"
                variant="copper"
                onClick={() =>
                  document
                    .getElementById('careers-application-form')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                Jump to Demo Application
              </CreepyButton>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14 divide-y md:divide-y-0 md:divide-x divide-[#10243A]/15 dark:divide-[#F4F8FC]/14 bg-white dark:bg-[#12243B]">
            <div className="p-6 sm:p-8 space-y-2">
              <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">01</p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Training & Mentorship
              </h3>
              <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                Practical workshops, structured cross-department progression, and SAP training where required for plant MIS workflows.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">02</p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Occupational Safety & Health
              </h3>
              <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                Plant safety protocols paired with periodic multi-specialty employee medical camps and regular occupational health screening.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">03</p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Inclusive Recruitment
              </h3>
              <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                Equal-opportunity hiring across eleven operational and corporate functions, alongside recognition of women employees and families.
              </p>
            </div>
          </div>

          {/* Restored Interactive GSAP Life & Culture Scatter Stage (8 exclusive workplace visuals) */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Interactive Workplace Stage · ET Edge 2026
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Inside Our Control Rooms, Labs &amp; Campuses
                </h3>
              </div>
              <Link
                to="/awards-achievements"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
              >
                View Workplace &amp; Industry Recognitions
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <ImageScatter imageSets={LIFE_CULTURE_SCATTER_SETS} />
          </div>
        </section>

        {/* Documented Vacancies */}
        <section aria-labelledby="vacancies-heading" className="pt-8 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 space-y-6">
          <div>
            <h2 id="vacancies-heading" className="font-display text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Documented Role Listings
            </h2>
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">
              Vacancies below reflect roles listed on the company careers page. Active hiring status requires direct HR confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {JOB_VACANCIES.map((job) => (
              <article
                key={job.id}
                className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                    <span className="font-semibold text-brand dark:text-[#69C5F5]">{job.location}</span>
                    <span aria-hidden="true">/</span>
                    <span>{job.experience}</span>
                  </div>

                  <h3 className="font-display text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {job.title}
                  </h3>

                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                    <span className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">Qualification:</span>{' '}
                    {job.qualification}
                  </p>

                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                      Key Responsibilities
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#465C72] dark:text-[#B5C5D7]">
                      {job.responsibilities.map((r) => (
                        <li key={r}>— {r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                      Skills Requested
                    </p>
                    <p className="text-xs text-[#10243A] dark:text-[#F4F8FC]">{job.skills.join(' · ')}</p>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 space-y-3">
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">{job.statusNotice}</p>
                  <IndustrialButton
                    type="button"
                    variant="secondary"
                    onClick={() => selectVacancy(job.title, job.department)}
                  >
                    Prepare Demo Application
                  </IndustrialButton>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive Application Form */}
        <section
          id="careers-application-form"
          aria-labelledby="apply-heading"
          className="pt-8 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-5 space-y-4">
            <h2 id="apply-heading" className="font-display text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Submit an Application (Prototype)
            </h2>
            <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              Apply against a documented role listing (5 MB CV limit) or submit a general profile across any of Berry Alloys Limited’s 11 functional departments (10 MB CV limit).
            </p>
            <div className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-4 flex items-start gap-3 text-xs text-[#10243A] dark:text-[#F4F8FC]">
              <Info className="w-4 h-4 text-brand dark:text-[#69C5F5] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                <strong>Prototype Disclosure:</strong> This is an interactive frontend demonstration. No CV file or personal information is transmitted to a server, emailed, or stored after leaving this page.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-6 sm:p-8">
            {submittedDemo ? (
              <div role="status" className="space-y-4 py-4">
                <div className="flex items-center gap-2.5 text-[#10243A] dark:text-[#F4F8FC]">
                  <CheckCircle2 className="w-5 h-5 text-brand dark:text-[#69C5F5]" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-bold uppercase">
                    Demo Application Validated (Not Transmitted)
                  </h3>
                </div>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  All required fields passed client-side validation for{' '}
                  <strong className="text-[#10243A] dark:text-[#F4F8FC]">{submittedDemo.fullName}</strong> (
                  {submittedDemo.mode === 'role'
                    ? submittedDemo.roleTitle
                    : `General — ${submittedDemo.department}`}
                  ). Because this is a frontend prototype, no application or CV ({submittedDemo.fileName}) was uploaded or emailed.
                </p>
                <IndustrialButton
                  type="button"
                  variant="outline-light"
                  onClick={() => setSubmittedDemo(null)}
                >
                  Reset Demonstration Form
                </IndustrialButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mode: 'role' }))}
                    className={`min-h-[40px] px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                      form.mode === 'role'
                        ? 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC]'
                        : 'bg-[#F1F6FB] text-[#465C72] dark:bg-[#07111F] dark:text-[#B5C5D7]'
                    }`}
                  >
                    Role-Specific (5 MB max)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mode: 'general' }))}
                    className={`min-h-[40px] px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                      form.mode === 'general'
                        ? 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC]'
                        : 'bg-[#F1F6FB] text-[#465C72] dark:bg-[#07111F] dark:text-[#B5C5D7]'
                    }`}
                  >
                    General Application (10 MB max)
                  </button>
                </div>

                {form.mode === 'role' ? (
                  <div>
                    <label
                      htmlFor="career-role"
                      className="block text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] mb-1.5"
                    >
                      Target Role
                    </label>
                    <select
                      id="career-role"
                      value={form.roleTitle}
                      onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                      className={inputClass}
                    >
                      {JOB_VACANCIES.map((v) => (
                        <option key={v.id} value={v.title}>
                          {v.title} ({v.location})
                        </option>
                      ))}
                    </select>
                    {errors.roleTitle && (
                      <p role="alert" className="text-xs text-brand dark:text-[#69C5F5] mt-1">
                        {errors.roleTitle}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="career-department"
                      className="block text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] mb-1.5"
                    >
                      Department
                    </label>
                    <select
                      id="career-department"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className={inputClass}
                    >
                      {CAREERS_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="career-name"
                      className="block text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="career-name"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      aria-invalid={Boolean(errors.fullName)}
                      className={inputClass}
                    />
                    {errors.fullName && (
                      <p role="alert" className="text-xs text-brand dark:text-[#69C5F5] mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="career-mobile"
                      className="block text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="career-mobile"
                      type="tel"
                      required
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      aria-invalid={Boolean(errors.mobile)}
                      placeholder="+91 98XXXXXXXX"
                      className={inputClass}
                    />
                    {errors.mobile && (
                      <p role="alert" className="text-xs text-brand dark:text-[#69C5F5] mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="career-email"
                    className="block text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="career-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p role="alert" className="text-xs text-brand dark:text-[#69C5F5] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="career-cv"
                    className="block text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] mb-1.5"
                  >
                    Attach CV (PDF, DOCX, JPG, PNG · Max {maxMb} MB)
                  </label>
                  <input
                    id="career-cv"
                    type="file"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setForm((prev) => ({
                        ...prev,
                        fileName: file ? file.name : '',
                        fileSizeBytes: file ? file.size : 0,
                      }));
                    }}
                    aria-invalid={Boolean(errors.cv)}
                    className="block w-full text-xs text-[#465C72] dark:text-[#B5C5D7] file:mr-4 file:min-h-[40px] file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#F1F6FB] file:text-[#10243A] hover:file:bg-[#D4DFEB] dark:file:bg-[#0D1B2E] dark:file:text-[#F4F8FC]"
                  />
                  {errors.cv && (
                    <p role="alert" className="text-xs text-brand dark:text-[#69C5F5] mt-1">
                      {errors.cv}
                    </p>
                  )}
                </div>

                <div className="pt-2 space-y-2.5">
                  <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7]">
                    Demo Notice: Submitting validates fields locally only; no information is sent or persisted.
                  </p>
                  <IndustrialButton type="submit" variant="primary">
                    Validate Demo Application
                  </IndustrialButton>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
