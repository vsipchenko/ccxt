# -*- coding: utf-8 -*-

from ccxt.async_support.base.exchange import Exchange
from ccxt.abstract.gains import ImplicitAPI
from ccxt.base.types import Bool, Int, LeverageTier, LeverageTiers, Market, Num, Order, OrderSide, OrderType, Str, \
    Strings, Ticker, Trade, Fee, FundingHistory, Position, Balances
from typing import List, Any
from ccxt.base.errors import ExchangeError
from ccxt.base.errors import ArgumentsRequired
from ccxt.base.errors import NotSupported
from ccxt.base.decimal_to_precision import TICK_SIZE


class gains(Exchange, ImplicitAPI):

    def describe(self):
        return self.deep_extend(super(gains, self).describe(), {
            'id': 'gains',
            'name': 'gains',
            'countries': ['EU'],
            'version': 'v1',
            'rateLimit': 10,
            'pro': False,
            'has': {
                'CORS': None,
                'spot': False,
                'margin': False,
                'swap': False,
                'future': False,
                'option': False,
                'cancelAllOrders': False,
                'cancelOrder': True,
                'cancelOrders': False,
                'closeAllPositions': False,
                'closePosition': False,
                'createOrder': True,
                'editOrder': False,
                'fetchBalance': True,
                'fetch_markets': True,
                'fetchBorrowRateHistories': False,
                'fetchBorrowRateHistory': False,
                'fetchClosedOrders': False,
                'fetchCrossBorrowRate': False,
                'fetchCrossBorrowRates': False,
                'fetchCurrencies': False,
                'fetchDepositAddress': False,
                'fetchDeposits': False,
                'fetchFundingHistory': True,
                'fetchFundingRate': False,
                'fetchFundingRateHistory': False,
                'fetchFundingRates': False,
                'fetchIndexOHLCV': False,
                'fetchIsolatedBorrowRate': False,
                'fetchIsolatedBorrowRates': False,
                'fetchLeverageTiers': True,
                'fetchMarginMode': False,
                'fetchMarkets': True,
                'fetchMarkOHLCV': False,
                'fetchMyTrades': True,
                'fetchOHLCV': True,
                'fetchOpenInterestHistory': False,
                'fetchOpenOrders': False,
                'fetchOrder': True,
                'fetchOrderBook': True,
                'fetchOrders': True,
                'fetchOrderTrades': False,
                'fetchPosition': False,
                'fetchPositionHistory': False,
                'fetchPositionMode': False,
                'fetchPositions': True,
                'fetchPositionsForSymbol': False,
                'fetchPositionsHistory': False,
                'fetchPositionsRisk': False,
                'fetchPremiumIndexOHLCV': False,
                'fetchTicker': True,
                'fetchTickers': False,
                'fetchTime': False,
                'fetchTrades': True,
                'fetchTradingFee': False,
                'fetchTradingFees': False,
                'fetchTransactionFees': False,
                'fetchTransactions': False,
                'fetchTransfer': False,
                'fetchTransfers': False,
                'fetchWithdrawal': False,
                'fetchWithdrawals': False,
                'setLeverage': True,
                'setMarginMode': False,
                'transfer': False,
                'withdraw': False,
                'ws': False,
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
                    'public': 'http://localhost:8000',
                    'private': 'http://localhost:8000',
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
                    ],
                },
                'private': {
                    'get': [
                        'orders',
                        'order',
                        'trades',
                        'positions',
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
            'exceptions': {},
            'commonCurrencies': {
            },
        })

    async def fetch_markets(self, params={}) -> List[Market]:
        response = await self.publicGetMarkets(params)
        return self.parse_markets(response)

    def parse_markets(self, markets: list) -> List[Market]:
        result = []
        for i in range(0, len(markets)):
            result.append(self.parse_market(markets[i]))
        return result

    def parse_market(self, market: dict) -> Market:
        precision = self.safe_value(market, 'precision', {})
        limits = self.safe_dict(market, 'limits', {})
        limit_amount = self.safe_dict(limits, 'amount', {})
        limit_price = self.safe_dict(limits, 'price', {})
        limit_cost = self.safe_dict(limits, 'cost', {})
        limit_leverage = self.safe_dict(limits, 'leverage', {})
        return  {
            'id': self.safe_string(market, 'id'),
            'symbol': self.safe_string(market, 'symbol'),
            'base': self.safe_string(market, 'base'),
            'baseId': self.safe_string(market, 'baseId'),
            'quote': self.safe_string(market, 'quote'),
            'quoteId': self.safe_string(market, 'quoteId'),
            'active': self.safe_value(market, 'active', True),
            'type': self.safe_string(market, 'type'),
            'spot': self.safe_string(market, 'type') == 'spot',
            'margin': self.safe_string(market, 'type') == 'margin',
            'future': self.safe_string(market, 'type') == 'future',
            'swap': self.safe_string(market, 'type') == 'swap',
            'option': self.safe_string(market, 'type') == 'option',
            'contract': self.safe_string(market, 'type') in ('option', 'future', 'swap'),
            'settle': None,
            'settleId': None,
            'contractSize': None,
            'linear': True,
            'inverse': None,
            'expiry': None,
            'expiryDatetime': None,
            'strike': None,
            'optionType': None,
            'taker': self.safe_float(market, 'taker'),
            'maker': self.safe_float(market, 'maker'),
            'percentage': self.safe_bool(market, 'percentage', False),
            'tierBased': self.safe_bool(market, 'tierBased', False),
            'feeSide': 'quote',
            'precision': {
                'price': self.safe_integer(precision, 'price'),
                'amount': self.safe_integer(precision, 'amount'),
                'cost': self.safe_integer(precision, 'cost')
            },
            'limits': {
                'amount' : {
                    'min': self.safe_number(limit_amount, 'min'),
                    'max': self.safe_number(limit_amount, 'max'),
                },
                'price': {
                    'min': self.safe_number(limit_price, 'min'),
                    'max': self.safe_number(limit_price, 'max'),
                },
                'cost': {
                    'min': self.safe_number(limit_cost, 'min'),
                    'max': self.safe_number(limit_cost, 'max'),
                },
                'leverage': {
                    'min': self.safe_number(limit_leverage, 'min'),
                    'max': self.safe_number(limit_leverage, 'max'),
                }
            },
            'marginModes': {
                'cross': False,
                'isolated': False,
            },
            'info': market,
        }

    def parse_orders(self, orders: list, market: Market = None, since: Int = None, limit: Int = None, params={}) -> List[Order]:
        result = []
        for i in range(0, len(orders)):
            result.append(self.parse_order(orders[i]))
        return result

    def parse_order(self, order: dict, market: Market = None) -> Order:
        timestamp: Int = self.safe_integer(order, 'timestamp', None)
        order_is_open = self.safe_value(order, 'isOpen', None)
        fee, fees = self.parsed_fee_and_fees(order)
        return {
            'id': self.safe_string(order, 'id'),
            'clientOrderId': self.safe_string(order, 'clientOrderId', None),
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'lastTradeTimestamp': self.safe_integer(order, 'lastTradeTimestamp', None),
            'lastUpdateTimestamp': self.safe_integer(order, 'lastUpdated', None),
            'symbol': self.safe_string(order, 'symbol', None),
            'type': self.safe_string(order, 'type', None),
            'timeInForce': self.safe_string(order, 'timeInForce', None),
            'postOnly': None,
            'side': self.safe_string(order, 'side', None),
            'price': self.safe_float(order, 'price', None),
            'stopPrice': None,
            'stopLossPrice': None,
            'takeProfitPrice': None,
            'reduceOnly': not order_is_open if order_is_open is not None else None,
            'amount': self.safe_float(order, 'amount', None),
            'cost': self.safe_float(order, 'cost', None),
            'average': self.safe_float(order, 'average', None),
            'filled': self.safe_float(order, 'filled', None),
            'remaining': self.safe_float(order, 'remaining', None),
            'status': self.safe_string(order, 'status', None),
            'fee': fee,
            'fees': fees,
            'trades': self.parse_trades([self.safe_dict(order, 'trade')]),
            'info': order,
        }

    async def fetch_order(self, id: str, symbol: Str = None, params={}) -> Order:
        request: dict = {
            'id': id,
            'pair': symbol,
        }
        response = await self.privateGetOrder(self.extend(request, params))
        return self.parse_order(response)

    async def fetch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Order]:
        if symbol is None:
            raise ArgumentsRequired(self.id + ' fetchOrders() requires a symbol argument')
        request: dict = {
            'symbol': symbol,
        }
        if since is not None:
            request['since'] = since
        if limit is not None:
            request['limit'] = limit
        response = await self.privateGetOrders(self.extend(request, params))
        return self.parse_orders(response)

    async def create_order(self, symbol: str, type: OrderType, side: OrderSide, amount: float, price: Num = None, params={}) -> Order:
        request: dict = {
            'pair': symbol,
            'type': type,
            'side': side,
            'amount': amount,
        }
        if type != 'market':
            raise NotSupported(self.id + ' createOrder() supports market orders only')
        if side != 'buy' and side != 'sell':
            raise NotSupported(self.id + ' createOrder() side must be buy or sell')
        response = await self.privatePostOrder(self.extend(request, params))
        return self.parse_order(response)

    async def cancel_order(self, id: str, symbol: Str = None, params={}) -> Order:
        request: dict = {
            'id': id,
        }
        response = await self.privateDeleteOrder(self.extend(request, params))
        return self.parse_order(response)

    def parse_balance(self, response) -> Balances:
        result = {}
        balances = self.safe_value(response, 'balance', {})

        for currency in balances:
            result[currency] = {
                'free': self.safe_number(balances[currency], 'free'),
                'used': self.safe_number(balances[currency], 'used'),
                'total': self.safe_number(balances[currency], 'total'),
                'debt': self.safe_number(balances[currency], 'debt', 0),
            }

        result['timestamp'] = self.safe_integer(response, 'timestamp')
        result['datetime'] = self.safe_string(response, 'datetime')

        return result

    async def fetch_balance(self, params={}) -> dict:
        response = await self.privateGetBalance(params)
        return self.parse_balance(response)

    def parse_ohlcvs(self, ohlcvs: List[object], market: Any = None, timeframe: str = '1m', since: Int = None, limit: Int = None, tail: Bool = False):
        results = []
        for i in range(0, len(ohlcvs)):
            results.append(self.parse_ohlcv(ohlcvs[i]))
        return results

    def parse_ohlcv(self, ohlcv, market: Market = None) -> list:
        if isinstance(ohlcv, list):
            return [
                self.safe_integer(ohlcv, 0),  # timestamp
                self.safe_number(ohlcv, 1),   # open
                self.safe_number(ohlcv, 2),   # high
                self.safe_number(ohlcv, 3),   # low
                self.safe_number(ohlcv, 4),   # close
                self.safe_number(ohlcv, 5),   # volume
            ]
        return ohlcv

    async def fetch_ohlcv(self, symbol: str, timeframe='1m', since: Int = None, limit: Int = None, params={}) -> List[list]:
        request: dict = {
            'pair': symbol,
            'timeframe': timeframe,
        }
        if limit is not None:
            request['limit'] = limit
        if since is not None:
            request['since'] = since
        response = await self.publicGetOhlcv(self.extend(request, params))
        return self.parse_ohlcvs(response)

    def parse_ticker(self, ticker: dict, market: Market = None) -> Ticker:
        timestamp = self.safe_integer(ticker, 'timestamp')
        return {
            'symbol': self.safe_string(ticker, 'symbol'),
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'high': self.safe_number(ticker, 'high'),
            'low': self.safe_number(ticker, 'low'),
            'bid': self.safe_number(ticker, 'bid'),
            'bidVolume': self.safe_number(ticker, 'bid_volume'),
            'ask': self.safe_number(ticker, 'ask'),
            'askVolume': self.safe_number(ticker, 'askVolume'),
            'vwap': self.safe_number(ticker, 'vwap'),
            'open': self.safe_number(ticker, 'open'),
            'close': self.safe_number(ticker, 'close'),
            'last': self.safe_number(ticker, 'last'),
            'previousClose': self.safe_number(ticker, 'previousClose'),
            'change': self.safe_number(ticker, 'change'),
            'percentage': self.safe_number(ticker, 'percentage'),
            'average': self.safe_number(ticker, 'average'),
            'baseVolume': self.safe_number(ticker, 'baseVolume'),
            'quoteVolume': self.safe_number(ticker, 'quoteVolume'),
            'info': ticker,
        }

    async def fetch_ticker(self, symbol: str, params={}) -> Ticker:
        request: dict = {
            'pair': symbol,
        }
        response = await self.publicGetTicker(self.extend(request, params))
        return self.parse_ticker(response)

    def parse_leverage_tiers(self, response: Any, symbols: List[str] = None, marketIdKey=None) -> LeverageTiers:
        results = {}
        for symbol, tiers in response.items():
            results[symbol] = self.parse_market_leverage_tiers(tiers)
        return results

    def parse_market_leverage_tiers(self, info, market: Market = None) -> List[LeverageTier]:
        results = []
        for j in range(0, len(info)):
            leverageTier = info[j]
            results.append({
                'tier': self.safe_number(leverageTier, 'tier'),
                'currency': self.safe_string(leverageTier, 'notionalCurrency'),
                'minNotional': self.safe_number(leverageTier, 'minNotional'),
                'maxNotional': self.safe_number(leverageTier, 'maxNotional'),
                'maintenanceMarginRate': self.safe_number(leverageTier, 'maintenanceMarginRate'),
                'maxLeverage': self.safe_number(leverageTier, 'maxLeverage'),
                'info': leverageTier,
            })
        return results

    async def fetch_leverage_tiers(self, symbols: Strings = None, params={}) -> LeverageTiers:
        request: dict = {}
        if symbols is not None:
            request['symbols'] = symbols
        response = await self.privateGetLeverageTiers(self.extend(request, params))
        return self.parse_leverage_tiers(response)

    def parse_leverage(self, leverage: dict, market: Market = None) -> dict:
        return {
            "info": leverage,
            "symbol": self.safe_string(leverage, 'symbol'),
            "marginMode": self.safe_string(leverage, 'marginMode'),
            "longLeverage": self.safe_number(leverage, 'longLeverage'),
            "shortLeverage": self.safe_number(leverage, 'shortLeverage'),
        }

    async def set_leverage(self, leverage: Int, symbol: Str = None, params={}) -> dict:
        if symbol is None:
            raise ArgumentsRequired(self.id + ' setLeverage() requires a symbol argument')

        request: dict = {
            'pair': symbol,
            'long_leverage': leverage,
            'short_leverage': leverage,
        }
        response = await self.privatePostLeverage(self.extend(request, params))
        return self.parse_leverage(response)

    def parse_fee(self, container: dict):
        if not container:
            return {'currency': 'USD', 'rate': 0, 'cost': 0}

        return {
            'currency': 'USD',
            'rate': self.safe_number(container, 'rate', 0),
            'cost': self.safe_number(container, 'cost', 0)
        }

    def parsed_fee_and_fees(self, container):
        fees_list = self.safe_list(container, 'fees', [])
        fee = {'currency': 'USD', 'rate': 0, 'cost': 0}
        fees = []
        if not fees_list:
            return fee, [fee]

        for f in fees_list:
            parsed = self.parse_fee(f)
            fee['rate'] += parsed['rate']
            fee['cost'] += parsed['cost']
            fees.append(parsed)

        return fee, fees

    def parse_trades(self, trades: list, market: Market = None, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        result = []
        for i in range(0, len(trades)):
            result.append(self.parse_trade(trades[i]))
        return result

    def parse_trade(self, trade: dict, market: Market = None) -> Trade:
        fee, fees = self.parsed_fee_and_fees(trade)
        return {
            'id': self.safe_string(trade, 'id'),
            'symbol': self.safe_string(trade, 'symbol'),
            'timestamp': self.safe_integer(trade, 'timestamp'),
            'datetime': self.safe_string(trade, 'datetime'),
            'order': self.safe_string(trade, 'closeOrderId') or self.safe_string(trade, 'openOrderId'),
            'type': self.safe_string(trade, 'type'),
            'takerOrMaker': self.safe_string(trade, 'takerOrMaker'),
            'side': self.safe_string(trade, 'side'),
            'price': self.safe_string(trade, 'price'),
            'amount': self.safe_string(trade, 'amount'),
            'cost': self.safe_string(trade, 'cost'),
            'fee': fee,
            'fees': fees,
            'info': trade,
        }

    async def fetch_trades(self, symbol: str, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        request: dict = {
            'symbol': symbol,
        }
        if limit is not None:
            request['limit'] = limit
        if since is not None:
            request['since'] = since
        response = await self.privateGetTrades(self.extend(request, params))
        return self.parse_trades(response, None, since, limit)

    async def fetch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        # TODO temporary repeat method fetch_trades
        return await self.fetch_trades(symbol, since, limit, params)

    def fetch_positions(self, symbols: Strings = None, params={}) -> List[Position]:
        request: dict = {}
        if symbols:
            # TODO move this logic into adapter
            symbol = symbols[0] if isinstance(symbols, list) else symbols
            request['symbol'] = symbol
        response = self.privateGetPositions(self.extend(request, params))
        return self.parse_positions(response)

    def parse_positions(self, positions: List[Any], symbols: List[str] = None, params={}) -> List[Position]:
        result = []
        for i in range(0, len(positions)):
            result.append(self.parse_position(positions[i]))
        return result

    def parse_position(self, position: dict, market: Market = None) -> Position:
        return {
            'info': position,
            'id': self.safe_string(position, 'id'),
            'symbol': self.safe_string(position, 'symbol'),
            'timestamp': self.safe_integer(position, 'timestamp'),
            'datetime': self.safe_string(position, 'datetime'),
            'isolated': self.safe_value(position, 'isolated'),
            'hedged': self.safe_value(position, 'hedged'),
            'side': self.safe_string(position, 'side'),
            'contracts': self.safe_float(position, 'contracts'),
            'contractSize': self.safe_float(position, 'contractSize'),
            'entryPrice': self.safe_float(position, 'entryPrice'),
            'markPrice': self.safe_float(position, 'markPrice'),
            'notional': self.safe_float(position, 'notional'),
            'leverage': self.safe_float(position, 'leverage'),
            'collateral': self.safe_float(position, 'collateral'),
            'initialMargin': self.safe_float(position, 'initialMargin'),
            'maintenanceMargin': self.safe_float(position, 'maintenanceMargin'),
            'initialMarginPercentage': self.safe_float(position, 'initialMarginPercentage'),
            'maintenanceMarginPercentage': self.safe_float(position, 'maintenanceMarginPercentage'),
            'unrealizedPnl': self.safe_float(position, 'unrealizedPnl'),
            'liquidationPrice': self.safe_float(position, 'liquidationPrice'),
            'marginMode': self.safe_string(position, 'marginMode'),
            'percentage': self.safe_float(position, 'percentage'),
        }

    async def fetch_funding_history(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}) -> List[FundingHistory]:
        return []

    def sign(self, path, api='public', method='GET', params={}, headers=None, body=None):
        endpoint = '/' + self.implode_params(path, params)
        url = self.implode_hostname(self.urls['api'][api])
        headers = headers if (headers is not None) else {}
        query = self.omit(params, self.extract_params(path))
        if query:
            if (method == 'GET') or (method == 'DELETE'):
                endpoint += '?' + self.urlencode(query)
            else:
                body = self.json(query)
                headers['Content-Type'] = 'application/json'
        url = url + endpoint
        return {'url': url, 'method': method, 'body': body, 'headers': headers}

    def handle_errors(self, httpCode: int, reason: str, url: str, method: str, headers: dict, body: str, response, requestHeaders, requestBody):
        if response is None:
            return None
        code = self.safe_string(response, 'code')
        message = self.safe_string(response, 'msg')
        if code is not None and code != '0':
            feedback = self.id + ' ' + body
            self.throw_exactly_matched_exception(self.exceptions['exact'], message, feedback)
            self.throw_exactly_matched_exception(self.exceptions['exact'], code, feedback)
            self.throw_broadly_matched_exception(self.exceptions['broad'], message, feedback)
            raise ExchangeError(feedback)
        return None
