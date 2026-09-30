import React, { useEffect, useMemo, useRef, useState } from 'react';

const PRODUCT_URL = 'https://b2b-product-page.vercel.app/';

const campaignEmails = [
  {
    id: 1,
    sender: 'Babs from Toggl',
    subject: 'Your 40-hour project just became 57',
    preview: 'You hit the deadline, send the invoice, and still wonder where the profit went...',
    date: 'Sep 24',
    time: '9:14 AM',
    unread: true,
  },
  {
    id: 2,
    sender: 'Babs from Toggl',
    subject: '36 of 40 hours used. How much work is left?',
    preview: 'Your project has a 40-hour estimate. Your team has logged 36...',
    date: 'Sep 26',
    time: '10:02 AM',
    unread: true,
  },
  {
    id: 3,
    sender: 'Babs from Toggl',
    subject: 'Why is the next estimate still 40 hours?',
    preview: 'Last project: estimated at 40 hours, took 57. Next project: similar work...',
    date: 'Sep 28',
    time: '8:47 AM',
    unread: true,
  },
];

const otherEmails = [
  ['The Penman', 'Portfolio notes for September', "A few things I'm changing about the way I present my work...", 'Sep 28'],
  ['Babalola', 'Re: Project update', 'I have gone through the latest version and made a few notes...', 'Sep 27'],
  ['Design Team', 'New project files are ready', 'The latest assets have been uploaded to the shared folder...', 'Sep 27'],
  ['LinkedIn', 'You have 3 new notifications', 'See what is happening in your professional network...', 'Sep 26'],
  ['Sarah', 'Friday', 'Are we still meeting later?', 'Sep 25'],
  ['Product Updates', "What's new this month", 'A few improvements have landed in your workspace...', 'Sep 24'],
  ['Newsletter', 'The brief: September edition', 'A short roundup of ideas, links, and things worth saving...', 'Sep 23'],
  ['Alex', 'Coffee next week?', 'I am free Tuesday or Thursday afternoon if either works for you...', 'Sep 22'],
  ['Finance', 'Invoice #2048 received', 'Your payment has been recorded successfully. No action needed.', 'Sep 21'],
];

function Icon({ name, size = 20, stroke = 1.8 }) {
  const paths = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 1 1 3.2 2.27c-.8.3-1 .73-1 1.73" /><path d="M12 17h.01" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.12 2.12-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20H9.8v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-2.12-2.12.06-.06A1.65 1.65 0 0 0 5.2 15a1.65 1.65 0 0 0-1.52-1H3.6V10h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06L6.93 5l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.52V3.8h4.01v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33L16.7 5l2.12 2.12-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.52 1H20v4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
    grid: <>{[6,12,18].flatMap((x) => [6,12,18].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="currentColor" stroke="none" />))}</>,
    inbox: <><path d="M4 5h16l-2 14H6L4 5Z" /><path d="M4.7 14H9l1.5 2h3L15 14h4.3" /></>,
    star: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    send: <><path d="m3 11 17-7-7 17-2-7-8-3Z" /><path d="m11 14 4-4" /></>,
    draft: <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    refresh: <><path d="M20 6v5h-5" /><path d="M4 18v-5h5" /><path d="M18.5 9A7 7 0 0 0 6.8 6.8L4 9M20 15l-2.8 2.2A7 7 0 0 1 5.5 15" /></>,
    more: <><circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></>,
    archive: <><path d="M4 7h16v13H4z" /><path d="M3 4h18v3H3z" /><path d="M9 11h6" /></>,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v4M12 17h.01" /></>,
    trash: <><path d="M5 7h14M9 7V5h6v2M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    left: <><path d="m14 7-5 5 5 5" /></>,
    right: <><path d="m10 7 5 5-5 5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function BrandMark() {
  return <div className="brand-mark" aria-label="Toggl Mail">
    <div className="brand-disc"><span /></div>
    <span className="brand-word">Toggl Mail</span>
  </div>;
}

function TopBar({ onMenu }) {
  return <header className="topbar">
    <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Toggle sidebar"><Icon name="menu" /></button>
    <BrandMark />
    <div className="searchbox" aria-label="Search mail">
      <Icon name="search" />
      <input placeholder="Search mail" aria-label="Search mail" readOnly />
      <span className="search-filter">⌘ K</span>
    </div>
    <div className="top-actions">
      <button className="icon-btn" aria-label="Help"><Icon name="help" /></button>
      <button className="icon-btn" aria-label="Settings"><Icon name="settings" /></button>
      <button className="icon-btn" aria-label="Apps"><Icon name="grid" /></button>
      <button className="avatar-button" aria-label="Profile">J</button>
    </div>
  </header>;
}

const primaryNav = [
  ['inbox','Inbox','3'], ['star','Starred',''], ['clock','Snoozed',''], ['send','Sent',''], ['draft','Drafts','2'], ['more','More','']
];

function MailSidebar({ collapsed, mobileOpen }) {
  return <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
    <button className="compose-btn"><span className="compose-icon"><Icon name="plus" size={18}/></span><span>Compose</span></button>
    <nav aria-label="Mail folders" className="nav-stack">
      {primaryNav.map(([icon,label,count],i) => <button key={label} className={`nav-item ${i===0 ? 'active' : ''}`}>
        <Icon name={icon} size={18}/><span>{label}</span>{count && <em>{count}</em>}
      </button>)}
    </nav>
    <div className="side-divider"/>
    <div className="labels-title"><span>Labels</span><Icon name="plus" size={16}/></div>
    <div className="labels">
      <button><i className="label-dot toggle"/><span>Toggl Campaign</span></button>
      <button><i className="label-dot work"/><span>Work</span></button>
      <button><i className="label-dot personal"/><span>Personal</span></button>
    </div>
  </aside>;
}

