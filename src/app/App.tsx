import { AppProvider } from "./contexts/AppContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Header } from "./components/Header";
import { IndexPage } from "./components/pages/IndexPage";
import { AboutPage } from "./components/pages/AboutPage";
import { AttractionsPage } from "./components/pages/AttractionsPage";
import { FormPage } from "./components/pages/FormPage";
import { DetailPage } from "./components/pages/DetailPage";
import { useRouter } from "./hooks/useRouter";
import { useLanguage } from "./contexts/LanguageContext";
import { motion } from "motion/react";
import { useApp } from "./contexts/AppContext";

function AppContent() {
  const { currentPage, params, navigate } = useRouter();
  const { t, language } = useLanguage();
  const { isAdmin } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'index':
        return <IndexPage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'attractions':
        return <AttractionsPage onNavigate={navigate} />;
      case 'manage':
        return <AttractionsPage onNavigate={navigate} management={isAdmin} />;
      case 'form':
        if (!isAdmin) return <AttractionsPage onNavigate={navigate} />;
        return (
          <FormPage 
            mode={params.mode || 'add'} 
            attractionId={params.id}
            onNavigate={navigate} 
          />
        );
      case 'detail':
        return params.id ? (
          <DetailPage 
            attractionId={params.id} 
            onNavigate={navigate} 
          />
        ) : (
          <IndexPage onNavigate={navigate} />
        );
      default:
        return <IndexPage onNavigate={navigate} />;
    }
  };

  const heroPage = currentPage === 'index' || currentPage === 'about';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header currentPage={currentPage} onNavigate={navigate} />
      {isAdmin && <div role="status" className="fixed bottom-4 left-4 z-40 border border-gold bg-background px-4 py-2 text-xs text-foreground shadow-lg">{language === 'th' ? 'โหมดผู้ดูแล · บันทึกเฉพาะเบราว์เซอร์นี้' : 'Admin mode · Saved in this browser'}</div>}
      <motion.main
        key={currentPage}
        className={heroPage ? '' : 'pt-20'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {renderPage()}
      </motion.main>
      <footer className="mt-32 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center lg:px-10">
          <span className="font-display text-2xl uppercase tracking-[0.35em]">
            {language === 'th' ? 'กำแพงเพชร' : 'Kamphaeng Phet'}
          </span>
          <div className="rule" />
          <button onClick={() => navigate('about')} className="link-line text-xs text-muted-foreground">{language === 'th' ? 'เกี่ยวกับจังหวัดและเครดิตภาพ' : 'About the province & photo credits'}</button>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{t('footer.subtitle')}</p>
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground/70">{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
