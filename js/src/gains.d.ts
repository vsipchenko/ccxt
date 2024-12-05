import Exchange from './abstract/gains.js';
import type { Balances, Dict, int, Int, LeverageTier, LeverageTiers, Market, Num, OHLCV, Order, OrderSide, OrderType, Str, Strings, Ticker, Trade } from './base/types.js';
/**
 * @class gains
 * @augments Exchange
 */
export default class gains extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(market: Dict): Market;
    parseOrder(order: Dict, market?: Market): Order;
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    fetchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    cancelOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    parseBalance(balance: any): Balances;
    fetchBalance(params?: {}): Promise<Balances>;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    parseTicker(ticker: Dict, market?: Market): Ticker;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    parseMarketLeverageTiers(info: any, market?: Market): LeverageTier[];
    fetchLeverageTiers(symbols?: Strings, params?: {}): Promise<LeverageTiers>;
    setLeverage(leverage: Int, symbol?: Str, params?: {}): Promise<any>;
    parseTrade(trade: Dict, market?: Market): Trade;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(httpCode: int, reason: string, url: string, method: string, headers: Dict, body: string, response: any, requestHeaders: any, requestBody: any): any;
}
