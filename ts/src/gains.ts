
//  ---------------------------------------------------------------------------

import Exchange from './abstract/gains.js';
import { ArgumentsRequired, InsufficientFunds, InvalidOrder, AuthenticationError, BadRequest, ExchangeError } from './base/errors.js';
import type { Balances, Dict, int, Int, LeverageTiers, Market, Num, OHLCV, Order, OrderSide, OrderType, Str, Strings, Ticker, Trade } from './base/types.js';
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
                'fetchLeverageTiers': true,
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
                    'public': 'http://127.0.0.1:8000', // TODO: update this
                    'private': 'http://127.0.0.1:8000',  // TODO: update this
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

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name gains#fetchMarkets
         * @description retrieves data on all markets for ace
         * @see TODO add a link to the relevant part of the exchange API documentation
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetMarkets (params);
        return this.parseMarkets (response);
    }

    parseMarket (market: Dict): Market {
        // TODO: update this method with real implementation
        return {
            'id': 'BTC/USDT',
            'uppercaseId': undefined,
            'symbol': 'BTC/USDT',
            'base': 'BTC',
            'baseId': '122',
            'quote': 'USDT',
            'quoteId': '1',
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
                    'min': 0.1,
                    'max': 480286,
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
                'price': 100,
                'amount': 1,
            },
            'active': undefined,
            'created': undefined,
            'info': market,
        };
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        const timestamp: Int = this.safeInteger (order, 'timestamp', undefined);
        return this.safeOrder ({
            'id': this.safeString (order, 'id'),
            'clientOrderId': undefined,
            'timestamp': this.safeInteger (order, 'timestamp', undefined),
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'symbol': this.safeString (order, 'symbol', undefined),
            'type': this.safeString (order, 'type', undefined),
            'timeInForce': undefined,
            'postOnly': undefined,
            'side': this.safeString (order, 'side', undefined),
            'price': this.safeFloat (order, 'price', undefined),
            'stopPrice': undefined,
            'amount': this.safeFloat (order, 'amount', undefined),
            'cost': undefined,
            'average': this.safeFloat (order, 'average', undefined),
            'filled': this.safeFloat (order, 'filled', undefined),
            'remaining': this.safeFloat (order, 'remaining', undefined),
            'status': this.safeString (order, 'status', undefined),
            'fee': this.safeDict (order, 'fee', {}),
            'trades': this.safeList (order, 'trades', []),
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
        const market = this.market (symbol);
        const request: Dict = {
            'id': id,
            'pair': market['id'],
        };
        const response = await this.privateGetOrder (this.extend (request, params));
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
         * @name gains#fetchOrders
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
            'pair': market['id'],
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
        const request: Dict = {
            'pair': market['id'],
            'type': type,
            'side': side,
            'amount': this.amountToPrecision (symbol, amount),
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
        const market = this.market (symbol);
        const request: Dict = {
            'orderNo': id,
            'pair': market['id'],
        };
        const response = await this.privateDeleteOrder (this.extend (request, params));
        return this.parseOrder (response, market);
    }

    parseBalance (balance): Balances {
        const timestamp = this.safeInteger (balance, 'timestamp');
        return this.safeBalance ({
            'info': balance,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'free': this.safeDict (balance, 'free', {}),
            'used': this.safeDict (balance, 'used', {}),
            'total': this.safeDict (balance, 'total', {}),
            'debt': this.safeDict (balance, 'debt', {}),
        });
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
            'pair': market['id'],
            'timeframe': this.timeframes[timeframe],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['since'] = since;
        }
        const response = await this.publicGetOhlcv (this.extend (request, params));
        return this.parseOHLCVs (response, market, timeframe, since, limit);
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        const marketId = this.safeString (ticker, 'id');
        const symbol = this.safeSymbol (marketId, market);
        const timestamp = this.safeInteger2 (ticker, 'timestamp', 'timestamp');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'high'),
            'low': this.safeString (ticker, 'low'),
            'bid': this.safeString (ticker, 'bid'),
            'bidVolume': this.safeString (ticker, 'bid_volume'),
            'ask': this.safeString (ticker, 'ask'),
            'askVolume': this.safeString (ticker, 'askVolume'),
            'vwap': this.safeString (ticker, 'vwap'),
            'open': this.safeString (ticker, 'open'),
            'close': this.safeString (ticker, 'close'),
            'last': undefined,
            'previousClose': this.safeString (ticker, 'previousClose'),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'baseVolume'),
            'quoteVolume': this.safeString (ticker, 'quoteVolume'),
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
        const request: Dict = {
            'pair': market['id'],
        };
        const response = await this.publicGetTicker (this.extend (request, params));
        return this.parseTicker (response, market);
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
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'pair': market['id'],
            'leverage': leverage,
        };
        return await this.privatePostLeverage (this.extend (request, params));
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        const timestamp = this.safeInteger (trade, 'timestamp');
        market = this.safeMarket (undefined, market);
        return this.safeTrade ({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'id': this.safeString (trade, 'id'),
            'order': this.safeString (trade, 'order'),
            'type': this.safeString (trade, 'type'),
            'takerOrMaker': this.safeString (trade, 'takerOrMaker'),
            'side': this.safeString (trade, 'side'),
            'price': this.safeString (trade, 'price'),
            'amount': this.safeString (trade, 'amount'),
            'cost': this.safeString (trade, 'cost'),
            'fee': this.safeList (trade, 'fee', []),
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
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['since'] = since;
        }
        const response = await this.publicGetTrades (this.extend (request, params));
        return this.parseTrades (response, market, since, limit);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let endpoint = '/' + this.implodeParams (path, params);
        let url = this.implodeHostname (this.urls['api'][api[0]]);
        headers = (headers !== undefined) ? headers : {};
        if (api[1] === 'private') {
            this.checkRequiredCredentials ();
            headers['TEST_API_KEY_HEADER'] = this.apiKey;
            headers['TEST_SECRET_KEY_HEADER'] = this.secret;
        }
        const query = this.omit (params, this.extractParams (path));
        if (Object.keys (query).length) {
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
        //
        //    {
        //        "code": 80014,
        //        "msg": "Invalid parameters, err:Key: 'GetTickerRequest.Symbol' Error:Field validation for "Symbol" failed on the "len=0|endswith=-USDT" tag",
        //        "data": {
        //        }
        //    }
        //
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
