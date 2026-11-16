import { FormEvent, useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { CAREERS_DEPARTMENTS, JOB_VACANCIES } from '../data/communityNewsCareersDocs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { SplitText } from '../components/motion/SplitText';
import { IndustrialButton } from '../components/ui/IndustrialButton';

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
    'w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#F6F4EF] border border-[#141618]/20 text-[#141618] focus:border-[#9E4B28] focus:outline-none dark:bg-[#121417] dark:border-[#F3F0E9]/20 dark:text-[#F3F0E9] dark:focus:border-[#EC743C]';

  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Careers' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            People & Workplace
          </p>
          <SplitText
            text="Engineering, plant operations & commercial teams."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
          />
          <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
            Berry Alloys Limited’s workplace framework emphasizes practical technical training, mentorship, structured safety programs, annual employee health checks, equal-opportunity hiring, and work-life balance across Kolkata, Visakhapatnam, and Jharkhand operations.
          </p>
        </div>

        {/* Workplace Pillars */}
        <section aria-labelledby="culture-heading" className="pt-8 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14">
          <h2 id="culture-heading" className="font-display text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mb-6">
            Workplace Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#141618]/15 dark:border-[#F3F0E9]/14 divide-y md:divide-y-0 md:divide-x divide-[#141618]/15 dark:divide-[#F3F0E9]/14 bg-white dark:bg-[#20242A]">
            <div className="p-6 sm:p-8 space-y-2">
              <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C]">01</p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Training & Mentorship
              </h3>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                Practical workshops, structured cross-department progression, and SAP training where required for plant MIS workflows.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C]">02</p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Occupational Safety & Health
              </h3>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                Plant safety protocols paired with periodic multi-specialty employee medical camps and regular occupational health screening.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C]">03</p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Inclusive Recruitment
              </h3>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                Equal-opportunity hiring across eleven operational and corporate functions, alongside recognition of women employees and families.
              </p>
            </div>
          </div>
        </section>

        {/* Documented Vacancies */}
        <section aria-labelledby="vacancies-heading" className="pt-8 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 space-y-6">
          <div>
            <h2 id="vacancies-heading" className="font-display text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              Documented Role Listings
            </h2>
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1">
              Vacancies below reflect roles listed on the company careers page. Active hiring status requires direct HR confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {JOB_VACANCIES.map((job) => (
              <article
                key={job.id}
                className="bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                    <span className="font-semibold text-[#9E4B28] dark:text-[#EC743C]">{job.location}</span>
                    <span aria-hidden="true">/</span>
                    <span>{job.experience}</span>
                  </div>

                  <h3 className="font-display text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {job.title}
                  </h3>

                  <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
                    <span className="font-semibold text-[#141618] dark:text-[#F3F0E9]">Qualification:</span>{' '}
                    {job.qualification}
                  </p>

                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#4A5054] dark:text-[#A1A7AB]">
                      Key Responsibilities
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#4A5054] dark:text-[#A1A7AB]">
                      {job.responsibilities.map((r) => (
                        <li key={r}>— {r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#4A5054] dark:text-[#A1A7AB]">
                      Skills Requested
                    </p>
                    <p className="text-xs text-[#141618] dark:text-[#F3F0E9]">{job.skills.join(' · ')}</p>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 space-y-3">
                  <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">{job.statusNotice}</p>
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
          className="pt-8 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-5 space-y-4">
            <h2 id="apply-heading" className="font-display text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              Submit an Application (Prototype)
            </h2>
            <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
              Apply against a documented role listing (5 MB CV limit) or submit a general profile across any of Berry Alloys Limited’s 11 functional departments (10 MB CV limit).
            </p>
            <div className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-4 flex items-start gap-3 text-xs text-[#141618] dark:text-[#F3F0E9]">
              <Info className="w-4 h-4 text-[#9E4B28] dark:text-[#EC743C] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                <strong>Prototype Disclosure:</strong> This is an interactive frontend demonstration. No CV file or personal information is transmitted to a server, emailed, or stored after leaving this page.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-6 sm:p-8">
            {submittedDemo ? (
              <div role="status" className="space-y-4 py-4">
                <div className="flex items-center gap-2.5 text-[#141618] dark:text-[#F3F0E9]">
                  <CheckCircle2 className="w-5 h-5 text-[#9E4B28] dark:text-[#EC743C]" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-bold uppercase">
                    Demo Application Validated (Not Transmitted)
                  </h3>
                </div>
                <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                  All required fields passed client-side validation for{' '}
                  <strong className="text-[#141618] dark:text-[#F3F0E9]">{submittedDemo.fullName}</strong> (
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
                <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mode: 'role' }))}
                    className={`min-h-[40px] px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                      form.mode === 'role'
                        ? 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
                        : 'bg-[#ECE8DF] text-[#4A5054] dark:bg-[#121417] dark:text-[#A1A7AB]'
                    }`}
                  >
                    Role-Specific (5 MB max)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mode: 'general' }))}
                    className={`min-h-[40px] px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                      form.mode === 'general'
                        ? 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
                        : 'bg-[#ECE8DF] text-[#4A5054] dark:bg-[#121417] dark:text-[#A1A7AB]'
                    }`}
                  >
                    General Application (10 MB max)
                  </button>
                </div>

                {form.mode === 'role' ? (
                  <div>
                    <label
                      htmlFor="career-role"
                      className="block text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] mb-1.5"
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
                      <p role="alert" className="text-xs text-[#9E4B28] dark:text-[#EC743C] mt-1">
                        {errors.roleTitle}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="career-department"
                      className="block text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] mb-1.5"
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
                      className="block text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] mb-1.5"
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
                      <p role="alert" className="text-xs text-[#9E4B28] dark:text-[#EC743C] mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="career-mobile"
                      className="block text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] mb-1.5"
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
                      <p role="alert" className="text-xs text-[#9E4B28] dark:text-[#EC743C] mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="career-email"
                    className="block text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] mb-1.5"
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
                    <p role="alert" className="text-xs text-[#9E4B28] dark:text-[#EC743C] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="career-cv"
                    className="block text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] mb-1.5"
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
                    className="block w-full text-xs text-[#4A5054] dark:text-[#A1A7AB] file:mr-4 file:min-h-[40px] file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#ECE8DF] file:text-[#141618] hover:file:bg-[#D8D1C3] dark:file:bg-[#191C20] dark:file:text-[#F3F0E9]"
                  />
                  {errors.cv && (
                    <p role="alert" className="text-xs text-[#9E4B28] dark:text-[#EC743C] mt-1">
                      {errors.cv}
                    </p>
                  )}
                </div>

                <div className="pt-2 space-y-2.5">
                  <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">
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
