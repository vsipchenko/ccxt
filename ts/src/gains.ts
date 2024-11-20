
//  ---------------------------------------------------------------------------

import Exchange from './abstract/gains.js';
import { ArgumentsRequired, InsufficientFunds, InvalidOrder, AuthenticationError, BadRequest, BadSymbol } from './base/errors.js';
import type {
    Balances,
    Bool,
    Dict,
    Int,
    LeverageTiers,
    Market,
    Num,
    OHLCV,
    Order,
    OrderSide,
    OrderType,
    Str,
    Strings,
    Ticker, Trade,
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
            'countries': [ 'TW' ], // Taiwan
            'version': 'v2',
            'rateLimit': 100,
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
                'fetchMarginMode': false,
                'fetchMarkets': false,
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
                'logo': 'https://some-logo.jpg',  // TODO: update this
                'api': {
                    'public': 'http://127.0.0.1:8000/public', // TODO: update this
                    'private': 'http://127.0.0.1:8000/',  // TODO: update this
                },
                'www': 'https://gains.com/',  // TODO: update this
                'doc': [
                    'https://gains.com/gains-offical-api-docs',  // TODO: update this
                ],
                'fees': 'https://gains.com/fees',  // TODO: update this
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'api': {
                'private': {  // private methods, but public also possible 'public': {....}
                    'get': [
                        'orders',
                        'order',
                        'balance',
                        'ohlcv',
                        'ticker',
                        'leverage_tiers',
                        'trades',
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
                'trading': {
                    'percentage': true,
                    'maker': this.parseNumber ('0.0005'),
                    'taker': this.parseNumber ('0.001'),
                },
            },
            'options': {
                'brokerId': 'ccxt',
            },
            'precisionMode': TICK_SIZE,
            'exceptions': {
                'exact': {
                    '2003': InvalidOrder,
                    '2004': InvalidOrder,
                    '2005': InvalidOrder,
                    '2021': InsufficientFunds,
                    '2036': InvalidOrder,
                    '2039': InvalidOrder,
                    '2053': InvalidOrder,
                    '2061': BadRequest,
                    '2063': InvalidOrder,
                    '9996': BadRequest,
                    '10012': AuthenticationError,
                    '20182': AuthenticationError,
                    '20183': InvalidOrder,
                },
                'broad': {
                },
            },
            'commonCurrencies': {
            },
        });
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        // TODO update with real parser function
        return this.safeOrder ({
            'id': '12345-67890',
            'clientOrderId': undefined,
            'timestamp': 1652376800000,
            'datetime': this.iso8601 (1652376800000),
            'lastTradeTimestamp': undefined,
            'symbol': 'BTC/USD',
            'type': 'limit',
            'timeInForce': undefined,
            'postOnly': undefined,
            'side': 'buy',
            'price': 50000.0,
            'stopPrice': undefined,
            'amount': 0.1,
            'cost': undefined,
            'average': undefined,
            'filled': 0.0,
            'remaining': 0.1,
            'status': 'open',
            'fee': undefined,
            'trades': undefined,
            'info': order,
        }, market);
    }

    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name gains#fetchOrder
         * @description fetches information on an order made by the user
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {string} id the order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        // TODO update this method with real implementation
        await this.loadMarkets ();
        const request: Dict = {
            'id': id,
        };
        const response = await this.privateGetOrder (this.extend (request, params));
        //
        // {
        //         "id": "12345-67890",
        //         "timestamp": 1652376800000,
        //         "status": "open",
        //         "symbol": "BTC/USD",
        //         "type": "limit",
        //         "side": "buy",
        //         "price": 50000.0,
        //         "amount": 0.1,
        //         "filled": 0.0,
        //         "remaining": 0.1,
        //         "cost": 0.0,
        //         "timeInForce": None,
        //         "average": None,
        //         "trades": [],
        //         "fee": {
        //             "currency": "BTC",
        //             "cost": 0.0009,
        //             "rate": 0.002,
        //
        //         }
        //     }
        //
        return this.parseOrder (response, undefined);
    }

    parseOrders (orders: object, market: Market = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Order[] {
        // TODO check for implementation, might be issues
        let results = [];
        if (Array.isArray (orders)) {
            for (let i = 0; i < orders.length; i++) {
                const order = this.extend (this.parseOrder (orders[i], market), params);
                results.push (order);
            }
        } else {
            const ids = Object.keys (orders);
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const order = this.extend (this.parseOrder (this.extend ({ 'id': id }, orders[id]), market), params);
                results.push (order);
            }
        }
        results = this.sortBy (results, 'timestamp');
        const symbol = (market !== undefined) ? market['symbol'] : undefined;
        return this.filterBySymbolSinceLimit (results, symbol, since, limit) as Order[];
    }

    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        /**
         * @method
         * @name binance#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @see TODO add a link to the relevant part of the exchange API documentation
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
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetOrders (this.extend (request, params));
        return this.parseOrders (response, market, since, limit);
    }

    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        /**
         * @method
         * @name gains#createOrder
         * @description create a trade order
         * @see TODO add a link to the relevant part of the exchange API documentation
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
        const orderType = type.toUpperCase ();
        const orderSide = side.toUpperCase ();
        const request: Dict = {
            'baseCurrencyId': market['baseId'],
            'quoteCurrencyId': market['quoteId'],
            'type': (orderType === 'LIMIT') ? 1 : 2,
            'buyOrSell': (orderSide === 'BUY') ? 1 : 2,
            'num': this.amountToPrecision (symbol, amount),
        };
        if (type === 'limit') {
            request['price'] = this.priceToPrecision (symbol, price);
        }
        const response = await this.privatePostOrder (this.extend (request, params));
        return this.parseOrder (response, market);
    }

    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name gains#cancelOrder
         * @description cancels an open order
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const request: Dict = {
            'orderNo': id,
        };
        const response = await this.privateDeleteOrder (this.extend (request, params));
        return response;
    }

    parseBalance (response): Balances {
        const result: Dict = {
            'info': response,
        };
        for (let i = 0; i < response.length; i++) {
            const balance = response[i];
            const currencyId = this.safeString (balance, 'currencyName');
            const code = this.safeCurrencyCode (currencyId);
            const amount = this.safeString (balance, 'amount');
            const available = this.safeString (balance, 'cashAmount');
            const account: Dict = {
                'free': available,
                'total': amount,
            };
            result[code] = account;
        }
        return this.safeBalance (result);
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
        await this.loadMarkets ();
        const response = await this.privateGetBalance (params);
        return this.parseBalance (response);
    }

    parseOHLCVs (ohlcvs: object[], market: any = undefined, timeframe: string = '1m', since: Int = undefined, limit: Int = undefined, tail: Bool = false): OHLCV[] {
        const results = [];
        for (let i = 0; i < ohlcvs.length; i++) {
            results.push (this.parseOHLCV (ohlcvs[i], market));
        }
        const sorted = this.sortBy (results, 0);
        return this.filterBySinceLimit (sorted, since, limit, 0, tail) as any;
    }

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name gains#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'timeframe': this.timeframes[timeframe],
            'quoteCurrencyId': market['quoteId'],
            'baseCurrencyId': market['baseId'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['since'] = since;
        }
        const response = await this.privateGetOhlcv (this.extend (request, params));
        return this.parseOHLCVs (response, market, timeframe, since, limit);
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        const marketId = this.safeString (ticker, 'id');
        const symbol = this.safeSymbol (marketId, market);
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'high': undefined,
            'low': undefined,
            'bid': undefined,
            'bidVolume': undefined,
            'ask': undefined,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': this.safeString (ticker, 'last_price'),
            'last': this.safeString (ticker, 'last_price'),
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'base_volume'),
            'quoteVolume': this.safeString (ticker, 'quote_volume'),
            'info': ticker,
        }, market);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name gains#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const response = await this.privateGetTicker (params);
        const marketId = market['id'] as string;
        const ticker = this.safeDict (response, marketId, {}) as Dict;
        return this.parseTicker (ticker, market);
    }

    async fetchLeverageTiers (symbols: Strings = undefined, params = {}): Promise<LeverageTiers> {
        /**
         * @method
         * @name gains#fetchLeverageTiers
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @description retrieve information on the maximum leverage, and maintenance margin for trades of varying trade sizes
         * @param {string[]|undefined} symbols list of unified market symbols
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [leverage tiers structures]{@link https://docs.ccxt.com/#/?id=leverage-tiers-structure}, indexed by market symbols
         */
        await this.loadMarkets ();
        const response = await this.privateGetLeverageTiers (params);
        symbols = this.marketSymbols (symbols);
        return this.parseLeverageTiers (response, symbols, 'symbol');
    }

    async setLeverage (leverage: Int, symbol: Str = undefined, params = {}) {
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
        if ((leverage < 1) || (leverage > 100)) {
            throw new BadRequest (this.id + ' leverage should be between 1 and 100');
        }
        await this.loadMarkets ();
        await this.loadAccounts ();
        const market = this.market (symbol);
        if (!market['swap']) {
            throw new BadSymbol (this.id + ' setLeverage() supports swap contracts only');
        }
        const account = this.safeDict (this.accounts, 0, {});
        const accountGroup = this.safeString (account, 'id');
        const request: Dict = {
            'account-group': accountGroup,
            'symbol': market['id'],
            'leverage': leverage,
        };
        return await this.privatePostLeverage (this.extend (request, params));
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        const timestamp = this.safeInteger (trade, 'ts');
        const priceString = this.safeString2 (trade, 'price', 'p');
        const amountString = this.safeString (trade, 'q');
        const buyerIsMaker = this.safeBool (trade, 'bm', false);
        const side = buyerIsMaker ? 'sell' : 'buy';
        market = this.safeMarket (undefined, market);
        return this.safeTrade ({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'id': undefined,
            'order': undefined,
            'type': undefined,
            'takerOrMaker': undefined,
            'side': side,
            'price': priceString,
            'amount': amountString,
            'cost': undefined,
            'fee': undefined,
        }, market);
    }

    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        /**
         * @method
         * @name gains#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] timestamp in ms of the earliest trade to fetch
         * @param {int} [limit] the maximum amount of trades to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit; // max 100
        }
        const response = await this.privateGetTrades (this.extend (request, params));
        return this.parseTrades (response, market, since, limit);
    }
}
