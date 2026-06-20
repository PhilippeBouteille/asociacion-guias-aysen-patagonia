/**
 * cookie-consent.js — Clarté Consultoría
 * Composant réutilisable : bandeau informatif + page politique de confidentialité
 * Usage : <script src="cookie-consent.js"></script>  (avant </body>)
 * Config : window.COOKIE_CONFIG = { ... } avant le script
 *
 * Aucun cookie de tracking → bandeau informatif simple (pas d'opt-in requis)
 * Couverture : RGPD (info) + Ley 21.096 Chile
 */

(function () {
  // ─── Configuration par défaut (surcharger via window.COOKIE_CONFIG) ───────
  const defaults = {
    siteName:    'Ce site',
    companyName: 'Clarté Consultoría',
    email:       'contact@clarteconsultoria.cl',
    lang:        'es',          // 'es' | 'en' | 'fr' | 'pt'
    accentColor: '#00a099',     // surcharger selon le site
    textColor:   '#ffffff',
    bgColor:     '#151a30',
    policyPageId: 'politica-privacidad',  // id de la section/page à afficher
    langStorageKey: null,  // optionnel : clé localStorage propre au site (ex: 'agap_lang') — vérifiée avant les clés génériques
    policyUrl: null,       // optionnel : si défini, "Más información" et data-cc-policy redirigent vers cette URL au lieu de générer la politique générique
  };

  const cfg = Object.assign({}, defaults, window.COOKIE_CONFIG || {});

  // ─── Traductions ──────────────────────────────────────────────────────────
  const T = {
    es: {
      bannerText: `Este sitio utiliza cookies técnicas esenciales para su funcionamiento. No utilizamos cookies de seguimiento ni publicidad. Al continuar navegando, aceptas su uso.`,
      learnMore:  'Más información',
      accept:     'Entendido',
      policyTitle: 'Política de Privacidad',
      policySubtitle: 'Última actualización: junio 2026',
      s1title: '¿Qué información recopilamos?',
      s1text:  `Este sitio no utiliza herramientas de análisis de terceros (Google Analytics, Meta Pixel, etc.) ni cookies de seguimiento. Las únicas cookies presentes son técnicas y necesarias para el funcionamiento básico del sitio (preferencia de idioma, sesión de usuario si aplica).\n\nCuando envías un formulario de contacto, recopilamos los datos que nos proporcionas voluntariamente (nombre, correo electrónico, mensaje). Estos datos son procesados por Formspree (formspree.io) y utilizados únicamente para responderte.`,
      s2title: '¿Cómo usamos tus datos?',
      s2text:  `Los datos de contacto que nos envías se utilizan exclusivamente para responder a tu solicitud. No los vendemos, cedemos ni compartimos con terceros, salvo los servicios técnicos necesarios para el funcionamiento del sitio (Vercel para el alojamiento, Formspree para los formularios).`,
      s3title: 'Cookies utilizadas',
      s3text:  `— Preferencia de idioma (localStorage, sin expiración)\n— Consentimiento de este aviso (localStorage, sin expiración)\n\nNinguna de estas cookies identifica al usuario ni se comparte con terceros.`,
      s4title: 'Tus derechos',
      s4text:  `De acuerdo con el RGPD (si eres residente en la UE) y la Ley 21.096 de Chile, tienes derecho a acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos, escríbenos a:`,
      s5title: 'Alojamiento y servicios técnicos',
      s5text:  `Este sitio está alojado en Vercel (vercel.com). Los formularios de contacto son procesados por Formspree (formspree.io). Puedes consultar sus políticas de privacidad en sus respectivos sitios web.`,
      back: '← Volver',
    },
    en: {
      bannerText: `This site uses essential technical cookies for its operation. We do not use tracking or advertising cookies. By continuing to browse, you accept their use.`,
      learnMore:  'Learn more',
      accept:     'Got it',
      policyTitle: 'Privacy Policy',
      policySubtitle: 'Last updated: June 2026',
      s1title: 'What information do we collect?',
      s1text:  `This site does not use third-party analytics tools (Google Analytics, Meta Pixel, etc.) or tracking cookies. The only cookies present are technical and necessary for basic site operation (language preference, user session if applicable).\n\nWhen you submit a contact form, we collect the data you voluntarily provide (name, email, message). This data is processed by Formspree (formspree.io) and used solely to respond to you.`,
      s2title: 'How do we use your data?',
      s2text:  `Contact data you send us is used exclusively to respond to your request. We do not sell, transfer or share it with third parties, except the technical services required for the site to function (Vercel for hosting, Formspree for forms).`,
      s3title: 'Cookies used',
      s3text:  `— Language preference (localStorage, no expiry)\n— Consent for this notice (localStorage, no expiry)\n\nNone of these cookies identify the user or are shared with third parties.`,
      s4title: 'Your rights',
      s4text:  `Under the GDPR (if you are an EU resident) and Chile's Law 21.096, you have the right to access, rectify or delete your personal data. To exercise these rights, write to us at:`,
      s5title: 'Hosting and technical services',
      s5text:  `This site is hosted on Vercel (vercel.com). Contact forms are processed by Formspree (formspree.io). You can consult their privacy policies on their respective websites.`,
      back: '← Back',
    },
    fr: {
      bannerText: `Ce site utilise des cookies techniques essentiels à son fonctionnement. Nous n'utilisons pas de cookies de suivi ni de publicité. En continuant à naviguer, vous acceptez leur utilisation.`,
      learnMore:  'En savoir plus',
      accept:     'J\'ai compris',
      policyTitle: 'Politique de confidentialité',
      policySubtitle: 'Dernière mise à jour : juin 2026',
      s1title: 'Quelles informations collectons-nous ?',
      s1text:  `Ce site n'utilise pas d'outils d'analyse tiers (Google Analytics, Meta Pixel, etc.) ni de cookies de suivi. Les seuls cookies présents sont techniques et nécessaires au fonctionnement de base du site (préférence de langue, session utilisateur le cas échéant).\n\nLorsque vous soumettez un formulaire de contact, nous collectons les données que vous fournissez volontairement (nom, e-mail, message). Ces données sont traitées par Formspree (formspree.io) et utilisées uniquement pour vous répondre.`,
      s2title: 'Comment utilisons-nous vos données ?',
      s2text:  `Les données de contact que vous nous envoyez sont utilisées exclusivement pour répondre à votre demande. Nous ne les vendons, cédons ni partageons avec des tiers, sauf les services techniques nécessaires au fonctionnement du site (Vercel pour l'hébergement, Formspree pour les formulaires).`,
      s3title: 'Cookies utilisés',
      s3text:  `— Préférence de langue (localStorage, sans expiration)\n— Consentement à cet avis (localStorage, sans expiration)\n\nAucun de ces cookies n'identifie l'utilisateur ni n'est partagé avec des tiers.`,
      s4title: 'Vos droits',
      s4text:  `Conformément au RGPD (si vous résidez dans l'UE) et à la loi chilienne 21.096, vous avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles. Pour exercer ces droits, écrivez-nous à :`,
      s5title: 'Hébergement et services techniques',
      s5text:  `Ce site est hébergé sur Vercel (vercel.com). Les formulaires de contact sont traités par Formspree (formspree.io). Vous pouvez consulter leurs politiques de confidentialité sur leurs sites respectifs.`,
      back: '← Retour',
    },
    pt: {
      bannerText: `Este site utiliza cookies técnicos essenciais para o seu funcionamento. Não utilizamos cookies de rastreamento ou publicidade. Ao continuar navegando, você aceita o seu uso.`,
      learnMore:  'Saiba mais',
      accept:     'Entendido',
      policyTitle: 'Política de Privacidade',
      policySubtitle: 'Última atualização: junho 2026',
      s1title: 'Quais informações coletamos?',
      s1text:  `Este site não usa ferramentas de análise de terceiros (Google Analytics, Meta Pixel, etc.) nem cookies de rastreamento. Os únicos cookies presentes são técnicos e necessários para o funcionamento básico do site (preferência de idioma, sessão do usuário se aplicável).\n\nQuando você envia um formulário de contato, coletamos os dados que você fornece voluntariamente (nome, e-mail, mensagem). Esses dados são processados pelo Formspree (formspree.io) e usados exclusivamente para responder a você.`,
      s2title: 'Como usamos seus dados?',
      s2text:  `Os dados de contato que você nos envia são usados exclusivamente para responder à sua solicitação. Não os vendemos, transferimos ou compartilhamos com terceiros, exceto os serviços técnicos necessários para o funcionamento do site (Vercel para hospedagem, Formspree para formulários).`,
      s3title: 'Cookies utilizados',
      s3text:  `— Preferência de idioma (localStorage, sem expiração)\n— Consentimento para este aviso (localStorage, sem expiração)\n\nNenhum desses cookies identifica o usuário ou é compartilhado com terceiros.`,
      s4title: 'Seus direitos',
      s4text:  `De acordo com o RGPD (se você for residente da UE) e a Lei 21.096 do Chile, você tem o direito de acessar, retificar ou excluir seus dados pessoais. Para exercer esses direitos, escreva para:`,
      s5title: 'Hospedagem e serviços técnicos',
      s5text:  `Este site é hospedado na Vercel (vercel.com). Os formulários de contato são processados pelo Formspree (formspree.io). Você pode consultar suas políticas de privacidade em seus respectivos sites.`,
      back: '← Voltar',
    }
  };

  // Langue détectée : cfg.lang ou localStorage ou navigateur
  function detectLang() {
    const keys = ['site_lang', 'pp_lang', 'koiaike_lang'];
    if (cfg.langStorageKey) keys.unshift(cfg.langStorageKey);
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v && T[v]) return v;
    }
    if (T[cfg.lang]) return cfg.lang;
    const nav = (navigator.language || 'es').slice(0, 2);
    return T[nav] ? nav : 'es';
  }

  const lang = detectLang();
  const t = T[lang];

  // ─── Cookie banner ────────────────────────────────────────────────────────
  const CONSENT_KEY = 'cookie_consent_v1';

  function injectBanner() {
    if (localStorage.getItem(CONSENT_KEY)) return;

    const banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Avis cookies');
    banner.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;
      background: ${cfg.bgColor}; color: ${cfg.textColor};
      padding: 16px 24px; display: flex; align-items: center;
      gap: 16px; flex-wrap: wrap;
      box-shadow: 0 -2px 12px rgba(0,0,0,0.25);
      font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5;
    `;

    banner.innerHTML = `
      <p style="margin:0;flex:1;min-width:220px;">${t.bannerText}</p>
      <div style="display:flex;gap:10px;flex-shrink:0;">
        <button id="cc-more" style="
          background:transparent;border:1px solid ${cfg.accentColor};
          color:${cfg.accentColor};padding:8px 16px;border-radius:4px;
          cursor:pointer;font-size:13px;white-space:nowrap;
        ">${t.learnMore}</button>
        <button id="cc-accept" style="
          background:${cfg.accentColor};border:none;
          color:#fff;padding:8px 20px;border-radius:4px;
          cursor:pointer;font-size:13px;font-weight:600;white-space:nowrap;
        ">${t.accept}</button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('cc-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, '1');
      banner.remove();
    });

    document.getElementById('cc-more').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, '1');
      banner.remove();
      showPolicy();
    });
  }

  // ─── Page politique de confidentialité ────────────────────────────────────
  function showPolicy() {
    // Si le site a sa propre page de politique de confidentialité, on y redirige directement
    // au lieu de générer la politique générique (évite un contenu dupliqué/contradictoire)
    if (cfg.policyUrl) {
      window.location.href = cfg.policyUrl;
      return;
    }

    // Cherche d'abord un conteneur existant avec l'id configuré
    const existing = document.getElementById(cfg.policyPageId);
    if (existing) {
      existing.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Sinon, overlay fullpage
    const overlay = document.createElement('div');
    overlay.id = 'cc-policy-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99998;
      background: #fff; overflow-y: auto;
      font-family: system-ui, sans-serif; color: #222;
    `;

    const sections = [
      { title: t.s1title, text: t.s1text },
      { title: t.s2title, text: t.s2text },
      { title: t.s3title, text: t.s3text },
      { title: t.s4title, text: t.s4text, email: true },
      { title: t.s5title, text: t.s5text },
    ];

    const sectionsHTML = sections.map(s => `
      <div style="margin-bottom:28px;">
        <h2 style="font-size:17px;font-weight:700;color:${cfg.bgColor};margin:0 0 8px;">${s.title}</h2>
        <p style="margin:0;line-height:1.7;white-space:pre-line;">${s.text}</p>
        ${s.email ? `<p style="margin:8px 0 0;"><a href="mailto:${cfg.email}" style="color:${cfg.accentColor};font-weight:600;">${cfg.email}</a></p>` : ''}
      </div>
    `).join('');

    overlay.innerHTML = `
      <div style="max-width:720px;margin:0 auto;padding:40px 24px 60px;">
        <button id="cc-back" style="
          background:transparent;border:none;color:${cfg.accentColor};
          font-size:14px;cursor:pointer;padding:0;margin-bottom:28px;
          font-weight:600;
        ">${t.back}</button>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
          <div style="width:4px;height:36px;background:${cfg.accentColor};border-radius:2px;"></div>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:${cfg.bgColor};">${t.policyTitle}</h1>
        </div>
        <p style="margin:0 0 36px;color:#888;font-size:13px;">${t.policySubtitle} · ${cfg.companyName}</p>
        ${sectionsHTML}
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('cc-back').addEventListener('click', function () {
      overlay.remove();
    });
  }

  // ─── Lien "Politique de confidentialité" dans le footer ──────────────────
  // Ajoute automatiquement un listener sur tout élément avec data-cc-policy
  function bindPolicyLinks() {
    document.querySelectorAll('[data-cc-policy]').forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showPolicy();
      });
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  function init() {
    injectBanner();
    bindPolicyLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose pour usage manuel
  window.cookieConsent = { showPolicy };

})();
