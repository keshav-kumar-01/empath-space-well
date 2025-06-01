
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GAD7Test from '@/components/tests/GAD7Test';
import BAITest from '@/components/tests/BAITest';
import PHQ9Test from '@/components/tests/PHQ9Test';

const PsychTestRunner = () => {
  const { testId } = useParams<{ testId: string }>();

  const renderTest = () => {
    switch (testId) {
      case 'gad7':
        return <GAD7Test />;
      case 'bai':
        return <BAITest />;
      case 'phq9':
        return <PHQ9Test />;
      case 'bdi2':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">BDI-II Test</h2>
            <p className="text-gray-600">This test is coming soon!</p>
          </div>
        );
      case 'cpt':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Continuous Performance Test</h2>
            <p className="text-gray-600">This interactive test is coming soon!</p>
          </div>
        );
      case 'mmpi2':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">MMPI-2 Test</h2>
            <p className="text-gray-600">This comprehensive test is coming soon!</p>
          </div>
        );
      case 'sis':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Supports Intensity Scale</h2>
            <p className="text-gray-600">This assessment is coming soon!</p>
          </div>
        );
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
