# Gains Trade CCXT Integration

CCXT-compatible Python client for interacting with the Gains Trade adapter API.

## Table of Contents

- [Installation](#installation)
- [Initialization](#initialization)
- [Quick Start](#quick-start)
- [Symbols & conventions](#symbols--conventions)
- [Errors & rate limits](#errors--rate-limits)
- [API Reference](#api-reference)
  - [Markets](#fetch_markets)
  - [Ticker](#fetch_ticker)
  - [OHLCV](#fetch_ohlcv)
  - [Balance](#fetch_balance)
  - [Orders](#orders)
  - [Closing positions](#closing-positions)
  - [Trades](#trades)
  - [Positions](#fetch_positions)
  - [Leverage](#leverage)

## Installation

```bash
pip install ccxt
```

## Initialization

```python
import ccxt

exchange = ccxt.gains({
    'secret': '<YOUR_API_TOKEN>',
    'urls': {
        'api': {
            'public': 'http://your-adapter-host',
            'private': 'http://your-adapter-host',
        }
    }
})
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `secret` | Yes | API token used for Bearer authentication on all requests. `apiKey` is **not** used. |
| `urls.api.public` | No | Base URL for public endpoints (default: `http://localhost:8000`) |
| `urls.api.private` | No | Base URL for private endpoints (default: `http://localhost:8000`) |

> Both `public` and `private` URLs should point to the same adapter instance. Deployed instances listen on port 80 (nginx), local dev on 8000.

> **Timeout:** the class ships with a 30s default (`'timeout': 30000`) because market orders wait for on-chain execution events (1–3s typical on Arbitrum, longer under RPC/keeper slowness). Don't lower it below ~15s for write calls.

## Quick Start

A typical trading flow: load markets, check balance, set leverage, place an order, and monitor positions.

```python
import ccxt

# 1. Initialize the exchange
exchange = ccxt.gains({
    'secret': 'my-api-token',
    'urls': {
        'api': {
            'public': 'http://your-adapter-host',
            'private': 'http://your-adapter-host',
        }
    }
})

# 2. Load available markets
markets = exchange.fetch_markets()
print(f"Available markets: {len(markets)}")

# 3. Check your balance
balance = exchange.fetch_balance()
print(f"USDC balance: {balance['USDC']}")

# 4. Get current price
ticker = exchange.fetch_ticker('BTC/USD')
print(f"BTC last price: {ticker['last']}")

# 5. Set per-pair default leverage (local setting, no on-chain tx)
exchange.set_leverage(10, 'BTC/USD')

# 6. Place a market buy order with per-order leverage and TP/SL
order = exchange.create_order('BTC/USD', 'market', 'buy', 0.01, None,
                              {'leverage': 5, 'takeProfitPercent': 50, 'stopLossPercent': 5})
print(f"Order placed: {order['id']}, status: {order['status']}")

# 7. Place a limit buy order
limit_order = exchange.create_order('BTC/USD', 'limit', 'buy', 0.01, 50000.0, {'leverage': 5})
print(f"Limit order placed: {limit_order['id']}")

# 8. Check open positions
positions = exchange.fetch_positions(['BTC/USD'])
for pos in positions:
    print(f"Position: {pos['symbol']} {pos['side']} x{pos['leverage']}, PnL: {pos['unrealizedPnl']}")

# 9. Close a specific position by its trade UUID
if positions:
    close_order = exchange.close_position('BTC/USD', None, {'id': positions[0]['id']})
    print(f"Closed: {close_order['id']}, status: {close_order['status']}")

# 10. Cancel an open (unfilled) order
cancelled = exchange.cancel_order(limit_order['id'])
print(f"Cancelled order: {cancelled['id']}")
```

## Symbols & conventions

- **Symbol format is `BASE/USD`** — e.g. `BTC/USD`, `ETH/USD`. The quote is `USD`; the settlement currency is USDC (`settle: 'USDC'`). `BTC/USDC` is **not** a valid symbol.
- Sides: `buy` (long) / `sell` (short). Positions report `long` / `short`.
- Timestamps are Unix epoch **milliseconds**.
- All markets are isolated-margin synthetic perps (`type: 'swap'`); there is no order book (`fetchOrderBook` is not supported).
- OHLCV `volume` is always `0` — Gains does not expose per-pair volume. Do not treat it as liquidity.

## Errors & rate limits

Adapter errors (`{"error": "<message>"}` + HTTP status) are mapped to CCXT exception classes:

| Condition | Exception |
|---|---|
| Missing/invalid Bearer token (401) | `AuthenticationError` |
| Rate limit hit (429) | `RateLimitExceeded` |
| Unknown pair (`Invalid pair: ...`) | `BadSymbol` |
| Validation errors (`... must be ...`, `mutually exclusive`, `Missing required ...`) | `BadRequest` |
| Order/position not found (404, `no candidate found`) | `OrderNotFound` |
| Already processed / already closed / concurrent close | `InvalidOrder` |
| Unsupported operation (`... not yet supported`) | `NotSupported` |
| Anything else (incl. `BlockchainError: <reason>`) | `ExchangeError` |

Rate limits (per IP, adapter defaults): **60 requests/minute** globally, **10/minute** for writes (`create_order`, `close_position`). On 429, back off using the `RateLimit-Reset` response header.

## API Reference

---

### `fetch_markets`

Retrieves all available trading markets.

```python
markets = exchange.fetch_markets()
```

**Parameters:** None

**Returns:** `List[Market]` - array of market objects containing symbol, base/quote currencies, precision, limits, and fee information.

**Example response item:**
```python
{
    'id': '0',                 # on-chain pairIndex
    'symbol': 'BTC/USD',
    'base': 'BTC',
    'quote': 'USD',
    'settle': 'USDC',
    'active': True,
    'type': 'swap',
    'precision': {'price': 1e-10, 'amount': 1e-08, 'cost': 1e-06},
    'limits': {
        'amount': {'min': None, 'max': None},
        'leverage': {'min': 1.1, 'max': 200.0},
    },
    'taker': 0.0005,           # fractional (0.0005 = 0.05%)
    'maker': 0.0005,
}
```

Per-pair amount limits are not enforced locally; min/max notional is governed by leverage tiers (see [`fetch_leverage_tiers`](#fetch_leverage_tiers)).

---

### `fetch_ticker`

Fetches the 24h price ticker for a specific market.

```python
ticker = exchange.fetch_ticker('BTC/USD')
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | `str` | Yes | Unified market symbol (e.g. `'BTC/USD'`) |

**Returns:** `Ticker` - ticker object with price statistics.

**Example response:**
```python
{
    'symbol': 'BTC/USD',
    'timestamp': 1712150400000,
    'high': 71000.0,
    'low': 69000.0,
    'bid': 70105.9,            # synthetic: close - 0.02%
    'ask': 70134.1,            # synthetic: close + 0.02%
    'open': 69500.0,
    'close': 70120.0,
    'last': 70120.0,
    'change': 620.0,
    'percentage': 0.89,
    'baseVolume': 100,         # placeholder, not real volume
    'quoteVolume': 6750000,    # placeholder, not real volume
}
```

---

### `fetch_ohlcv`

Fetches historical candlestick (OHLCV) data.

```python
candles = exchange.fetch_ohlcv('BTC/USD', '1h', limit=100)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | `str` | Yes | Unified market symbol |
| `timeframe` | `str` | No | Candle interval (default: `'1m'`) |
| `since` | `int` | No | Start time in milliseconds (defaults to last 24h) |
| `limit` | `int` | No | Max number of candles to return |

**Supported timeframes:** `1m`, `5m`, `10m`, `15m`, `30m`, `45m`, `1h`, `4h`, `8h`, `12h`, `1d`, `1w`, `1M`

**Returns:** `List[list]` - array of `[timestamp, open, high, low, close, volume]`. `volume` is always `0`.

---

### `fetch_balance`

Queries account balance: USDC collateral plus the gas token (ETH on Arbitrum).

```python
balance = exchange.fetch_balance()
```

**Parameters:** None

**Returns:** `Balances` - balance object keyed by currency.

**Example response:**
```python
{
    'USDC': {'free': 5000.0, 'used': 1200.0, 'total': 6200.0, 'debt': 0.0},
    'USD':  {'free': 5000.0, 'used': 1200.0, 'total': 6200.0, 'debt': 0.0},  # alias of USDC
    'gas':  {'free': 0.0499, 'used': 0.0,    'total': 0.0499, 'debt': 0.0},  # ETH for tx fees
    'timestamp': 1712150400000,
    'datetime': '2025-04-03 12:00:00.000',
}
```

`used` is the collateral locked in currently open positions.

---

### Orders

#### `create_order`

Places a new trade order (opens a position), or closes one when `reduceOnly` is set — see [Closing positions](#closing-positions).

```python
# Market order
order = exchange.create_order('BTC/USD', 'market', 'buy', 0.01, None, {'leverage': 5})

# Limit order
order = exchange.create_order('BTC/USD', 'limit', 'sell', 0.05, 72000.0, {'leverage': 5})

# Market order with TP/SL (percent from entry)
order = exchange.create_order('BTC/USD', 'market', 'buy', 0.01, None,
                              {'leverage': 5, 'takeProfitPercent': 50, 'stopLossPercent': 5})

# Market order with absolute TP/SL trigger prices
order = exchange.create_order('ETH/USD', 'market', 'sell', 1.0, None,
                              {'leverage': 3, 'takeProfitPrice': 3500, 'stopLossPrice': 4200})
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | `str` | Yes | Unified market symbol |
| `type` | `str` | Yes | `'market'` or `'limit'` |
| `side` | `str` | Yes | `'buy'` or `'sell'` |
| `amount` | `float` | Yes | Order amount in base currency |
| `price` | `float` | limit only | Limit price; raises `ArgumentsRequired` if omitted for a limit order |
| `params.leverage` | `float` | No | `>= 1.1`. Fallback: per-pair `set_leverage()` value → server default (`1.1`) |
| `params.reduceOnly` | `bool` | No | `True` closes the most recent matching open position (see below) |
| `params.takeProfitPercent` | `float` | No | TP distance from entry, in percent. Mutually exclusive with `takeProfitPrice` |
| `params.takeProfitPrice` | `float` | No | Absolute TP trigger (above entry for long, below for short). Mutually exclusive with `takeProfitPercent` |
| `params.stopLossPercent` | `float` | No | SL distance from entry, in percent. Mutually exclusive with `stopLossPrice` |
| `params.stopLossPrice` | `float` | No | Absolute SL trigger (below entry for long, above for short). Mutually exclusive with `stopLossPercent` |

Omitted TP/SL legs are left unset on-chain (no auto-close). Max slippage is fixed at 2%.

**Returns:** `Order`

**Behaviour notes:**
- Market orders wait server-side for on-chain execution events; typical latency 1–3s, allow up to ~30s.
- If events don't correlate in time, the adapter returns a **fallback** response: `status: 'open'`, `filled: 0`, `average == price`. Refetch with `fetch_order(id)` after a short delay for settled values.
- `status: 'closed'` on a market order means **filled** — not that the position is closed. Check `fetch_positions()`.

---

#### `fetch_order`

Fetches a single order by ID.

```python
order = exchange.fetch_order('5b2b5d6a-...')
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `str` | Yes | Order UUID |
| `symbol` | `str` | No | Ignored (orders are fetched by id alone) |

**Returns:** `Order`. Raises `OrderNotFound` for an unknown id.

---

#### `fetch_orders`

Fetches multiple orders for a symbol, newest first (capped at 10 000).

```python
orders = exchange.fetch_orders('BTC/USD', since=1712000000000, limit=50)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | `str` | Yes | Unified market symbol (raises `ArgumentsRequired` if omitted) |
| `since` | `int` | No | Earliest time in ms |
| `limit` | `int` | No | Max number of orders |

**Returns:** `List[Order]`

---

#### `cancel_order`

Cancels a pending (unfilled) order — an unfilled limit order, or a market order stuck pending on-chain.

```python
result = exchange.cancel_order('5b2b5d6a-...')
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `str` | Yes | Order UUID |
| `symbol` | `str` | No | Not used |

**Returns:** `Order` with `status: 'canceled'`. An already-processed order raises `InvalidOrder`.

---

#### Order Structure

All order methods return objects with this structure:

```python
{
    'id': '5b2b5d6a-...',        # internal UUID — use for fetch_order/cancel_order
    'clientOrderId': '...',
    'timestamp': 1712150400000,
    'datetime': '2025-04-03T12:00:00.000Z',
    'symbol': 'BTC/USD',
    'type': 'market',
    'side': 'buy',
    'price': 70100.0,
    'amount': 0.01,
    'cost': 701.0,
    'average': 70102.1,
    'filled': 0.01,
    'remaining': 0.0,
    'status': 'closed',          # open | closed (= filled) | canceled | expired | rejected
    'fee': {'currency': 'USDC', 'rate': ..., 'cost': ...},   # combined open+close fees once the trade is closed
    'trades': [...],             # the associated trade, when present
    'info': { ... },             # raw adapter response
}
```

---

### Closing positions

Two ways to close; both submit a market close on-chain.

#### `close_position` — close a specific position by trade UUID

```python
positions = exchange.fetch_positions(['BTC/USD'])
close_order = exchange.close_position('BTC/USD', None, {'id': positions[0]['id']})
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | `str` | Yes | Unified market symbol (informational) |
| `side` | `str` | No | Not used |
| `params.id` | `str` | Yes | The trade UUID — the `id` field from `fetch_positions()`. Raises `ArgumentsRequired` if omitted |

**Returns:** `Order` — the close order. Use this when multiple positions exist on the same pair/side and you need to pick one.

#### `create_order` with `reduceOnly` — CCXT-standard close

```python
# close a long 0.01 BTC position
close_order = exchange.create_order('BTC/USD', 'market', 'sell', 0.01, None, {'reduceOnly': True})
```

Rules:
- `side` must be the **opposite** of the position's side.
- `amount` must **exactly match** the open position's amount, otherwise `OrderNotFound` (`no candidate found`).
- `type` must be `'market'` — limit closes are not supported (`NotSupported`).
- The adapter picks the **most recent** matching open position; to target a specific one, use `close_position`.

---

### Trades

#### `fetch_trades` / `fetch_my_trades`

Both return **your own** executed trades for a symbol, newest first (capped at 10 000) — there is no public trade feed.

```python
trades = exchange.fetch_my_trades('BTC/USD', limit=20)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | `str` | Yes | Unified market symbol |
| `since` | `int` | No | Earliest time in ms |
| `limit` | `int` | No | Max number of trades |
| `params.orderId` | `str` | No | Filter to trades originating from a specific order UUID |

**Returns:** `List[Trade]`

#### Trade Structure

```python
{
    'id': '<trade UUID>',        # use for close_position
    'symbol': 'BTC/USD',
    'timestamp': 1712150400000,
    'datetime': '2025-04-03 12:00:00.000',
    'order': '<order UUID>',     # closeOrderId if closed, else openOrderId
    'type': 'market',
    'side': 'buy',
    'takerOrMaker': 'taker',
    'price': 70100.0,
    'amount': 0.01,
    'cost': 701.0,
    'fee': None,
    'info': { ... },             # raw: includes isOpen, priceOpen/priceClose, fees, tradeId, ...
}
```

`info['isOpen']` tells whether the underlying position is still active.

---

### `fetch_positions`

Fetches open positions.

```python
# All positions
positions = exchange.fetch_positions()

# Filter by symbol
positions = exchange.fetch_positions(['BTC/USD'])
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbols` | `List[str]` | No | List of symbols to filter (uses first symbol) |

**Returns:** `List[Position]`

**Position structure:**
```python
{
    'id': '5b2b5d6a-...',        # trade UUID — use for close_position
    'symbol': 'BTC/USD',
    'side': 'long',
    'contracts': 0.01,
    'entryPrice': 70100.0,
    'markPrice': 70500.0,
    'leverage': 5.0,
    'collateral': 140.2,
    'unrealizedPnl': 4.0,
    'liquidationPrice': 63500.0,
    'marginMode': 'isolated',    # always isolated, hedged is always False
    'percentage': 5.7,
    'info': { ... },
}
```

---

### Leverage

#### `set_leverage`

Sets the per-pair **default** leverage (long and short). This is a local adapter setting used as the fallback when `params['leverage']` is omitted from `create_order` — it does **not** send an on-chain transaction. Per-order `leverage` always wins.

```python
result = exchange.set_leverage(10, 'BTC/USD')
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `leverage` | `float` | Yes | Leverage multiplier, within the pair's `[min, max]` (see `fetch_leverage_tiers`) |
| `symbol` | `str` | Yes | Unified market symbol |

**Returns:**
```python
{
    'symbol': 'BTC/USD',
    'longLeverage': 10.0,
    'shortLeverage': 10.0,
    'marginMode': None,
    'info': {'symbol': 'BTC/USD', 'pairIndex': '0', 'longLeverage': '10', 'shortLeverage': '10', 'lastUpdated': '...'},
}
```

---

#### `fetch_leverage_tiers`

Retrieves leverage tier information for markets.

```python
tiers = exchange.fetch_leverage_tiers(['BTC/USD'])
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbols` | `List[str]` | No | List of symbols to query (omitted = all pairs) |

**Returns:** `LeverageTiers` - dictionary keyed by symbol, each containing a list of tier objects:

```python
{
    'BTC/USD': [
        {
            'tier': 1.0,
            'currency': 'USD',
            'minNotional': 0.0,
            'maxNotional': 100000.0,
            'maintenanceMarginRate': 0.1,
            'maxLeverage': 1.1,
            'info': { ... },
        },
        # ... higher tiers
    ]
}
```
