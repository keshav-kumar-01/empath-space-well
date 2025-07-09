
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

  const renderTest = () => {
    switch (testType) {
      case 'gad7':
        return <GAD7Test />;
      case 'bai':
        return <BAITest />;
      case 'phq9':
        return <PHQ9Test />;
      case 'bdi2':
        return <BDI2Test />;
      case 'cpt':
        return <CPTTest />;
      case 'mmpi2':
        return <MMPI2Test />;
      case 'sis':
        return <SISTest />;
      default:
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Test Not Found</h2>
            <p className="text-gray-600">The requested test could not be found.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderTest()}
      </main>
      <Footer />
    </div>
  );
};

export default PsychTestRunner;