function InboxToolbar() {
  return <div className="inbox-toolbar">
    <div className="toolbar-left">
      <button className="checkbox-btn" aria-label="Select all"><span/></button>
      <button className="icon-btn small" aria-label="Refresh"><Icon name="refresh" size={17}/></button>
      <button className="icon-btn small" aria-label="More"><Icon name="more" size={18}/></button>
    </div>
    <div className="mail-count">1–12 of 12</div>
  </div>;
}

function EmailRow({ email, onOpen, campaign = false, index = 0 }) {
  const content = campaign ? email : { sender: email[0], subject: email[1], preview: email[2], date: email[3], unread: index % 3 === 0 };
  const rowProps = campaign ? { type:'button', onClick:()=>onOpen(content.id), 'aria-label':`Open ${content.subject}` } : { type:'button', disabled:true, 'aria-label':`${content.subject}, non-interactive inbox item` };
  return <button {...rowProps} className={`email-row ${content.unread ? 'unread' : ''} ${campaign ? 'campaign-row' : 'filler-row'}`}>
    <span className="row-checkbox"><span/></span>
    <span className="row-star"><Icon name="star" size={16}/></span>
    <span className="row-sender">{content.sender}{campaign && <span className="campaign-pill">campaign</span>}</span>
    <span className="row-copy"><strong>{content.subject}</strong><span className="dash"> — </span><span>{content.preview}</span></span>
    <span className="row-date">{content.date}</span>
  </button>;
}

function Inbox({ onOpen }) {
  return <section className="inbox-pane">
    <div className="inbox-head"><div><h1>Inbox</h1><p>3 campaign messages · 12 total</p></div></div>
    <InboxToolbar />
    <div className="email-list" role="list">
      {campaignEmails.map((e)=> <EmailRow key={e.id} email={e} onOpen={onOpen} campaign />)}
      {otherEmails.map((e,i)=> <EmailRow key={`${e[0]}-${e[1]}`} email={e} index={i} />)}
    </div>
  </section>;
}

function EmailToolbar({ onBack, prev, next, onPrev, onNext }) {
  return <div className="reader-toolbar">
    <div className="reader-tools-left">
      <button className="icon-btn small" onClick={onBack} aria-label="Back to inbox"><Icon name="back" size={19}/></button>
      <span className="tool-separator"/>
      <button className="icon-btn small" aria-label="Archive"><Icon name="archive" size={18}/></button>
      <button className="icon-btn small" aria-label="Report spam"><Icon name="alert" size={18}/></button>
      <button className="icon-btn small" aria-label="Delete"><Icon name="trash" size={18}/></button>
      <span className="tool-separator"/>
      <button className="icon-btn small" aria-label="Mark unread"><Icon name="mail" size={18}/></button>
      <button className="icon-btn small" aria-label="Snooze"><Icon name="clock" size={18}/></button>
      <button className="icon-btn small" aria-label="More"><Icon name="more" size={18}/></button>
    </div>
    <div className="reader-nav">
      <button className="icon-btn small" disabled={!prev} onClick={onPrev} aria-label="Previous campaign email"><Icon name="left" size={18}/></button>
      <button className="icon-btn small" disabled={!next} onClick={onNext} aria-label="Next campaign email"><Icon name="right" size={18}/></button>
    </div>
  </div>;
}

function useInViewOnce() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(()=>{
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setSeen(true); return; }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(node);
    return ()=>obs.disconnect();
  }, []);
  return [ref, seen];
}

function EmailMeta({ email }) {
  return <div className="message-meta-wrap">
    <div className="subject-line"><h1>{email.subject}</h1><span className="inbox-tag">Inbox</span></div>
    <div className="message-meta">
      <div className="sender-avatar">B</div>
      <div className="sender-block"><strong>Babs from Toggl</strong><span>&lt;babs@toggl.example&gt;</span><small>to Justin⌄</small></div>
      <div className="message-time">{email.date}, 2026, {email.time}</div>
    </div>
  </div>;
}

function EmailNewsletterHeader() {
  return <>
    <div className="newsletter-brand"><div className="mini-disc"><span/></div><strong>toggl</strong></div>
    <div className="newsletter-rule"/>
    <div className="from-line"><strong>Babs from Toggl</strong><span>to Justin</span></div>
  </>;
}

function Footer() {
  return <footer className="email-footer">
    <div className="newsletter-brand smallbrand"><div className="mini-disc"><span/></div><strong>toggl</strong></div>
    <p>Babs from Toggl</p>
    <p>You're receiving this email because you're part of the Toggl project management community.</p>
    <div className="footer-links"><a>Unsubscribe</a><a>Privacy</a><a>Manage preferences</a></div>
  </footer>;
}

function CTA({ children }) {
  return <a className="email-cta" href={PRODUCT_URL} target="_blank" rel="noreferrer">{children}</a>;
}

