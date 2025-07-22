import Header from "@/app/components/Header";
import Apresentation from "@/app/components/Apresentation";
import Summary from "@/app/components/Summary";
import SkillsSummary from "@/app/components/SkillsSummary";
import History from "@/app/components/History";
import Projects from "@/app/components/Projects";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
        <div className="flex min-h-screen flex-col">
          <Header />
          <Apresentation/>
          <Summary />
          <SkillsSummary />
          <History />
          <Projects />
          <Footer />
        </div>
    </main>
  );
}
