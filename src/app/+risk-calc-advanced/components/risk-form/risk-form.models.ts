import { ETradeType, TypeFee } from '../../models';

export interface RiskIncomeFormData {
  tradeType: ETradeType;

  deposit: string;
  risk: string;

  leverageAvailable: boolean;

  feeAvailable: boolean;

  marketMakerFee?: string;
  marketTakerFee?: string;
}