function ProductUI({ variant }) {
  const data = variant === 1
    ? {name:'Website relaunch', estimate:'40h', tracked:'57h', progress:142, note:'17h over estimate'}
    : variant === 2
      ? {name:'Q3 campaign', estimate:'40h', tracked:'36h', progress:90, note:'4h remaining'}
      : {name:'Brand system refresh', estimate:'40h', tracked:'57h', progress:142, note:'Project complete'};
  return <div className="product-ui">
    <div className="product-top"><div className="product-logo"><span/>Toggl Track</div><div className="product-dots">•••</div></div>
    <div className="project-kicker">PROJECT</div>
    <div className="project-title-row"><div><h3>{data.name}</h3><p>Client work · Design team</p></div><span className={`status ${variant===1?'over':variant===2?'live':'done'}`}>{variant===1?'Over estimate':variant===2?'In progress':'Complete'}</span></div>
    <div className="metric-row"><div><span>Estimate</span><strong>{data.estimate}</strong></div><div><span>Tracked</span><strong>{data.tracked}</strong></div><div><span>Progress</span><strong>{data.progress}%</strong></div></div>
    <div className="ui-progress-track"><span style={{width:`${Math.min(data.progress,100)}%`}} className={data.progress>100?'danger':''}/>{variant===2 && <i style={{left:'80%'}}/>}</div>
    <div className="ui-caption"><span>{data.note}</span><span>{variant===2?'Alert set at 80%':'Updated just now'}</span></div>
    {variant===2 && <div className="ui-alert"><Icon name="alert" size={16}/><div><strong>You're at 80% of your estimated time.</strong><span>Review scope before the project reaches its limit.</span></div></div>}
    {variant===3 && <div className="history-row"><div><span>Previous actual</span><strong>57h</strong></div><Icon name="right" size={16}/><div><span>Next estimate</span><strong>Start from evidence</strong></div></div>}
  </div>;
}

function EmailShell({ children }) {
  return <article className="email-canvas">{children}</article>;
}

function Email1() {
  const [visualRef, seen] = useInViewOnce();
  const [uiRef, uiSeen] = useInViewOnce();
  return <EmailShell>
    <EmailNewsletterHeader />
    <h2 className="email-title">Your 40-hour project just became 57</h2>
    <p>Hello Justin,</p>
    <p>You hit the deadline, send the invoice, and still wonder where the profit went.</p>

    <section ref={visualRef} className={`calc-visual ${seen?'is-visible':''}`} aria-label="Project economics calculation">
      <div className="fixed-fee">$4,000 <span>fixed fee</span></div>
      <div className="calc-axis">
        <div className="calc-point"><strong>40h</strong><span>ESTIMATED</span></div>
        <div className="calc-line"><span/><em>+17h</em></div>
        <div className="calc-point accent"><strong>{seen?'57h':'40h'}</strong><span>ACTUAL</span></div>
      </div>
      <div className="return-row"><div><strong>$100/hr</strong><span>planned return</span></div><Icon name="right" size={22}/><div className="return-drop"><strong>{seen?'$70/hr':'$100/hr'}</strong><span>effective hourly return</span></div></div>
    </section>

    <p>The project was estimated at 40 hours, but it took 57. On a $4,000 fixed-fee project, that takes the effective hourly return from $100 to about $70, even though the invoice itself has not changed.</p>
    <p>That difference is easy to miss when all you have is a timesheet showing how many hours were logged. By the time the extra hours become obvious, the project may already be over.</p>
    <div ref={uiRef} className={`reveal-section ${uiSeen?'is-visible':''}`}><ProductUI variant={1}/></div>
    <p>Toggl lets you set the estimate before work begins, track actual hours as the project moves along, and compare the two while there is still time to understand what is driving the difference.</p>
    <div className="editorial-rule-block"><span>40h</span><b>→</b><span>57h</span><i/><span>$100/hr</span><b>→</b><span className="drop">$70/hr</span></div>
    <p>Because knowing how many hours a project took is useful. Knowing what those hours did to the project is more useful.</p>
    <CTA>See how it works →</CTA>
    <div className="signoff">Babs<br/>Toggl</div>
    <Footer/>
  </EmailShell>;
}

function Email2() {
  const [progressRef, seen] = useInViewOnce();
  const [alertRef, alertSeen] = useInViewOnce();
  return <EmailShell>
    <EmailNewsletterHeader />
    <h2 className="email-title">36 of 40 hours used. How much work is left?</h2>
    <p>Hi Justin,</p>
    <p>Your project has a 40-hour estimate. Your team has logged 36.</p>
    <p className="question-line">Are you almost done, or are you in trouble?</p>

    <section ref={progressRef} className={`hours-visual ${seen?'is-visible':''}`}>
      <div className="hours-fraction"><strong>36</strong><span>/ 40</span></div>
      <div className="hours-label">hours used</div>
      <div className="progress-scale"><span>0%</span><span>80%</span><span>100%</span></div>
      <div className="email-progress"><i className="eighty"/><span/></div>
      <div className="remaining"><strong>4 HOURS LEFT</strong><span>10% of the original estimate remains</span></div>
    </section>

    <p>It depends on what's left. If it's a final round of edits, you're fine. If it's half the project, you're already headed over budget. You just haven't seen it yet.</p>
    <section className="work-left-visual">
      <div className="center-number">4h <span>remaining</span></div>
      <div className="work-path final"><span>FINAL EDITS</span><i/><small>close to done</small></div>
      <div className="work-path half"><span>HALF THE PROJECT</span><i/><small>scope still open</small></div>
    </section>
    <p>That is why estimated and actual time need to sit together. Toggl Track lets you set the estimate up front and see your tracked time against it as the work happens.</p>
    <ProductUI variant={2}/>
    <p>Set an alert at 80%, and you'll get a heads-up while there's still time to check the scope, adjust the timeline, or have the client conversation early.</p>
    <section ref={alertRef} className={`alert-sequence ${alertSeen?'is-visible':''}`}>
      <div className="alert-track"><span className="a0">0%</span><span className="a80">80%</span><span className="a100">100%</span><i/></div>
      <div className="notification"><Icon name="alert" size={17}/><span>You're at 80% of your estimated time.</span></div>
      <div className="payoff-numbers"><strong>80%</strong><Icon name="right" size={28}/><strong className="risk">110%</strong></div>
      <p>Better a nudge at 80% than a surprise at 110%.</p>
    </section>
    <p>Better a nudge at 80% than a surprise at 110%.</p>
    <CTA>See project progress →</CTA>
    <div className="signoff">Babs<br/>Toggl</div>
    <Footer/>
  </EmailShell>;
}

function Email3() {
  const [timelineRef, seen] = useInViewOnce();
  const [evidenceRef, evidenceSeen] = useInViewOnce();
  return <EmailShell>
    <EmailNewsletterHeader />
    <h2 className="email-title">Why is the next estimate still 40 hours?</h2>
    <p>Hi Justin,</p>
    <p>Last project: estimated at 40 hours, took 57.<br/>Next project: similar work, estimated at 40 hours.</p>
    <section ref={timelineRef} className={`project-timeline ${seen?'is-visible':''}`}>
      <div className="timeline-project"><span>PROJECT 01</span><strong>40h <small>estimated</small></strong></div>
      <div className="timeline-line"><i/><em>57h actual</em><b>+17h</b></div>
      <div className="timeline-project next"><span>PROJECT 02</span><strong>Next estimate</strong><small>Start with what the last project taught you</small></div>
    </section>
    <p>If that looks familiar, it's worth a second look. Those 17 extra hours aren't a mistake to move on from. They're the most honest data you have on what this kind of work takes, and they're already sitting in your timesheet.</p>
    <ProductUI variant={3}/>
    <p>In Toggl Track, estimated and actual time sit side by side on every project. Open your last one, see where it ran over, and start your next estimate from there. No guessing from memory, and no rounding down because 40 feels about right.</p>
    <section ref={evidenceRef} className={`evidence-visual ${evidenceSeen?'is-visible':''}`}>
      <div className="evidence-side memory"><span>MEMORY</span><strong>40h</strong><small>feels about right</small></div>
      <div className="evidence-connector"><span>vs</span><i/><Icon name="right" size={18}/></div>
      <div className="evidence-side data"><span>PROJECT DATA</span><strong>57h</strong><small>based on what actually happened</small></div>
      <div className="evidence-next"><span>next estimate</span><strong>informed by evidence</strong></div>
    </section>
    <p>Do that a few times, and your estimates stop being hopeful and start being based on evidence.</p>
    <div className="closing-thought">Stop making the same guess twice.</div>
    <p>The point of tracking time isn't a better timesheet. It's to stop making the same guess twice.</p>
    <CTA>Build better estimates →</CTA>
    <div className="signoff">Babs<br/>Toggl</div>
    <Footer/>
  </EmailShell>;
}

function EmailReader({ id, onBack, onSelect }) {
  const email = campaignEmails.find((e)=>e.id===id);
  const scrollRef = useRef(null);
  useEffect(()=>{ if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [id]);
  const prev = id > 1 ? id - 1 : null;
  const next = id < 3 ? id + 1 : null;
  return <section className="reader-pane" ref={scrollRef}>
    <EmailToolbar onBack={onBack} prev={prev} next={next} onPrev={()=>prev&&onSelect(prev)} onNext={()=>next&&onSelect(next)} />
    <EmailMeta email={email}/>
    <div className="reader-body">
      {id===1 ? <Email1/> : id===2 ? <Email2/> : <Email3/>}
    </div>
    <div className="reader-bottom-nav">
      <button disabled={!prev} onClick={()=>prev&&onSelect(prev)}><Icon name="left" size={17}/>Previous</button>
      <button onClick={onBack}>Back to inbox</button>
      <button disabled={!next} onClick={()=>next&&onSelect(next)}>Next<Icon name="right" size={17}/></button>
    </div>
  </section>;
}

export default function App() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const openEmail = (id) => { setSelectedEmail(id); setMobileOpen(false); };
  const handleMenu = () => {
    if (window.matchMedia('(max-width: 860px)').matches) setMobileOpen((v)=>!v);
    else setSidebarCollapsed((v)=>!v);
  };
  return <div className="app-shell">
    <TopBar onMenu={handleMenu}/>
    <div className="app-body">
      <MailSidebar collapsed={sidebarCollapsed} mobileOpen={mobileOpen}/>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close sidebar" onClick={()=>setMobileOpen(false)}/>} 
      <main className="main-pane">
        {selectedEmail ? <EmailReader id={selectedEmail} onBack={()=>setSelectedEmail(null)} onSelect={openEmail}/> : <Inbox onOpen={openEmail}/>} 
      </main>
    </div>
    <style>{styles}</style>
  </div>;
}

const styles = `
:root{
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  color:#1f1a25;background:#f7f5fa;font-synthesis:none;text-rendering:optimizeLegibility;
  --ink:#1f1a25;--muted:#716a78;--line:#e8e2ec;--surface:#fff;--soft:#f5f0fa;
  --purple:#7b2cf5;--purple-dark:#5f1fc8;--pink:#e65eb2;--red:#d85151;--green:#26876c;
}
*{box-sizing:border-box}html,body,#root{margin:0;min-height:100%;background:#f7f5fa}button,input,a{font:inherit}button{color:inherit}
button:focus-visible,a:focus-visible{outline:3px solid rgba(123,44,245,.28);outline-offset:2px}.app-shell{min-height:100vh;overflow:hidden}
.topbar{height:68px;background:#fff;display:grid;grid-template-columns:auto 205px minmax(280px,680px) 1fr;align-items:center;gap:10px;padding:0 18px;border-bottom:1px solid var(--line);position:relative;z-index:50}
.icon-btn{width:38px;height:38px;border:0;background:transparent;border-radius:10px;display:grid;place-items:center;cursor:pointer;color:#625b69;transition:.18s ease}.icon-btn:hover{background:#f2edf6;color:#271f2d}.icon-btn.small{width:34px;height:34px;border-radius:8px}.icon-btn:disabled{opacity:.28;cursor:default}.icon-btn:disabled:hover{background:transparent}
.brand-mark{display:flex;align-items:center;gap:9px}.brand-disc,.mini-disc{width:29px;height:29px;border-radius:50%;background:var(--purple);display:grid;place-items:center;position:relative;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22)}.brand-disc span,.mini-disc span{width:9px;height:9px;border:3px solid #fff;border-top-color:transparent;border-radius:50%;transform:rotate(-24deg)}.brand-word{font-weight:730;letter-spacing:-.02em;font-size:17px}
.searchbox{height:44px;background:#f4eff8;border:1px solid transparent;border-radius:12px;display:flex;align-items:center;gap:10px;padding:0 13px;color:#7d7584;transition:.18s ease}.searchbox:focus-within{background:#fff;border-color:#dbd2e2;box-shadow:0 2px 8px rgba(54,37,67,.08)}.searchbox input{border:0;outline:0;background:transparent;min-width:0;flex:1;font-size:15px;color:#2a242f}.search-filter{font-size:11px;border:1px solid #ddd4e3;border-radius:6px;padding:3px 6px;color:#8b8191;background:#fff}.top-actions{justify-self:end;display:flex;align-items:center;gap:3px}.avatar-button{width:34px;height:34px;border:0;border-radius:50%;background:#2a2230;color:#fff;font-weight:700;cursor:pointer}
.app-body{display:flex;height:calc(100vh - 68px)}.sidebar{width:242px;flex:0 0 242px;padding:14px 12px;background:#fbf9fc;border-right:1px solid var(--line);transition:width .2s ease,flex-basis .2s ease;overflow:hidden;position:relative;z-index:40}.sidebar.collapsed{width:72px;flex-basis:72px}.sidebar.collapsed .compose-btn span:last-child,.sidebar.collapsed .nav-item span,.sidebar.collapsed .nav-item em,.sidebar.collapsed .labels-title span,.sidebar.collapsed .labels button span{display:none}.sidebar.collapsed .compose-btn{width:46px;padding:0;justify-content:center}.sidebar.collapsed .nav-item,.sidebar.collapsed .labels button{justify-content:center;padding-left:0;padding-right:0}.sidebar.collapsed .labels-title{justify-content:center}.compose-btn{height:48px;border:0;border-radius:14px;background:#eee3fa;padding:0 18px;display:flex;align-items:center;gap:11px;font-weight:650;cursor:pointer;margin-bottom:12px;box-shadow:0 1px 1px rgba(31,20,43,.04);transition:.18s}.compose-btn:hover{background:#e4d3f8}.compose-icon{color:var(--purple)}.nav-stack{display:flex;flex-direction:column;gap:2px}.nav-item{height:38px;border:0;background:transparent;border-radius:10px;padding:0 12px;display:flex;align-items:center;gap:12px;color:#5a5360;cursor:pointer;text-align:left}.nav-item span{flex:1}.nav-item em{font-style:normal;font-size:12px;color:#6e6474}.nav-item:hover{background:#f1ecf4}.nav-item.active{background:#eadcfa;color:#4d178e;font-weight:680}.side-divider{height:1px;background:var(--line);margin:14px 8px}.labels-title{display:flex;align-items:center;justify-content:space-between;padding:0 10px 8px;font-size:13px;font-weight:720;color:#6b6370}.labels{display:flex;flex-direction:column;gap:2px}.labels button{height:35px;border:0;background:transparent;border-radius:9px;display:flex;align-items:center;gap:11px;padding:0 12px;color:#5f5865;cursor:pointer}.labels button:hover{background:#f1ecf4}.label-dot{width:9px;height:9px;border-radius:50%;background:#aaa}.label-dot.toggle{background:var(--purple)}.label-dot.work{background:#d5902d}.label-dot.personal{background:#3e9b7e}
.main-pane{flex:1;min-width:0;background:#fff;overflow:hidden}.inbox-pane,.reader-pane{height:100%;overflow:auto;background:#fff}.inbox-head{height:82px;padding:20px 24px 14px;display:flex;align-items:end;justify-content:space-between}.inbox-head h1{margin:0;font-size:23px;letter-spacing:-.02em}.inbox-head p{margin:4px 0 0;color:#8a818f;font-size:12px}.inbox-toolbar,.reader-toolbar{height:48px;border-top:1px solid #f3eff5;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 18px;background:#fff;position:sticky;top:0;z-index:25}.toolbar-left,.reader-tools-left{display:flex;align-items:center;gap:3px}.checkbox-btn{width:34px;height:34px;border:0;background:transparent;display:grid;place-items:center;cursor:pointer;border-radius:8px}.checkbox-btn:hover{background:#f3eef6}.checkbox-btn span,.row-checkbox span{width:14px;height:14px;border:1.5px solid #aaa2ae;border-radius:3px;background:#fff}.mail-count{font-size:12px;color:#8b838f;padding-right:8px}.email-list{border-bottom:1px solid var(--line)}.email-row{width:100%;height:43px;border:0;border-bottom:1px solid #efebf1;background:#fff;display:grid;grid-template-columns:34px 34px minmax(165px,220px) 1fr 82px;align-items:center;padding:0 14px 0 10px;text-align:left;color:#5d5662;cursor:pointer;transition:.12s ease}.email-row:hover{position:relative;z-index:2;background:#fbf8fd;box-shadow:0 1px 5px rgba(42,24,55,.09)}.email-row:disabled{cursor:default;opacity:1}.email-row:disabled:hover{box-shadow:none;background:#fff}.row-checkbox,.row-star{display:grid;place-items:center;color:#aaa2ae}.row-checkbox{height:100%}.row-star{transition:.15s}.campaign-row:hover .row-star{color:#715c7f}.row-star:hover{color:#cc9b2f}.row-sender{font-size:13px;display:flex;align-items:center;gap:8px;min-width:0}.unread .row-sender,.unread .row-copy strong,.unread .row-date{font-weight:730;color:#2d2732}.campaign-pill{font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:#6d28bd;background:#f0e4fc;border:1px solid #e1cef6;border-radius:999px;padding:2px 5px;font-weight:720}.row-copy{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px}.row-copy strong{font-weight:610;color:#39323f}.row-copy .dash{color:#ada5b1}.row-copy span:last-child{color:#817987}.row-date{justify-self:end;font-size:11px;color:#817987}.campaign-row{background:#fffdfd}.campaign-row.unread{background:#faf7fc}
.reader-toolbar{position:sticky;top:0}.reader-nav{display:flex;gap:2px}.tool-separator{width:1px;height:18px;background:#e4dfe6;margin:0 6px}.message-meta-wrap{padding:26px 36px 22px;border-bottom:1px solid #f0ebf2}.subject-line{display:flex;align-items:center;gap:10px;padding-left:52px}.subject-line h1{font-size:24px;font-weight:620;letter-spacing:-.02em;margin:0}.inbox-tag{font-size:10px;background:#eeeaf0;color:#69606e;border-radius:4px;padding:3px 6px}.message-meta{margin-top:22px;display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:center}.sender-avatar{width:40px;height:40px;border-radius:50%;background:#4f236e;color:#fff;display:grid;place-items:center;font-weight:760}.sender-block{display:grid;grid-template-columns:auto 1fr;column-gap:6px;align-items:baseline}.sender-block strong{font-size:13px}.sender-block span{font-size:11px;color:#8d8492}.sender-block small{grid-column:1/3;font-size:11px;color:#817987;margin-top:3px}.message-time{font-size:11px;color:#817987}.reader-body{padding:30px 20px 56px;background:#f8f6f9}.email-canvas{width:min(640px,calc(100vw - 32px));margin:0 auto;background:#fff;min-height:2300px;padding:52px 54px 42px;box-shadow:0 5px 24px rgba(34,22,42,.08),0 0 0 1px #eee8f0;color:#2b2630}.newsletter-brand{display:flex;align-items:center;gap:8px}.newsletter-brand strong{font-size:22px;letter-spacing:-.04em}.mini-disc{width:24px;height:24px}.mini-disc span{width:7px;height:7px;border-width:2px}.newsletter-rule{height:1px;background:#dfd7e3;margin:21px 0 13px}.from-line{display:flex;justify-content:space-between;gap:20px;font-size:11px;color:#807687}.from-line strong{color:#3d3543}.email-title{font-size:35px;line-height:1.08;letter-spacing:-.045em;margin:72px 0 26px;max-width:500px;color:#211b27}.email-canvas p{font-size:16px;line-height:1.72;margin:0 0 21px;color:#423b47}.email-canvas p.question-line{font-size:22px;line-height:1.35;font-weight:650;letter-spacing:-.02em;color:#27202e;margin:34px 0}.email-cta{display:inline-flex;align-items:center;justify-content:center;margin:20px 0 30px;background:#24182d;color:#fff;text-decoration:none;font-size:14px;font-weight:720;padding:12px 17px;border-radius:7px;transition:.18s ease}.email-cta:hover{transform:translateY(-1px);background:#4a1f64}.signoff{font-size:14px;line-height:1.6;color:#433a48;margin:4px 0 62px}.email-footer{border-top:1px solid #e5dfe7;padding-top:25px;color:#807887}.email-footer p{font-size:11px;line-height:1.55;margin:9px 0;color:#8b8290}.smallbrand strong{font-size:15px}.smallbrand .mini-disc{width:18px;height:18px}.footer-links{display:flex;gap:14px;font-size:10px;margin-top:13px}.footer-links a{text-decoration:underline;cursor:pointer}
.calc-visual{margin:50px 0 42px;border-top:1px solid #ded6e2;border-bottom:1px solid #ded6e2;padding:24px 0 26px}.fixed-fee{text-align:right;font-size:22px;font-weight:730;color:#362d3b}.fixed-fee span{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#928899;margin-left:6px}.calc-axis{display:grid;grid-template-columns:110px 1fr 110px;align-items:center;margin:28px 0 20px}.calc-point strong{font-size:35px;display:block;letter-spacing:-.04em}.calc-point span{font-size:9px;letter-spacing:.1em;color:#8c8293}.calc-point.accent{text-align:right}.calc-point.accent strong{color:var(--purple)}.calc-line{height:2px;background:#e2d9e6;position:relative}.calc-line span{position:absolute;left:0;top:0;height:2px;width:0;background:var(--purple);transition:width 1s cubic-bezier(.2,.8,.2,1)}.calc-line:after{content:"";position:absolute;right:-1px;top:-3px;width:8px;height:8px;border-radius:50%;background:var(--purple);opacity:.24}.calc-line em{position:absolute;right:0;top:-25px;font-size:10px;color:var(--purple);font-style:normal;opacity:0;transform:translateY(5px);transition:.5s ease .55s}.calc-visual.is-visible .calc-line span{width:100%}.calc-visual.is-visible .calc-line em{opacity:1;transform:none}.return-row{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;background:#f7f3fa;padding:18px 20px;border-radius:7px}.return-row div{display:flex;flex-direction:column}.return-row div:last-child{text-align:right}.return-row strong{font-size:22px;letter-spacing:-.02em}.return-row span{font-size:9px;color:#84798a;text-transform:uppercase;letter-spacing:.08em}.return-drop strong{transition:.5s ease .5s;color:#8b2334}.product-ui{border:1px solid #ddd4e1;background:#fbfafc;border-radius:10px;margin:43px 0;padding:16px 17px;box-shadow:0 7px 18px rgba(46,33,54,.05)}.product-top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e9e3ec;padding-bottom:13px}.product-logo{font-size:11px;font-weight:720;display:flex;align-items:center;gap:7px}.product-logo span{width:12px;height:12px;border-radius:50%;background:var(--purple)}.product-dots{color:#9d94a2;letter-spacing:2px}.project-kicker{font-size:8px;letter-spacing:.12em;color:#9a919f;margin-top:17px}.project-title-row{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-top:5px}.project-title-row h3{margin:0;font-size:17px}.project-title-row p{font-size:10px;line-height:1.4;margin:3px 0 0;color:#8b8290}.status{font-size:9px;border-radius:999px;padding:5px 8px;font-weight:710}.status.over{background:#fae8eb;color:#9d3647}.status.live{background:#f2e7fc;color:#6c2caf}.status.done{background:#e4f2ed;color:#2c705d}.metric-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#e6dfe8;border:1px solid #e6dfe8;margin-top:17px}.metric-row div{background:#fff;padding:12px}.metric-row span{display:block;font-size:9px;color:#8a808f}.metric-row strong{font-size:17px;display:block;margin-top:3px}.ui-progress-track{height:7px;background:#e9e3ec;margin-top:16px;position:relative;border-radius:999px;overflow:visible}.ui-progress-track>span{height:100%;display:block;background:var(--purple);border-radius:999px}.ui-progress-track>span.danger{background:#b94b5d}.ui-progress-track i{position:absolute;top:-4px;width:1px;height:15px;background:#7b2cf5}.ui-caption{display:flex;justify-content:space-between;font-size:9px;color:#8b8290;margin-top:7px}.ui-alert{margin-top:16px;border-left:3px solid var(--purple);background:#f3ecfb;padding:11px 12px;display:flex;gap:9px;color:#5f2a92}.ui-alert div{display:flex;flex-direction:column}.ui-alert strong{font-size:10px}.ui-alert span{font-size:9px;color:#755b88;margin-top:2px}.history-row{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:9px;border-top:1px solid #e8e2ea;margin-top:15px;padding-top:13px}.history-row div{display:flex;flex-direction:column}.history-row span{font-size:8px;color:#8b8290}.history-row strong{font-size:11px;margin-top:3px}.reveal-section{opacity:.2;transform:translateY(16px);transition:.65s ease}.reveal-section.is-visible{opacity:1;transform:none}.editorial-rule-block{margin:38px 0 36px;border-top:1px solid #d9d0dd;border-bottom:1px solid #d9d0dd;padding:18px 0;display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:24px;font-weight:730}.editorial-rule-block i{width:100%;height:0}.editorial-rule-block b{font-weight:500;color:#9a909f}.editorial-rule-block .drop{color:#962d42}
.hours-visual{margin:44px 0 46px;border-top:1px solid #ddd5e0;border-bottom:1px solid #ddd5e0;padding:24px 0 30px}.hours-fraction{display:flex;align-items:baseline;gap:8px}.hours-fraction strong{font-size:82px;letter-spacing:-.07em;line-height:1;color:#2b2130}.hours-fraction span{font-size:28px;color:#877d8d}.hours-label{text-transform:uppercase;font-size:9px;letter-spacing:.12em;color:#887e8e;margin-top:6px}.progress-scale{display:flex;justify-content:space-between;font-size:9px;color:#8b8190;margin-top:26px}.email-progress{height:8px;background:#e9e3ec;border-radius:999px;margin-top:6px;position:relative}.email-progress span{display:block;height:100%;width:0;background:var(--purple);border-radius:999px;transition:width 1s cubic-bezier(.2,.8,.2,1)}.hours-visual.is-visible .email-progress span{width:90%}.email-progress i.eighty{position:absolute;left:80%;top:-5px;width:1px;height:18px;background:#4c235e}.remaining{display:flex;justify-content:space-between;align-items:baseline;margin-top:15px}.remaining strong{font-size:19px}.remaining span{font-size:9px;color:#918798}.work-left-visual{position:relative;margin:42px 0 46px;padding:24px 0 6px}.center-number{font-size:37px;font-weight:740;letter-spacing:-.04em;margin-bottom:28px}.center-number span{font-size:10px;letter-spacing:.08em;color:#8e8493;text-transform:uppercase}.work-path{display:grid;grid-template-columns:120px 1fr 86px;align-items:center;gap:10px;margin:18px 0}.work-path span{font-size:10px;font-weight:730;letter-spacing:.07em}.work-path i{height:4px;background:#e8e1eb;border-radius:99px;position:relative}.work-path.final i:before{content:"";position:absolute;left:0;top:0;height:4px;width:82%;background:#3b8b71;border-radius:99px}.work-path.half i:before{content:"";position:absolute;left:0;top:0;height:4px;width:48%;background:#b85c66;border-radius:99px}.work-path small{font-size:9px;color:#8c8292}.alert-sequence{margin:43px 0 42px;padding:25px 0;border-top:1px solid #ded6e2;border-bottom:1px solid #ded6e2}.alert-track{height:2px;background:#e3dce6;position:relative;margin:27px 0 38px}.alert-track i{position:absolute;height:2px;left:0;top:0;width:0;background:var(--purple);transition:.9s ease}.alert-sequence.is-visible .alert-track i{width:80%}.alert-track span{position:absolute;top:-20px;font-size:9px;color:#8c8292}.a0{left:0}.a80{left:80%;transform:translateX(-50%);color:var(--purple)!important;font-weight:700}.a100{right:0}.notification{display:flex;align-items:center;gap:8px;background:#f2eafa;border-left:3px solid var(--purple);padding:11px 12px;color:#59208c;font-size:11px;opacity:0;transform:translateY(6px);transition:.45s ease .55s}.alert-sequence.is-visible .notification{opacity:1;transform:none}.payoff-numbers{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:22px;margin-top:38px}.payoff-numbers strong{font-size:44px;letter-spacing:-.05em}.payoff-numbers strong:last-child{text-align:right}.payoff-numbers .risk{color:#a13c4d}.alert-sequence>p{font-size:13px!important;text-align:center;margin:14px 0 0!important;color:#625766!important}
.project-timeline{margin:42px 0 45px;padding:26px 0;border-top:1px solid #ddd5e0;border-bottom:1px solid #ddd5e0}.timeline-project{display:flex;justify-content:space-between;align-items:end;gap:20px}.timeline-project>span{font-size:9px;letter-spacing:.1em;color:#8b8290;font-weight:700}.timeline-project strong{font-size:26px}.timeline-project strong small{font-size:9px;text-transform:uppercase;color:#8c8292;letter-spacing:.09em}.timeline-line{height:130px;border-left:2px solid #dfd6e3;margin:10px 0 10px 12px;position:relative}.timeline-line i{position:absolute;left:-2px;top:0;width:2px;height:0;background:var(--purple);transition:height .9s ease}.project-timeline.is-visible .timeline-line i{height:100%}.timeline-line em{position:absolute;top:42px;left:20px;font-style:normal;font-size:13px;color:#665c6c}.timeline-line b{position:absolute;bottom:11px;left:20px;font-size:34px;color:var(--purple);letter-spacing:-.05em;opacity:0;transform:translateY(8px);transition:.45s ease .6s}.project-timeline.is-visible .timeline-line b{opacity:1;transform:none}.timeline-project.next{align-items:flex-start}.timeline-project.next strong{font-size:21px}.timeline-project.next small{font-size:9px;color:#8c8292;max-width:175px;line-height:1.45}.evidence-visual{margin:43px 0 44px;display:grid;grid-template-columns:1fr 55px 1fr;gap:12px;align-items:center;position:relative;padding-bottom:68px}.evidence-side{border-top:2px solid #d8d0dc;padding-top:13px;display:flex;flex-direction:column}.evidence-side>span{font-size:9px;letter-spacing:.09em;color:#8b8290;font-weight:700}.evidence-side strong{font-size:36px;margin-top:6px;letter-spacing:-.04em}.evidence-side small{font-size:9px;color:#938999;margin-top:3px}.evidence-side.data{border-top-color:var(--purple)}.evidence-side.data strong{color:var(--purple)}.evidence-connector{display:flex;flex-direction:column;align-items:center;gap:8px;color:#9b91a0}.evidence-connector span{font-size:9px}.evidence-connector i{width:1px;height:32px;background:#ddd5e1}.evidence-next{position:absolute;left:calc(50% + 18px);bottom:0;border-left:2px solid var(--purple);padding-left:12px;opacity:0;transform:translateY(8px);transition:.5s ease .55s}.evidence-visual.is-visible .evidence-next{opacity:1;transform:none}.evidence-next span{font-size:8px;color:#8b8290;text-transform:uppercase;letter-spacing:.08em}.evidence-next strong{display:block;font-size:13px;margin-top:2px}.closing-thought{font-size:31px;line-height:1.14;letter-spacing:-.04em;font-weight:750;color:#291f30;margin:50px 0 28px;padding:26px 0;border-top:1px solid #dcd3e0;border-bottom:1px solid #dcd3e0}.reader-bottom-nav{display:flex;justify-content:center;gap:12px;padding:0 20px 46px;background:#f8f6f9}.reader-bottom-nav button{height:38px;border:1px solid #d9d0de;background:#fff;border-radius:9px;padding:0 13px;display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12px;color:#5e5564}.reader-bottom-nav button:hover{background:#f1eaf5}.reader-bottom-nav button:disabled{opacity:.35;cursor:default}.mobile-scrim{display:none}
@media (max-width:1100px){.topbar{grid-template-columns:auto 180px minmax(240px,1fr) auto}.brand-word{font-size:15px}.sidebar{width:210px;flex-basis:210px}.email-row{grid-template-columns:32px 32px 180px 1fr 68px}.campaign-pill{display:none}}
@media (max-width:860px){.topbar{grid-template-columns:auto auto 1fr auto;padding:0 10px}.brand-word{display:none}.searchbox{min-width:0}.search-filter{display:none}.top-actions .icon-btn:nth-child(-n+2){display:none}.app-body{position:relative}.sidebar{position:absolute;left:0;top:0;bottom:0;transform:translateX(-100%);width:242px!important;flex-basis:242px!important;box-shadow:10px 0 30px rgba(34,20,43,.13);transition:transform .2s ease}.sidebar.mobile-open{transform:translateX(0)}.sidebar.mobile-open .compose-btn span:last-child,.sidebar.mobile-open .nav-item span,.sidebar.mobile-open .nav-item em,.sidebar.mobile-open .labels-title span,.sidebar.mobile-open .labels button span{display:initial}.sidebar.mobile-open .compose-btn{width:auto;padding:0 18px;justify-content:flex-start}.sidebar.mobile-open .nav-item,.sidebar.mobile-open .labels button{justify-content:flex-start;padding:0 12px}.mobile-scrim{display:block;position:absolute;z-index:35;inset:0;border:0;background:rgba(29,20,34,.18)}.email-row{grid-template-columns:28px 28px 150px 1fr 60px;padding-left:4px}.message-meta-wrap{padding:22px 20px}.subject-line{padding-left:0}.reader-body{padding-left:8px;padding-right:8px}.email-canvas{padding:44px 38px}.email-title{font-size:32px}}
@media (max-width:620px){.topbar{height:62px;grid-template-columns:auto auto 1fr auto}.app-body{height:calc(100vh - 62px)}.top-actions .icon-btn{display:none}.searchbox{height:40px}.email-row{height:56px;grid-template-columns:27px 1fr 52px;grid-template-areas:"star sender date" "star copy date";align-content:center;column-gap:8px}.row-checkbox{display:none}.row-star{grid-area:star}.row-sender{grid-area:sender;font-size:12px}.row-copy{grid-area:copy;font-size:11px}.row-date{grid-area:date}.inbox-head{height:72px;padding:16px}.inbox-toolbar{padding:0 10px}.message-meta{grid-template-columns:36px 1fr;align-items:start}.sender-avatar{width:36px;height:36px}.message-time{grid-column:2}.subject-line h1{font-size:20px}.reader-tools-left .tool-separator:nth-of-type(2),.reader-tools-left button:nth-of-type(3),.reader-tools-left button:nth-of-type(5){display:none}.email-canvas{width:min(640px,calc(100vw - 16px));padding:36px 24px;min-height:2200px}.email-title{font-size:29px;margin-top:55px}.email-canvas p{font-size:15px}.calc-axis{grid-template-columns:90px 1fr 90px}.calc-point strong{font-size:29px}.return-row{gap:10px;padding:15px 14px}.return-row strong{font-size:18px}.hours-fraction strong{font-size:68px}.work-path{grid-template-columns:96px 1fr 70px}.metric-row strong{font-size:14px}.evidence-visual{grid-template-columns:1fr 35px 1fr}.evidence-side strong{font-size:30px}.reader-bottom-nav{gap:6px}.reader-bottom-nav button{padding:0 9px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}.calc-line span,.email-progress span,.alert-track i,.timeline-line i{width:100%!important;height:100%!important}.notification,.timeline-line b,.evidence-next,.reveal-section{opacity:1!important;transform:none!important}}
`;
