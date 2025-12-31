import type { Company } from '../../../models';

// Importar todas as landing pages customizadas
export { EMP01LandingPage } from './EMP01LandingPage';

// Adicione aqui novas landing pages conforme forem criadas
// export { EMP02LandingPage } from './EMP02LandingPage';
// export { COOP01LandingPage } from './COOP01LandingPage';

// Interface para props das landing pages
export interface CompanyLandingPageProps {
  company: Partial<Company>;
  companyCode: string;
}

// Tipo do componente de landing page
export type CompanyLandingPageComponent = React.FC<CompanyLandingPageProps>;

// Mapa de códigos de empresa para seus componentes de landing page
export const companyLandingPages: Record<string, CompanyLandingPageComponent> = {
  'EMP01': require('./EMP01LandingPage').EMP01LandingPage,
  // Adicione aqui novos mapeamentos:
  // 'EMP02': require('./EMP02LandingPage').EMP02LandingPage,
  // 'COOP01': require('./COOP01LandingPage').COOP01LandingPage,
};

/**
 * Verifica se existe uma landing page customizada para o código da empresa
 * @param companyCode Código da empresa
 * @returns true se existe landing page, false caso contrário
 */
export function hasCustomLandingPage(companyCode: string): boolean {
  return companyCode in companyLandingPages;
}

/**
 * Retorna o componente de landing page para o código da empresa
 * @param companyCode Código da empresa
 * @returns Componente de landing page ou undefined se não existir
 */
export function getCompanyLandingPage(companyCode: string): CompanyLandingPageComponent | undefined {
  return companyLandingPages[companyCode];
}

/**
 * Retorna a lista de códigos de empresas que possuem landing page customizada
 * @returns Array com os códigos das empresas
 */
export function getAvailableLandingPages(): string[] {
  return Object.keys(companyLandingPages);
}
