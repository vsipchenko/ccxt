import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    publicGetMarkets(params?: {}): Promise<implicitReturnType>;
    publicGetOhlcv(params?: {}): Promise<implicitReturnType>;
    publicGetTicker(params?: {}): Promise<implicitReturnType>;
    publicGetTrades(params?: {}): Promise<implicitReturnType>;
    privateGetOrders(params?: {}): Promise<implicitReturnType>;
    privateGetOrder(params?: {}): Promise<implicitReturnType>;
    privateGetBalance(params?: {}): Promise<implicitReturnType>;
    privateGetLeverageTiers(params?: {}): Promise<implicitReturnType>;
    privatePostOrder(params?: {}): Promise<implicitReturnType>;
    privatePostLeverage(params?: {}): Promise<implicitReturnType>;
    privateDeleteOrder(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
