'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { useZatcaOnboarding } from '../../hooks/useZatcaOnboarding';

import { ZatcaHeaderTabs } from './ZatcaHeaderTabs';
import { ZatcaEnvSelector } from './ZatcaEnvSelector';
import { ZatcaStepperProgress } from './ZatcaStepperProgress';
import { Step1CreateUnit } from './Step1CreateUnit';
import { Step2GenerateCsr } from './Step2GenerateCsr';
import { Step3ComplianceCsid } from './Step3ComplianceCsid';
import { Step4ComplianceCheck } from './Step4ComplianceCheck';
import { Step5ProductionCsid } from './Step5ProductionCsid';
import { ZatcaTerminalDrawer } from './ZatcaTerminalDrawer';
import { ZatcaStatusTab } from './ZatcaStatusTab';
import { ZatcaXmlViewerTab } from './ZatcaXmlViewerTab';
import { ZatcaQrDecoderTab } from './ZatcaQrDecoderTab';

export const ZatcaOnboardingPortal: React.FC = () => {
  const {
    businessProfile,
    isZatcaActivated,
    canOnboard,
    activeTab,
    setActiveTab,
    targetEnv,
    handleEnvChange,
    currentStep,
    setCurrentStep,
    unitId,
    unitName,
    setUnitName,
    vatNumber,
    setVatNumber,
    organizationName,
    setOrganizationName,
    branchName,
    setBranchName,
    invoiceType,
    setInvoiceType,
    otp,
    setOtp,
    showTerminal,
    setShowTerminal,
    logs,
    loadingStep,
    errorMsg,
    handleResetWizard,
    backendStats,
    unitStatusDto,
    isRenewingCsid,
    handleRenewCsid,
    sampleXml,
    copiedXml,
    copyToClipboard,
    handleStep1CreateUnit,
    handleStep2GenerateCsr,
    handleStep3ComplianceCsid,
    handleStep4ComplianceCheck,
    handleStep5ProductionCsid
  } = useZatcaOnboarding();

  const stepsList = [
    { num: 1, title: 'تسجيل الوحدة', desc: 'POST /zatca/units' },
    { num: 2, title: 'إعداد CSR', desc: 'مفاتيح التشفير' },
    { num: 3, title: 'اعتماد Compliance', desc: 'رمز OTP' },
    { num: 4, title: 'فحص الامتثال', desc: 'اختبار الفواتير' },
    { num: 5, title: 'شهادة Production', desc: 'تفعيل لايف' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860, margin: '0 auto', width: '100%' }} className="fade-up">
      <ZatcaHeaderTabs
        isZatcaActivated={isZatcaActivated}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {!canOnboard && (
        <div style={{ padding: '14px 18px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lock style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            تنبيه: يتطلب السيرفر وجود صلاحية <code style={{ fontFamily: 'monospace' }}>zatca:onboard</code>. يرجى تسجيل الدخول بحساب مالك المنشأة (Owner/Admin) لإتمام عملية الربط.
          </span>
        </div>
      )}

      {activeTab === 'stepper' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <ZatcaEnvSelector targetEnv={targetEnv} onEnvChange={handleEnvChange} />

          <ZatcaStepperProgress
            currentStep={currentStep}
            isZatcaActivated={isZatcaActivated}
            stepsList={stepsList}
          />

          {errorMsg && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>⚠️ {errorMsg}</span>
              <button type="button" onClick={handleResetWizard} style={{ background: 'none', border: 'none', color: '#991B1B', textDecoration: 'underline', cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>
                إعادة المحاولة
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <Step1CreateUnit
              unitName={unitName}
              setUnitName={setUnitName}
              targetEnv={targetEnv}
              loadingStep={loadingStep}
              onNext={handleStep1CreateUnit}
            />
          )}

          {currentStep === 2 && (
            <Step2GenerateCsr
              vatNumber={vatNumber}
              setVatNumber={setVatNumber}
              organizationName={organizationName}
              setOrganizationName={setOrganizationName}
              invoiceType={invoiceType}
              setInvoiceType={setInvoiceType}
              branchName={branchName}
              setBranchName={setBranchName}
              loadingStep={loadingStep}
              onBack={() => setCurrentStep(1)}
              onNext={handleStep2GenerateCsr}
            />
          )}

          {currentStep === 3 && (
            <Step3ComplianceCsid
              otp={otp}
              setOtp={setOtp}
              targetEnv={targetEnv}
              loadingStep={loadingStep}
              onBack={() => setCurrentStep(2)}
              onNext={handleStep3ComplianceCsid}
            />
          )}

          {currentStep === 4 && (
            <Step4ComplianceCheck
              loadingStep={loadingStep}
              onBack={() => setCurrentStep(3)}
              onNext={handleStep4ComplianceCheck}
            />
          )}

          {currentStep === 5 && (
            <Step5ProductionCsid
              isZatcaActivated={isZatcaActivated}
              loadingStep={loadingStep}
              onActivate={handleStep5ProductionCsid}
            />
          )}

          <ZatcaTerminalDrawer
            logs={logs}
            showTerminal={showTerminal}
            onToggle={() => setShowTerminal(!showTerminal)}
          />
        </div>
      )}

      {activeTab === 'status' && (
        <ZatcaStatusTab
          unitStatusDto={unitStatusDto}
          isZatcaActivated={isZatcaActivated}
          unitId={unitId}
          backendStats={backendStats}
          targetEnv={targetEnv}
          isRenewingCsid={isRenewingCsid}
          onRenewCsid={handleRenewCsid}
        />
      )}

      {activeTab === 'xml' && (
        <ZatcaXmlViewerTab
          sampleXml={sampleXml}
          copiedXml={copiedXml}
          onCopy={copyToClipboard}
        />
      )}

      {activeTab === 'qr' && (
        <ZatcaQrDecoderTab
          companyNameAr={businessProfile.companyNameAr}
          vatNumber={businessProfile.vatNumber}
        />
      )}
    </div>
  );
};
