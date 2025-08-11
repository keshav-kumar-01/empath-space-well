
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderTest()}
      </main>
      <Footer />
    </div>
  );
};

export default PsychTestRunner;
