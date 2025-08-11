
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import GAD7Test from '@/components/tests/GAD7Test';
import BAITest from '@/components/tests/BAITest';
import PHQ9Test from '@/components/tests/PHQ9Test';
import BDI2Test from '@/components/tests/BDI2Test';
import CPTTest from '@/components/tests/CPTTest';
import MMPI2Test from '@/components/tests/MMPI2Test';
import SISTest from '@/components/tests/SISTest';

const PsychTestRunner = () => {
  const { testType } = useParams<{ testType: string }>();

  console.log('PsychTestRunner - testType:', testType);

  const getTestInfo = () => {
    switch (testType?.toLowerCase()) {
      case 'gad7':
      case 'gad-7':
        return {
          title: 'GAD-7 Anxiety Assessment | Chetna_AI',
          description: 'Take the GAD-7 test to assess your anxiety levels. Get professional-grade mental health screening with Chetna_AI.',
          keywords: 'GAD-7, anxiety test, anxiety assessment, mental health screening, anxiety disorder test'
        };
      case 'bai':
        return {
          title: 'Beck Anxiety Inventory (BAI) | Chetna_AI',
          description: 'Complete the Beck Anxiety Inventory to measure anxiety severity. Professional anxiety assessment tool.',
          keywords: 'BAI, Beck Anxiety Inventory, anxiety measurement, anxiety symptoms, mental health test'
        };
      case 'phq9':
      case 'phq-9':
        return {
          title: 'PHQ-9 Depression Screening | Chetna_AI',
          description: 'Take the PHQ-9 depression screening test. Assess depression symptoms with this validated mental health tool.',
          keywords: 'PHQ-9, depression test, depression screening, mental health assessment, depression symptoms'
        };
      case 'bdi2':
      case 'bdi-2':
      case 'bdi-ii':
        return {
          title: 'Beck Depression Inventory (BDI-II) | Chetna_AI',
          description: 'Complete the BDI-II depression assessment. Professional-grade depression screening tool.',
          keywords: 'BDI-II, Beck Depression Inventory, depression assessment, mental health screening'
        };
      default:
        return {
          title: 'Psychological Tests | Chetna_AI',
          description: 'Access professional psychological assessments and mental health screening tools.',
          keywords: 'psychological tests, mental health assessments, screening tools, anxiety tests, depression tests'
        };
    }
  };

  const testInfo = getTestInfo();

  const renderTest = () => {
    switch (testType?.toLowerCase()) {
      case 'gad7':
      case 'gad-7':
        return <GAD7Test />;
      case 'bai':
        return <BAITest />;
      case 'phq9':
      case 'phq-9':
        return <PHQ9Test />;
      case 'bdi2':
      case 'bdi-2':
      case 'bdi-ii':
        return <BDI2Test />;
      case 'cpt':
        return <CPTTest />;
      case 'mmpi2':
      case 'mmpi-2':
        return <MMPI2Test />;
      case 'sis':
        return <SISTest />;
      default:
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-chetna-primary">Test Not Found</h2>
            <p className="text-gray-600 mb-6">
              The requested test "{testType}" could not be found.
            </p>
            <p className="text-sm text-gray-500">
              Available tests: GAD-7, BAI, PHQ-9, BDI-II, CPT, MMPI-2, SIS
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-chetna-light via-white to-chetna-secondary/10">
      <SEO
        title={testInfo.title}
        description={testInfo.description}
        keywords={testInfo.keywords}
        url={`https://chetna.live/psych-tests/${testType}`}
      />
      
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Psychological Tests', href: '/quiz' },
          { label: testType?.toUpperCase() || 'Test' }
        ]} />
        {renderTest()}
      </main>
      <Footer />
    </div>
  );
};

export default PsychTestRunner;
