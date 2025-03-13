//  ---------------------------------------------------------------------------

import Exchange from './abstract/gains.js';
import { ArgumentsRequired, NotSupported, ExchangeError } from './base/errors.js';
import type {
    Balances,
    Dict,
    int,
    Int,
    LeverageTier,
    LeverageTiers,
    Market,
    Num,
    OHLCV,
    Order,
    OrderSide,
    OrderType,
    Str,
    Strings,
    Ticker,
    Trade,
    Fee,
    Leverage,
    Bool,
} from './base/types.js';
import { TICK_SIZE } from './base/functions/number.js';

//  ---------------------------------------------------------------------------

/**
 * @class gains
 * @augments Exchange
 */
export default class gains extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'gains',
            'name': 'gains',
            'countries': [ 'EU' ],
            'version': 'v1',
            'rateLimit': 10,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'cancelAllOrders': false,
                'cancelOrder': true,
                'cancelOrders': false,
                'closeAllPositions': false,
                'closePosition': false,
                'createOrder': true,
                'editOrder': false,
                'fetchBalance': true,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchClosedOrders': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': false,
                'fetchDeposits': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLeverageTiers': true,
                'fetchMarginMode': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': false,
                'fetchOHLCV': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': false,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchOrderTrades': false,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTickers': false,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactionFees': false,
                'fetchTransactions': false,
                'fetchTransfer': false,
                'fetchTransfers': false,
                'fetchWithdrawal': false,
                'fetchWithdrawals': false,
                'setLeverage': true,
                'setMarginMode': false,
                'transfer': false,
                'withdraw': false,
                'ws': false,
            },
            'timeframes': {
                '1m': 1,
                '5m': 5,
                '10m': 10,
                '30m': 10,
                '1h': 60,
                '2h': 120,
                '4h': 240,
                '8h': 480,
                '12h': 720,
                '1d': 24,
                '1w': 70,
                '1M': 31,
            },
            'urls': {
                'logo': 'https://some-logo.jpg',
                'api': {
                    'public': 'http://127.0.0.1:8000',
                    'private': 'http://127.0.0.1:8000',
                },
                'www': 'https://gains.com/',
                'doc': [
                    'https://gains.com/gains-offical-api-docs',
                ],
                'fees': 'https://gains.com/fees',
            },
            'requiredCredentials': {},
            'api': {
                'public': {
                    'get': [
                        'markets',
                        'ohlcv',
                        'ticker',
                        'trades',
                    ],
                },
                'private': {
                    'get': [
                        'orders',
                        'order',
                        'balance',
                        'leverage_tiers',
                    ],
                    'post': [
                        'order',
                        'leverage',
                    ],
                    'delete': [
                        'order',
                    ],
                },
            },
            'fees': {
            },
            'options': {
            },
            'precisionMode': TICK_SIZE,
            'exceptions': {
            },
            'commonCurrencies': {
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name gains#fetchMarkets
         * @description retrieves data on all markets for gains
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetMarkets (params);
        return this.parseMarkets (response);
    }

    parseMarkets (markets: Dict[], params = {}): Market[] {
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push (this.parseOrder (markets[i]));
        }
        return result;
    }

    parseMarket (market: Dict): Market {
        return {
            'id': this.safeString (market, 'id'),
            'uppercaseId': undefined,
            'symbol': this.safeString (market, 'symbol'),
            'base': this.safeString (market, 'base'),
            'baseId': this.safeString (market, 'baseId'),
            'quote': this.safeString (market, 'quote'),
            'quoteId': this.safeString (market, 'quoteId'),
            'settle': undefined,
            'settleId': undefined,
            'type': 'spot',
            'spot': true,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'limits': {
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'precision': {
                'price': undefined,
                'amount': undefined,
            },
            'active': true,
            'created': undefined,
            'info': market,
        };
    }

    parseOrders (orders: Dict[], market: Market = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Order[] {
        const result = [];
        for (let i = 0; i < orders.length; i++) {
            result.push (this.parseOrder (orders[i], market));
        }
        return result;
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        const timestamp: Int = this.safeInteger (order, 'timestamp');
        return {
            'id': this.safeString (order, 'id'),
            'clientOrderId': this.safeString (order, 'clientOrderId'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': this.safeInteger (order, 'lastTradeTimestamp'),
            'lastUpdateTimestamp': this.safeInteger (order, 'lastUpdated'),
            'symbol': this.safeString (order, 'symbol'),
            'type': this.safeStringLower (order, 'type'),
            'timeInForce': this.safeString (order, 'timeInForce'),
            'postOnly': undefined,
            'side': this.safeStringLower (order, 'side'),
            'price': this.safeNumber (order, 'price'),
            'stopPrice': undefined,
            'amount': this.safeNumber (order, 'amount'),
            'cost': this.safeNumber (order, 'cost'),
            'average': this.safeNumber (order, 'average'),
            'filled': this.safeNumber (order, 'filled'),
            'remaining': this.safeNumber (order, 'remaining'),
            'status': this.safeStringLower (order, 'status'),
            'fee': this.parseFee (order),
            'reduceOnly': false,
            'trades': this.parseTrades (this.safeValue (order, 'trades', [])),
            'info': order,
        };
    }

    async fetchOrder (id: string, symbol: Str = undefined, params = {}): Promise<Order> {
        /**
         * @method
         * @name gains#fetchOrder
         * @description fetches information on an order made by the user
         * @param {string} id the order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        const request: Dict = {
            'id': id,
            'pair': symbol,
        };
        const response = await this.privateGetOrder (this.extend (request, params));
        return this.parseOrder (response);
    }

    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        /**
         * @method
         * @name gains#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': symbol,
        };
        if (since !== undefined) {
            request['since'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetOrders (this.extend (request, params));
        return this.parseOrders (response, market, since, limit);
    }

    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}): Promise<Order> {
        /**
         * @method
         * @name gains#createOrder
         * @description create a trade order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'pair': symbol,
            'type': type,
            'side': side,
            'amount': amount,
        };
        if (type !== 'market') {
            throw new NotSupported (this.id + ' createOrder() supports market orders only');
        }
        if (side !== 'buy') {
            throw new NotSupported (this.id + ' createOrder() supports buy orders only');
        }
        const response = await this.privatePostOrder (this.extend (request, params));
        return this.parseOrder (response, market);
    }

    async cancelOrder (id: string, symbol: Str = undefined, params = {}): Promise<Order> {
        /**
         * @method
         * @name gains#cancelOrder
         * @description cancels an open order
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'id': id,
        };
        const response = await this.privateDeleteOrder (this.extend (request, params));
        return this.parseOrder (response, market);
    }

    parseBalance (balance): Balances {
        const timestamp = this.safeInteger (balance, 'timestamp');
        return {
            'info': balance,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'free': this.safeValue (balance, 'free', {}),
            'used': this.safeValue (balance, 'used', {}),
            'total': this.safeValue (balance, 'total', {}),
            'debt': this.safeValue (balance, 'debt', {}),
        };
    }

    async fetchBalance (params = {}): Promise<Balances> {
        /**
         * @method
         * @name gains#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
         */
        const response = await this.privateGetBalance (params);
        return this.parseBalance (response);
    }

    parseOHLCVs (ohlcvs: object[], market: Market = undefined, timeframe: string = '1m', since: Int = undefined, limit: Int = undefined, tail: Bool = false): OHLCV[] {
        const results = [];
        for (let i = 0; i < ohlcvs.length; i++) {
            results.push (this.parseOHLCV (ohlcvs[i], market));
        }
        return results;
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        if (Array.isArray (ohlcv)) {
            return [
                this.safeInteger (ohlcv, 0),  // timestamp
                this.safeNumber (ohlcv, 1),   // open
                this.safeNumber (ohlcv, 2),   // high
                this.safeNumber (ohlcv, 3),   // low
                this.safeNumber (ohlcv, 4),   // close
                this.safeNumber (ohlcv, 5),   // volume
            ];
        }
        return ohlcv;
    }

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name gains#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        const request: Dict = {
            'pair': symbol,
            'timeframe': timeframe,
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['since'] = since;
        }
        const response = await this.publicGetOhlcv (this.extend (request, params));
        return this.parseOHLCVs (response);
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        const symbol = this.safeString (ticker, 'symbol');
        const timestamp = this.safeInteger (ticker, 'timestamp');
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeNumber (ticker, 'high'),
            'low': this.safeNumber (ticker, 'low'),
            'bid': this.safeNumber (ticker, 'bid'),
            'bidVolume': this.safeNumber (ticker, 'bidVolume'),
            'ask': this.safeNumber (ticker, 'ask'),
            'askVolume': this.safeNumber (ticker, 'askVolume'),
            'vwap': this.safeNumber (ticker, 'vwap'),
            'open': this.safeNumber (ticker, 'open'),
            'close': this.safeNumber (ticker, 'close'),
            'last': this.safeNumber (ticker, 'close'),
            'previousClose': this.safeNumber (ticker, 'previousClose'),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeNumber (ticker, 'baseVolume'),
            'indexPrice': this.safeNumber (ticker, 'indexPrice'),
            'markPrice': this.safeNumber (ticker, 'markPrice'),
            'quoteVolume': this.safeNumber (ticker, 'quoteVolume'),
            'info': ticker,
        };
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name gains#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'pair': symbol,
        };
        const response = await this.publicGetTicker (this.extend (request, params));
        return this.parseTicker (response, market);
    }

    parseMarketLeverageTiers (info, market: Market = undefined): LeverageTier[] {
        const results = [];
        for (let j = 0; j < info.length; j++) {
            const leverageTier = info[j];
            results.push ({
                'tier': this.safeNumber (leverageTier, 'tier'),
                'currency': this.safeString (leverageTier, 'notionalCurrency'),
                'minNotional': this.safeNumber (leverageTier, 'minNotional'),
                'maxNotional': this.safeNumber (leverageTier, 'maxNotional'),
                'maintenanceMarginRate': this.safeNumber (leverageTier, 'maintenanceMarginRate'),
                'maxLeverage': this.safeNumber (leverageTier, 'maxLeverage'),
                'info': leverageTier,
            });
        }
        return results;
    }

    async fetchLeverageTiers (symbols: Strings = undefined, params = {}): Promise<LeverageTiers> {
        /**
         * @method
         * @name gains#fetchLeverageTiers
         * @description retrieve information on the maximum leverage, and maintenance margin for trades of varying trade sizes
         * @param {string[]|undefined} symbols list of unified market symbols
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [leverage tiers structures]{@link https://docs.ccxt.com/#/?id=leverage-tiers-structure}, indexed by market symbols
         */
        const request: Dict = {
            'symbols': symbols,
        };
        const response = await this.privateGetLeverageTiers (this.extend (request, params));
        return this.parseLeverageTiers (response);
    }

    parseLeverage (leverage: Dict, market: Market = undefined): Leverage {
        return {
            'info': leverage,
            'symbol': this.safeString (leverage, 'symbol'),
            'marginMode': this.safeString (leverage, 'marginMode'),
            'longLeverage': this.safeNumber (leverage, 'longLeverage'),
            'shortLeverage': this.safeNumber (leverage, 'shortLeverage'),
        };
    }

    async setLeverage (leverage: Int, symbol: Str = undefined, params = {}): Promise<Dict> {
        /**
         * @method
         * @name gains#setLeverage
         * @description set the level of leverage for a market
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {float} leverage the rate of leverage
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} response from the exchange
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setLeverage() requires a symbol argument');
        }
        const request: Dict = {
            'pair': symbol,
            'long_leverage': leverage,
            'short_leverage': leverage,
        };
        const response = await this.privatePostLeverage (this.extend (request, params));
        return this.parseLeverage (response);
    }

    parseTrades (trades: any[], market: Market = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Trade[] {
        const result = [];
        for (let i = 0; i < trades.length; i++) {
            result.push (this.parseTrade (trades[i], market));
        }
        return result;
    }

    parseFee (fee: Dict): Fee {
        return {
            'currency': this.safeString (fee, 'currency'),
            'cost': this.safeNumber (fee, 'cost'),
            'rate': this.safeNumber (fee, 'rate'),
        };
    }

    parseFeeAndFees (container: Dict) {
        const fee = this.parseFee (this.safeValue (container, 'fee'));
        const fees = this.safeValue (container, 'fees', []).map ((feeObject) => this.parseFee (feeObject));
        return [ fee, fees ];
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        const fees = this.safeValue (trade, 'fees', []).map ((feeObject) => this.parseFee (feeObject));
        const timestamp = this.safeInteger (trade, 'timestamp');
        return {
            'id': this.safeString (trade, 'id'),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'order': this.safeString (trade, 'order'),
            'type': this.safeString (trade, 'type'),
            'side': this.safeString (trade, 'side'),
            'takerOrMaker': this.safeString (trade, 'takerOrMaker'),
            'price': this.safeNumber (trade, 'price'),
            'amount': this.safeNumber (trade, 'amount'),
            'cost': this.safeNumber (trade, 'cost'),
            'fee': fees,
        };
    }

    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        /**
         * @method
         * @name gains#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] timestamp in ms of the earliest trade to fetch
         * @param {int} [limit] the maximum amount of trades to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
         */
        const request: Dict = {
            'symbol': symbol,
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['since'] = since;
        }
        const response = await this.publicGetTrades (this.extend (request, params));
        return this.parseTrades (response);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let endpoint = '/' + this.implodeParams (path, params);
        let url = this.implodeHostname (this.urls['api'][api]);
        headers = headers || {};
        const query = this.omit (params, this.extractParams (path));
        if (query) {
            if ((method === 'GET') || (method === 'DELETE')) {
                endpoint += '?' + this.urlencode (query);
            } else {
                body = this.json (query);
                headers['Content-Type'] = 'application/json';
            }
        }
        url = url + endpoint;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        const code = this.safeString (response, 'code');
        const message = this.safeString (response, 'msg');
        if (code !== undefined && code !== '0') {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
            this.throwExactlyMatchedException (this.exceptions['exact'], code, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            throw new ExchangeError (feedback); // unknown message
        }
        return undefined;
    }
}
