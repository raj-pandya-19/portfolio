import React, { useEffect, useState } from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import EducationSection from './sections/EducationSection';
import Projects from './sections/Projects';
import Certificates from './sections/Certificates';
import Training from './sections/Training';
import LearningRoadmap from './sections/LearningRoadmap';
import Contact from './sections/Contact';
import { Skeleton, SkeletonCard } from '../../components/ui/Skeleton';
import {
  aboutApi,
  skillsApi,
  experiencesApi,
  educationApi,
  certificatesApi,
  trainingApi,
  learningApi,
  projectsApi,
  socialLinksApi
} from '../../api';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    about: null,
    skills: [],
    experiences: [],
    education: [],
    certificates: [],
    training: [],
    learning: [],
    projects: [],
    socialLinks: []
  });

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const [
          aboutRes,
          skillsRes,
          expRes,
          eduRes,
          certRes,
          trainingRes,
          learningRes,
          projRes,
          socialRes
        ] = await Promise.allSettled([
          aboutApi.getAll(),
          skillsApi.getAll(),
          experiencesApi.getAll(),
          educationApi.getAll(),
          certificatesApi.getAll(),
          trainingApi.getAll(),
          learningApi.getAll(),
          projectsApi.getAll(),
          socialLinksApi.getAll()
        ]);

        const aboutData =
          aboutRes.status === 'fulfilled' && aboutRes.value?.data
            ? Array.isArray(aboutRes.value.data)
              ? aboutRes.value.data[0]
              : aboutRes.value.data
            : null;

        setData({
          about: aboutData,
          skills: skillsRes.status === 'fulfilled' ? skillsRes.value?.data || [] : [],
          experiences: expRes.status === 'fulfilled' ? expRes.value?.data || [] : [],
          education: eduRes.status === 'fulfilled' ? eduRes.value?.data || [] : [],
          certificates: certRes.status === 'fulfilled' ? certRes.value?.data || [] : [],
          training: trainingRes.status === 'fulfilled' ? trainingRes.value?.data || [] : [],
          learning: learningRes.status === 'fulfilled' ? learningRes.value?.data || [] : [],
          projects: projRes.status === 'fulfilled' ? projRes.value?.data || [] : [],
          socialLinks: socialRes.status === 'fulfilled' ? socialRes.value?.data || [] : []
        });

        // Set document title and meta description dynamically
        if (aboutData?.title) {
          document.title = `Raj Pandya | ${aboutData.title}`;
        }
      } catch (err) {
        console.error('Failed to load portfolio details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioData();
  }, []);

  return (
    <div className="public-home-wrapper">
      <PublicNavbar resumeUrl={data.about?.resumeUrl} />

      {loading ? (
        <main className="container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
            <Skeleton width="40%" height="48px" />
            <Skeleton width="60%" height="28px" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </main>
      ) : (
        <main>
          <Hero about={data.about} socialLinks={data.socialLinks} />
          <About about={data.about} />
          <Skills skills={data.skills} />
          <Experience experiences={data.experiences} />
          <EducationSection education={data.education} />
          <Projects projects={data.projects} />
          <Certificates certificates={data.certificates} />
          <Training training={data.training} />
          <LearningRoadmap learning={data.learning} />
          <Contact about={data.about} />
        </main>
      )}

      <PublicFooter about={data.about} socialLinks={data.socialLinks} />
    </div>
  );
}
